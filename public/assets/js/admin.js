document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const productRows = document.querySelectorAll('.product-table tbody tr');
    const orderRows = document.querySelectorAll('.order-table tbody tr');
    const addProductForm = document.querySelector('.add-product-form');
    const editProductForm = document.querySelector('.edit-product-form');
  
    // Tìm kiếm sản phẩm (trong products_Management.html)
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
            fetch(`/dishes/${productId}`, {
              method: 'DELETE'
            })
              .then(response => response.json())
              .then(data => {
                alert(data.message);
                button.closest('tr').remove();
              })
              .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm!');
              });
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
        const formData = new FormData(addProductForm);
  
        fetch('/dishes', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            window.location.href = 'products_Management.html';
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm!');
          });
      });
    }
  
    // Xử lý form chỉnh sửa sản phẩm (trong edit_product.html)
    if (editProductForm) {
      const productIdInput = document.getElementById('product-id');
      const productNameInput = document.getElementById('product-name');
      const productDescriptionInput = document.getElementById('product-description');
      const productCategoryInput = document.getElementById('product-category');
      const productBrandInput = document.getElementById('product-brand');
      const productOriginInput = document.getElementById('product-origin');
      const productStockInput = document.getElementById('product-stock');
      const productPriceInput = document.getElementById('product-price');
      const productImageInput = document.getElementById('product-image');
      const previewImg = document.getElementById('preview-img');
  
      // Lấy ID sản phẩm từ URL
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');
  
      if (productId) {
        // Lấy thông tin sản phẩm từ backend
        fetch(`/dishes/${productId}`)
          .then(response => response.json())
          .then(product => {
            productIdInput.value = product.id;
            productNameInput.value = product.ten;
            productDescriptionInput.value = product.moTa;
            productCategoryInput.value = product.loai;
            productBrandInput.value = product.thuongHieu;
            productOriginInput.value = product.inventory.origin;
            productStockInput.value = product.inventory.quantity;
            productPriceInput.value = product.inventory.price;
            if (product.hinhAnh) {
              previewImg.src = product.hinhAnh;
              previewImg.style.display = 'block';
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi lấy thông tin sản phẩm!');
          });
      }
  
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
        const formData = new FormData(editProductForm);
  
        fetch(`/dishes/${productId}`, {
          method: 'PUT',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            window.location.href = 'products_Management.html';
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
          });
      });
    }
  });