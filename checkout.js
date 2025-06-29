document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser) {
        window.location.href = 'login.html?redirect=satin-al.html';
        return;
    }
    
    loadOrderSummary();
    setupDeliveryForm();
    initializeCitySelect();
});

function loadOrderSummary() {
    const container = document.querySelector('.order-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = db.products.find(p => p.id === item.id) || item;
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        container.innerHTML += `
            <div class="order-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="item-info">
                    <h4>${product.name}</h4>
                    <p>${product.price.toFixed(2)} TL × ${item.quantity}</p>
                </div>
                <div class="item-total">
                    <p>${itemTotal.toFixed(2)} TL</p>
                </div>
            </div>
        `;
    });
    
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;
    
    document.getElementById('order-subtotal').textContent = subtotal.toFixed(2) + ' TL';
    document.getElementById('order-shipping').textContent = shipping.toFixed(2) + ' TL';
    document.getElementById('order-total').textContent = total.toFixed(2) + ' TL';
}

function initializeCitySelect() {
    const citySelect = document.getElementById('delivery-city');
    if (!citySelect) return;
    
    citySelect.innerHTML = '';
    db.cities.forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });
    
    // Set default address if available
    if (currentUser.addresses?.length > 0) {
        const defaultAddress = currentUser.addresses[0];
        document.getElementById('delivery-name').value = currentUser.name;
        document.getElementById('delivery-phone').value = defaultAddress.phone;
        document.getElementById('delivery-city').value = defaultAddress.city;
        document.getElementById('delivery-district').value = defaultAddress.district;
        document.getElementById('delivery-address').value = defaultAddress.address;
    }
}

function setupDeliveryForm() {
    const form = document.getElementById('delivery-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Save delivery info to session
        const deliveryInfo = {
            name: document.getElementById('delivery-name').value,
            phone: document.getElementById('delivery-phone').value,
            city: document.getElementById('delivery-city').value,
            district: document.getElementById('delivery-district').value,
            address: document.getElementById('delivery-address').value,
            notes: document.getElementById('delivery-notes').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value
        };
        
        sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
        window.location.href = 'odeme.html';
    });
}