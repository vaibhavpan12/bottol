import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { BASE_URL } from "../config/api";
import usePresence from "../hooks/usePresence";
import useProducts from "../hooks/useProducts";
import { localAssistant } from "../utils/localAssistant";
// import "./AIChat.css";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Selected product for details modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart Context
  const {
    addToCart,
    openDrawer,
    isDrawerOpen,
  } = useCart();

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "👋 Hi! What are you looking for?",
    },
  ]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const { products } = useProducts();

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

    // Ask the backend AI. Render's free plan sleeps, so allow time to wake
    // up and retry once. If it still fails, answer from the products already
    // loaded in the browser so the shopper never sees an error.
    const ask = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45000);
      try {
        const response = await fetch(`${BASE_URL}/api/ai/agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || typeof data.message !== "string") {
          throw new Error(data.detail || `AI request failed (${response.status})`);
        }
        return data;
      } finally {
        clearTimeout(timer);
      }
    };

    try {
      let data;
      try {
        data = await ask();
      } catch (firstError) {
        console.warn("AI request failed, retrying once:", firstError);
        data = await ask();
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.message, products: data.products || [] },
      ]);
    } catch (error) {
      console.error("AI backend unavailable, using in-browser search:", error);

      if (products.length) {
        const local = localAssistant(userMessage, products);
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: local.message, products: local.products },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "I'm having trouble reaching the store right now. Please try again in a moment.",
          },
        ]);
      }
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

    // Product out of stock
    if (selectedProduct.quantity <= 0) {
      return;
    }

    // AI product uses "id"
    // CartContext expects "_id"
    addToCart({
      ...selectedProduct,
      _id: selectedProduct.id,
    });

    // Close product modal
    setSelectedProduct(null);

    // Close AI chat
    setIsOpen(false);

    // Open cart drawer
    openDrawer();
  };

  const chatPresence = usePresence(isOpen && !isDrawerOpen, 260);

  return (
    <>
      {/* =================================================
          CHAT POPUP
      ================================================= */}

      {chatPresence.mounted && (
        <div className={`ai-chat-popup${chatPresence.closing ? " is-closing" : ""}`}>
          {/* HEADER */}

          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <div className="ai-chat-avatar">✨</div>

              <div>
                <h3>Pivora AI</h3>
                <span>Shopping Assistant</span>
              </div>
            </div>

            <button
              className="ai-close-btn"
              onClick={() => setIsOpen(false)}
            >
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
                              : `${BASE_URL}${product.image}`
                          }
                          alt={product.name}
                        />

                        {/* PRODUCT INFO */}

                        <div className="ai-product-info">
                          <h4>{product.name}</h4>

                          <p>₹{product.price}</p>

                          <span>
                            {product.quantity > 0
                              ? "In Stock"
                              : "Out of Stock"}
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
              placeholder="Ask me to find any product..."
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

      {selectedProduct && !isDrawerOpen && (
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
                    : `${BASE_URL}${selectedProduct.image}`
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

              <div className="ai-product-price">
                ₹{selectedProduct.price}
              </div>

              {/* STOCK */}

              <p className="ai-product-stock">
                {selectedProduct.quantity > 0
                  ? `✓ In Stock (${selectedProduct.quantity} available)`
                  : "✕ Out of Stock"}
              </p>

              {/* TRENDING */}

              {selectedProduct.trending && (
                <div className="ai-product-trending">
                  🔥 Trending Product
                </div>
              )}

              {/* ADD TO CART */}

              <button
                className="ai-add-to-cart-btn"
                disabled={selectedProduct.quantity <= 0}
                onClick={handleAddToCart}
              >
                {selectedProduct.quantity > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          FLOATING AI BUTTON
      ================================================= */}

      <div
        className={`ai-floating-container ${
          isDrawerOpen ? "ai-hidden-by-cart" : ""
        }`}
      >
        {!isOpen && (
          <div className="ai-floating-label">
            <span>✨</span>
            Find Your Perfect Product
          </div>
        )}

        <button
          className={`ai-floating-button ${
            isOpen ? "ai-button-open" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Pivora AI"
        >
          {isOpen ? "×" : "✨"}
        </button>
      </div>
    </>
  );
}