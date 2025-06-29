const db = JSON.parse(localStorage.getItem('db')) || {
    users: [],
    products: [],
    orders: [],
    categories: [],
    cities: []
};
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    // Load users
    loadUsers();
    
    // Load farmers
    loadFarmers();
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Form event listeners
    document.getElementById('add-user')?.addEventListener('click', showAddUserModal);
    document.querySelector('.modal .close')?.addEventListener('click', hideAddUserModal);
    document.getElementById('add-user-form')?.addEventListener('submit', addNewUser);
    document.getElementById('user-type')?.addEventListener('change', toggleFarmerFields);
});

function loadUsers() {
    const container = document.getElementById('users-table');
    if (!container) return;
    
    container.innerHTML = '';
    
    const users = db.users.filter(u => u.type === 'customer');
    
    users.forEach(user => {
        const registerDate = new Date(user.createdAt || '2025-01-01').toLocaleDateString();
        
        container.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${registerDate}</td>
                <td>
                    <button class="button small">Düzenle</button>
                    <button class="button small danger">Sil</button>
                </td>
            </tr>
        `;
    });
}

function loadFarmers() {
    const container = document.getElementById('farmers-table');
    if (!container) return;
    
    container.innerHTML = '';
    
    const farmers = db.users.filter(u => u.type === 'farmer');
    
    farmers.forEach(farmer => {
        const registerDate = new Date(farmer.createdAt || '2025-01-01').toLocaleDateString();
        const status = farmer.verified ? 'Onaylı' : 'Onay Bekliyor';
        
        container.innerHTML += `
            <tr>
                <td>${farmer.id}</td>
                <td>${farmer.name}</td>
                <td>${farmer.email}</td>
                <td>${farmer.city || '-'}</td>
                <td><span class="status ${farmer.verified ? 'verified' : 'pending'}">${status}</span></td>
                <td>
                    ${!farmer.verified ? '<button class="button small verify-btn">Onayla</button>' : ''}
                    <button class="button small">Düzenle</button>
                    <button class="button small danger">Sil</button>
                </td>
            </tr>
        `;
    });
}

function loadDashboardStats() {
    const totalSales = db.orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = db.orders.length;
    const totalFarmers = db.users.filter(u => u.type === 'farmer').length;
    const totalUsers = db.users.filter(u => u.type === 'customer').length;
    
    document.getElementById('total-sales').textContent = totalSales.toFixed(2) + ' TL';
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-farmers').textContent = totalFarmers;
    document.getElementById('total-users').textContent = totalUsers;
    
    renderSalesChart();
}

function renderSalesChart() {
    const ctx = document.getElementById('sales-chart')?.getContext('2d');
    if (!ctx) return;
    
    const labels = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
    const data = [1200, 1900, 1500, 2000, 2500, 2200];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aylık Satışlar (TL)',
                data: data,
                backgroundColor: 'rgba(46, 139, 87, 0.2)',
                borderColor: 'rgba(46, 139, 87, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showAddUserModal() {
    document.getElementById('user-modal').style.display = 'block';
}

function hideAddUserModal() {
    document.getElementById('user-modal').style.display = 'none';
}

function toggleFarmerFields() {
    const userType = document.getElementById('user-type').value;
    const farmerFields = document.getElementById('farmer-fields');
    
    if (userType === 'farmer') {
        farmerFields.style.display = 'block';
    } else {
        farmerFields.style.display = 'none';
    }
}

function addNewUser(e) {
    e.preventDefault();
    
    const type = document.getElementById('user-type').value;
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const city = type === 'farmer' ? document.getElementById('farmer-city').value : null;
    
    const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
    
    const newUser = {
        id: newId,
        name,
        email,
        password,
        type,
        createdAt: new Date().toISOString()
    };
    
    if (type === 'farmer') {
        newUser.city = city;
        newUser.verified = false;
        newUser.products = [];
    }
    
    db.users.push(newUser);
    
    alert('Kullanıcı başarıyla eklendi!');
    hideAddUserModal();
    
    if (type === 'customer') {
        loadUsers();
    } else if (type === 'farmer') {
        loadFarmers();
    }
    
    loadDashboardStats();
}