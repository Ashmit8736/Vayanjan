import { useState } from "react";

export default function Subscriptions() {
  const [plan, setPlan] = useState("Pro");

  return (
    <>
      {/* ===== INLINE CSS ===== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #f7f9fc, #ffffff);
          font-family: "Inter", system-ui, sans-serif;
          color: #1f2937;
        }

        /* HEADER (FIXED) */
        .header {
          padding: 24px 28px 12px;
          flex-shrink: 0;
        }

        .header p {
          font-size: 13px;
          color: #6b7280;
        }

        .header h2 {
          font-size: 26px;
          font-weight: 700;
          margin-top: 4px;
        }

        .header span {
          font-size: 14px;
          font-weight: 500;
          color: #9ca3af;
          margin-left: 8px;
        }

        /* SCROLL AREA (LIKE MUI PAGES) */
        .scroll-area {
          flex-grow: 1;
          overflow: auto;
          padding: 16px 28px 28px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scroll-area::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-bottom: 32px;
        }

        .stat {
          background: white;
          border-radius: 16px;
          padding: 18px 20px;
          border: 1px solid #eef2f7;
          box-shadow: 0 6px 20px rgba(0,0,0,0.04);
        }

        .stat p {
          font-size: 13px;
          color: #6b7280;
        }

        .stat h3 {
          font-size: 28px;
          font-weight: 800;
          margin-top: 6px;
        }

        .warn {
          color: #f97316;
        }

        /* MAIN GRID */
        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 26px;
        }

        @media (max-width: 1200px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        /* CARD */
        .card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #eef2f7;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          padding: 20px;
        }

        /* TABLE */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
        }

        thead {
          background: #f9fafb;
        }

        th, td {
          padding: 14px 12px;
          font-size: 14px;
          border-bottom: 1px solid #eef2f7;
          text-align: left;
        }

        th {
          font-weight: 600;
          color: #6b7280;
        }

        tr:hover {
          background: #f9fafb;
        }

        .client {
          font-weight: 600;
        }

        .email {
          font-size: 12px;
          color: #9ca3af;
        }

        /* STATUS */
        .status {
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          text-transform: capitalize;
        }

        .active {
          background: #dcfce7;
          color: #15803d;
        }

        .expiring {
          background: #fef3c7;
          color: #b45309;
        }

        .expired {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* FORM */
        input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 12px;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }

        input:focus {
          border-color: #fb923c;
          box-shadow: 0 0 0 3px rgba(251,146,60,0.15);
        }

        .plans {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 14px 0;
        }

        .plan {
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .plan:hover {
          background: #f9fafb;
        }

        .plan.active {
          border-color: #fb923c;
          color: #fb923c;
          background: #fff7ed;
        }

        .key {
          margin: 14px 0;
          padding: 12px;
          border-radius: 12px;
          border: 2px dashed #fb923c;
          color: #fb923c;
          font-weight: 600;
          text-align: center;
        }

        .btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #fb923c, #f97316);
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(249,115,22,0.35);
        }
      `}</style>

      {/* ===== PAGE ===== */}
      <div className="page">

        {/* HEADER */}
        <div className="header">
          <p>Superadmin / Billing</p>
          <h2>
            Subscriptions & Licenses
            <span>98 Active Licenses</span>
          </h2>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="scroll-area">

          {/* STATS */}
          <div className="stats">
            <Stat title="Active Licenses" value="1,248" />
            <Stat title="Expiring Soon" value="14" warn />
            <Stat title="Monthly Revenue" value="₹4.2L" />
          </div>

          <div className="grid">
            {/* TABLE */}
            <div className="card">
              <h3>Active Subscriptions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Plan</th>
                    <th>License</th>
                    <th>Valid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <Row name="Spice Garden Pvt" email="rajesh@spicegarden.com" status="active" />
                  <Row name="The Chai Spot" email="priya@chaispot.in" status="active" />
                  <Row name="Royal Tandoor" email="vikram@royaltandoor.com" status="expiring" />
                  <Row name="Desai Sweets" email="anita@gmail.com" status="expired" />
                </tbody>
              </table>
            </div>

            {/* RIGHT PANEL */}
            <div className="card">
              <h3>Issue New License</h3>

              <input value="Burger Point Franchise" />
              <div className="plans">
                {["Pro", "Ent", "Basic"].map((p) => (
                  <button
                    key={p}
                    className={`plan ${plan === p ? "active" : ""}`}
                    onClick={() => setPlan(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <input value="Oct 24, 2023" />
              <input value="1 Year" />
              <input value="Oct 24, 2024" />

              <div className="key">VYJN-8821-X992-MM01</div>
              <button className="btn">Generate & Assign Key</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ===== SMALL COMPONENTS ===== */

const Stat = ({ title, value, warn }) => (
  <div className="stat">
    <p>{title}</p>
    <h3 className={warn ? "warn" : ""}>{value}</h3>
  </div>
);

const Row = ({ name, email, status }) => (
  <tr>
    <td>
      <div className="client">{name}</div>
      <div className="email">{email}</div>
    </td>
    <td>Pro</td>
    <td>XXXX-1122</td>
    <td>Tomorrow</td>
    <td>
      <span className={`status ${status}`}>{status}</span>
    </td>
  </tr>
);
