export const printInvoiceWithIframe = (invoice) => {
  const totalQty = (invoice.items || []).reduce((sum, item) => sum + Number(item.qty || item.quantity || 0), 0);
  const formattedDate = invoice.created_at
    ? new Date(invoice.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    : new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

  const rows = (invoice.items || []).map(item => `
    <tr>
      <td style="font-weight: bold; padding: 4px 0; max-width: 140px; word-break: break-word;">${item.name}</td>
      <td style="text-align: right; font-weight: bold; padding: 4px 0;">${item.qty || item.quantity}</td>
      <td style="text-align: right; padding: 4px 0; color: #444;">${Number(item.price).toFixed(2)}</td>
      <td style="text-align: right; font-weight: bold; padding: 4px 0;">${Number(item.subtotal || ((item.qty || item.quantity) * item.price)).toFixed(2)}</td>
    </tr>
  `).join("");

  const branchName = invoice.branch_name || "Kamla Sweets";
  const branchAddress = invoice.branch_address || "C-8 Amrapali Golf Homes , Greater Noida West 201301";
  const branchPhone = invoice.branch_phone || "8700063220";
  const branchGst = invoice.branch_gst || "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          width: 76mm;
          margin: 0;
          padding: 4px;
          font-size: 11px;
          color: #000;
          background-color: #fff;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .dashed { border-top: 1px dashed #000; margin: 8px 0; }
        .dotted { border-top: 1px dotted #000; margin: 6px 0; }
        .flex-between { display: flex; justify-content: space-between; }
        
        /* Metadata grid with left borders */
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 12px;
          margin: 12px 0;
        }
        .meta-box {
          border-left: 2px solid #555;
          padding-left: 6px;
        }
        .meta-label {
          font-size: 8px;
          text-transform: uppercase;
          color: #555;
          font-weight: bold;
          display: block;
          margin-bottom: 1px;
        }
        .meta-val {
          font-size: 11px;
          font-weight: bold;
        }

        /* E-Bill border box card */
        .ebill-card {
          border: 1px solid #000;
          border-radius: 8px;
          padding: 10px;
          margin: 12px 0;
        }

        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; font-size: 10px; padding: 2px 0; vertical-align: top; }
        .right { text-align: right; }
      </style>
    </head>
    <body>
      <div class="center bold" style="font-size: 12px; letter-spacing: 0.5px;">!!! WELCOME !!!</div>
      <div class="center" style="margin-top: 4px; line-height: 1.3;">${branchAddress}</div>
      <div class="center" style="margin-top: 2px; font-weight: 500;">Mob-: ${branchPhone}</div>
      ${branchGst ? `<div class="center" style="font-weight: 500;">GSTIN: ${branchGst}</div>` : ""}
      
      <div class="meta-grid">
        <div class="meta-box">
          <span class="meta-label">Order Number</span>
          <span class="meta-val">${invoice.invoice_number}</span>
        </div>
        <div class="meta-box">
          <span class="meta-label">${invoice.table_number ? "Table No" : "Order Type"}</span>
          <span class="meta-val">${invoice.table_number ? `Table ${invoice.table_number}` : (invoice.token_number ? `Tkn: ${invoice.token_number.replace(/\D/g, "")}` : "Take Away/Delivery")}</span>
        </div>
        <div class="meta-box">
          <span class="meta-label">Order Amount</span>
          <span class="meta-val">₹${Number(invoice.total_amount).toFixed(2)}</span>
        </div>
        <div class="meta-box">
          <span class="meta-label">Date</span>
          <span class="meta-val">${formattedDate}</span>
        </div>
      </div>
      
      <div class="dashed"></div>
      
      <div class="bold" style="text-transform: uppercase; font-size: 9px; color: #444; margin-bottom: 2px;">Customer Details</div>
      <div class="bold" style="font-size: 11px;">${invoice.customer_name || invoice.client_name || "Walk-In Customer"}</div>
      ${invoice.mobile_number || invoice.customer_mobile ? `<div style="font-weight: 500;">${invoice.mobile_number || invoice.customer_mobile}</div>` : ""}
      ${invoice.customer_location || invoice.address || invoice.customer_address ? `<div style="color: #444;">${invoice.customer_location || invoice.address || invoice.customer_address}</div>` : ""}
      
      <!-- Bordered E-BILL Card Box -->
      <div class="ebill-card">
        <div class="center bold" style="font-size: 14px; letter-spacing: 1.5px; margin-bottom: 2px;">E-BILL</div>
        <div class="center bold" style="font-size: 11px;">${branchName}</div>
        <div class="center" style="font-style: italic; font-size: 9px; color: #444;">Biller Name: biller</div>
        
        <table style="margin-top: 8px;">
          <thead>
            <tr style="font-weight: bold; border-bottom: 1px dotted #000; font-size: 9px;">
              <th>Name</th>
              <th class="right">Qty.</th>
              <th class="right">Rate</th>
              <th class="right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        
        <div class="dotted"></div>
        
        <div class="flex-between">
          <div>Total Qty:</div>
          <div class="bold">${totalQty}</div>
        </div>
        <div class="flex-between" style="margin-top: 2px;">
          <div>Sub Total:</div>
          <div class="bold">₹${Number(invoice.subtotal || invoice.total_amount).toFixed(2)}</div>
        </div>
        ${Number(invoice.gst) > 0 ? `
          <div class="flex-between" style="margin-top: 2px;">
            <div>CGST (9%):</div>
            <div class="bold">₹${Number(invoice.cgst || (invoice.gst / 2)).toFixed(2)}</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div>SGST (9%):</div>
            <div class="bold">₹${Number(invoice.sgst || (invoice.gst / 2)).toFixed(2)}</div>
          </div>
        ` : ""}
        <div class="flex-between" style="margin-top: 2px;">
          <div>Payment Mode:</div>
          <div class="bold">${invoice.payment_mode || "Cash"}</div>
        </div>
        
        <div class="dashed" style="margin: 6px 0;"></div>
        
        <div class="flex-between" style="font-size: 12px; font-weight: bold;">
          <div>Total Payable:</div>
          <div>₹${Number(invoice.total_amount).toFixed(2)}</div>
        </div>
      </div>
      
      <div class="center bold" style="margin-top: 10px; font-size: 9.5px; line-height: 1.3;">Thank you for Choosing Us, Please Visit again</div>
    </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.write(html);
  doc.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};
