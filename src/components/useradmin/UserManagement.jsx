import { useState, useEffect } from "react";
import AddBranchUser from "./AddBranchUser";
import axios from "../../services/api/axios-config";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users/owner/users");
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAddingUser) {
    return <AddBranchUser onCancel={() => setIsAddingUser(false)} />;
  }

  const filteredUsers = users.filter((user) => {
    const matchesRole = role === "All" || user.role.toLowerCase() === role.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
        .inventory { background: #e0e7ff; color: #3730a3; }
        .billing { background: #dcfce7; color: #15803d; }

        /* STATUS */
        .active { color: #15803d; font-weight: 600; }
        .inactive { color: #b91c1c; font-weight: 600; }
        
        .loading {
             text-align: center;
             padding: 20px;
             color: #6b7280;
        }
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
            <input
              className="search"
              placeholder="Search users, email, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-primary" onClick={() => setIsAddingUser(true)}>Add User</button>
          </div>

          {/* FILTERS */}
          <div className="filters">
            {["All", "inventory", "billing"].map(r => (
              <button
                key={r}
                className={`filter ${role === r ? "active" : ""}`}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div className="card">
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <Row
                        key={user.id}
                        name={user.name}
                        email={user.email}
                        role={user.role}
                        branch={user.branch_name}
                        status={user.is_active ? "Active" : "Inactive"}
                        phone={user.phone}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* ===== SMALL COMPONENT ===== */

const Row = ({ name, email, role, branch, status, phone }) => (
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
    <td>{phone}</td>
  </tr>
);
