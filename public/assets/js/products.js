let products = [];
    let filteredProducts = [];
    let sortState = { column: null, direction: 'asc' };
    const productsPerPage = 7;
    let currentPage = 1;

    // DOM Elements
    const productTableBody = document.getElementById('productTableBody');
    const searchForm = document.getElementById('search-form');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteManyBtn = document.getElementById('deleteManyBtn');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfoSpan = document.getElementById('pageInfo');
    const loadingIndicator = document.getElementById('loading');

    // Fetch products from the server
    async function fetchProducts() {
        productTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Đang tải dữ liệu...</td></tr>';
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
            currentPage = 1;
            renderTable();
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
            productTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px; color: red;">Không thể tải dữ liệu sản phẩm. Lỗi: ${error.message}</td></tr>`;
            alert(`Lỗi tải dữ liệu: ${error.message}`);
        }
    }

    // Render the product table content
    function renderTable() {
        sortProducts();
        productTableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToRender = filteredProducts.slice(startIndex, endIndex);

        if (productsToRender.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Không tìm thấy sản phẩm nào.</td></tr>';
        } else {
            productsToRender.forEach(product => {
                const row = document.createElement('tr');
                const status = product.quantity > 0 ? 'Hoạt động' : 'Hết hàng';
                const statusClass = product.quantity > 0 ? 'active' : 'inactive';
                const priceDisplay = (product.price || 0).toLocaleString('vi-VN');
                const imageSrc = product.hinhAnh ? `/images/products/${encodeURIComponent(product.hinhAnh)}` : '/images/placeholder.png';

                row.innerHTML = `
                    <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
                    <td>${product.id}</td>
                    <td><img src="${imageSrc}" alt="${product.ten}" class="product-image" onerror="this.onerror=null; this.src='/images/placeholder.png';"></td>
                    <td title="${product.ten}">${product.ten.length > 30 ? product.ten.substring(0, 30) + '...' : product.ten}</td>
                    <td>${product.loaiHienThi || product.loai || 'N/A'}</td>
                    <td>${priceDisplay} đ</td>
                    <td>${product.quantity || 0}</td>
                    <td><span class="status ${statusClass}">${status}</span></td>
                    <td>
                        <div class="action-wrapper">
                            <button class="action-btn" title="Thao tác">...</button>
                            <div class="action-dropdown">
                                <a href="/product_detail?id=${product.id}" target="_blank" class="action-item">Xem chi tiết</a>
                                <a href="/edit_product?id=${product.id}" class="action-item">Sửa</a>
                                <a href="#" class="action-item delete-btn" data-id="${product.id}">Xóa</a>
                            </div>
                        </div>
                    </td>
                `;
                productTableBody.appendChild(row);
            });
        }
        updatePaginationControls();
        updateSelectAllCheckboxState();
        toggleDeleteManyButton();
    }

    // --- Event Listeners ---

    // Search Form
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(searchForm);
        const ten = formData.get('ten');
        const loai = formData.get('loai');
        const giaFr = formData.get('giaFr') ? parseInt(formData.get('giaFr')) : null;
        const giaTo = formData.get('giaTo') ? parseInt(formData.get('giaTo')) : null;

        // Lọc sản phẩm (kiểu OR)
        filteredProducts = products.filter(product => {
            let match = false;

            // Lọc theo tên (regex, không phân biệt hoa thường)
            if (ten) {
                const regex = new RegExp(ten, 'i');
                if (regex.test(product.ten)) {
                    match = true;
                }
            }

            // Lọc theo danh mục
            if (loai) {
                if (product.loai === loai) {
                    match = true;
                }
            }

            // Lọc theo giá
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

            // Nếu không có điều kiện nào được nhập, hiển thị tất cả
            if (!ten && !loai && !giaFr && !giaTo) {
                match = true;
            }

            return match;
        });

        currentPage = 1;
        renderTable();
    });

    // Select All Checkbox
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxesOnPage = productTableBody.querySelectorAll(".product-checkbox");
        checkboxesOnPage.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        toggleDeleteManyButton();
    });

    // Individual Product Checkbox (using event delegation)
    productTableBody.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-checkbox')) {
            updateSelectAllCheckboxState();
            toggleDeleteManyButton();
        }
    });

    // Delete Button (using event delegation)
    productTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            e.preventDefault();
            const button = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
            const productId = button.getAttribute('data-id');
            if (productId) {
                showSingleDeleteModal(productId);
            }
        }
    });

    // Delete Many Button
    deleteManyBtn.addEventListener('click', function() {
        const checkedCheckboxes = productTableBody.querySelectorAll(".product-checkbox:checked");
        const productIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.getAttribute("data-id"));

        if (productIds.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để xóa!");
            return;
        }
        showMultiDeleteModal(productIds);
    });

    // Pagination Buttons
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

    // Sorting Headers (using event delegation)
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

    // --- Helper Functions ---

    // Sort products based on current sort state
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

    // Update state of "Select All" checkbox based on current page's checkboxes
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

    // Toggle visibility of "Delete Many" button
    function toggleDeleteManyButton() {
        const checkedCount = productTableBody.querySelectorAll(".product-checkbox:checked").length;
        if (checkedCount > 0) {
            deleteManyBtn.classList.add("visible");
            deleteManyBtn.textContent = `Xóa ${checkedCount} sản phẩm đã chọn`;
        } else {
            deleteManyBtn.classList.remove("visible");
            deleteManyBtn.textContent = `Xóa sản phẩm đã chọn`;
        }
    }

    // Update pagination controls (buttons and page info)
    function updatePaginationControls() {
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        pageInfoSpan.textContent = totalProducts > 0 ? `Trang ${currentPage} / ${totalPages}` : 'Không có dữ liệu';
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

        selectAllCheckbox.disabled = productTableBody.querySelectorAll('.product-checkbox').length === 0;
    }

    // --- Modal and Deletion Logic ---

    // Show confirmation modal for single product deletion
    function showSingleDeleteModal(productId) {
        const product = products.find(p => p.id === productId);
        const productName = product ? product.ten : `ID ${productId}`;
        showModal(`Xác nhận xóa sản phẩm`,
                  `<p style="color: #666666; margin-bottom: 20px;">Bạn có chắc chắn muốn xóa sản phẩm <strong>${productName}</strong>?</p>`,
                  `<button class="btn btn-danger" onclick="confirmSingleDelete('${productId}')">Xóa</button>
                   <button class="btn btn-secondary" onclick="closeModal()">Hủy</button>`);
    }

    // Show confirmation modal for multiple product deletion
    function showMultiDeleteModal(productIds) {
        showModal(`Xác nhận xóa nhiều sản phẩm`,
                  `<p style="color: #666666; margin-bottom: 20px;">Bạn có chắc chắn muốn xóa <strong>${productIds.length}</strong> sản phẩm đã chọn?</p>`,
                  `<button class="btn btn-danger" onclick='confirmMultiDelete(${JSON.stringify(productIds)})'>Xóa ${productIds.length} sản phẩm</button>
                   <button class="btn btn-secondary" onclick="closeModal()">Hủy</button>`);
    }

    // Generic Modal Function
    function showModal(title, contentHtml, footerHtml) {
        closeModal();
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "confirmActionModal";
        modal.style.cssText = `
            display: flex; justify-content: center; align-items: center;
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); z-index: 1000;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        modal.innerHTML = `
            <div style="background: #FFFFFF; width: 90%; max-width: 450px; padding: 25px 30px; border-radius: 8px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.2); transform: scale(0.9); transition: transform 0.3s ease;">
                <h3 style="color: #333333; margin-top: 0; margin-bottom: 15px; font-size: 1.3em;">${title}</h3>
                ${contentHtml}
                <div class="modal-actions" style="margin-top: 25px;">
                    ${footerHtml}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 10);
    }

    // Close any modal
    function closeModal() {
        const modal = document.getElementById("confirmActionModal");
        if (modal) {
            modal.style.opacity = '0';
            modal.querySelector('div').style.transform = 'scale(0.9)';
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Confirm single delete action
    async function confirmSingleDelete(productId) {
        loadingIndicator.style.display = 'block';
        closeModal();
        try {
            const response = await fetch(`/dishes/${productId}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                alert(data.message || `Xóa sản phẩm ${productId} thành công!`);
                products = products.filter(p => p.id !== productId);
                const formData = new FormData(searchForm);
                const ten = formData.get('ten');
                const loai = formData.get('loai');
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

                    if (loai) {
                        if (product.loai === loai) {
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

                    if (!ten && !loai && !giaFr && !giaTo) {
                        match = true;
                    }

                    return match;
                });
                const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    currentPage = totalPages;
                } else if (filteredProducts.length === 0) {
                    currentPage = totalPages;
                }
                renderTable();
            } else {
                throw new Error(data.message || `Lỗi ${response.status}: Không thể xóa sản phẩm.`);
            }
        } catch (error) {
            console.error(`Lỗi khi xóa sản phẩm ${productId}:`, error);
            alert(`Lỗi khi xóa: ${error.message}`);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Confirm multiple delete action
    async function confirmMultiDelete(productIds) {
        if (!Array.isArray(productIds) || productIds.length === 0) {
            alert("Không có ID sản phẩm nào để xóa.");
            return;
        }
        console.log("Xác nhận xóa các ID:", productIds);
        loadingIndicator.style.display = "block";
        closeModal();

        try {
            const response = await fetch("/dishes/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: productIds }),
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
            alert(data.message || `Thực hiện xóa ${productIds.length} sản phẩm.`);
            await fetchProducts();

        } catch (error) {
            console.error("Lỗi khi xóa nhiều sản phẩm:", error);
            alert(`Lỗi khi xóa nhiều: ${error.message}`);
        } finally {
            loadingIndicator.style.display = "none";
            selectAllCheckbox.checked = false;
            toggleDeleteManyButton();
        }
    }

    document.addEventListener('DOMContentLoaded', fetchProducts);