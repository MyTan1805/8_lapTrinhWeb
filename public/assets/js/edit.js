// Sửa 1 sản phẩm 

// Sửa nhiều sản phẩm 

let products = [];
let filteredProducts = [];
let editedProducts = new Map();
let sortState = { column: null, direction: 'asc' };
const productsPerPage = 7;
let currentPage = 1;

const productTableBody = document.getElementById('productTableBody');
const searchForm = document.getElementById('search-form');
const selectAllCheckbox = document.getElementById('selectAll');
const saveAllBtn = document.getElementById('saveAllBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfoSpan = document.getElementById('pageInfo');

async function fetchProducts() {
  productTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Đang tải dữ liệu...</td></tr>';
  try {
    const response = await fetch('/dishes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    products = data.map(p => ({
      ...p,
      price: p.inventory?.price || 0,
      quantity: p.inventory?.quantity || 0
    }));
    filteredProducts = [...products];
    editedProducts.clear();
    currentPage = 1;
    renderTable();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
    productTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: red;">Không thể tải dữ liệu sản phẩm. Lỗi: ${error.message}</td></tr>`;
    alert(`Lỗi tải dữ liệu: ${error.message}`);
  }
}

function renderTable() {
  sortProducts();
  productTableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToRender = filteredProducts.slice(startIndex, endIndex);

  if (productsToRender.length === 0) {
    productTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Không tìm thấy sản phẩm nào.</td></tr>';
  } else {
    productsToRender.forEach(product => {
      const editedData = editedProducts.get(product.id) || {};
      const currentPrice = editedData.price !== undefined ? editedData.price : (product.price || 0);
      const currentQuantity = editedData.quantity !== undefined ? editedData.quantity : (product.quantity || 0);
      const priceDisplay = currentPrice.toLocaleString('vi-VN');
      const imageSrc = product.hinhAnh ? `/images/products/${encodeURIComponent(product.hinhAnh)}` : '/images/placeholder.png';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
        <td>${product.id}</td>
        <td><img src="${imageSrc}" alt="${product.ten}" class="product-image" onerror="this.onerror=null; this.src='/images/placeholder.png';"></td>
        <td title="${product.ten}">${product.ten.length > 30 ? product.ten.substring(0, 30) + '...' : product.ten}</td>
        <td>${product.loaiHienThi || product.loai || 'N/A'}</td>
        <td>
          <input type="number" class="editable-field price-field" data-id="${product.id}" value="${currentPrice}" min="0" step="1000">
        </td>
        <td>
          <input type="number" class="editable-field quantity-field" data-id="${product.id}" value="${currentQuantity}" min="0">
        </td>
        
      `;
      productTableBody.appendChild(row);
    });
  }
  updatePaginationControls();
  updateSelectAllCheckboxState();
  toggleSaveAllButton();
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(searchForm);
  const ten = formData.get('ten');
  const giaFr = formData.get('giaFr') ? parseInt(formData.get('giaFr')) : null;
  const giaTo = formData.get('giaTo') ? parseInt(formData.get('giaTo')) : null;

  filteredProducts = products.filter(product => {
    let match = false;

    if (ten) {
      const regex = new RegExp(ten, 'i');
      if (regex.test(product.ten)) {
        match = true;
      }
    }

    if (giaFr && giaTo) {
      if (product.inventory.price >= giaFr && product.inventory.price <= giaTo) {
        match = true;
      }
    } else if (giaFr) {
      if (product.inventory.price >= giaFr) {
        match = true;
      }
    } else if (giaTo) {
      if (product.inventory.price <= giaTo) {
        match = true;
      }
    }

    if (!ten && !giaFr && !giaTo) {
      match = true;
    }

    return match;
  });

  currentPage = 1;
  renderTable();
});

productTableBody.addEventListener('input', (e) => {
  if (e.target.classList.contains('editable-field')) {
    const field = e.target;
    const productId = field.getAttribute('data-id');
    const value = field.value.trim();
    const isPrice = field.classList.contains('price-field');
    const key = isPrice ? 'price' : 'quantity';

    if (value === '' || isNaN(value) || parseFloat(value) < 0) {
      field.classList.add('error');
      return;
    }

    field.classList.remove('error');
    const numericValue = parseFloat(value);
    const originalProduct = products.find(p => p.id === productId);
    const originalValue = isPrice ? (originalProduct.price || 0) : (originalProduct.quantity || 0);

    if (numericValue !== originalValue) {
      if (!editedProducts.has(productId)) {
        editedProducts.set(productId, {});
      }
      editedProducts.get(productId)[key] = numericValue;
    } else {
      if (editedProducts.has(productId)) {
        delete editedProducts.get(productId)[key];
        if (Object.keys(editedProducts.get(productId)).length === 0) {
          editedProducts.delete(productId);
        }
      }
    }
    toggleSaveAllButton();
  }
});

selectAllCheckbox.addEventListener('change', function() {
  const checkboxesOnPage = productTableBody.querySelectorAll(".product-checkbox");
  checkboxesOnPage.forEach(checkbox => {
    checkbox.checked = this.checked;
  });
  toggleSaveAllButton();
});

productTableBody.addEventListener('change', function(e) {
  if (e.target.classList.contains('product-checkbox')) {
    updateSelectAllCheckboxState();
    toggleSaveAllButton();
  }
});

saveAllBtn.addEventListener('click', async function() {
  const checkedCheckboxes = productTableBody.querySelectorAll(".product-checkbox:checked");
  const productIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.getAttribute("data-id"));

  if (productIds.length === 0) {
    alert("Vui lòng chọn ít nhất một sản phẩm để lưu thay đổi!");
    return;
  }

  const updates = [];
  productIds.forEach(id => {
    if (editedProducts.has(id)) {
      updates.push({
        id: id,
        inventory: editedProducts.get(id)
      });
    }
  });

  if (updates.length === 0) {
    alert("Không có thay đổi nào để lưu!");
    return;
  }

  // Thay modal bằng confirm
  const confirmed = confirm(`Bạn có chắc chắn muốn lưu thay đổi cho ${updates.length} sản phẩm đã chọn?`);
  if (confirmed) {
    await confirmSaveAll(updates);
  }
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextPageBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

document.querySelector('.product-table thead').addEventListener('click', (e) => {
  if (e.target.classList.contains('sortable')) {
    const column = e.target.getAttribute('data-sort');
    if (sortState.column === column) {
      sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortState.column = column;
      sortState.direction = 'asc';
    }
    document.querySelectorAll('.product-table th.sortable').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
    });
    e.target.classList.add(sortState.direction === 'asc' ? 'sort-asc' : 'sort-desc');
    renderTable();
  }
});

function sortProducts() {
  if (!sortState.column) return;

  const { column, direction } = sortState;
  const multiplier = direction === 'asc' ? 1 : -1;

  filteredProducts.sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    if (column === 'price' || column === 'quantity') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return (valA - valB) * multiplier;
    } else {
      valA = String(valA || '').toLowerCase();
      valB = String(valB || '').toLowerCase();
      if (valA < valB) return -1 * multiplier;
      if (valA > valB) return 1 * multiplier;
      return 0;
    }
  });
}

function updateSelectAllCheckboxState() {
  const checkboxesOnPage = productTableBody.querySelectorAll('.product-checkbox');
  if (checkboxesOnPage.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    return;
  }
  const checkedCount = productTableBody.querySelectorAll('.product-checkbox:checked').length;

  if (checkedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === checkboxesOnPage.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

function toggleSaveAllButton() {
  const checkedCount = productTableBody.querySelectorAll(".product-checkbox:checked").length;
  const hasChanges = editedProducts.size > 0;

  if (checkedCount > 0 && hasChanges) {
    const changedProducts = Array.from(editedProducts.keys());
    const checkedProducts = Array.from(productTableBody.querySelectorAll(".product-checkbox:checked")).map(cb => cb.getAttribute("data-id"));
    const productsToSave = changedProducts.filter(id => checkedProducts.includes(id));
    const count = productsToSave.length;

    if (count > 0) {
      saveAllBtn.classList.add("visible");
      saveAllBtn.textContent = `Lưu ${count} thay đổi`;
      return;
    }
  }
  saveAllBtn.classList.remove("visible");
  saveAllBtn.textContent = `Lưu tất cả thay đổi`;
}

function updatePaginationControls() {
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  pageInfoSpan.textContent = totalProducts > 0 ? `Trang ${currentPage} / ${totalPages}` : 'Không có dữ liệu';
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  selectAllCheckbox.disabled = productTableBody.querySelectorAll('.product-checkbox').length === 0;
}

async function confirmSaveAll(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    alert("Không có thay đổi nào để lưu.");
    return;
  }


  try {
    const response = await fetch("/dishes/bulk-update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });

    if (!response.ok) {
      let errorMsg = `Lỗi ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (parseError) {
        console.warn("Không thể parse JSON lỗi từ server:", parseError);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    alert(data.message || `Thực hiện cập nhật ${updates.length} sản phẩm.`);

    updates.forEach(update => {
      editedProducts.delete(update.id);
    });

    await fetchProducts();

  } catch (error) {
    console.error("Lỗi khi lưu thay đổi:", error);
    alert(`Lỗi khi lưu thay đổi: ${error.message}`);
  } finally {
    selectAllCheckbox.checked = false;
    toggleSaveAllButton();
  }
}

document.addEventListener('DOMContentLoaded', fetchProducts);
