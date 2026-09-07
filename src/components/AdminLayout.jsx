import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import "../css/Admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="admin-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="admin-logo">
          <span>PIVORA</span>
          <small>ADMIN</small>
        </div>

        <nav className="admin-nav">

          <p className="admin-nav-title">MAIN MENU</p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}

          <p className="admin-nav-title settings-title">
            SYSTEM
          </p>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon">⚙</span>
            <span>Settings</span>
          </NavLink>

        </nav>

        <div className="admin-sidebar-bottom">

          <button className="admin-logout">
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Main Area */}
      <div className="admin-main">

        {/* Top Header */}
        <header className="admin-header">

          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="admin-header-right">

            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div className="admin-profile-info">
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>

        </header>


        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;