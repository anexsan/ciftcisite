const db = JSON.parse(localStorage.getItem('db')) || {
    users: [],
    products: [],
    orders: [],
    categories: [],
    cities: []
};
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load user info
    loadUserInfo();
    
    // Load user orders
    loadUserOrders();
    
    // Load user addresses
    loadUserAddresses();
    
    // Load user favorites
    loadUserFavorites();
    
    // Form event listeners
    document.getElementById('user-settings')?.addEventListener('submit', saveUserSettings);
    document.getElementById('add-address')?.addEventListener('click', showAddAddressModal);
    document.querySelector('.modal .close')?.addEventListener('click', hideAddAddressModal);
    document.getElementById('add-address-form')?.addEventListener('submit', addNewAddress);
});

function loadUserInfo() {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    
    // Fill form fields
    document.getElementById('user-name').value = currentUser.name;
    document.getElementById('user-email').value = currentUser.email;
    document.getElementById('user-phone').value = currentUser.phone || '';
}

function loadUserOrders() {
    const container = document.querySelector('.orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    const userOrders = db.orders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        container.innerHTML = '<p>Henüz hiç siparişiniz yok.</p>';
        return;
    }
    
    userOrders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const statusText = getStatusText(order.status);
        
        container.innerHTML += `
            <div class="order-item">
                <div class="order-header">
                    <h3>Sipariş #${order.id}</h3>
                    <span class="order-date">${orderDate}</span>
                    <span class="order-status ${order.status}">${statusText}</span>
                </div>
                <div class="order-details">
                    <p>Toplam: ${order.total.toFixed(2)} TL</p>
                    <button class="button">Detayları Gör</button>
                </div>
            </div>
        `;
    });
}

function loadUserAddresses() {
    const container = document.querySelector('.addresses-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!currentUser.addresses || currentUser.addresses.length === 0) {
        container.innerHTML = '<p>Henüz hiç adres eklemediniz.</p>';
        return;
    }
    
    currentUser.addresses.forEach(address => {
        container.innerHTML += `
            <div class="address-card">
                <h3>${address.title}</h3>
                <p>${address.address}</p>
                <p>${address.district}, ${address.city}</p>
                <p>${address.phone}</p>
                <div class="address-actions">
                    <button class="button small">Düzenle</button>
                    <button class="button small danger">Sil</button>
                </div>
            </div>
        `;
    });
}

function loadUserFavorites() {
    const container = document.querySelector('.favorites-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!currentUser.favorites || currentUser.favorites.length === 0) {
        container.innerHTML = '<p>Henüz hiç favori ürün eklemediniz.</p>';
        return;
    }
    
    const favoriteProducts = db.products.filter(p => 
        currentUser.favorites.includes(p.id)
    );
    
    favoriteProducts.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <h3>${product.name}</h3>
                <p class="price">${product.price.toFixed(2)} TL</p>
                <p class="farmer">Üretici: ${product.farmer} - ${product.city}</p>
                <div class="product-actions">
                    <button class="button add-to-cart" data-product-id="${product.id}">Sepete Ekle</button>
                    <button class="button danger">Favorilerden Çıkar</button>
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

function saveUserSettings(e) {
    e.preventDefault();
    
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value;
    const password = document.getElementById('user-password').value;
    const passwordConfirm = document.getElementById('user-password-confirm').value;
    
    if (password && password !== passwordConfirm) {
        alert('Şifreler eşleşmiyor!');
        return;
    }
    
    const userIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        db.users[userIndex] = {
            ...db.users[userIndex],
            name,
            email,
            phone
        };
        
        if (password) {
            db.users[userIndex].password = password;
        }
        
        currentUser = db.users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Bilgileriniz başarıyla güncellendi!');
        loadUserInfo();
    }
}

function showAddAddressModal() {
    const citySelect = document.getElementById('address-city');
    citySelect.innerHTML = '';
    db.cities.forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });
    
    document.getElementById('address-modal').style.display = 'block';
}

function hideAddAddressModal() {
    document.getElementById('address-modal').style.display = 'none';
}

function addNewAddress(e) {
    e.preventDefault();
    
    const title = document.getElementById('address-title').value;
    const city = document.getElementById('address-city').value;
    const district = document.getElementById('address-district').value;
    const address = document.getElementById('address-details').value;
    const phone = document.getElementById('address-phone').value;
    
    const newAddress = {
        id: Date.now(),
        title,
        city,
        district,
        address,
        phone
    };
    
    if (!currentUser.addresses) {
        currentUser.addresses = [];
    }
    
    currentUser.addresses.push(newAddress);
    
    // Update in database
    const userIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        db.users[userIndex].addresses = currentUser.addresses;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    alert('Adres başarıyla eklendi!');
    hideAddAddressModal();
    loadUserAddresses();
}
