document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const productRows = document.querySelectorAll('.product-table tbody tr');
    const orderRows = document.querySelectorAll('.order-table tbody tr');
    const addProductForm = document.querySelector('.add-product-form');
    const editProductForm = document.querySelector('.edit-product-form');
  
    // Tìm kiếm sản phẩm (trong products.html)
    if (productRows.length > 0) {
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
  
        productRows.forEach(row => {
          const productName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
          if (productName.includes(searchTerm)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
  
      // Xử lý xóa sản phẩm
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const productId = button.getAttribute('data-id');
          const productName = button.closest('tr').querySelector('td:nth-child(3)').textContent;
          const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" (ID: ${productId}) không?`);
          if (confirmDelete) {
            button.closest('tr').remove();
            alert(`Đã xóa sản phẩm "${productName}" (ID: ${productId})`);
          }
        });
      });
    }
  
    // Tìm kiếm đơn hàng (trong orders.html)
    if (orderRows.length > 0) {
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
  
        orderRows.forEach(row => {
          const customerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
          if (customerName.includes(searchTerm)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
  
    // Xử lý form thêm sản phẩm (trong add_product.html)
    if (addProductForm) {
      const productNameInput = document.getElementById('product-name');
      const productImageInput = document.getElementById('product-image');
      const previewImg = document.getElementById('preview-img');
  
      // Hiển thị preview hình ảnh
      productImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewImg.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          previewImg.src = '';
          previewImg.style.display = 'none';
        }
      });
  
      // Xử lý submit form
      addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = productNameInput.value;
        alert(`Sản phẩm "${productName}" đã được thêm thành công!`);
        window.location.href = 'products.html'; // Quay lại danh sách sản phẩm
      });
    }
  
    // Xử lý form chỉnh sửa sản phẩm (trong edit_product.html)
    if (editProductForm) {
      const productNameInput = document.getElementById('product-name');
      const productImageInput = document.getElementById('product-image');
      const previewImg = document.getElementById('preview-img');
  
      // Hiển thị preview hình ảnh
      productImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewImg.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
  
      // Xử lý submit form
      editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = productNameInput.value;
        alert(`Sản phẩm "${productName}" đã được cập nhật thành công!`);
        window.location.href = 'products.html'; // Quay lại danh sách sản phẩm
      });
    }
  });