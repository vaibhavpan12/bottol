import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../config/api";
import "../../css/Admin.css";

import AdminProductDetailsModal from "../../components/ProductDetailsModal";
import AddProduct from "./AddProduct";

const emptyForm = {
  name: "",
  category: "",
  quantity: 0,
  trending: false,
  price: "",
  material: "",
  capacity: "",
  weight: "",
  use_cases: "",
  features: "",
  image_url: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const [stats, setStats] = useState({
    total_products: 0,
    trending_products: 0,
    total_quantity: 0,
    inventory_value: 0,
    low_stock_products: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal
  const [showModal, setShowModal] = useState(false);

  // null = Add Product
  // product = Edit Product
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Product details
  const [selectedProduct, setSelectedProduct] = useState(null);

  const adminToken = localStorage.getItem("adminToken");

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/products/AllProducts`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH STATS
  // =====================================================

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/products/Stats`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch stats"
        );
      }

      setStats(
        data.stats || {
          total_products: 0,
          trending_products: 0,
          total_quantity: 0,
          inventory_value: 0,
          low_stock_products: 0,
        }
      );
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("/uploads/")) {
      return `${BASE_URL}${image}`;
    }

    return image;
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [products]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.category
          ?.toLowerCase()
          .includes(searchText) ||
        product.material
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    categoryFilter,
  ]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // OPEN ADD PRODUCT
  // =====================================================

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT PRODUCT
  // =====================================================

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: product.category || "",
      quantity: product.quantity ?? 0,
      trending: product.trending === true,
      price: product.price ?? "",
      material: product.material || "",
      capacity: product.capacity || "",
      weight: product.weight || "",

      use_cases: Array.isArray(product.use_cases)
        ? product.use_cases.join(", ")
        : "",

      features: Array.isArray(product.features)
        ? product.features.join(", ")
        : "",

      image_url:
        product.image &&
        !product.image.startsWith("/uploads/")
          ? product.image
          : "",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setSaving(false);
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add Product ka form apna khud ka submit handle karta hai
    if (!editingProduct) {
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "quantity",
        form.quantity
      );

      formData.append(
        "trending",
        form.trending
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "material",
        form.material
      );

      formData.append(
        "capacity",
        form.capacity
      );

      formData.append(
        "weight",
        form.weight
      );

      const useCases = form.use_cases
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const features = form.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      formData.append(
        "use_cases",
        JSON.stringify(useCases)
      );

      formData.append(
        "features",
        JSON.stringify(features)
      );

      if (form.image_url) {
        formData.append(
          "image_url",
          form.image_url
        );
      }

      const response = await fetch(
        `${BASE_URL}/api/products/UpdateProduct/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update product"
        );
      }

      await fetchProducts();
      await fetchStats();

      closeModal();

    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // TOGGLE TRENDING
  // =====================================================

  const toggleTrending = async (product) => {
    try {
      const formData = new FormData();

      formData.append(
        "name",
        product.name
      );

      formData.append(
        "category",
        product.category
      );

      formData.append(
        "quantity",
        product.quantity
      );

      formData.append(
        "trending",
        !product.trending
      );

      formData.append(
        "price",
        product.price
      );

      formData.append(
        "material",
        product.material || ""
      );

      formData.append(
        "capacity",
        product.capacity || ""
      );

      formData.append(
        "weight",
        product.weight || ""
      );

      formData.append(
        "use_cases",
        JSON.stringify(
          Array.isArray(product.use_cases)
            ? product.use_cases
            : []
        )
      );

      formData.append(
        "features",
        JSON.stringify(
          Array.isArray(product.features)
            ? product.features
            : []
        )
      );

      const image = product.image;

      if (
        image &&
        !image.startsWith("/uploads/")
      ) {
        formData.append(
          "image_url",
          image
        );
      }

      const response = await fetch(
        `${BASE_URL}/api/products/UpdateProduct/${product._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update trending"
        );
      }

      await fetchProducts();
      await fetchStats();

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Failed to update trending"
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product._id);

      const response = await fetch(
        `${BASE_URL}/api/products/DeleteProduct/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to delete product"
        );
      }

      setProducts((prev) =>
        prev.filter(
          (item) =>
            item._id !== product._id
        )
      );

      await fetchStats();

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-page">

        <div className="admin-page-header">
          <div>
            <h1>Products</h1>
            <p>
              Manage your product inventory.
            </p>
          </div>
        </div>

        <div className="admin-product-empty">
          <h3>
            Loading products...
          </h3>
        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage your product inventory.
          </p>
        </div>

        {/* ADD PRODUCT BUTTON */}

        <button
          type="button"
          className="admin-primary-btn"
          onClick={openAddModal}
        >
          + Add Product
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>
            {stats.total_products}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Trending</span>
          <strong>
            {stats.trending_products}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Stock</span>
          <strong>
            {stats.total_quantity}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Inventory Value</span>
          <strong>
            ₹
            {Number(
              stats.inventory_value || 0
            ).toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Low Stock</span>
          <strong>
            {stats.low_stock_products}
          </strong>
        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="admin-products-toolbar">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="admin-search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }
          className="admin-category-select"
        >
          <option value="all">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {filteredProducts.length === 0 ? (

        <div className="admin-product-empty">

          <h3>
            No products found
          </h3>

          <p>
            Try changing your search
            or category filter.
          </p>

        </div>

      ) : (

        <div className="admin-products-grid">

          {filteredProducts.map(
            (product) => {

              const isLowStock =
                Number(
                  product.quantity || 0
                ) <= 5;

              return (

                <div
                  className="admin-product-card"
                  onClick={() =>
                    setSelectedProduct(
                      product
                    )
                  }
                  key={product._id}
                >

                  {/* IMAGE */}

                  <div className="admin-product-image-wrap">

                    {product.image ? (

                      <img
                        src={getImageUrl(
                          product.image
                        )}
                        alt={product.name}
                        className="admin-product-image"
                      />

                    ) : (

                      <div className="admin-product-image-placeholder">
                        No Image
                      </div>

                    )}

                    {product.trending && (
                      <span className="admin-product-trending">
                        Trending
                      </span>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="admin-product-content">

                    {/* TOP */}

                    <div className="admin-product-top">

                      <div>

                        <span className="admin-product-category">
                          {product.category}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                      </div>

                      <strong className="admin-product-price">
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    {/* DETAILS */}

                    <div className="admin-product-details">

                      <div>
                        <span>
                          Quantity
                        </span>

                        <strong
                          className={
                            isLowStock
                              ? "low-stock-text"
                              : ""
                          }
                        >
                          {product.quantity}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Material
                        </span>

                        <strong>
                          {product.material ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Capacity
                        </span>

                        <strong>
                          {product.capacity ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Weight
                        </span>

                        <strong>
                          {product.weight ||
                            "—"}
                        </strong>
                      </div>

                    </div>

                    {/* TRENDING */}

                    <div className="admin-product-trending-row">

                      <span>
                        Trending Product
                      </span>

                      <button
                        type="button"
                        className={`admin-toggle ${
                          product.trending
                            ? "active"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrending(
                            product
                          );
                        }}
                        title={
                          product.trending
                            ? "Remove from trending"
                            : "Make trending"
                        }
                      >
                        <span></span>
                      </button>

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-product-actions">

                      <button
                        type="button"
                        className="admin-edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(
                            product
                          );
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(
                            product
                          );
                        }}
                        disabled={
                          deletingId ===
                          product._id
                        }
                      >
                        {deletingId ===
                        product._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="admin-product-modal-overlay"
          onMouseDown={closeModal}
        >

          <div
            className="admin-product-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                ADD PRODUCT
            ================================================= */}

            {!editingProduct ? (

              <AddProduct
                onClose={closeModal}
                onSuccess={async () => {
                  await fetchProducts();
                  await fetchStats();
                  closeModal();
                }}
              />

            ) : (

              /* =================================================
                 EDIT PRODUCT
              ================================================= */

              <>

                <div className="admin-product-modal-header">

                  <div>
                    <h2>
                      Edit Product
                    </h2>

                    <p>
                      Update product
                      information
                    </p>
                  </div>

                  <button
                    type="button"
                    className="admin-modal-close"
                    onClick={closeModal}
                  >
                    ×
                  </button>

                </div>

                <form
                  onSubmit={handleSubmit}
                  className="admin-product-form"
                >

                  <div className="admin-form-grid">

                    {/* NAME */}

                    <div className="admin-form-group full">

                      <label>
                        Product Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    {/* CATEGORY */}

                    <div className="admin-form-group">

                      <label>
                        Category
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={
                          form.category
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    {/* PRICE */}

                    <div className="admin-form-group">

                      <label>
                        Price (₹)
                      </label>

                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={
                          handleChange
                        }
                        min="1"
                        step="0.01"
                        required
                      />

                    </div>

                    {/* QUANTITY */}

                    <div className="admin-form-group">

                      <label>
                        Quantity
                      </label>

                      <input
                        type="number"
                        name="quantity"
                        value={
                          form.quantity
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        required
                      />

                    </div>

                    {/* MATERIAL */}

                    <div className="admin-form-group">

                      <label>
                        Material
                      </label>

                      <input
                        type="text"
                        name="material"
                        value={
                          form.material
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Stainless Steel"
                      />

                    </div>

                    {/* CAPACITY */}

                    <div className="admin-form-group">

                      <label>
                        Capacity
                      </label>

                      <input
                        type="text"
                        name="capacity"
                        value={
                          form.capacity
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. 1 litre"
                      />

                    </div>

                    {/* WEIGHT */}

                    <div className="admin-form-group">

                      <label>
                        Weight
                      </label>

                      <input
                        type="text"
                        name="weight"
                        value={
                          form.weight
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Lightweight"
                      />

                    </div>

                    {/* IMAGE URL */}

                    <div className="admin-form-group full">

                      <label>
                        Image URL
                      </label>

                      <input
                        type="url"
                        name="image_url"
                        value={
                          form.image_url
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://example.com/bottle.jpg"
                      />

                    </div>

                    {/* USE CASES */}

                    <div className="admin-form-group full">

                      <label>
                        Use Cases
                      </label>

                      <input
                        type="text"
                        name="use_cases"
                        value={
                          form.use_cases
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="gym, office, travel, daily use"
                      />

                      <small>
                        Separate with commas.
                      </small>

                    </div>

                    {/* FEATURES */}

                    <div className="admin-form-group full">

                      <label>
                        Features
                      </label>

                      <input
                        type="text"
                        name="features"
                        value={
                          form.features
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="leak proof, BPA free, insulated"
                      />

                      <small>
                        Separate with commas.
                      </small>

                    </div>

                    {/* TRENDING */}

                    <label className="admin-trending-checkbox">

                      <input
                        type="checkbox"
                        name="trending"
                        checked={
                          form.trending
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span>
                        Mark as Trending
                      </span>

                    </label>

                  </div>

                  {/* ACTIONS */}

                  <div className="admin-edit-modal-actions">

                    <button
                      type="button"
                      className="admin-cancel-btn"
                      onClick={
                        closeModal
                      }
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="admin-save-btn"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </div>

                </form>

              </>

            )}

          </div>

        </div>

      )}

      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      {selectedProduct && (

        <AdminProductDetailsModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
        />

      )}

    </div>
  );
};

export default AdminProducts;