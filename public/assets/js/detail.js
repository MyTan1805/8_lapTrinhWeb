const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
      document.getElementById('productDetailWrapper').innerHTML = '<p>Không tìm thấy sản phẩm.</p>';
    } else {
      fetch(`/dishes/${productId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Sản phẩm không tồn tại!');
          }
          return response.json();
        })
        .then(product => {
          const productDetailWrapper = document.getElementById('productDetailWrapper');
          productDetailWrapper.innerHTML = `
            <div class="product-detail-image">
              <img src="/images/products/${product.hinhAnh}" alt="${product.ten}">
            </div>
            <div class="product-detail-info">
              <h1>${product.ten}</h1>
              <p class="product-category">Category: ${product.loai}</p>
              <div class="product-rating" id="productRating">
                <!-- Rating will be populated dynamically -->
              </div>
              <div class="product-price">
                <span class="current-price">${product.inventory.price.toLocaleString()} đ</span>
              </div>
              <p class="product-description">
                ${product.moTa}
              </p>
              <div class="product-quantity">
                <button class="quantity-btn decrease">-</button>
                <input type="number" value="1" min="1" class="quantity-input">
                <button class="quantity-btn increase">+</button>
                <span class="stock-info">In stock: ${product.inventory.quantity}</span>
              </div>
              <button class="wishlist-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.366 3.84166C16.941 3.41583 16.4355 3.07783 15.879 2.84799C15.3225 2.6175 14.725 2.5 14.1195 2.5C13.514 2.5 12.9165 2.6175 12.36 2.84799C11.8035 3.07783 11.298 3.41583 10.873 3.84166L10 4.71666L9.127 3.84166C8.2765 2.99033 7.1185 2.5 5.8805 2.5C4.6425 2.5 3.4845 2.99033 2.634 3.84166C1.7835 4.69216 1.293 5.85066 1.293 7.08866C1.293 8.32666 1.7835 9.48516 2.634 10.3357L9.9995 17.7017L17.366 10.3357C17.791 9.91066 18.129 9.40466 18.359 8.84766C18.5895 8.29066 18.707 7.69366 18.707 7.08816C18.707 6.48266 18.5895 5.88566 18.359 5.32866C18.129 4.77166 17.791 4.26666 17.366 3.84166Z" stroke="#666666" stroke-width="2"/>
                </svg>
              </button>
            </div>
          `;

          // Populate product description
          document.getElementById('productDescription').textContent = product.moTa;

          // Populate "How to Use" (if available)
          const howToUse = document.getElementById('howToUse');
          if (product.usage) {
            howToUse.innerHTML = `<li>${product.usage}</li>`;
          } else {
            howToUse.innerHTML = `
              <li>Apply evenly to cleansed face.</li>
              <li>Gently massage in circular motions.</li>
              <li>Rinse thoroughly with warm water (if applicable).</li>
              <li>Use as directed for best results.</li>
            `;
          }

          // Calculate average rating and populate reviews
          const reviewsSummary = document.getElementById('reviewsSummary');
          const reviewsList = document.getElementById('reviewsList');
          const productRating = document.getElementById('productRating');
          if (product.ratings && product.ratings.length > 0) {
            const averageRating = product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length;
            const stars = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));
            productRating.innerHTML = `<span class="stars">${stars}</span> (${product.ratings.length})`;
            reviewsSummary.innerHTML = `
              <div class="rating-score">
                <span class="score">${averageRating.toFixed(1)}/5</span>
                <span class="stars">${stars}</span>
                <span class="review-count">${product.ratings.length} reviews</span>
              </div>
            `;

            product.ratings.forEach(rating => {
              const reviewItem = document.createElement('div');
              reviewItem.classList.add('review-item');
              reviewItem.innerHTML = `
                <p><strong>${rating.user}</strong>: ${rating.rating}/5</p>
                <p>${rating.comment}</p>
              `;
              reviewsList.appendChild(reviewItem);
            });
          } else {
            productRating.innerHTML = `<span class="stars">☆☆☆☆☆</span> (0)`;
            reviewsSummary.innerHTML = `
              <div class="rating-score">
                <span class="score">0/5</span>
                <span class="stars">☆☆☆☆☆</span>
                <span class="review-count">0 reviews</span>
              </div>
            `;
            reviewsList.innerHTML = '<p class="no-reviews">There are no reviews for this product yet. Be the first to review!</p>';
          }
        })
        .catch(error => {
          console.error("Lỗi khi tải dữ liệu:", error);
          document.getElementById('productDetailWrapper').innerHTML = `<p>${error.message}</p>`;
        });

      // Fetch all products to populate "Featured Products" section
      fetch('/dishes')
        .then(response => response.json())
        .then(products => {
          const featuredProducts = document.getElementById('featuredProducts');
          // Filter products of the same category as the current product, excluding the current product
          fetch(`/dishes/${productId}`)
            .then(response => response.json())
            .then(currentProduct => {
              const relatedProducts = products
                .filter(p => p.loai === currentProduct.loai && p.id !== productId)
                .slice(0, 4); // Limit to 4 related products

              relatedProducts.forEach(product => {
                const productItem = document.createElement('a');
                productItem.href = `product_detail?id=${product.id}`;
                productItem.classList.add('product-item');
                const averageRating = product.ratings ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length : 0;
                const stars = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));
                productItem.innerHTML = `
                  <div class="product-image">
                    <img src="/images/products/${product.hinhAnh}" alt="${product.ten}">
                  </div>
                  <div class="product-info">
                    <div class="product-rating">
                      <span class="stars">${stars}</span> (${product.ratings ? product.ratings.length : 0})
                    </div>
                    <h4>${product.ten}</h4>
                    <p>${product.loai}</p>
                    <div class="product-price">
                      <span class="current-price">${product.inventory.price.toLocaleString()} đ</span>
                    </div>
                  </div>
                `;
                featuredProducts.appendChild(productItem);
              });
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm tương tự:", error));
    }

    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.getAttribute('data-tab')).classList.add('active');
      });
    });

    // Quantity buttons functionality
    document.addEventListener('click', (e) => {
      const quantityInput = document.querySelector('.quantity-input');
      let quantity = parseInt(quantityInput.value);
      if (e.target.classList.contains('increase')) {
        quantityInput.value = quantity + 1;
      } else if (e.target.classList.contains('decrease') && quantity > 1) {
        quantityInput.value = quantity - 1;
      }
    });