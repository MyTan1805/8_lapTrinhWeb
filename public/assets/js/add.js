document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const defaultTab = document.querySelector('.tab-btn[data-tab="description"]');
  if (defaultTab) {
    defaultTab.classList.add('active');
    document.getElementById('description').classList.add('active');
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});

// Code Js phần thêm sản phẩm

// Logic cho ID tự động
const categorySelect = document.getElementById('product-category');
const productIdInput = document.getElementById('product-id');

async function fetchNextId(categoryCode) {
  if (!categoryCode) {
    productIdInput.value = '';
    productIdInput.placeholder = 'Chọn danh mục để tạo ID';
    return;
  }
  try {
    productIdInput.value = 'Đang tạo ID...';
    productIdInput.placeholder = 'Đang tạo ID...';
    const response = await fetch(`/api/generate-id/${categoryCode}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi server: ${response.status}`);
    }
    const data = await response.json();
    productIdInput.value = data.nextId;
  } catch (error) {
    console.error('Lỗi khi lấy ID tiếp theo:', error);
    alert(`Không thể tạo ID tự động: ${error.message}`);
    productIdInput.value = '';
    productIdInput.placeholder = 'Lỗi khi tạo ID';
    categorySelect.value = '';
  }
}

categorySelect.addEventListener('change', (e) => {
  const selectedCategoryCode = e.target.value;
  fetchNextId(selectedCategoryCode);
});

// Xem trước hình ảnh
document.getElementById('product-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewImg = document.getElementById('preview-img');
      previewImg.src = event.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Thêm đặc tính tùy chỉnh
document.getElementById('add-attribute').addEventListener('click', () => {
  const customAttributes = document.getElementById('custom-attributes');
  const attributeRow = document.createElement('div');
  attributeRow.classList.add('attribute-row');
  attributeRow.innerHTML = `
    <input type="text" class="attribute-key" placeholder="Tên đặc tính" required>
    <input type="text" class="attribute-value" placeholder="Dung tích" required>
    <button type="button" class="remove-attribute btn btn-danger m-5">Xóa</button>
  `;
  attributeRow.style.marginTop = '15px';
  attributeRow.querySelector('.remove-attribute').addEventListener('click', () => {
    customAttributes.removeChild(attributeRow);
  });
  customAttributes.appendChild(attributeRow);
});

// Xử lý submit form tạo một sản phẩm
document.querySelector('.add-product-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('ten', document.getElementById('product-name').value);
  formData.append('moTa', document.getElementById('product-description').value);
  formData.append('loai', document.getElementById('product-category').value);
  formData.append('thuongHieu', document.getElementById('product-brand').value);
  formData.append('noiSanXuat', document.getElementById('product-origin').value);
  formData.append('soLuong', document.getElementById('product-stock').value);
  formData.append('gia', document.getElementById('product-price').value);
  formData.append('product-image', document.getElementById('product-image').files[0]);

  const attributes = {};
  const keyIngredient = document.getElementById('key-ingredient').value.trim();
  if (keyIngredient) attributes['Thành phần chính'] = keyIngredient;
  const skinConcern = document.getElementById('skin-concern').value.trim();
  if (skinConcern) attributes['Vấn đề da'] = skinConcern;
  const texture = document.getElementById('texture').value.trim();
  if (texture) attributes['Kết cấu'] = texture;
  const scent = document.getElementById('scent').value.trim();
  if (scent) attributes['Mùi hương'] = scent;

  document.querySelectorAll('.attribute-row').forEach(row => {
    const key = row.querySelector('.attribute-key').value.trim();
    const value = row.querySelector('.attribute-value').value.trim();
    if (key && value) {
      attributes[key] = value;
    }
  });

  formData.append('dacTinh', JSON.stringify(attributes));

  fetch('/dishes', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Thêm sản phẩm thất bại!');
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      window.location.href = '/';
    })
    .catch(error => {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert(error.message);
    });
});

// Chuyển đổi chế độ
const tabButtons = document.querySelectorAll('.tab-btn');
const modeContents = document.querySelectorAll('.mode-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    modeContents.forEach(content => content.style.display = 'none');
    document.getElementById(`${button.dataset.mode}-product-form`).style.display = 'block';
  });
});

// Xử lý tạo nhiều sản phẩm
const jsonFileInput = document.getElementById('json-file');
const previewTableBody = document.querySelector('#preview-table tbody');
const confirmImportBtn = document.getElementById('confirm-import');
let products = [];

// Hàm kiểm tra tính hợp lệ của một sản phẩm
function validateProduct(product) {
  const requiredFields = ['ten', 'thuongHieu', 'loai', 'noiSanXuat', 'soLuong', 'gia', 'hinhAnh'];
  const errors = [];

  requiredFields.forEach(field => {
    if (!product[field] && product[field] !== 0) {
      errors.push(`- Thiếu ${field}`);
    }
  });

  if (product.loai && (typeof product.loai !== 'string' || product.loai.length !== 4)) {
    errors.push(`- Danh mục (${product.loai}) không hợp lệ, phải là mã 4 ký tự (ví dụ: SERU)`);
  }

  if (product.soLuong || product.soLuong === 0) {
    const quantity = parseInt(product.soLuong);
    if (isNaN(quantity) || quantity < 0) {
      errors.push(`- Số lượng (${product.soLuong}) phải là số không âm`);
    }
  }

  if (product.gia || product.gia === 0) {
    const price = parseInt(product.gia);
    if (isNaN(price) || price < 0) {
      errors.push(`- Giá (${product.gia}) phải là số không âm`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}

jsonFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    products = JSON.parse(text);
    if (!Array.isArray(products)) throw new Error('File JSON phải chứa một mảng sản phẩm.');

    previewTableBody.innerHTML = '';
    const validationErrors = [];

    products.forEach((product, index) => {
      const validation = validateProduct(product);
      const row = document.createElement('tr');
      if (!validation.isValid) {
        row.classList.add('error-row');
        validationErrors.push(`Sản phẩm "${product.ten || 'Không xác định'}":\n${validation.errors.join('\n')}`);
      }

      row.innerHTML = `
        <td contenteditable="true" data-field="ten">${product.ten || '<span style="color: red;">Thiếu</span>'}</td>
        <td contenteditable="true" data-field="thuongHieu">${product.thuongHieu || '<span style="color: red;">Thiếu</span>'}</td>
        <td contenteditable="true" data-field="loai">${product.loai || '<span style="color: red;">Thiếu</span>'}</td>
        <td contenteditable="true" data-field="soLuong">${product.soLuong ?? '<span style="color: red;">Thiếu</span>'}</td>
        <td contenteditable="true" data-field="gia">${product.gia ?? '<span style="color: red;">Thiếu</span>'}</td>
        <td contenteditable="true" data-field="hinhAnh">${product.hinhAnh || '<span style="color: red;">Thiếu</span>'}</td>
        <td contenteditable="true" data-field="dacTinh.keyIngredient">${product.dacTinh?.keyIngredient || 'Không có'}</td>
        <td><button type="button" class="remove-row btn btn-danger">Xóa</button></td>
      `;
      row.dataset.index = index;
      previewTableBody.appendChild(row);
    });

    if (validationErrors.length > 0) {
      alert(`Có lỗi trong file JSON:\n\n${validationErrors.join('\n\n')}\n\nVui lòng chỉnh sửa dữ liệu trong bảng hoặc tải lên file JSON mới.`);
    }

    previewTableBody.addEventListener('input', (e) => {
      const row = e.target.closest('tr');
      const index = row.dataset.index;
      const field = e.target.dataset.field;
      let value = e.target.innerText.trim();

      if (field === 'soLuong' || field === 'gia') {
        value = parseInt(value);
        if (isNaN(value) || value < 0) {
          e.target.innerHTML = '<span style="color: red;">Số không hợp lệ</span>';
          value = null;
        }
      }

      if (field.includes('dacTinh.')) {
        const subField = field.split('.')[1];
        if (!products[index].dacTinh) products[index].dacTinh = {};
        products[index].dacTinh[subField] = value;
      } else {
        products[index][field] = value;
      }

      const validation = validateProduct(products[index]);
      row.classList.toggle('error-row', !validation.isValid);
      confirmImportBtn.disabled = products.some(product => !validateProduct(product).isValid);
    });

    confirmImportBtn.disabled = products.some(product => !validateProduct(product).isValid);

    document.querySelectorAll('.remove-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const index = row.dataset.index;
        products.splice(index, 1);
        row.remove();
        confirmImportBtn.disabled = products.length === 0 || products.some(product => !validateProduct(product).isValid);
      });
    });
  } catch (error) {
    console.error('Lỗi khi xử lý file JSON:', error);
    alert(`Lỗi: ${error.message}`);
    previewTableBody.innerHTML = '';
    confirmImportBtn.disabled = true;
  }
});

// Xử lý submit form tạo nhiều sản phẩm
document.querySelector('.import-json-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const jsonFile = document.getElementById('json-file').files[0];
  const imageFiles = document.getElementById('image-files').files;

  if (!jsonFile) {
    alert('Vui lòng tải lên file JSON.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('products', JSON.stringify(products));
    for (const file of imageFiles) {
      formData.append('image-files', file);
    }

    const response = await fetch('/dishes/bulk', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Lỗi khi tạo nhiều sản phẩm.');
    }

    const data = await response.json();
    let message = data.message;
    if (data.errors && data.errors.length > 0) {
      message += '\nLỗi:\n' + data.errors.map(e => `- ${e.product}: ${e.message}`).join('\n');
    }
    alert(message);
    window.location.href = '/';
  } catch (error) {
    console.error('Lỗi khi tạo nhiều sản phẩm:', error);
    alert(`Lỗi: ${error.message}`);
  }
});

// Tải mẫu JSON
document.getElementById('download-template').addEventListener('click', () => {
  const template = [
    {
      ten: "Tên sản phẩm",
      moTa: "Mô tả sản phẩm",
      loai: "SERU",
      thuongHieu: "Thương hiệu",
      noiSanXuat: "Nơi sản xuất",
      soLuong: 0,
      gia: 0,
      hinhAnh: "tên_file_ảnh.jpg",
      dacTinh: {
        keyIngredient: "Thành phần chính",
        skinConcernTargeted: "Vấn đề da",
        texture: "Kết cấu",
        scent: "Mùi hương"
      }
    }
  ];
  const dataStr = JSON.stringify(template, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'product_template.json';
  link.click();
  URL.revokeObjectURL(url);
});
