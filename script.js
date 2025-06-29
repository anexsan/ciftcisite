// Database
const products = [
    // Meyveler
    {id: 1, name: "Elma", price: 8.50, category: "meyve", city: "Amasya", farmer: "Amasya Bahçe", image: "images/elma.jpg"},
    {id: 2, name: "Armut", price: 10.00, category: "meyve", city: "Bursa", farmer: "Bursa Meyve", image: "images/armut.jpg"},
    {id: 3, name: "Şeftali", price: 12.00, category: "meyve", city: "Bursa", farmer: "Bursa Meyve", image: "images/şeftali.jpg"},
    {id: 4, name: "Kiraz", price: 15.00, category: "meyve", city: "İzmir", farmer: "Ege Bahçe", image: "images/kiraz.jpg"},
    {id: 5, name: "Üzüm", price: 9.00, category: "meyve", city: "Manisa", farmer: "Manisa Bağ", image: "images/üzüm.jpg"},
    {id: 21, name: "Muz", price: 18.00, category: "meyve", city: "Antalya", farmer: "Akdeniz Meyve", image: "images/muz.jpg"},
    {id: 22, name: "Portakal", price: 7.50, category: "meyve", city: "Adana", farmer: "Çukurova Meyve", image: "images/portakal.jpg"},
    
    // Sebzeler
    {id: 6, name: "Domates", price: 7.00, category: "sebze", city: "Antalya", farmer: "Akdeniz Tarım", image: "images/domates.jpg"},
    {id: 7, name: "Biber", price: 8.50, category: "sebze", city: "Adana", farmer: "Çukurova Üretim", image: "images/biber.jpg"},
    {id: 8, name: "Patlıcan", price: 9.00, category: "sebze", city: "İzmir", farmer: "Ege Tarım", image: "images/patlıcan.jpg"},
    {id: 9, name: "Salatalık", price: 6.50, category: "sebze", city: "Antalya", farmer: "Akdeniz Tarım", image: "images/salatalık.jpg"},
    {id: 10, name: "Marul", price: 5.00, category: "sebze", city: "Mersin", farmer: "Toros Tarım", image: "images/marul.jpg"},
    {id: 23, name: "Havuç", price: 4.50, category: "sebze", city: "Konya", farmer: "Konya Tarım", image: "images/havuç.jpg"},
    {id: 24, name: "Soğan", price: 3.50, category: "sebze", city: "Nevşehir", farmer: "Kapadokya Üretim", image: "images/soğan.jpg"},
    
    // Süt Ürünleri
    {id: 11, name: "Taze Süt", price: 8.00, category: "sut", city: "İzmir", farmer: "Ege Mandıra", image: "images/süt.jpg"},
    {id: 12, name: "Yumurta", price: 2.50, category: "sut", city: "Balıkesir", farmer: "Balıkesir Çiftlik", image: "images/yumurta.jpg"},
    {id: 13, name: "Beyaz Peynir", price: 35.00, category: "sut", city: "Trabzon", farmer: "Karadeniz Mandıra", image: "images/beyazp.jpg"},
    {id: 14, name: "Kaşar Peyniri", price: 45.00, category: "sut", city: "Kars", farmer: "Kars Mandıra", image: "images/kaşarp.jpg"},
    {id: 15, name: "Tereyağı", price: 60.00, category: "sut", city: "Edirne", farmer: "Trakya Mandıra", image: "images/tereyağı.jpg"},
    {id: 25, name: "Yoğurt", price: 12.00, category: "sut", city: "Afyon", farmer: "Afyon Mandıra", image: "images/yoğurt.jpg"},
    {id: 26, name: "Kaymak", price: 40.00, category: "sut", city: "Kayseri", farmer: "Erciyes Mandıra", image: "images/kaymak.jpg"},
    
    // Bakliyat
    {id: 16, name: "Mercimek", price: 20.00, category: "bakliyat", city: "Konya", farmer: "Konya Bakliyat", image: "images/mercimek.jpg"},
    {id: 17, name: "Nohut", price: 18.00, category: "bakliyat", city: "Ankara", farmer: "Ankara Bakliyat", image: "images/nohut.jpg"},
    {id: 18, name: "Fasulye", price: 15.00, category: "bakliyat", city: "Çanakkale", farmer: "Çanakkale Bakliyat", image: "images/fasulye.jpg"},
    {id: 19, name: "Pirinç", price: 12.00, category: "bakliyat", city: "Edirne", farmer: "Trakya Bakliyat", image: "images/pirinç.jpg"},
    {id: 20, name: "Bulgur", price: 10.00, category: "bakliyat", city: "Gaziantep", farmer: "Gaziantep Bakliyat", image: "images/bulgur.jpg"},
    {id: 27, name: "Antep Fıstığı", price: 80.00, category: "bakliyat", city: "Gaziantep", farmer: "Gaziantep Bakliyat", image: "images/fıstık.jpg"},
    {id: 28, name: "Kuru Üzüm", price: 25.00, category: "bakliyat", city: "Manisa", farmer: "Manisa Bağ", image: "images/küzüm.jpg"}
];


const cities = [...new Set(products.map(product => product.city))];
const categories = [...new Set(products.map(product => product.category))];

// Current user and cart
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Initialize city selects
    initializeCitySelects();
    
    // Initialize category selects
    initializeCategorySelects();
    
    // Load products based on current page
    if (document.getElementById('popular-products')) {
        loadPopularProducts();
    }
    
    if (document.getElementById('all-products')) {
        loadAllProducts();
    }
    
    // Setup event listeners
    setupCartButtons();
    setupLogoutButton();
    setupLoginForm();
    setupFilterEvents();
    
    // Update cart UI
    updateCartUI();
});

// Initialize city select elements
function initializeCitySelects() {
    const citySelects = document.querySelectorAll('select[id$="-city"], select#city-filter');
    citySelects.forEach(select => {
        select.innerHTML = '<option value="">Tüm Şehirler</option>';
        cities.forEach(city => {
            select.innerHTML += `<option value="${city}">${city}</option>`;
        });
    });
}

// Initialize category select elements
function initializeCategorySelects() {
    const categorySelects = document.querySelectorAll('select[id$="-category"], select#category-filter');
    categorySelects.forEach(select => {
        select.innerHTML = '<option value="">Tüm Kategoriler</option>';
        categories.forEach(category => {
            select.innerHTML += `<option value="${category}">${category}</option>`;
        });
    });
}

// Setup filter events
function setupFilterEvents() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadAllProducts();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('category-filter').value = '';
            document.getElementById('city-filter').value = '';
            document.getElementById('sort-filter').value = 'price-asc';
            loadAllProducts();
        });
    }
}

// Load popular products for homepage
function loadPopularProducts() {
    const container = document.getElementById('popular-products');
    if (!container) return;
    
    container.innerHTML = '';
    
    const popularProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    
    popularProducts.forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}

// Load all products for products page with filtering
function loadAllProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    // Get filter values
    const category = document.getElementById('category-filter')?.value || '';
    const city = document.getElementById('city-filter')?.value || '';
    const sort = document.getElementById('sort-filter')?.value || 'price-asc';
    
    // Filter products
    let filteredProducts = [...products];
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (city) {
        filteredProducts = filteredProducts.filter(p => p.city === city);
    }
    
    // Sort products
    switch (sort) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    // Display products
    container.innerHTML = '';
    filteredProducts.forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} TL</p>
            <p class="farmer">Üretici: ${product.farmer} - ${product.city}</p>
            <div class="product-actions">
                <button class="button add-to-cart" data-product-id="${product.id}">Sepete Ekle</button>
                ${currentUser ? `<button class="button" onclick="window.location.href='satin-al.html?product=${product.id}'">Hemen Al</button>` : ''}
            </div>
        </div>
    `;
}

// Setup cart button events
function setupCartButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            addToCart(productId);
        }
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    alert(`${product.name} sepete eklendi!`);
}

// Update cart UI
function updateCartUI() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

// Setup logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLogin();
    window.location.href = 'index.html';
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('user-login');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('#login-email').value;
        const password = this.querySelector('#login-password').value;
        
        // In a real app, you would check against a real user database
        // This is just for demonstration
        if (email && password) {
            currentUser = {
                id: 1,
                name: "Demo Kullanıcı",
                email: email,
                type: "customer"
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUIForLogin();
            window.location.href = 'index.html';
        } else {
            alert('Lütfen geçerli bir e-posta ve şifre girin!');
        }
    });
}

// Update UI based on login status
function updateUIForLogin() {
    const loginLinks = document.querySelectorAll('.login-link');
    const logoutLinks = document.querySelectorAll('.logout-link');
    const farmerLinks = document.querySelectorAll('.farmer-link');
    const adminLinks = document.querySelectorAll('.admin-link');
    const userProfile = document.querySelector('.user-profile');
    
    if (currentUser) {
        loginLinks.forEach(link => link.style.display = 'none');
        logoutLinks.forEach(link => link.style.display = 'block');
        
        if (currentUser.type === 'farmer') {
            farmerLinks.forEach(link => link.style.display = 'block');
            adminLinks.forEach(link => link.style.display = 'none');
        } else if (currentUser.type === 'admin') {
            farmerLinks.forEach(link => link.style.display = 'none');
            adminLinks.forEach(link => link.style.display = 'block');
        } else {
            farmerLinks.forEach(link => link.style.display = 'none');
            adminLinks.forEach(link => link.style.display = 'none');
        }
        
        if (userProfile) {
            userProfile.style.display = 'block';
            const avatar = userProfile.querySelector('.user-avatar');
            if (avatar) {
                avatar.alt = currentUser.name;
            }
        }
    } else {
        loginLinks.forEach(link => link.style.display = 'block');
        logoutLinks.forEach(link => link.style.display = 'none');
        farmerLinks.forEach(link => link.style.display = 'none');
        adminLinks.forEach(link => link.style.display = 'none');
        
        if (userProfile) {
            userProfile.style.display = 'none';
        }
    }
}

// Check login status
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    updateUIForLogin();
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};
window.updateQuantity = function(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity < 1) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartUI();
    }
};
window.logout = logout;