import { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

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

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("auth-changed"));

      onClose();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();

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

      window.dispatchEvent(new Event("auth-changed"));

      onClose();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div
      className="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        {mode === "login" ? (
          <>
            <h2>Welcome back</h2>
            <p className="auth-subtitle">Login to your Pivora account</p>

            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <button className="auth-submit" type="submit">
                Login
              </button>
            </form>

            <div className="auth-switch">
              Don't have an account?
              <button onClick={() => setMode("signup")}>Sign up</button>
            </div>
          </>
        ) : (
          <>
            <h2>Create account</h2>
            <p className="auth-subtitle">Enter your shipping details</p>

            <form onSubmit={handleSignup}>
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
                  required
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

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
                  required
                />
              </div>

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
                  required
                />
              </div>

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
                    required
                  />
                </div>
              </div>

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
                  required
                />
              </div>

              <button className="auth-submit" type="submit">
                Create account
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?
              <button onClick={() => setMode("login")}>Login</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
