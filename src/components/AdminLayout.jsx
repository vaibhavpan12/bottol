import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "▦",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "□",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: "♙",
    },
    {
      name: "Sales",
      path: "/admin/sales",
      icon: "↗",
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: "▤",
    },
  ];

  // =====================================
  // ADMIN LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setSidebarOpen(false);

    navigate("/admin/login", {
      replace: true,
    });
  };

  // =====================================
  // GET ADMIN INFO
  // =====================================

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  return (
    <div className="admin-layout">

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        {/* LOGO */}

        <div className="admin-logo">
          <span>PIVORA</span>
          <small>ADMIN</small>
        </div>


        {/* NAVIGATION */}

        <nav className="admin-nav">

          <p className="admin-nav-title">
            MAIN MENU
          </p>


          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
              onClick={() =>
                setSidebarOpen(false)
              }
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}


          {/* SYSTEM */}

          <p className="admin-nav-title settings-title">
            SYSTEM
          </p>


          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="admin-nav-icon">
              ⚙
            </span>

            <span>Settings</span>
          </NavLink>

        </nav>


        {/* =====================================
            LOGOUT
        ===================================== */}

        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <span>↪</span>

            Logout
          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN AREA
      ===================================== */}

      <div className="admin-main">


        {/* =====================================
            TOP HEADER
        ===================================== */}

        <header className="admin-header">

          <button
            className="admin-menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            ☰
          </button>


          <div className="admin-header-right">

            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div className="admin-profile-info">

                <strong>
                  {adminUser.email || "Admin"}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;