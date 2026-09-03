/* ==========================================================================
   InvoiceFine Pro Studio - Next-Level Invoicing Engine
   Features:
   - Rock-Solid Cross-Browser Print Engine
   - Decluttered Main Screen with Dedicated ⚙️ Settings Modal
   - Customer Khata & Directory with Instant Autocomplete
   - Product Catalog with Auto-Save
   - Google Sheets & Apps Script Cloud Sync Webhook
   - Past Invoices History & CSV Export
   - Dynamic UPI Payment QR Code Generator
   - Multi-Theme & Watermark Branding
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initInvoiceMakerPro();
});

function initInvoiceMakerPro() {
  // DOM Elements - Navigation & Ribbons
  const ribbonShopNameDisplay = document.getElementById('ribbonShopNameDisplay');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');

  const openHistoryBtn = document.getElementById('openHistoryBtn');
  const closeHistoryModalBtn = document.getElementById('closeHistoryModalBtn');
  const closeHistoryBottomBtn = document.getElementById('closeHistoryBottomBtn');
  const historyModal = document.getElementById('historyModal');
  const historyTableBody = document.getElementById('historyTableBody');
  const historySearchInput = document.getElementById('historySearchInput');
  const exportHistoryCsvBtn = document.getElementById('exportHistoryCsvBtn');
  const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');

  const mobileTabEditor = document.getElementById('tabBtnEditor');
  const mobileTabPreview = document.getElementById('tabBtnPreview');

  // Main Editor Billing Fields
  const customerNameInput = document.getElementById('invCustomerName');
  const customerPhoneInput = document.getElementById('invCustomerPhone');
  const customerGstInput = document.getElementById('invCustomerGst');
  const customerAddressInput = document.getElementById('invCustomerAddress');
  const customerSuggestions = document.getElementById('customerSuggestions');
  const productSuggestions = document.getElementById('productSuggestions');

  const docTypeSelect = document.getElementById('invDocType');
  const invoiceNumInput = document.getElementById('invNumber');
  const invoiceDateInput = document.getElementById('invDate');
  const invoiceDueDateInput = document.getElementById('invDueDate');
  const taxTypeSelect = document.getElementById('invTaxType');

  const itemsTableBody = document.getElementById('invItemsTableBody');
  const itemsCountBadge = document.getElementById('itemsCountBadge');
  const addItemBtn = document.getElementById('addItemBtn');
  const resetBtn = document.getElementById('resetInvoiceBtn');
  const saveBillBtn = document.getElementById('saveBillBtn');

  const statusPills = document.querySelectorAll('.status-pill');
  const amountPaidInput = document.getElementById('invAmountPaid');
  const balanceDueDisplay = document.getElementById('balanceDueDisplay');

  // Preview & Actions
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const downloadJpgBtn = document.getElementById('downloadJpgBtn');
  const printBtn = document.getElementById('printInvoiceBtn');
  const whatsappBtn = document.getElementById('whatsappShareBtn');
  const syncGoogleSheetBtn = document.getElementById('syncGoogleSheetBtn');
  const previewContainer = document.getElementById('invoicePaperPreview');
  const paperZoomWrapper = document.getElementById('paperZoomWrapper');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomDisplay = document.getElementById('zoomDisplay');
  const modeA4Btn = document.getElementById('modeA4Btn');
  const modeThermalBtn = document.getElementById('modeThermalBtn');

  // Settings Modal Inputs
  const settingBusinessName = document.getElementById('settingBusinessName');
  const settingBusinessPhone = document.getElementById('settingBusinessPhone');
  const settingBusinessGst = document.getElementById('settingBusinessGst');
  const settingState = document.getElementById('settingState');
  const settingBusinessAddress = document.getElementById('settingBusinessAddress');
  const invLogoUpload = document.getElementById('invLogoUpload');
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const logoUploadLabel = document.getElementById('logoUploadLabel');
  const removeLogoBtn = document.getElementById('removeLogoBtn');

  const settingUpiId = document.getElementById('settingUpiId');
  const settingBankName = document.getElementById('settingBankName');
  const settingBankAcc = document.getElementById('settingBankAcc');
  const settingBankIfsc = document.getElementById('settingBankIfsc');
  const settingBankBranch = document.getElementById('settingBankBranch');

  const settingGoogleSheetUrl = document.getElementById('settingGoogleSheetUrl');
  const settingAutoSyncGoogle = document.getElementById('settingAutoSyncGoogle');
  const testGoogleSheetBtn = document.getElementById('testGoogleSheetBtn');
  const copyAppsScriptBtn = document.getElementById('copyAppsScriptBtn');

  const settingTerms = document.getElementById('settingTerms');
  const settingNotes = document.getElementById('settingNotes');
  const settingSignatory = document.getElementById('settingSignatory');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // State
  let currentPaymentStatus = 'PAID';
  let currentTheme = localStorage.getItem('invoicefine_inv_theme') || 'theme-coral';
  let currentZoom = 1.0;
  let shopLogoBase64 = '';

  const UNITS = ['Pcs', 'Kg', 'Ltr', 'Box', 'Mtr', 'Pack', 'Bags', 'Gram', 'Set', 'Unit'];

  const DEFAULT_ITEMS = [
    { name: "Basmati Premium Rice 5kg", hsn: "1006", qty: 2, unit: "Bags", price: 450, taxRate: 5, discount: 0 },
    { name: "Refined Sunflower Oil 1L", hsn: "1512", qty: 5, unit: "Pcs", price: 140, taxRate: 5, discount: 5 },
    { name: "Organic Toor Dal 1kg", hsn: "0713", qty: 3, unit: "Kg", price: 165, taxRate: 0, discount: 0 }
  ];

  let items = [];

  // Default Shop Settings
  const DEFAULT_SETTINGS = {
    bName: "Shree Balaji Traders",
    bPhone: "+91 98765 43210",
    bGst: "07AABCU9603R1ZM",
    bState: "07 - Delhi",
    bAddr: "Shop 42, Grain Market, Chandni Chowk, Delhi 110006",
    logo: "",
    upiId: "shreebalaji@okaxis",
    bankName: "HDFC Bank",
    bankAcc: "50200012345678",
    bankIfsc: "HDFC0001234",
    bankBranch: "Chandni Chowk, Delhi",
    googleSheetUrl: "",
    autoSyncGoogle: false,
    terms: "1. Goods once sold will not be taken back.\n2. All disputes subject to local city jurisdiction.",
    notes: "Thank you for your business! Visit again.",
    signatory: "Authorized Signatory / Partner"
  };

  let shopSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

  // Set default today's date
  if (invoiceDateInput && !invoiceDateInput.value) {
    invoiceDateInput.value = new Date().toISOString().split('T')[0];
  }

  /* --------------------------------------------------------------------------
     1. Toast Notification Utility
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     2. Settings Management (Load, Modal, Save)
     -------------------------------------------------------------------------- */
  function loadShopSettings() {
    try {
      const saved = localStorage.getItem('invoicefine_shop_settings_v3');
      if (saved) {
        shopSettings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved));
      }
    } catch (e) {
      shopSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    shopLogoBase64 = shopSettings.logo || '';
    if (ribbonShopNameDisplay) {
      ribbonShopNameDisplay.innerText = shopSettings.bName || "Your Shop";
    }
  }

  function populateSettingsModal() {
    if (settingBusinessName) settingBusinessName.value = shopSettings.bName;
    if (settingBusinessPhone) settingBusinessPhone.value = shopSettings.bPhone;
    if (settingBusinessGst) settingBusinessGst.value = shopSettings.bGst;
    if (settingState) settingState.value = shopSettings.bState;
    if (settingBusinessAddress) settingBusinessAddress.value = shopSettings.bAddr;

    if (settingUpiId) settingUpiId.value = shopSettings.upiId;
    if (settingBankName) settingBankName.value = shopSettings.bankName;
    if (settingBankAcc) settingBankAcc.value = shopSettings.bankAcc;
    if (settingBankIfsc) settingBankIfsc.value = shopSettings.bankIfsc;
    if (settingBankBranch) settingBankBranch.value = shopSettings.bankBranch;

    if (settingGoogleSheetUrl) settingGoogleSheetUrl.value = shopSettings.googleSheetUrl;
    if (settingAutoSyncGoogle) settingAutoSyncGoogle.checked = !!shopSettings.autoSyncGoogle;

    if (settingTerms) settingTerms.value = shopSettings.terms;
    if (settingNotes) settingNotes.value = shopSettings.notes;
    if (settingSignatory) settingSignatory.value = shopSettings.signatory;

    renderLogoState();
  }

  function renderLogoState() {
    if (shopLogoBase64) {
      if (logoPreviewImg) {
        logoPreviewImg.src = shopLogoBase64;
        logoPreviewImg.style.display = 'block';
      }
      if (logoUploadLabel) logoUploadLabel.innerText = "Change Shop Logo";
      if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
    } else {
      if (logoPreviewImg) {
        logoPreviewImg.src = '';
        logoPreviewImg.style.display = 'none';
      }
      if (logoUploadLabel) logoUploadLabel.innerText = "Upload Shop Logo (PNG/JPG)";
      if (removeLogoBtn) removeLogoBtn.style.display = 'none';
    }
  }

  function saveShopSettingsFromModal() {
    shopSettings.bName = settingBusinessName.value.trim() || "Your Business Name";
    shopSettings.bPhone = settingBusinessPhone.value.trim();
    shopSettings.bGst = settingBusinessGst.value.trim();
    shopSettings.bState = settingState.value;
    shopSettings.bAddr = settingBusinessAddress.value.trim();
    shopSettings.logo = shopLogoBase64;

    shopSettings.upiId = settingUpiId.value.trim();
    shopSettings.bankName = settingBankName.value.trim();
    shopSettings.bankAcc = settingBankAcc.value.trim();
    shopSettings.bankIfsc = settingBankIfsc.value.trim();
    shopSettings.bankBranch = settingBankBranch.value.trim();

    shopSettings.googleSheetUrl = settingGoogleSheetUrl.value.trim();
    shopSettings.autoSyncGoogle = settingAutoSyncGoogle.checked;

    shopSettings.terms = settingTerms.value.trim();
    shopSettings.notes = settingNotes.value.trim();
    shopSettings.signatory = settingSignatory.value.trim();

    try {
      localStorage.setItem('invoicefine_shop_settings_v3', JSON.stringify(shopSettings));
    } catch (e) {
      console.warn("Storage error", e);
    }

    if (ribbonShopNameDisplay) {
      ribbonShopNameDisplay.innerText = shopSettings.bName;
    }

    settingsModal.classList.remove('is-open');
    showToast("✓ Shop & Cloud settings saved successfully!");
    updatePreview();
    saveCurrentDraft();
  }

  // Settings Modal Handlers
  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      populateSettingsModal();
      settingsModal.classList.add('is-open');
    });
  }

  if (closeSettingsModalBtn && settingsModal) {
    closeSettingsModalBtn.addEventListener('click', () => settingsModal.classList.remove('is-open'));
  }
  if (cancelSettingsBtn && settingsModal) {
    cancelSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('is-open'));
  }
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveShopSettingsFromModal);
  }

  // Settings Modal Tabs
  const modalTabs = document.querySelectorAll('.modal-nav-tab');
  modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modalTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Logo upload & remove inside modal
  if (invLogoUpload) {
    invLogoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        shopLogoBase64 = loadEvt.target.result;
        renderLogoState();
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeLogoBtn) {
    removeLogoBtn.addEventListener('click', () => {
      shopLogoBase64 = '';
      if (invLogoUpload) invLogoUpload.value = '';
      renderLogoState();
    });
  }

  // Copy Apps Script Code Button
  if (copyAppsScriptBtn) {
    copyAppsScriptBtn.addEventListener('click', () => {
      const code = document.getElementById('appsScriptCodeSnippet').innerText;
      navigator.clipboard.writeText(code).then(() => {
        showToast("📋 Apps Script code copied to clipboard!");
      }).catch(() => {
        showToast("Select & copy the code box manually.", "error");
      });
    });
  }

  // Test Google Sheets Connection
  if (testGoogleSheetBtn) {
    testGoogleSheetBtn.addEventListener('click', async () => {
      const url = settingGoogleSheetUrl.value.trim();
      if (!url || !url.startsWith('http')) {
        alert("Please enter a valid Google Apps Script Web App URL first.");
        return;
      }
      testGoogleSheetBtn.disabled = true;
      testGoogleSheetBtn.innerText = "Testing...";

      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true, ping: 'InvoiceFine Pro Studio Connection Test', timestamp: new Date().toISOString() })
        });
        showToast("✓ Webhook dispatched to Google Sheets! Check your sheet for test ping.");
      } catch (err) {
        showToast("Failed to reach Web App URL. Verify deployment settings.", "error");
      } finally {
        testGoogleSheetBtn.disabled = false;
        testGoogleSheetBtn.innerText = "Test Connection";
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Customer Directory & Khata Auto-Save
     -------------------------------------------------------------------------- */
  function getCustomerDirectory() {
    try {
      const data = localStorage.getItem('invoicefine_customers_dir');
      return data ? JSON.parse(data) : [
        { name: "Sharma Kirana & General Store", phone: "+91 91234 56789", address: "Near Metro Station, Karol Bagh, Delhi", gst: "" },
        { name: "Gupta Electricals & Hardware", phone: "+91 98111 22334", address: "Plot 14, Industrial Area, Okhla, Delhi", gst: "07AABCG1234F1Z0" }
      ];
    } catch (e) {
      return [];
    }
  }

  function saveCustomerToDirectory(name, phone, address, gst) {
    if (!name || name.trim().length < 2) return;
    const dir = getCustomerDirectory();
    const existingIdx = dir.findIndex(c => c.name.toLowerCase() === name.trim().toLowerCase());
    const custObj = { name: name.trim(), phone: phone.trim(), address: address.trim(), gst: gst.trim() };

    if (existingIdx >= 0) {
      dir[existingIdx] = custObj;
    } else {
      dir.unshift(custObj);
    }

    try {
      localStorage.setItem('invoicefine_customers_dir', JSON.stringify(dir.slice(0, 100)));
      populateCustomerSuggestions();
    } catch (e) {}
  }

  function populateCustomerSuggestions() {
    if (!customerSuggestions) return;
    const dir = getCustomerDirectory();
    customerSuggestions.innerHTML = '';
    dir.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.label = `${c.phone ? c.phone + ' • ' : ''}${c.address || ''}`;
      customerSuggestions.appendChild(opt);
    });
  }

  // When customer name typed, check if exists and auto-fill
  if (customerNameInput) {
    customerNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      const dir = getCustomerDirectory();
      const match = dir.find(c => c.name.toLowerCase() === val);
      if (match) {
        if (customerPhoneInput && match.phone) customerPhoneInput.value = match.phone;
        if (customerAddressInput && match.address) customerAddressInput.value = match.address;
        if (customerGstInput && match.gst) customerGstInput.value = match.gst;
        showToast(`Auto-filled details for ${match.name}`);
      }
      updatePreview();
      saveCurrentDraft();
    });
  }

  /* --------------------------------------------------------------------------
     4. Product Catalog Auto-Save & Suggestions
     -------------------------------------------------------------------------- */
  function getProductCatalog() {
    try {
      const data = localStorage.getItem('invoicefine_products_catalog');
      return data ? JSON.parse(data) : [
        { name: "Basmati Premium Rice 5kg", hsn: "1006", unit: "Bags", price: 450, taxRate: 5 },
        { name: "Refined Sunflower Oil 1L", hsn: "1512", unit: "Pcs", price: 140, taxRate: 5 },
        { name: "Organic Toor Dal 1kg", hsn: "0713", unit: "Kg", price: 165, taxRate: 0 },
        { name: "Fortune Atta 10kg", hsn: "1101", unit: "Bags", price: 420, taxRate: 5 },
        { name: "Tata Salt 1kg", hsn: "2501", unit: "Pcs", price: 28, taxRate: 0 }
      ];
    } catch (e) {
      return [];
    }
  }

  function saveProductToCatalog(item) {
    if (!item.name || item.name.trim().length < 2) return;
    const cat = getProductCatalog();
    const existingIdx = cat.findIndex(p => p.name.toLowerCase() === item.name.trim().toLowerCase());
    const prodObj = { name: item.name.trim(), hsn: item.hsn || '', unit: item.unit || 'Pcs', price: item.price || 0, taxRate: item.taxRate || 0 };

    if (existingIdx >= 0) {
      cat[existingIdx] = prodObj;
    } else {
      cat.unshift(prodObj);
    }

    try {
      localStorage.setItem('invoicefine_products_catalog', JSON.stringify(cat.slice(0, 150)));
      populateProductSuggestions();
    } catch (e) {}
  }

  function populateProductSuggestions() {
    if (!productSuggestions) return;
    const cat = getProductCatalog();
    productSuggestions.innerHTML = '';
    cat.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.label = `₹${p.price} • ${p.unit} (GST: ${p.taxRate}%)`;
      productSuggestions.appendChild(opt);
    });
  }

  /* --------------------------------------------------------------------------
     5. Google Sheets Cloud Sync Engine
     -------------------------------------------------------------------------- */
  async function syncInvoiceToGoogleSheet(manual = true) {
    const url = shopSettings.googleSheetUrl;
    if (!url || !url.startsWith('http')) {
      if (manual) {
        alert("Please set your Google Apps Script Web App URL in '⚙️ Shop & Cloud Settings' first.");
        populateSettingsModal();
        settingsModal.classList.add('is-open');
      }
      return;
    }

    const bName = shopSettings.bName || "My Shop";
    const cName = customerNameInput ? customerNameInput.value.trim() : "Customer";
    const cPhone = customerPhoneInput ? customerPhoneInput.value.trim() : "";
    const cGst = customerGstInput ? customerGstInput.value.trim() : "";
    const cAddr = customerAddressInput ? customerAddressInput.value.trim() : "";
    const invNo = invoiceNumInput ? invoiceNumInput.value.trim() : "INV-001";
    const invDate = invoiceDateInput ? invoiceDateInput.value : "";
    const docType = docTypeSelect ? docTypeSelect.value : "TAX INVOICE";

    let subtotal = 0;
    let totalTax = 0;
    const itemsSummaryArr = [];

    items.forEach(i => {
      const base = i.qty * i.price;
      const disc = (base * i.discount) / 100;
      const taxable = base - disc;
      const tax = (taxable * i.taxRate) / 100;
      subtotal += taxable;
      totalTax += tax;
      itemsSummaryArr.push(`${i.name} (x${i.qty} ${i.unit || 'Pcs'})`);
    });

    const grandTotal = Math.round(subtotal + totalTax);
    const amountPaid = amountPaidInput ? (parseFloat(amountPaidInput.value) || 0) : 0;
    const balanceDue = currentPaymentStatus === 'PAID' ? 0 : Math.max(0, grandTotal - amountPaid);

    const payload = {
      invoiceNo: invNo,
      date: invDate,
      docType: docType,
      shopName: bName,
      customerName: cName,
      customerPhone: cPhone,
      customerGst: cGst,
      customerAddress: cAddr,
      itemsSummary: itemsSummaryArr.join(', '),
      subtotal: subtotal.toFixed(2),
      totalTax: totalTax.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      status: currentPaymentStatus,
      amountPaid: amountPaid.toFixed(2),
      balanceDue: balanceDue.toFixed(2),
      timestamp: new Date().toISOString()
    };

    if (syncGoogleSheetBtn) {
      syncGoogleSheetBtn.disabled = true;
      syncGoogleSheetBtn.innerText = "Syncing...";
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(`☁️ Invoice #${invNo} synced to your Google Sheet!`);
    } catch (err) {
      if (manual) {
        showToast("Cloud sync failed. Verify your Web App URL.", "error");
      }
    } finally {
      if (syncGoogleSheetBtn) {
        syncGoogleSheetBtn.disabled = false;
        syncGoogleSheetBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
          <span>Sync Sheets</span>
        `;
      }
    }
  }

  if (syncGoogleSheetBtn) {
    syncGoogleSheetBtn.addEventListener('click', () => syncInvoiceToGoogleSheet(true));
  }

  /* --------------------------------------------------------------------------
     6. Invoices History (Khata Ledger & Archive)
     -------------------------------------------------------------------------- */
  function getInvoicesHistory() {
    try {
      const data = localStorage.getItem('invoicefine_invoices_history_v3');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveInvoiceToHistory() {
    const invNo = invoiceNumInput ? (invoiceNumInput.value.trim() || "INV-001") : "INV-001";
    const invDate = invoiceDateInput ? invoiceDateInput.value : new Date().toISOString().split('T')[0];
    const cName = customerNameInput ? (customerNameInput.value.trim() || "Walk-in Customer") : "Walk-in Customer";
    const cPhone = customerPhoneInput ? customerPhoneInput.value.trim() : "";
    const cGst = customerGstInput ? customerGstInput.value.trim() : "";
    const cAddr = customerAddressInput ? customerAddressInput.value.trim() : "";

    let subtotal = 0;
    let totalTax = 0;
    items.forEach(i => {
      const base = i.qty * i.price;
      const disc = (base * i.discount) / 100;
      const taxable = base - disc;
      subtotal += taxable;
      totalTax += (taxable * i.taxRate) / 100;
    });

    const grandTotal = Math.round(subtotal + totalTax);
    const amountPaid = amountPaidInput ? (parseFloat(amountPaidInput.value) || 0) : 0;
    const balanceDue = currentPaymentStatus === 'PAID' ? 0 : Math.max(0, grandTotal - amountPaid);

    const invoiceRecord = {
      id: 'inv_' + Date.now(),
      invoiceNo: invNo,
      date: invDate,
      docType: docTypeSelect ? docTypeSelect.value : 'TAX INVOICE',
      customerName: cName,
      customerPhone: cPhone,
      customerGst: cGst,
      customerAddress: cAddr,
      items: JSON.parse(JSON.stringify(items)),
      subtotal,
      totalTax,
      grandTotal,
      status: currentPaymentStatus,
      amountPaid,
      balanceDue,
      timestamp: new Date().toISOString()
    };

    const history = getInvoicesHistory();
    // Check if invNo already exists
    const idx = history.findIndex(h => h.invoiceNo === invNo);
    if (idx >= 0) {
      history[idx] = invoiceRecord;
    } else {
      history.unshift(invoiceRecord);
    }

    try {
      localStorage.setItem('invoicefine_invoices_history_v3', JSON.stringify(history.slice(0, 300)));
    } catch (e) {}

    // Also auto-save customer to customer directory
    saveCustomerToDirectory(cName, cPhone, cAddr, cGst);

    // Also auto-save items to product catalog
    items.forEach(saveProductToCatalog);

    showToast(`✓ Invoice #${invNo} saved to Khata History!`);

    // If auto-sync Google Sheets is enabled
    if (shopSettings.autoSyncGoogle && shopSettings.googleSheetUrl) {
      syncInvoiceToGoogleSheet(false);
    }
  }

  if (saveBillBtn) {
    saveBillBtn.addEventListener('click', saveInvoiceToHistory);
  }

  function renderHistoryTable(query = '') {
    if (!historyTableBody) return;
    const history = getInvoicesHistory();
    const q = query.toLowerCase().trim();

    const filtered = history.filter(h => {
      if (!q) return true;
      return (h.invoiceNo && h.invoiceNo.toLowerCase().includes(q)) ||
             (h.customerName && h.customerName.toLowerCase().includes(q)) ||
             (h.customerPhone && h.customerPhone.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">
            ${query ? 'No matching invoices found.' : 'No saved invoices yet. Click "Save to History" or Print to store invoices here.'}
          </td>
        </tr>
      `;
      return;
    }

    historyTableBody.innerHTML = '';
    filtered.forEach(h => {
      const tr = document.createElement('tr');
      const statusBadge = h.status === 'PAID'
        ? '<span style="background:#E3F5EC; color:#0D5C3A; padding:2px 6px; border-radius:3px; font-weight:700; font-size:10px;">PAID</span>'
        : (h.status === 'PARTIAL'
          ? `<span style="background:#FEF3E2; color:#8C5300; padding:2px 6px; border-radius:3px; font-weight:700; font-size:10px;">PARTIAL (Due: ₹${h.balanceDue})</span>`
          : `<span style="background:#FDE8E9; color:#D9363E; padding:2px 6px; border-radius:3px; font-weight:700; font-size:10px;">UDHAR (₹${h.grandTotal})</span>`);

      tr.innerHTML = `
        <td><strong>#${escapeHtml(h.invoiceNo)}</strong></td>
        <td>${escapeHtml(h.date)}</td>
        <td><strong>${escapeHtml(h.customerName)}</strong></td>
        <td>${escapeHtml(h.customerPhone || '-')}</td>
        <td><strong>₹${h.grandTotal.toFixed(2)}</strong></td>
        <td>${statusBadge}</td>
        <td style="text-align: right; white-space: nowrap;">
          <button type="button" class="btn btn-sm btn-load-inv" data-id="${h.id}" style="background:var(--primary-soft); color:var(--primary); padding:4px 8px; font-size:0.75rem; font-weight:700; border:none; border-radius:4px; cursor:pointer;">Load</button>
          <button type="button" class="btn btn-sm btn-del-inv" data-id="${h.id}" style="background:var(--danger-soft); color:var(--danger); padding:4px 8px; font-size:0.75rem; font-weight:700; border:none; border-radius:4px; margin-left:4px; cursor:pointer;">✕</button>
        </td>
      `;
      historyTableBody.appendChild(tr);
    });

    // Attach actions
    document.querySelectorAll('.btn-load-inv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const inv = history.find(h => h.id === id);
        if (inv) {
          loadInvoiceIntoEditor(inv);
          historyModal.classList.remove('is-open');
          showToast(`Loaded invoice #${inv.invoiceNo} into editor.`);
        }
      });
    });

    document.querySelectorAll('.btn-del-inv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm("Delete this invoice from history?")) {
          const updated = history.filter(h => h.id !== id);
          localStorage.setItem('invoicefine_invoices_history_v3', JSON.stringify(updated));
          renderHistoryTable(historySearchInput ? historySearchInput.value : '');
          showToast("Invoice deleted from history.");
        }
      });
    });
  }

  function loadInvoiceIntoEditor(inv) {
    if (customerNameInput) customerNameInput.value = inv.customerName || '';
    if (customerPhoneInput) customerPhoneInput.value = inv.customerPhone || '';
    if (customerAddressInput) customerAddressInput.value = inv.customerAddress || '';
    if (customerGstInput) customerGstInput.value = inv.customerGst || '';

    if (docTypeSelect) docTypeSelect.value = inv.docType || 'TAX INVOICE';
    if (invoiceNumInput) invoiceNumInput.value = inv.invoiceNo || '';
    if (invoiceDateInput) invoiceDateInput.value = inv.date || '';

    if (inv.items && Array.isArray(inv.items) && inv.items.length > 0) {
      items = JSON.parse(JSON.stringify(inv.items));
    }

    if (inv.status) {
      currentPaymentStatus = inv.status;
      statusPills.forEach(p => {
        p.className = 'status-pill';
        if (p.dataset.status === currentPaymentStatus) {
          p.classList.add(currentPaymentStatus === 'PAID' ? 'active-paid' : (currentPaymentStatus === 'PARTIAL' ? 'active-partial' : 'active-unpaid'));
        }
      });
    }

    if (amountPaidInput) amountPaidInput.value = inv.amountPaid || 0;

    renderEditorItems();
    updatePreview();
    saveCurrentDraft();
  }

  // History Modal Open/Close
  if (openHistoryBtn && historyModal) {
    openHistoryBtn.addEventListener('click', () => {
      renderHistoryTable();
      historyModal.classList.add('is-open');
    });
  }
  if (closeHistoryModalBtn && historyModal) {
    closeHistoryModalBtn.addEventListener('click', () => historyModal.classList.remove('is-open'));
  }
  if (closeHistoryBottomBtn && historyModal) {
    closeHistoryBottomBtn.addEventListener('click', () => historyModal.classList.remove('is-open'));
  }
  if (historySearchInput) {
    historySearchInput.addEventListener('input', (e) => renderHistoryTable(e.target.value));
  }

  // Clear all history
  if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your entire invoices history?")) {
        localStorage.removeItem('invoicefine_invoices_history_v3');
        renderHistoryTable();
        showToast("History cleared.");
      }
    });
  }

  // Export History to CSV
  if (exportHistoryCsvBtn) {
    exportHistoryCsvBtn.addEventListener('click', () => {
      const history = getInvoicesHistory();
      if (history.length === 0) {
        alert("No invoices to export.");
        return;
      }

      let csv = "Invoice No,Date,Customer Name,Phone,Address,GSTIN,Items,Subtotal,Total Tax,Grand Total,Status,Amount Paid,Balance Due\n";
      history.forEach(h => {
        const itemsStr = (h.items || []).map(i => `${i.name} (${i.qty} ${i.unit})`).join('; ');
        csv += `"${h.invoiceNo}","${h.date}","${h.customerName}","${h.customerPhone}","${h.customerAddress}","${h.customerGst}","${itemsStr}","${h.subtotal}","${h.totalTax}","${h.grandTotal}","${h.status}","${h.amountPaid}","${h.balanceDue}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `InvoiceFine_Khata_Export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    });
  }

  /* --------------------------------------------------------------------------
     7. Mobile Segmented Tab Switcher (Edit vs Preview)
     -------------------------------------------------------------------------- */
  if (mobileTabEditor && mobileTabPreview) {
    mobileTabEditor.addEventListener('click', () => {
      document.body.classList.remove('view-tab-preview-active');
      document.body.classList.add('view-tab-editor-active');
      mobileTabEditor.classList.add('active');
      mobileTabPreview.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    mobileTabPreview.addEventListener('click', () => {
      document.body.classList.remove('view-tab-editor-active');
      document.body.classList.add('view-tab-preview-active');
      mobileTabPreview.classList.add('active');
      mobileTabEditor.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updatePreview();
    });
  }

  /* --------------------------------------------------------------------------
     8. Zoom Controls
     -------------------------------------------------------------------------- */
  function setZoom(newZoom) {
    currentZoom = Math.min(1.3, Math.max(0.65, Math.round(newZoom * 100) / 100));
    if (paperZoomWrapper) {
      paperZoomWrapper.style.transform = `scale(${currentZoom})`;
    }
    if (zoomDisplay) {
      zoomDisplay.innerText = `${Math.round(currentZoom * 100)}%`;
    }
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => setZoom(currentZoom + 0.1));
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - 0.1));
  }

  /* --------------------------------------------------------------------------
     9. Color Theme Picker
     -------------------------------------------------------------------------- */
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  function applyTheme(themeClass) {
    currentTheme = themeClass;
    localStorage.setItem('invoicefine_inv_theme', themeClass);
    if (previewContainer) {
      previewContainer.classList.remove('theme-coral', 'theme-navy', 'theme-emerald', 'theme-charcoal');
      previewContainer.classList.add(themeClass);
    }
    themeSwatches.forEach(sw => {
      if (sw.dataset.theme === themeClass) {
        sw.classList.add('active');
      } else {
        sw.classList.remove('active');
      }
    });
    updatePreview();
  }

  themeSwatches.forEach(sw => {
    sw.addEventListener('click', () => applyTheme(sw.dataset.theme));
  });

  /* --------------------------------------------------------------------------
     10. Payment Status Pills
     -------------------------------------------------------------------------- */
  statusPills.forEach(pill => {
    pill.addEventListener('click', () => {
      statusPills.forEach(p => p.className = 'status-pill');
      currentPaymentStatus = pill.dataset.status;

      if (currentPaymentStatus === 'PAID') {
        pill.classList.add('active-paid');
      } else if (currentPaymentStatus === 'PARTIAL') {
        pill.classList.add('active-partial');
      } else {
        pill.classList.add('active-unpaid');
      }
      updatePreview();
      saveCurrentDraft();
    });
  });

  /* --------------------------------------------------------------------------
     11. Current Working Draft Persistence
     -------------------------------------------------------------------------- */
  function loadCurrentDraft() {
    try {
      const saved = localStorage.getItem('invoicefine_current_billing_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (customerNameInput && d.cName) customerNameInput.value = d.cName;
        if (customerPhoneInput && d.cPhone) customerPhoneInput.value = d.cPhone;
        if (customerGstInput && d.cGst !== undefined) customerGstInput.value = d.cGst;
        if (customerAddressInput && d.cAddr) customerAddressInput.value = d.cAddr;

        if (docTypeSelect && d.docType) docTypeSelect.value = d.docType;
        if (invoiceNumInput && d.invNo) invoiceNumInput.value = d.invNo;
        if (invoiceDateInput && d.invDate) invoiceDateInput.value = d.invDate;
        if (invoiceDueDateInput && d.invDueDate) invoiceDueDateInput.value = d.invDueDate;
        if (taxTypeSelect && d.taxType) taxTypeSelect.value = d.taxType;

        if (d.items && Array.isArray(d.items) && d.items.length > 0) {
          items = d.items;
        } else {
          items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
        }

        if (d.status) {
          currentPaymentStatus = d.status;
          statusPills.forEach(p => {
            p.className = 'status-pill';
            if (p.dataset.status === currentPaymentStatus) {
              p.classList.add(currentPaymentStatus === 'PAID' ? 'active-paid' : (currentPaymentStatus === 'PARTIAL' ? 'active-partial' : 'active-unpaid'));
            }
          });
        }

        if (amountPaidInput && d.amountPaid !== undefined) amountPaidInput.value = d.amountPaid;
      } else {
        items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
      }
    } catch (e) {
      items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
    }
  }

  function saveCurrentDraft() {
    try {
      const draft = {
        cName: customerNameInput ? customerNameInput.value : '',
        cPhone: customerPhoneInput ? customerPhoneInput.value : '',
        cGst: customerGstInput ? customerGstInput.value : '',
        cAddr: customerAddressInput ? customerAddressInput.value : '',
        docType: docTypeSelect ? docTypeSelect.value : 'TAX INVOICE',
        invNo: invoiceNumInput ? invoiceNumInput.value : '',
        invDate: invoiceDateInput ? invoiceDateInput.value : '',
        invDueDate: invoiceDueDateInput ? invoiceDueDateInput.value : '',
        taxType: taxTypeSelect ? taxTypeSelect.value : 'intra',
        status: currentPaymentStatus,
        amountPaid: amountPaidInput ? amountPaidInput.value : 0,
        items: items
      };
      localStorage.setItem('invoicefine_current_billing_draft', JSON.stringify(draft));
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     12. Item Table Rendering & Catalog Autocomplete
     -------------------------------------------------------------------------- */
  function renderEditorItems() {
    if (!itemsTableBody) return;
    itemsTableBody.innerHTML = '';

    if (itemsCountBadge) {
      itemsCountBadge.innerText = `${items.length} ${items.length === 1 ? 'Item' : 'Items'}`;
    }

    if (items.length === 0) {
      itemsTableBody.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-muted); background: var(--bg-surface-variant); border-radius: var(--radius-md); margin-bottom: 10px;">
          <p style="margin-bottom: 8px; font-weight: 600;">No items in invoice.</p>
          <button type="button" class="btn btn-primary btn-sm" id="emptyAddRowBtn">+ Add First Item</button>
        </div>
      `;
      const emptyAdd = document.getElementById('emptyAddRowBtn');
      if (emptyAdd) {
        emptyAdd.addEventListener('click', () => {
          items.push({ name: "New Product / Service", hsn: "", qty: 1, unit: "Pcs", price: 100, taxRate: 18, discount: 0 });
          renderEditorItems();
        });
      }
      updatePreview();
      saveCurrentDraft();
      return;
    }

    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      
      let unitsOptions = '';
      UNITS.forEach(u => {
        unitsOptions += `<option value="${u}" ${item.unit === u ? 'selected' : ''}>${u}</option>`;
      });

      row.innerHTML = `
        <input type="text" list="productSuggestions" class="form-control item-name" value="${escapeHtml(item.name)}" placeholder="Item Name" data-index="${index}" autocomplete="off">
        <input type="text" class="form-control item-hsn" value="${escapeHtml(item.hsn || '')}" placeholder="HSN/SAC" data-index="${index}">
        <input type="number" class="form-control item-qty" value="${item.qty}" min="0.01" step="any" placeholder="Qty" data-index="${index}">
        <select class="form-control item-unit" data-index="${index}">
          ${unitsOptions}
        </select>
        <input type="number" class="form-control item-price" value="${item.price}" min="0" step="any" placeholder="Rate (₹)" data-index="${index}">
        <select class="form-control item-tax" data-index="${index}">
          <option value="0" ${item.taxRate === 0 ? 'selected' : ''}>0%</option>
          <option value="5" ${item.taxRate === 5 ? 'selected' : ''}>5%</option>
          <option value="12" ${item.taxRate === 12 ? 'selected' : ''}>12%</option>
          <option value="18" ${item.taxRate === 18 ? 'selected' : ''}>18%</option>
          <option value="28" ${item.taxRate === 28 ? 'selected' : ''}>28%</option>
        </select>
        <input type="number" class="form-control item-disc" value="${item.discount}" min="0" max="100" placeholder="Disc %" data-index="${index}">
        <button type="button" class="btn-remove-item" data-index="${index}" title="Delete item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;
      itemsTableBody.appendChild(row);
    });

    attachItemRowEvents();
    updatePreview();
    saveCurrentDraft();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function attachItemRowEvents() {
    document.querySelectorAll('.item-name').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          const val = e.target.value;
          items[idx].name = val;

          // Check if matches catalog product
          const cat = getProductCatalog();
          const match = cat.find(p => p.name.toLowerCase() === val.trim().toLowerCase());
          if (match) {
            items[idx].hsn = match.hsn;
            items[idx].unit = match.unit;
            items[idx].price = match.price;
            items[idx].taxRate = match.taxRate;
            renderEditorItems();
            return;
          }

          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.item-hsn').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          items[idx].hsn = e.target.value;
          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.item-qty').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          const val = parseFloat(e.target.value);
          items[idx].qty = isNaN(val) || val <= 0 ? 1 : val;
          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.item-unit').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          items[idx].unit = e.target.value;
          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.item-price').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          const val = parseFloat(e.target.value);
          items[idx].price = isNaN(val) || val < 0 ? 0 : val;
          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.item-tax').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          items[idx].taxRate = parseFloat(e.target.value) || 0;
          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.item-disc').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        if (items[idx]) {
          let val = parseFloat(e.target.value);
          if (isNaN(val) || val < 0) val = 0;
          if (val > 100) val = 100;
          items[idx].discount = val;
          updatePreview();
          saveCurrentDraft();
        }
      });
    });

    document.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        items.splice(idx, 1);
        renderEditorItems();
      });
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      items.push({ name: "New Item", hsn: "", qty: 1, unit: "Pcs", price: 100, taxRate: 18, discount: 0 });
      renderEditorItems();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset current bill back to default sample?")) {
        items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
        if (customerNameInput) customerNameInput.value = "Sharma Kirana & General Store";
        if (customerPhoneInput) customerPhoneInput.value = "+91 91234 56789";
        if (customerGstInput) customerGstInput.value = "";
        if (customerAddressInput) customerAddressInput.value = "Near Metro Station, Karol Bagh, Delhi";
        if (invoiceNumInput) invoiceNumInput.value = "INV-2026-004";
        if (amountPaidInput) amountPaidInput.value = "0";

        currentPaymentStatus = 'PAID';
        statusPills.forEach(p => {
          p.className = 'status-pill';
          if (p.dataset.status === 'PAID') p.classList.add('active-paid');
        });

        renderEditorItems();
        updatePreview();
        saveCurrentDraft();
      }
    });
  }

  /* --------------------------------------------------------------------------
     13. Currency & Number in Words
     -------------------------------------------------------------------------- */
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
    let result = 'Rupees ' + (inWords(integerPart) || 'Zero');
    if (paise > 0) {
      result += ' and ' + inWords(paise) + ' Paise';
    }
    return result + ' Only';
  }

  /* --------------------------------------------------------------------------
     14. Live Invoice Paper Preview Engine
     -------------------------------------------------------------------------- */
  function updatePreview() {
    if (!previewContainer) return;

    const bName = shopSettings.bName || "Your Business Name";
    const bPhone = shopSettings.bPhone || "+91 98765 43210";
    const bGst = shopSettings.bGst || "";
    const bState = shopSettings.bState || "07 - Delhi";
    const bAddr = shopSettings.bAddr || "Main Market, City";
    const logoSrc = shopLogoBase64 || shopSettings.logo || "";

    const upiId = shopSettings.upiId || "";
    const bankName = shopSettings.bankName || "";
    const bankAcc = shopSettings.bankAcc || "";
    const bankIfsc = shopSettings.bankIfsc || "";
    const bankBranch = shopSettings.bankBranch || "";

    const termsText = shopSettings.terms || "";
    const notesText = shopSettings.notes || "";
    const signatoryTitle = shopSettings.signatory || "Authorized Signatory";

    const cName = customerNameInput ? (customerNameInput.value.trim() || "Customer Name / Firm") : "Customer Name / Firm";
    const cPhone = customerPhoneInput ? (customerPhoneInput.value.trim() || "+91 91234 56789") : "+91 91234 56789";
    const cGst = customerGstInput ? customerGstInput.value.trim() : "";
    const cAddr = customerAddressInput ? (customerAddressInput.value.trim() || "Customer Address") : "Customer Address";

    const docType = docTypeSelect ? docTypeSelect.value : "TAX INVOICE";
    const invNo = invoiceNumInput ? (invoiceNumInput.value.trim() || "INV-001") : "INV-001";
    const invDate = invoiceDateInput && invoiceDateInput.value ? invoiceDateInput.value : new Date().toISOString().split('T')[0];
    const invDueDate = invoiceDueDateInput && invoiceDueDateInput.value ? invoiceDueDateInput.value : "";
    const isInterState = taxTypeSelect ? (taxTypeSelect.value === 'inter') : false;

    let subtotal = 0;
    let totalTax = 0;
    let rowsHtml = '';
    let thermalRowsHtml = '';

    if (items.length === 0) {
      rowsHtml = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: #74747C;">No items added.</td></tr>`;
      thermalRowsHtml = `<div style="text-align:center; padding: 10px; color: #74747C;">No items added</div>`;
    } else {
      items.forEach((item, idx) => {
        const lineBase = item.qty * item.price;
        const lineDisc = (lineBase * item.discount) / 100;
        const taxable = lineBase - lineDisc;
        const taxAmt = (taxable * item.taxRate) / 100;
        const lineTotal = taxable + taxAmt;

        subtotal += taxable;
        totalTax += taxAmt;

        rowsHtml += `
          <tr>
            <td style="text-align:center;">${idx + 1}</td>
            <td>
              <strong>${escapeHtml(item.name)}</strong>
              ${item.hsn ? `<div style="font-size:9px; color:#74747C;">HSN: ${escapeHtml(item.hsn)}</div>` : ''}
            </td>
            <td style="text-align:center;">${item.qty} ${item.unit || 'Pcs'}</td>
            <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
            <td style="text-align:center;">${item.taxRate}%</td>
            <td style="text-align:center;">${item.discount > 0 ? item.discount + '%' : '-'}</td>
            <td style="text-align:right;"><strong>₹${lineTotal.toFixed(2)}</strong></td>
          </tr>
        `;

        thermalRowsHtml += `
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>${idx + 1}. ${escapeHtml(item.name)} (${item.qty} ${item.unit || 'Pcs'})</span>
            <strong>₹${lineTotal.toFixed(2)}</strong>
          </div>
        `;
      });
    }

    const grandTotalExact = subtotal + totalTax;
    const roundedGrandTotal = Math.round(grandTotalExact);
    const roundOff = roundedGrandTotal - grandTotalExact;

    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    const amountPaidVal = amountPaidInput ? (parseFloat(amountPaidInput.value) || 0) : 0;
    const balanceDueVal = currentPaymentStatus === 'PAID' ? 0 : Math.max(0, roundedGrandTotal - amountPaidVal);

    if (balanceDueDisplay) {
      if (currentPaymentStatus === 'PAID') {
        balanceDueDisplay.innerText = `₹0.00 (Fully Paid)`;
        balanceDueDisplay.style.color = 'var(--positive)';
      } else {
        balanceDueDisplay.innerText = `₹${balanceDueVal.toFixed(2)} (Udhar Due)`;
        balanceDueDisplay.style.color = balanceDueVal > 0 ? 'var(--danger)' : 'var(--positive)';
      }
    }

    const isThermal = previewContainer.classList.contains('thermal-mode');

    // 1. THERMAL 3-INCH RECEIPT FORMAT
    if (isThermal) {
      previewContainer.innerHTML = `
        <div style="text-align:center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="font-size:15px; font-weight:800; text-transform:uppercase;">${escapeHtml(bName)}</div>
          <div style="font-size:9.5px;">${escapeHtml(bAddr)}</div>
          <div style="font-size:9.5px;">Phone: ${escapeHtml(bPhone)}</div>
          ${bGst ? `<div style="font-size:9.5px;">GSTIN: ${escapeHtml(bGst)}</div>` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; font-size:9.5px; margin-bottom:3px;">
          <span>Bill No: <strong>#${escapeHtml(invNo)}</strong></span>
          <span>Date: ${escapeHtml(invDate)}</span>
        </div>
        <div style="font-size:9.5px; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 6px;">
          Customer: <strong>${escapeHtml(cName)}</strong> (${escapeHtml(cPhone)})
        </div>

        <div style="border-bottom: 1px dashed #000; padding-bottom: 6px; margin-bottom: 6px;">
          ${thermalRowsHtml}
        </div>

        <div style="font-size:10.5px; margin-bottom: 6px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          ${isInterState ? `
            <div style="display:flex; justify-content:space-between;">
              <span>IGST Tax:</span>
              <span>₹${totalTax.toFixed(2)}</span>
            </div>
          ` : `
            <div style="display:flex; justify-content:space-between;">
              <span>CGST:</span>
              <span>₹${cgst.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>SGST:</span>
              <span>₹${sgst.toFixed(2)}</span>
            </div>
          `}
          <div style="display:flex; justify-content:space-between; font-size:13.5px; font-weight:900; border-top:1px dashed #000; margin-top:4px; padding-top:4px;">
            <span>GRAND TOTAL:</span>
            <span>₹${roundedGrandTotal.toFixed(2)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:9.5px; margin-top:3px;">
            <span>Status: <strong>${currentPaymentStatus}</strong></span>
            ${currentPaymentStatus !== 'PAID' ? `<span>Balance Due: <strong>₹${balanceDueVal.toFixed(2)}</strong></span>` : ''}
          </div>
        </div>

        <!-- Scan & Pay QR Code Container on Thermal Slip -->
        ${upiId ? `
          <div style="text-align:center; padding: 6px 0; border-top: 1px dashed #000; border-bottom: 1px dashed #000; margin: 6px 0;">
            <div style="font-size:9px; font-weight:700; margin-bottom:3px;">SCAN & PAY VIA ANY UPI APP</div>
            <div id="thermalQrCodeContainer" style="display:flex; justify-content:center; margin: 3px 0;"></div>
            <div style="font-size:8.5px; color:#333;">UPI: ${escapeHtml(upiId)}</div>
          </div>
        ` : ''}

        <!-- Thermal Footer Watermark Banner -->
        <div class="inv-watermark-banner" style="margin-top:8px; padding-top:6px; border-top:1px dashed #000; text-align:center;">
          <div style="font-size:8.5px;">Billed with <strong>InvoiceFine Pocket ERP</strong></div>
          <div style="font-size:7.5px; color:#555;">100% Offline Billing &bull; invoicefine.procsctools.in</div>
        </div>
      `;

      // Render UPI QR in Thermal Slip
      if (upiId) {
        setTimeout(() => {
          const thermalQr = document.getElementById('thermalQrCodeContainer');
          if (thermalQr && typeof QRCode !== 'undefined') {
            thermalQr.innerHTML = '';
            const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(bName)}&am=${roundedGrandTotal}&cu=INR&tn=${encodeURIComponent('Bill ' + invNo)}`;
            new QRCode(thermalQr, {
              text: upiPayload,
              width: 72,
              height: 72,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.M
            });
          }
        }, 50);
      }

      return;
    }

    // 2. A4 FULL TAX INVOICE FORMAT
    previewContainer.innerHTML = `
      <!-- Header Row -->
      <div class="inv-header-row">
        <div class="inv-brand-wrapper">
          ${logoSrc ? `<img src="${logoSrc}" alt="Shop Logo" class="inv-brand-logo-img">` : ''}
          <div>
            <div class="inv-brand-name">${escapeHtml(bName)}</div>
            <div style="font-size:10.5px; color:#52525B; margin-top:2px;">${escapeHtml(bAddr)}</div>
            <div style="font-size:10.5px; color:#52525B;">Phone: <strong>${escapeHtml(bPhone)}</strong> ${bGst ? `| GSTIN: <strong>${escapeHtml(bGst)}</strong>` : ''}</div>
            <div style="font-size:10px; color:#74747C;">State / POS: <strong>${escapeHtml(bState)}</strong></div>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="inv-title">${escapeHtml(docType)}</div>
          <div style="font-size:12.5px; font-weight:800; color:var(--inv-accent, #D93632); margin-top:2px;"># ${escapeHtml(invNo)}</div>
          <div style="font-size:10.5px; color:#52525B;">Date: <strong>${escapeHtml(invDate)}</strong></div>
          ${invDueDate ? `<div style="font-size:10px; color:#74747C;">Due: <strong>${escapeHtml(invDueDate)}</strong></div>` : ''}
        </div>
      </div>

      <!-- Customer & Invoice Metadata Grid -->
      <div class="inv-meta-grid">
        <div class="inv-box">
          <div class="inv-box-title">Billed To:</div>
          <div style="font-weight:700; font-size:12px;">${escapeHtml(cName)}</div>
          <div style="font-size:10.5px; color:#52525B; margin: 2px 0;">${escapeHtml(cAddr)}</div>
          <div style="font-size:10.5px; color:#52525B;">Phone: <strong>${escapeHtml(cPhone)}</strong></div>
          ${cGst ? `<div style="font-size:10.5px; color:#52525B;">GSTIN: <strong>${escapeHtml(cGst)}</strong></div>` : ''}
        </div>
        <div class="inv-box">
          <div class="inv-box-title">Payment Details:</div>
          <div style="font-size:10.5px;">GST Mode: <strong>${isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}</strong></div>
          <div style="font-size:10.5px; margin: 3px 0;">Status: 
            <span style="font-weight:700; padding:2px 6px; border-radius:3px; font-size:9.5px; ${currentPaymentStatus === 'PAID' ? 'background:#E3F5EC; color:#0D5C3A;' : (currentPaymentStatus === 'PARTIAL' ? 'background:#FEF3E2; color:#8C5300;' : 'background:#FDE8E9; color:#D9363E;')}">
              ${currentPaymentStatus}
            </span>
          </div>
          ${currentPaymentStatus !== 'PAID' ? `
            <div style="font-size:10.5px; color:#D9363E; font-weight:700;">Balance Due: ₹${balanceDueVal.toFixed(2)}</div>
          ` : ''}
        </div>
      </div>

      <!-- Line Items Table -->
      <table class="inv-table">
        <thead>
          <tr>
            <th style="width:26px; text-align:center;">#</th>
            <th>Item</th>
            <th style="width:65px; text-align:center;">Qty</th>
            <th style="width:75px; text-align:right;">Rate</th>
            <th style="width:50px; text-align:center;">GST</th>
            <th style="width:45px; text-align:center;">Disc</th>
            <th style="width:85px; text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Totals & Payment Summary -->
      <div class="inv-total-section">
        
        <!-- Left: Words, Bank & UPI QR -->
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div>
            <div style="font-size:9px; font-weight:700; text-transform:uppercase; color:#74747C; letter-spacing:0.04em;">Amount in Words:</div>
            <div style="font-size:10.5px; font-weight:600; color:#27272A; margin-top:2px; line-height:1.35;">${numberToWordsINR(roundedGrandTotal)}</div>
          </div>

          <!-- Bank & UPI Payment Box -->
          ${(upiId || bankAcc) ? `
            <div class="inv-bank-upi-box">
              ${upiId ? `
                <div class="inv-qr-wrapper">
                  <div id="invA4QrContainer"></div>
                </div>
              ` : ''}
              <div style="font-size:9.5px; line-height:1.45; color:#3F3F46;">
                ${upiId ? `<div><strong>UPI:</strong> <span style="color:var(--inv-accent, #D93632); font-weight:700;">${escapeHtml(upiId)}</span></div>` : ''}
                ${bankName ? `<div><strong>Bank:</strong> ${escapeHtml(bankName)} | <strong>A/c:</strong> ${escapeHtml(bankAcc)}</div>` : ''}
                ${bankIfsc ? `<div><strong>IFSC:</strong> ${escapeHtml(bankIfsc)}${bankBranch ? ` | ${escapeHtml(bankBranch)}` : ''}</div>` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Terms & Conditions Note -->
          <div style="font-size:9px; color:#71717A; line-height:1.35;">
            ${notesText ? `<div style="margin-bottom:2px; font-style:italic;">"${escapeHtml(notesText)}"</div>` : ''}
            ${termsText ? `<strong>Terms:</strong> ${escapeHtml(termsText).replace(/\n/g, ' ')}` : ''}
          </div>
        </div>

        <!-- Right: Tax Math & Signature -->
        <div>
          <table class="inv-total-table">
            <tr>
              <td style="color:#71717A;">Taxable Value:</td>
              <td style="text-align:right; font-weight:600;">₹${subtotal.toFixed(2)}</td>
            </tr>
            ${isInterState ? `
              <tr>
                <td style="color:#71717A;">IGST Tax:</td>
                <td style="text-align:right; font-weight:600;">₹${totalTax.toFixed(2)}</td>
              </tr>
            ` : `
              <tr>
                <td style="color:#71717A;">CGST:</td>
                <td style="text-align:right; font-weight:600;">₹${cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color:#71717A;">SGST:</td>
                <td style="text-align:right; font-weight:600;">₹${sgst.toFixed(2)}</td>
              </tr>
            `}
            ${roundOff !== 0 ? `
              <tr>
                <td style="color:#71717A;">Round Off:</td>
                <td style="text-align:right;">₹${roundOff.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr class="inv-grand-total">
              <td><strong>Grand Total:</strong></td>
              <td style="text-align:right;"><strong>₹${roundedGrandTotal.toFixed(2)}</strong></td>
            </tr>
            ${currentPaymentStatus !== 'PAID' && amountPaidVal > 0 ? `
              <tr>
                <td style="color:#168557;">Amount Received:</td>
                <td style="text-align:right; font-weight:600; color:#168557;">₹${amountPaidVal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color:#D93632; font-weight:700;">Balance Due:</td>
                <td style="text-align:right; font-weight:800; color:#D93632;">₹${balanceDueVal.toFixed(2)}</td>
              </tr>
            ` : ''}
          </table>

          <div style="margin-top:16px; text-align:right;">
            <div style="font-size:9px; color:#71717A; margin-bottom:18px;">For <strong>${escapeHtml(bName)}</strong>:</div>
            <div style="border-top:1px solid #A1A1AA; display:inline-block; padding-top:3px; font-size:9.5px; font-weight:600; color:#3F3F46;">
              ${escapeHtml(signatoryTitle)}
            </div>
          </div>
        </div>

      </div>

      <!-- DISCREET PROFESSIONAL FOOTER -->
      <div class="inv-watermark-banner">
        <div class="inv-watermark-left">
          <img src="web/android-chrome-192x192.png" alt="InvoiceFine Logo" class="inv-watermark-icon">
          <span>Generated by <strong>InvoiceFine Pocket ERP</strong> &bull; 100% Offline GST Billing</span>
        </div>
        <div class="inv-watermark-badge">invoicefine.procsctools.in</div>
      </div>
    `;

    // Render A4 Scan & Pay QR Code
    if (upiId) {
      setTimeout(() => {
        const a4Qr = document.getElementById('invA4QrContainer');
        if (a4Qr && typeof QRCode !== 'undefined') {
          a4Qr.innerHTML = '';
          const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(bName)}&am=${roundedGrandTotal}&cu=INR&tn=${encodeURIComponent('Invoice ' + invNo)}`;
          new QRCode(a4Qr, {
            text: upiPayload,
            width: 68,
            height: 68,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        }
      }, 50);
    }
  }

  /* --------------------------------------------------------------------------
     15. WhatsApp Formatted Bill Share
     -------------------------------------------------------------------------- */
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const bName = shopSettings.bName || "InvoiceFine Merchant";
      const cName = customerNameInput ? customerNameInput.value.trim() : "Customer";
      const invNo = invoiceNumInput ? invoiceNumInput.value.trim() : "INV-001";
      const invDate = invoiceDateInput ? invoiceDateInput.value : "";
      const rawPhone = customerPhoneInput ? customerPhoneInput.value.replace(/[^0-9]/g, '') : '';

      let itemsSummary = '';
      let subtotal = 0;
      let totalTax = 0;

      items.forEach((item, idx) => {
        const lineBase = item.qty * item.price;
        const lineDisc = (lineBase * item.discount) / 100;
        const taxable = lineBase - lineDisc;
        const taxAmt = (taxable * item.taxRate) / 100;
        const lineTotal = taxable + taxAmt;
        subtotal += taxable;
        totalTax += taxAmt;

        itemsSummary += `• ${item.name} (x${item.qty} ${item.unit || 'Pcs'}) - ₹${lineTotal.toFixed(2)}\n`;
      });

      const grandTotal = Math.round(subtotal + totalTax);

      const message = `🧾 *TAX INVOICE #${invNo}*\n` +
        `From: *${bName}*\n` +
        `To: *${cName}*\n` +
        `Date: ${invDate}\n` +
        `------------------------------------\n` +
        `*Items:*\n${itemsSummary}` +
        `------------------------------------\n` +
        `*Total Payable: ₹${grandTotal.toLocaleString('en-IN')}*\n` +
        `Payment Status: *${currentPaymentStatus}*\n` +
        (shopSettings.upiId ? `Pay via UPI: *${shopSettings.upiId}*\n` : '') +
        `------------------------------------\n` +
        `🙏 Thank you for doing business with us!\n` +
        `⚡ Billed using InvoiceFine Pocket ERP (Android App)\nhttps://invoicefine.procsctools.in`;

      let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      if (rawPhone.length >= 10) {
        const intlPhone = rawPhone.length === 10 ? '91' + rawPhone : rawPhone;
        waUrl = `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encodeURIComponent(message)}`;
      }

      window.open(waUrl, '_blank');
      // Save customer to directory
      saveCustomerToDirectory(cName, customerPhoneInput.value, customerAddressInput.value, customerGstInput.value);
    });
  }

  /* --------------------------------------------------------------------------
     16. Direct PDF File Download & Print Actions
     -------------------------------------------------------------------------- */
  async function downloadInvoicePdf() {
    if (!previewContainer) return;

    const invNo = invoiceNumInput ? (invoiceNumInput.value.trim() || 'INV-001') : 'INV-001';
    const cName = customerNameInput ? (customerNameInput.value.trim() || 'Customer') : 'Customer';
    const cleanInv = invNo.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanCust = cName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `InvoiceFine_${cleanInv}_${cleanCust}.pdf`;

    const isThermal = previewContainer.classList.contains('thermal-mode');

    // Auto-save invoice to history & Khata
    saveInvoiceToHistory();

    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
      window.print();
      return;
    }

    if (downloadPdfBtn) {
      downloadPdfBtn.disabled = true;
      downloadPdfBtn.innerText = "Downloading...";
    }
    showToast("⏳ Generating PDF file, downloading to your device...");

    // Temporarily reset zoom to 1 so pdf renders at full crisp resolution
    const prevTransform = paperZoomWrapper ? paperZoomWrapper.style.transform : '';
    if (paperZoomWrapper) {
      paperZoomWrapper.style.transform = 'none';
    }

    const opt = {
      margin: isThermal ? [4, 4, 4, 4] : [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: isThermal ? [80, 297] : 'a4',
        orientation: 'portrait'
      }
    };

    try {
      await html2pdf().set(opt).from(previewContainer).save();
      showToast(`✓ Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error("PDF generation error, fallback to print:", err);
      window.print();
    } finally {
      if (paperZoomWrapper) {
        paperZoomWrapper.style.transform = prevTransform;
      }
      if (downloadPdfBtn) {
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download PDF</span>
        `;
      }
    }
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', downloadInvoicePdf);
  }

  /* --------------------------------------------------------------------------
     16b. Direct High-Quality JPG Image Export
     -------------------------------------------------------------------------- */
  async function downloadInvoiceJpg() {
    if (!previewContainer) return;

    const invNo = invoiceNumInput ? (invoiceNumInput.value.trim() || 'INV-001') : 'INV-001';
    const cName = customerNameInput ? (customerNameInput.value.trim() || 'Customer') : 'Customer';
    const cleanInv = invNo.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanCust = cName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `InvoiceFine_${cleanInv}_${cleanCust}.jpg`;

    // Auto-save invoice to history & Khata
    saveInvoiceToHistory();

    if (typeof html2canvas === 'undefined') {
      showToast("⚠️ Image renderer loading, downloading PDF instead...");
      downloadInvoicePdf();
      return;
    }

    if (downloadJpgBtn) {
      downloadJpgBtn.disabled = true;
      downloadJpgBtn.innerText = "Exporting JPG...";
    }
    showToast("⏳ Rendering high-resolution JPG image...");

    // Temporarily reset zoom so canvas captures at full resolution
    const prevTransform = paperZoomWrapper ? paperZoomWrapper.style.transform : '';
    if (paperZoomWrapper) {
      paperZoomWrapper.style.transform = 'none';
    }

    try {
      const canvas = await html2canvas(previewContainer, {
        scale: 2.5, // Ultra-sharp 2.5x retina resolution
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });

      // Convert to JPG blob / data URL with 95% quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      // Trigger automatic direct browser file download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`✓ Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error("JPG export error:", err);
      showToast("⚠️ Could not export JPG, downloading PDF instead.");
      downloadInvoicePdf();
    } finally {
      if (paperZoomWrapper) {
        paperZoomWrapper.style.transform = prevTransform;
      }
      if (downloadJpgBtn) {
        downloadJpgBtn.disabled = false;
        downloadJpgBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <span>Export JPG</span>
        `;
      }
    }
  }

  if (downloadJpgBtn) {
    downloadJpgBtn.addEventListener('click', downloadInvoiceJpg);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      // Auto-save invoice to history
      saveInvoiceToHistory();

      // Trigger print
      window.print();
    });
  }

  /* --------------------------------------------------------------------------
     17. Event Listeners for Live Preview & Draft Auto-Save
     -------------------------------------------------------------------------- */
  const inputsToWatch = [
    customerNameInput, customerPhoneInput, customerGstInput, customerAddressInput,
    docTypeSelect, invoiceNumInput, invoiceDateInput, invoiceDueDateInput, taxTypeSelect,
    amountPaidInput
  ];

  inputsToWatch.forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        updatePreview();
        saveCurrentDraft();
      });
      inp.addEventListener('change', () => {
        updatePreview();
        saveCurrentDraft();
      });
    }
  });

  // Switch between A4 and Thermal layout
  if (modeA4Btn && modeThermalBtn && previewContainer) {
    modeA4Btn.addEventListener('click', () => {
      modeA4Btn.classList.add('active');
      modeThermalBtn.classList.remove('active');
      previewContainer.classList.remove('thermal-mode');
      updatePreview();
    });

    modeThermalBtn.addEventListener('click', () => {
      modeThermalBtn.classList.add('active');
      modeA4Btn.classList.remove('active');
      previewContainer.classList.add('thermal-mode');
      updatePreview();
    });
  }

  // Initial Load
  loadShopSettings();
  populateCustomerSuggestions();
  populateProductSuggestions();
  loadCurrentDraft();
  applyTheme(currentTheme);
  renderEditorItems();
}
