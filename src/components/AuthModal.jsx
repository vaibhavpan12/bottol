import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useCart } from "../context/CartContext";

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}) {
  console.log("🚨 AUTH MODAL PROPS:", {
    isOpen,
    onClose,
    onSuccess,
  });

  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mergeGuestCart } = useCart();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [isOpen, initialMode]);

  const switchMode = (newMode) => {
    if (isLoading) return;

    setMode(newMode);
    setErrorMessage("");
  };

  // =====================================
  // CUSTOMER LOGIN
  // =====================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    console.log("🔥 LOGIN START");

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("🔥 API RESPONSE:", response.status);

      const data = await response.json();

      console.log("🔥 LOGIN DATA:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      console.log("✅ LOGIN SUCCESS");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("✅ TOKEN SAVED");

      console.log("➡️ MERGE CART START");

      await mergeGuestCart();

      console.log("✅ MERGE CART DONE");

      window.dispatchEvent(new Event("auth-changed"));

      console.log("✅ AUTH EVENT DISPATCHED");

      onSuccess?.("You have been logged in successfully.");

      onClose();

      console.log("✅ MODAL CLOSED");
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error);

      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================
  // CUSTOMER SIGNUP
  // =====================================

  async function handleSignup(e) {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone,
          address: signupData.address,
          city: signupData.city,
          pin: signupData.pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      await mergeGuestCart();

      window.dispatchEvent(new Event("auth-changed"));

      onSuccess?.("Your Pivora account was created successfully.");

      onClose();
    } catch (error) {
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================
  // CLOSE MODAL
  // =====================================

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="auth-modal">

        {/* =====================================
            CLOSE BUTTON
        ===================================== */}

        <button
          className="auth-close"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          ×
        </button>

        {/* =====================================
            ERROR MESSAGE
        ===================================== */}

        {errorMessage && (
          <div className="auth-error" role="alert">
            <span className="auth-error-icon">!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =====================================
            LOGIN
        ===================================== */}

        {mode === "login" ? (
          <>
            <h2>Welcome back</h2>

            <p className="auth-subtitle">
              Login to your Pivora account
            </p>

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <div className="field">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    });

                    setErrorMessage("");
                  }}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* PASSWORD */}

              <div className="field">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    });

                    setErrorMessage("");
                  }}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* LOGIN BUTTON */}

              <button
                className={`auth-submit ${
                  isLoading ? "loading" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-loader-content">
                    <span className="auth-spinner"></span>

                    <span>Logging in...</span>
                  </span>
                ) : (
                  "Login"
                )}
              </button>

            </form>

            {/* =====================================
                SIGNUP + ADMIN LOGIN
            ===================================== */}

            <div className="auth-switch auth-login-options">

              <span className="auth-signup-option">
                Don't have an account?

                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </span>

              <span className="auth-option-divider">
                |
              </span>

              <button
                type="button"
                className="admin-login-link"
                onClick={() => {
                  if (isLoading) return;

                  onClose();

                  window.location.href = "/admin/login";
                }}
                disabled={isLoading}
              >
                Admin Login
              </button>

            </div>
          </>
        ) : (

          /* =====================================
              SIGNUP
          ===================================== */

          <>
            <h2>Create account</h2>

            <p className="auth-subtitle">
              Enter your shipping details
            </p>

            <form onSubmit={handleSignup}>

              {/* NAME */}

              <div className="field">
                <label>Full name</label>

                <input
                  type="text"
                  placeholder="Priya Sharma"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      name: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              {/* EMAIL */}

              <div className="field">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({
                      ...signupData,
                      email: e.target.value,
                    });

                    setErrorMessage("");
                  }}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* PASSWORD */}

              <div className="field">
                <label>Create password</label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              {/* ADDRESS */}

              <div className="field">
                <label>Address</label>

                <input
                  type="text"
                  placeholder="Flat, street, area"
                  value={signupData.address}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      address: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              {/* CITY + PIN */}

              <div className="field-row">

                <div className="field">
                  <label>City</label>

                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={signupData.city}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        city: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="field">
                  <label>PIN code</label>

                  <input
                    type="text"
                    placeholder="400001"
                    value={signupData.pin}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        pin: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

              </div>

              {/* PHONE */}

              <div className="field">
                <label>Phone</label>

                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      phone: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              {/* SIGNUP BUTTON */}

              <button
                className={`auth-submit ${
                  isLoading ? "loading" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-loader-content">
                    <span className="auth-spinner"></span>

                    <span>Creating account...</span>
                  </span>
                ) : (
                  "Create account"
                )}
              </button>

            </form>

            {/* LOGIN SWITCH */}

            <div className="auth-switch">

              Already have an account?

              <button
                type="button"
                onClick={() => switchMode("login")}
                disabled={isLoading}
              >
                Login
              </button>

            </div>
          </>
        )}

        {/* =====================================
            FULL MODAL LOADING OVERLAY
        ===================================== */}

        {isLoading && (
          <div className="auth-loading-overlay">

            <div className="auth-loading-circle">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}