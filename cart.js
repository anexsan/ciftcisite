document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    setupCheckoutButton();
});

function loadCartItems() {
    const container = document.getElementById('cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        container.style.display = 'none';
        summary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    container.style.display = 'block';
    summary.style.display = 'block';
    
    container.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = db.products.find(p => p.id === item.id) || item;
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        container.innerHTML += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="item-info">
                    <h3>${product.name}</h3>
                    <p>${product.price.toFixed(2)} TL</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">
                    <p>${itemTotal.toFixed(2)} TL</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${product.id})">×</button>
            </div>
        `;
    });
    
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' TL';
    document.getElementById('shipping').textContent = shipping.toFixed(2) + ' TL';
    document.getElementById('total').textContent = total.toFixed(2) + ' TL';
}

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!currentUser) {
                alert('Ödeme yapabilmek için giriş yapmalısınız!');
                window.location.href = 'login.html?redirect=satin-al.html';
                return;
            }
            window.location.href = 'satin-al.html';
        });
    }
}