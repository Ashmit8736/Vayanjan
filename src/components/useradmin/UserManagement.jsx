import { useState } from "react";

export default function UserManagement() {
  const [role, setRole] = useState("All");

  return (
    <>
      {/* ===== INLINE CSS ===== */}
      <style>{`
        * { box-sizing: border-box; }

        .page {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #f5f7fa;
          font-family: Inter, system-ui, sans-serif;
          color: #1f2937;
        }

        /* HEADER */
        .header {
          padding: 20px 24px;
          flex-shrink: 0;
        }

        .header p {
          font-size: 13px;
          color: #6b7280;
        }

        .header h2 {
          font-size: 24px;
          font-weight: 700;
          margin-top: 4px;
        }

        .header span {
          font-size: 13px;
          color: #9ca3af;
          margin-left: 8px;
        }

        /* CONTENT (ONLY THIS SCROLLS) */
        .content {
          flex-grow: 1;
          overflow-y: auto;
          padding: 16px 24px 24px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .content::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        /* TOP BAR */
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search {
          flex: 1;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
        }

        .btn-primary {
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: #6366f1;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        /* FILTERS */
        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .filter {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #fff;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
        }

        .filter.active {
          background: #eef2ff;
          border-color: #6366f1;
          color: #4338ca;
        }

        /* CARD */
        .card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 18px;
        }

        /* TABLE */
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }

        th {
          background: #f9fafb;
          color: #6b7280;
          font-weight: 600;
        }

        .name {
          font-weight: 600;
        }

        .email {
          font-size: 12px;
          color: #9ca3af;
        }

        /* ROLE BADGE */
        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .admin { background: #fee2e2; color: #b91c1c; }
        .manager { background: #e0e7ff; color: #3730a3; }
        .staff { background: #dcfce7; color: #15803d; }

        /* STATUS */
        .active { color: #15803d; font-weight: 600; }
        .inactive { color: #b91c1c; font-weight: 600; }
      `}</style>

      {/* ===== PAGE ===== */}
      <div className="page">

        {/* HEADER */}
        <div className="header">
          <p>Superadmin / Users</p>
          <h2>
            User Management
            <span>Access Control</span>
          </h2>
        </div>

        {/* CONTENT */}
        <div className="content">

          {/* TOP BAR */}
          <div className="topbar">
            <input className="search" placeholder="Search users, email, role..." />
            <button className="btn-primary">Add User</button>
          </div>

          {/* FILTERS */}
          <div className="filters">
            {["All", "Admin", "Manager", "Staff"].map(r => (
              <button
                key={r}
                className={`filter ${role === r ? "active" : ""}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <Row
                  name="Rajesh Kumar"
                  email="rajesh@restaurant.com"
                  role="admin"
                  branch="All"
                  status="Active"
                />
                <Row
                  name="Priya Sharma"
                  email="priya@restaurant.com"
                  role="manager"
                  branch="Andheri"
                  status="Active"
                />
                <Row
                  name="Vikram Singh"
                  email="vikram@restaurant.com"
                  role="staff"
                  branch="Bandra"
                  status="Inactive"
                />
                <Row
                  name="Anita Desai"
                  email="anita@restaurant.com"
                  role="staff"
                  branch="Powai"
                  status="Active"
                />
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

/* ===== SMALL COMPONENT ===== */

const Row = ({ name, email, role, branch, status }) => (
  <tr>
    <td>
      <div className="name">{name}</div>
      <div className="email">{email}</div>
    </td>
    <td>
      <span className={`badge ${role}`}>{role}</span>
    </td>
    <td>{branch}</td>
    <td className={status === "Active" ? "active" : "inactive"}>{status}</td>
    <td>Jan 2024</td>
  </tr>
);
