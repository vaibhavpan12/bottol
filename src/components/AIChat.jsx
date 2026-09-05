import React, { useState } from "react";
import { useCart } from "../context/CartContext";
// import "./AIChat.css";

const API_URL = "http://127.0.0.1:8000";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Selected product for details modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart } = useCart();

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "👋 Hi! What are you looking for?",
    },
  ]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = async () => {
    const userMessage = message.trim();

    if (!userMessage || isLoading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "AI request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.message,
          products: data.products || [],
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I'm unable to connect right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // PRODUCT CLICK
  // =====================================================

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (selectedProduct.quantity <= 0) {
      return;
    }

    addToCart({
      ...selectedProduct,
      _id: selectedProduct.id,
      quantity: 1,
    });

    // Close product modal
    setSelectedProduct(null);
  };

  return (
    <>
      {/* =================================================
          CHAT POPUP
      ================================================= */}

      {isOpen && (
        <div className="ai-chat-popup">
          {/* HEADER */}
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <div className="ai-chat-avatar">✨</div>

              <div>
                <h3>Pivora AI</h3>
                <span>Shopping Assistant</span>
              </div>
            </div>

            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="ai-chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.role === "user"
                    ? "ai-message-wrapper user"
                    : "ai-message-wrapper"
                }
              >
                {/* MESSAGE */}

                <div
                  className={
                    item.role === "user"
                      ? "ai-message user-message"
                      : "ai-message"
                  }
                >
                  {item.content}
                </div>

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {item.products?.length > 0 && (
                  <div className="ai-products">
                    {item.products.map((product) => (
                      <div
                        className="ai-product-card"
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleProductClick(product);
                          }
                        }}
                      >
                        {/* IMAGE */}

                        <img
                          src={
                            product.image?.startsWith("http")
                              ? product.image
                              : `${API_URL}${product.image}`
                          }
                          alt={product.name}
                        />

                        {/* PRODUCT INFO */}

                        <div className="ai-product-info">
                          <h4>{product.name}</h4>

                          <p>₹{product.price}</p>

                          <span>
                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* =================================================
                LOADING
            ================================================= */}

            {isLoading && (
              <div className="ai-message">
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Find your perfect bottle..."
              value={message}
              disabled={isLoading}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              className="ai-send-btn"
              onClick={handleSend}
              disabled={isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          PRODUCT DETAILS MODAL
      ================================================= */}

      {selectedProduct && (
        <div
          className="ai-product-modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="ai-product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}

            <button
              className="ai-product-modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            {/* PRODUCT IMAGE */}

            <div className="ai-product-modal-image">
              <img
                src={
                  selectedProduct.image?.startsWith("http")
                    ? selectedProduct.image
                    : `${API_URL}${selectedProduct.image}`
                }
                alt={selectedProduct.name}
              />
            </div>

            {/* PRODUCT DETAILS */}

            <div className="ai-product-modal-content">
              <span className="ai-product-category">
                {selectedProduct.category}
              </span>

              <h2>{selectedProduct.name}</h2>

              <div className="ai-product-price">₹{selectedProduct.price}</div>

              {/* STOCK */}

              <p className="ai-product-stock">
                {selectedProduct.quantity > 0
                  ? `✓ In Stock (${selectedProduct.quantity} available)`
                  : "✕ Out of Stock"}
              </p>

              {/* TRENDING */}

              {selectedProduct.trending && (
                <div className="ai-product-trending">🔥 Trending Product</div>
              )}

              {/* ADD TO CART */}

              <button
                className="ai-add-to-cart-btn"
                disabled={selectedProduct.quantity <= 0}
                onClick={handleAddToCart}
              >
                {selectedProduct.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          FLOATING AI BUTTON
      ================================================= */}

      <div className="ai-floating-container">
        {!isOpen && (
          <div className="ai-floating-label">
            <span>✨</span>
            Find Your Perfect Product
          </div>
        )}

        <button
          className={`ai-floating-button ${isOpen ? "ai-button-open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Pivora AI"
        >
          {isOpen ? "×" : "✨"}
        </button>
      </div>
    </>
  );
}
