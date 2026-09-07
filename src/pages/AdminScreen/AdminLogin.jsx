import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import {BASE_URL} from "../../config/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Admin login failed"
        );
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-brand">
          <div className="admin-logo">P</div>

          <span>PIVORA</span>
        </div>

        <div className="admin-login-heading">
          <h1>Welcome Back</h1>

          <p>
            Sign in to access your admin dashboard.
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@pivora.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="admin-login-footer">
          <span>Protected Admin Area</span>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;