/* ==========================================================================
   InvoiceFine Interactive In-Browser Invoice Generator Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initInvoiceMaker();
});

function initInvoiceMaker() {
  const itemsTableBody = document.getElementById('invItemsTableBody');
  const addItemBtn = document.getElementById('addItemBtn');
  const printBtn = document.getElementById('printInvoiceBtn');
  const previewContainer = document.getElementById('invoicePaperPreview');
  const modeA4Btn = document.getElementById('modeA4Btn');
  const modeThermalBtn = document.getElementById('modeThermalBtn');

  // Input elements for live update
  const businessNameInput = document.getElementById('invBusinessName');
  const businessPhoneInput = document.getElementById('invBusinessPhone');
  const businessGstInput = document.getElementById('invBusinessGst');
  const businessAddressInput = document.getElementById('invBusinessAddress');

  const customerNameInput = document.getElementById('invCustomerName');
  const customerPhoneInput = document.getElementById('invCustomerPhone');
  const customerAddressInput = document.getElementById('invCustomerAddress');

  const invoiceNumInput = document.getElementById('invNumber');
  const invoiceDateInput = document.getElementById('invDate');
  const taxTypeSelect = document.getElementById('invTaxType'); // intra (CGST+SGST) or inter (IGST)

  let items = [
    { name: "Basmati Premium Rice 5kg", hsn: "1006", qty: 2, price: 450, taxRate: 5, discount: 0 },
    { name: "Refined Sunflower Oil 1L", hsn: "1512", qty: 5, price: 140, taxRate: 5, discount: 5 }
  ];

  // Set today's date
  if (invoiceDateInput) {
    const today = new Date().toISOString().split('T')[0];
    invoiceDateInput.value = today;
  }

  function renderEditorItems() {
    if (!itemsTableBody) return;
    itemsTableBody.innerHTML = '';

    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <input type="text" class="form-control item-name" value="${item.name}" placeholder="Item Name" data-index="${index}">
        <input type="number" class="form-control item-qty" value="${item.qty}" min="1" placeholder="Qty" data-index="${index}">
        <input type="number" class="form-control item-price" value="${item.price}" min="0" placeholder="Price (₹)" data-index="${index}">
        <select class="form-control item-tax" data-index="${index}">
          <option value="0" ${item.taxRate === 0 ? 'selected' : ''}>0%</option>
          <option value="5" ${item.taxRate === 5 ? 'selected' : ''}>5%</option>
          <option value="12" ${item.taxRate === 12 ? 'selected' : ''}>12%</option>
          <option value="18" ${item.taxRate === 18 ? 'selected' : ''}>18%</option>
          <option value="28" ${item.taxRate === 28 ? 'selected' : ''}>28%</option>
        </select>
        <input type="number" class="form-control item-disc" value="${item.discount}" min="0" max="100" placeholder="Disc %" data-index="${index}">
        <button type="button" class="btn-remove-item" data-index="${index}" title="Remove Item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;
      itemsTableBody.appendChild(row);
    });

    attachRowEvents();
    updatePreview();
  }

  function attachRowEvents() {
    document.querySelectorAll('.item-name').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        items[idx].name = e.target.value;
        updatePreview();
      });
    });

    document.querySelectorAll('.item-qty').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        items[idx].qty = parseFloat(e.target.value) || 0;
        updatePreview();
      });
    });

    document.querySelectorAll('.item-price').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        items[idx].price = parseFloat(e.target.value) || 0;
        updatePreview();
      });
    });

    document.querySelectorAll('.item-tax').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = e.target.dataset.index;
        items[idx].taxRate = parseFloat(e.target.value) || 0;
        updatePreview();
      });
    });

    document.querySelectorAll('.item-disc').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        items[idx].discount = parseFloat(e.target.value) || 0;
        updatePreview();
      });
    });

    document.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.dataset.index;
        if (items.length > 1) {
          items.splice(idx, 1);
          renderEditorItems();
        } else {
          alert("Invoice must have at least one item.");
        }
      });
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      items.push({ name: "New Product / Service", hsn: "", qty: 1, price: 100, taxRate: 18, discount: 0 });
      renderEditorItems();
    });
  }

  // Format INR Currency
  function formatINR(val) {
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function numberToWordsINR(num) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
      if ((n = n.toString()).length > 9) return 'overflow';
      let n_array = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n_array) return '';
      let str = '';
      str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'Crore ' : '';
      str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'Lakh ' : '';
      str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'Thousand ' : '';
      str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'Hundred ' : '';
      str += (n_array[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) : '';
      return str.trim();
    };

    const integerPart = Math.floor(num);
    const paise = Math.round((num - integerPart) * 100);
    let result = 'Rupees ' + inWords(integerPart);
    if (paise > 0) {
      result += ' and ' + inWords(paise) + ' Paise';
    }
    return result + ' Only';
  }

  function updatePreview() {
    if (!previewContainer) return;

    const bName = businessNameInput ? (businessNameInput.value || "InvoiceFine Enterprises") : "InvoiceFine Enterprises";
    const bPhone = businessPhoneInput ? (businessPhoneInput.value || "+91 98765 43210") : "+91 98765 43210";
    const bGst = businessGstInput ? (businessGstInput.value || "07AAAAA0000A1Z5") : "07AAAAA0000A1Z5";
    const bAddr = businessAddressInput ? (businessAddressInput.value || "Main Market, Sector 12, New Delhi") : "Main Market, Sector 12, New Delhi";

    const cName = customerNameInput ? (customerNameInput.value || "Sharma Retail Store") : "Sharma Retail Store";
    const cPhone = customerPhoneInput ? (customerPhoneInput.value || "+91 91234 56789") : "+91 91234 56789";
    const cAddr = customerAddressInput ? (customerAddressInput.value || "Connaught Place, New Delhi") : "Connaught Place, New Delhi";

    const invNo = invoiceNumInput ? (invoiceNumInput.value || "INV-001") : "INV-001";
    const invDate = invoiceDateInput ? invoiceDateInput.value : new Date().toISOString().split('T')[0];
    const isInterState = taxTypeSelect ? (taxTypeSelect.value === 'inter') : false;

    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let rowsHtml = '';

    items.forEach((item, idx) => {
      const lineBase = item.qty * item.price;
      const lineDisc = (lineBase * item.discount) / 100;
      const taxable = lineBase - lineDisc;
      const taxAmt = (taxable * item.taxRate) / 100;
      const lineTotal = taxable + taxAmt;

      subtotal += taxable;
      totalDiscount += lineDisc;
      totalTax += taxAmt;

      rowsHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.name}</strong></td>
          <td style="text-align:center;">${item.qty}</td>
          <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
          <td style="text-align:center;">${item.taxRate}%</td>
          <td style="text-align:right;"><strong>₹${lineTotal.toFixed(2)}</strong></td>
        </tr>
      `;
    });

    const grandTotalExact = subtotal + totalTax;
    const roundedGrandTotal = Math.round(grandTotalExact);
    const roundOff = roundedGrandTotal - grandTotalExact;

    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    previewContainer.innerHTML = `
      <div class="inv-header-row">
        <div>
          <div class="inv-brand-name">${bName}</div>
          <div style="font-size:11px; color:#52525B;">${bAddr}</div>
          <div style="font-size:11px; color:#52525B;">Phone: ${bPhone} | GSTIN: ${bGst}</div>
        </div>
        <div style="text-align:right;">
          <div class="inv-title">TAX INVOICE</div>
          <div style="font-size:12px; font-weight:700; color:#D93632;"># ${invNo}</div>
          <div style="font-size:11px; color:#52525B;">Date: ${invDate}</div>
        </div>
      </div>

      <div class="inv-meta-grid">
        <div class="inv-box">
          <div class="inv-box-title">Billed To (Customer):</div>
          <div style="font-weight:700; font-size:12px;">${cName}</div>
          <div style="font-size:11px; color:#52525B;">${cAddr}</div>
          <div style="font-size:11px; color:#52525B;">Phone: ${cPhone}</div>
        </div>
        <div class="inv-box">
          <div class="inv-box-title">Payment & Tax Details:</div>
          <div style="font-size:11px;">Place of Supply: <strong>Delhi (07)</strong></div>
          <div style="font-size:11px;">Payment Mode: <strong>UPI / Cash</strong></div>
          <div style="font-size:11px;">Status: <span style="color:#168557; font-weight:700;">PAID</span></div>
        </div>
      </div>

      <table class="inv-table">
        <thead>
          <tr>
            <th style="width:30px;">#</th>
            <th>Item & Description</th>
            <th style="width:50px; text-align:center;">Qty</th>
            <th style="width:75px; text-align:right;">Rate</th>
            <th style="width:50px; text-align:center;">GST</th>
            <th style="width:85px; text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="inv-total-section">
        <div style="flex:1; padding-right:16px;">
          <div style="font-size:10px; font-weight:700; text-transform:uppercase; color:#74747C;">Amount in Words:</div>
          <div style="font-size:11px; font-weight:600; color:#19191B; margin-top:2px;">${numberToWordsINR(roundedGrandTotal)}</div>
          
          <div style="margin-top:16px; font-size:10px; color:#74747C;">
            <strong>Terms & Conditions:</strong><br>
            1. Goods once sold will not be taken back.<br>
            2. All disputes subject to local jurisdiction.
          </div>
        </div>
        <div>
          <table class="inv-total-table">
            <tr>
              <td style="color:#74747C;">Taxable Amount:</td>
              <td style="text-align:right; font-weight:600;">₹${subtotal.toFixed(2)}</td>
            </tr>
            ${isInterState ? `
              <tr>
                <td style="color:#74747C;">IGST:</td>
                <td style="text-align:right; font-weight:600;">₹${totalTax.toFixed(2)}</td>
              </tr>
            ` : `
              <tr>
                <td style="color:#74747C;">CGST:</td>
                <td style="text-align:right; font-weight:600;">₹${cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color:#74747C;">SGST:</td>
                <td style="text-align:right; font-weight:600;">₹${sgst.toFixed(2)}</td>
              </tr>
            `}
            ${roundOff !== 0 ? `
              <tr>
                <td style="color:#74747C;">Round Off:</td>
                <td style="text-align:right;">₹${roundOff.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr class="inv-grand-total">
              <td><strong>Grand Total:</strong></td>
              <td style="text-align:right;"><strong>₹${roundedGrandTotal.toFixed(2)}</strong></td>
            </tr>
          </table>

          <div style="margin-top:24px; text-align:right;">
            <div style="font-size:10px; color:#74747C; margin-bottom:28px;">For ${bName}:</div>
            <div style="border-top:1px solid #74747C; display:inline-block; padding-top:2px; font-size:10px;">Authorized Signatory</div>
          </div>
        </div>
      </div>

      <div class="inv-footer">
        Generated with InvoiceFine — 100% Offline-First Pocket ERP for Indian Small Business
      </div>
    `;
  }

  // Event listeners on form inputs
  [businessNameInput, businessPhoneInput, businessGstInput, businessAddressInput,
   customerNameInput, customerPhoneInput, customerAddressInput,
   invoiceNumInput, invoiceDateInput, taxTypeSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    }
  });

  // Switch between A4 and Thermal layout
  if (modeA4Btn && modeThermalBtn && previewContainer) {
    modeA4Btn.addEventListener('click', () => {
      modeA4Btn.classList.add('active');
      modeThermalBtn.classList.remove('active');
      previewContainer.classList.remove('thermal-mode');
    });

    modeThermalBtn.addEventListener('click', () => {
      modeThermalBtn.classList.add('active');
      modeA4Btn.classList.remove('active');
      previewContainer.classList.add('thermal-mode');
    });
  }

  // Print Action
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  renderEditorItems();
}
