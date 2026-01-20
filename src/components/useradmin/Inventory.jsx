import { useState } from "react";

export default function Inventory() {
  const [category, setCategory] = useState("All");

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

        /* SCROLL AREA */
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
          margin-bottom: 20px;
          gap: 12px;
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
          background: #fb923c;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 16px;
        }

        .stat p {
          font-size: 13px;
          color: #6b7280;
        }

        .stat h3 {
          font-size: 26px;
          font-weight: 800;
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
          margin-top: 12px;
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

        /* STOCK STATUS */
        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .in { background: #dcfce7; color: #15803d; }
        .low { background: #fef3c7; color: #b45309; }
        .out { background: #fee2e2; color: #b91c1c; }

        /* CATEGORY FILTER */
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
          background: #fff7ed;
          border-color: #fb923c;
          color: #fb923c;
        }
      `}</style>

      {/* ===== PAGE ===== */}
      <div className="page">

        {/* HEADER */}
        <div className="header">
          <p>Superadmin / Inventory</p>
          <h2>
            Inventory Management
            <span>Live Stock</span>
          </h2>
        </div>

        {/* CONTENT */}
        <div className="content">

          {/* TOP BAR */}
          <div className="topbar">
            <input className="search" placeholder="Search items, SKU, category..." />
            <button className="btn-primary">Add Item</button>
          </div>

          {/* STATS */}
          <div className="stats">
            <Stat title="Total Items" value="324" />
            <Stat title="Low Stock Items" value="18" />
            <Stat title="Out of Stock" value="6" />
          </div>

          {/* FILTERS */}
          <div className="filters">
            {["All", "Raw Material", "Beverages", "Snacks", "Frozen"].map(c => (
              <button
                key={c}
                className={`filter ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <Row name="Paneer (1kg)" cat="Raw Material" sku="RM-001" stock="120" status="in" />
                <Row name="Cold Drink (500ml)" cat="Beverages" sku="BV-018" stock="22" status="low" />
                <Row name="French Fries" cat="Frozen" sku="FR-006" stock="0" status="out" />
                <Row name="Veg Patty" cat="Frozen" sku="FR-011" stock="8" status="low" />
                <Row name="Tea Powder" cat="Beverages" sku="BV-004" stock="64" status="in" />
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

/* ===== SMALL COMPONENTS ===== */

const Stat = ({ title, value }) => (
  <div className="stat">
    <p>{title}</p>
    <h3>{value}</h3>
  </div>
);

const Row = ({ name, cat, sku, stock, status }) => (
  <tr>
    <td>{name}</td>
    <td>{cat}</td>
    <td>{sku}</td>
    <td>{stock}</td>
    <td><span className={`badge ${status}`}>
      {status === "in" ? "In Stock" : status === "low" ? "Low Stock" : "Out of Stock"}
    </span></td>
    <td>Today</td>
  </tr>
);
