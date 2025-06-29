const db = JSON.parse(localStorage.getItem('db')) || {
    users: [],
    products: [],
    orders: [],
    categories: [],
    cities: []
};
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser || currentUser.type !== 'farmer') {
        window.location.href = 'index.html';
        return;
    }
    
    // Load farmer info
    loadFarmerInfo();
    
    // Load farmer products
    loadFarmerProducts();
    
    // Load farmer orders
    loadFarmerOrders();
    
    // Form event listeners
    document.getElementById('farmer-settings')?.addEventListener('submit', saveFarmerSettings);
    document.getElementById('add-product')?.addEventListener('click', showAddProductModal);
    document.querySelector('.modal .close')?.addEventListener('click', hideAddProductModal);
    document.getElementById('add-product-form')?.addEventListener('submit', addNewProduct);
});

function loadFarmerInfo() {
    document.getElementById('farmer-name').textContent = currentUser.name;
    document.getElementById('farmer-city').textContent = currentUser.city || 'Belirtilmemiş';
    
    // Fill form fields
    document.getElementById('farmer-name').value = currentUser.name;
    document.getElementById('farmer-email').value = currentUser.email;
    document.getElementById('farmer-phone').value = currentUser.phone;
    
    // Fill city select
    const citySelect = document.getElementById('farmer-city');
    citySelect.innerHTML = '';
    db.cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        if (city === currentUser.city) option.selected = true;
        citySelect.appendChild(option);
    });
}

function loadFarmerProducts() {
    const container = document.querySelector('.products-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    const farmerProducts = db.products.filter(p => p.farmerId === currentUser.id);
    
    if (farmerProducts.length === 0) {
        container.innerHTML = '<p>Henüz hiç ürün eklemediniz.</p>';
        return;
    }
    
    farmerProducts.forEach(product => {
        container.innerHTML += `
            <div class="product-item">
                <img src="${product.image || 'images/product.jpg'}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.price.toFixed(2)} TL - Stok: ${product.stock}</p>
                    <p>${db.categories.find(c => c.id === product.category)?.name || 'Diğer'}</p>
                </div>
                <div class="product-actions">
                    <button class="button">Düzenle</button>
                    <button class="button danger">Sil</button>
                </div>
            </div>
        `;
    });
}

function loadFarmerOrders() {
    const container = document.querySelector('.orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    const farmerOrders = db.orders.filter(order => 
        order.items.some(item => {
            const product = db.products.find(p => p.id === item.productId);
            return product?.farmerId === currentUser.id;
        })
    );
    
    if (farmerOrders.length === 0) {
        container.innerHTML = '<p>Henüz hiç sipariş almadınız.</p>';
        return;
    }
    
    farmerOrders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const orderTotal = order.items.reduce((sum, item) => {
            const product = db.products.find(p => p.id === item.productId);
            if (product?.farmerId === currentUser.id) {
                return sum + (item.price * item.quantity);
            }
            return sum;
        }, 0);
        
        container.innerHTML += `
            <div class="order-item">
                <div class="order-header">
                    <h3>Sipariş #${order.id}</h3>
                    <span class="order-date">${orderDate}</span>
                    <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                </div>
                <div class="order-details">
                    <p>Toplam: ${orderTotal.toFixed(2)} TL</p>
                    <button class="button">Detayları Gör</button>
                </div>
            </div>
        `;
    });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Bekliyor',
        'processing': 'Hazırlanıyor',
        'shipped': 'Kargoda',
        'delivered': 'Teslim Edildi',
        'cancelled': 'İptal Edildi'
    };
    return statusMap[status] || status;
}

function saveFarmerSettings(e) {
    e.preventDefault();
    
    const name = document.getElementById('farmer-name').value;
    const email = document.getElementById('farmer-email').value;
    const phone = document.getElementById('farmer-phone').value;
    const city = document.getElementById('farmer-city').value;
    const password = document.getElementById('farmer-password').value;
    
    const userIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        db.users[userIndex] = {
            ...db.users[userIndex],
            name,
            email,
            phone,
            city
        };
        
        if (password) {
            db.users[userIndex].password = password;
        }
        
        currentUser = db.users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Bilgileriniz başarıyla güncellendi!');
        loadFarmerInfo();
    }
}

function showAddProductModal() {
    document.getElementById('product-modal').style.display = 'block';
}

function hideAddProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function addNewProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    const imageFile = document.getElementById('product-image').files[0];
    
    const newId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name,
        price,
        category,
        stock,
        description,
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        city: currentUser.city,
        image: imageFile ? 'uploads/' + imageFile.name : 'images/product.jpg',
        rating: 0,
        reviews: []
    };
    
    db.products.push(newProduct);
    
    if (imageFile) {
        alert('Ürün resmi gerçek uygulamada sunucuya yüklenir');
    }
    
    alert('Ürün başarıyla eklendi!');
    hideAddProductModal();
    loadFarmerProducts();
}