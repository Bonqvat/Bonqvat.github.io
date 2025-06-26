function initAdminPage() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    const carImageInput = document.getElementById('car-image');
    if (carImageInput) {
        carImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    const carForm = document.getElementById('car-form');
    if (carForm) {
        carForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const brand = document.getElementById('car-brand').value;
            const model = document.getElementById('car-model').value;
            
            if (!brand || !model) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }
            
            showNotification('Автомобиль успешно добавлен в каталог', 'success');
            this.reset();
            
            const preview = document.getElementById('image-preview');
            if (preview) preview.style.display = 'none';
        });
    }
    
    document.getElementById('refreshCars')?.addEventListener('click', async () => {
        await loadCars();
        renderCarList();
    });

    async function loadCars() {
        try {
            const response = await fetch('ajax.php?action=getCars');
            window.adminCars = await response.json();
        } catch (error) {
            console.error('Error loading cars:', error);
            showNotification('Ошибка загрузки данных', 'error');
        }
    }

    function renderCarList() {
        const tableBody = document.querySelector('#car-list tbody');
        tableBody.innerHTML = '';
        
        window.adminCars.forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.id}</td>
                <td>${car.brand}</td>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.price.toLocaleString()} ₽</td>
                <td>
                    <button class="action-btn edit" data-id="${car.id}">Edit</button>
                    <button class="action-btn delete" data-id="${car.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const id = row.querySelector('td:first-child').textContent;
                
                if (confirm(`Вы уверены, что хотите удалить запись ${id}?`)) {
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.remove();
                        showNotification(`Запись ${id} удалена`, 'success');
                    }, 500);
                }
            });
        });
    }

    async function loadDashboardData() {
        try {
            const response = await fetch('ajax.php?action=getDashboardData');
            const data = await response.json();
            
            document.getElementById('new-feedback-count').textContent = 
                data.new_feedback.toLocaleString('ru-RU');
            
            document.getElementById('cars-count').textContent = 
                data.total_cars.toLocaleString('ru-RU');
            
            document.getElementById('users-count').textContent = 
                data.total_users.toLocaleString('ru-RU');
            
            document.getElementById('orders-count').textContent = 
                data.new_orders.toLocaleString('ru-RU');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    async function loadFeedback() {
        try {
            const response = await fetch('ajax.php?action=getFeedback');
            window.adminFeedback = await response.json();
        } catch (error) {
            console.error('Error loading feedback:', error);
            showNotification('Ошибка загрузки заявок', 'error');
        }
    }

    function renderFeedback() {
        const tableBody = document.querySelector('#requests tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        window.adminFeedback.forEach(fb => {
            const date = new Date(fb.created_at);
            const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
            
            const shortMessage = fb.message.length > 50 
                ? fb.message.substring(0, 50) + '...' 
                : fb.message;
            
            const row = document.createElement('tr');
            row.dataset.id = fb.id;
            row.innerHTML = `
                <td>#${fb.id}</td>
                <td>${escapeHtml(fb.name)}</td>
                <td>${escapeHtml(fb.phone)}</td>
                <td>${escapeHtml(fb.subject)}</td>
                <td>${dateStr}</td>
                <td>
                    <div class="message-container">
                        <span class="message-short">${escapeHtml(shortMessage)}</span>
                        ${fb.message.length > 50 ? 
                            `<button class="toggle-message" data-id="${fb.id}">Развернуть</button>` : 
                            ''
                        }
                        <div class="message-full hidden" id="message-full-${fb.id}">
                            ${escapeHtml(fb.message)}
                        </div>
                    </div>
                </td>
                <td><span class="status status-${fb.status}">${escapeHtml(getStatusText(fb.status))}</span></td>
                <td>
                    <button class="action-btn reply" data-id="${fb.id}"><i class="fas fa-reply"></i></button>
                    <button class="action-btn delete" data-id="${fb.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        document.querySelectorAll('.toggle-message').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const fullMsg = document.getElementById(`message-full-${id}`);
                const shortMsg = this.previousElementSibling;
                
                if (fullMsg.classList.contains('hidden')) {
                    fullMsg.classList.remove('hidden');
                    shortMsg.classList.add('hidden');
                    this.textContent = 'Свернуть';
                } else {
                    fullMsg.classList.add('hidden');
                    shortMsg.classList.remove('hidden');
                    this.textContent = 'Развернуть';
                }
            });
        });
    }

async function loadOrders() {
    try {
        const response = await fetch('ajax.php?action=getAdminOrders');
        window.adminOrders = await response.json();
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Ошибка загрузки заказов', 'error');
    }
}

function renderOrders() {
    const tableBody = document.querySelector('#orders tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    window.adminOrders.forEach(order => {
        const date = new Date(order.created_at);
        const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        
        const row = document.createElement('tr');
        row.dataset.id = order.id;
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.user_name || 'N/A'}</td>
            <td>${escapeHtml(order.car_brand)} ${escapeHtml(order.car_model)}</td>
            <td>${dateStr}</td>
            <td>${escapeHtml(order.dealer)}</td>
            <td>${order.total_price.toLocaleString()} ₽</td>
            <td><span class="status status-${order.status === 'Ожидает подтверждения' ? 'new' : 'resolved'}">
                ${escapeHtml(order.status)}
            </span></td>
            <td>
                <button class="action-btn complete" data-id="${order.id}"><i class="fas fa-check"></i></button>
                <button class="action-btn delete" data-id="${order.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getStatusText(status) {
    const statuses = {
        'new': 'Новая',
        'in_progress': 'В обработке',
        'resolved': 'Завершена'
    };
    return statuses[status] || status;
}

function deleteFeedback(id) {
    if (confirm(`Удалить заявку #${id}?`)) {
        fetch('ajax.php?action=deleteFeedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.remove();
                        showNotification(`Заявка #${id} удалена`, 'success');
                        loadDashboardData();
                    }, 500);
                }
            }
        })
        .catch(error => console.error('Error deleting feedback:', error));
    }
}

function replyToFeedback(id) {
    const message = prompt('Введите ваш ответ:');
    if (message) {
        fetch('ajax.php?action=updateFeedbackStatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'resolved' })
        })
        .then(response => response.json())
        .then(() => {
            const statusCell = document.querySelector(`tr[data-id="${id}"] .status`);
            if (statusCell) {
                statusCell.className = 'status status-resolved';
                statusCell.textContent = 'Завершена';
                showNotification(`Ответ на заявку #${id} отправлен`, 'success');
                loadDashboardData();
            }
        })
        .catch(error => console.error('Error updating feedback status:', error));
    }
}

document.querySelector('#requests')?.addEventListener('click', function(e) {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    
    const id = btn.dataset.id;
    
    if (btn.classList.contains('delete')) {
        deleteFeedback(id);
    } 
    else if (btn.classList.contains('reply')) {
        replyToFeedback(id);
    }
});

document.querySelector('#orders')?.addEventListener('click', function(e) {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    
    const id = btn.dataset.id;
    
    if (btn.classList.contains('delete')) {
        if (confirm(`Удалить заказ #${id}?`)) {
            fetch('ajax.php?action=deleteOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const row = document.querySelector(`tr[data-id="${id}"]`);
                    if (row) {
                        row.style.opacity = '0.5';
                        setTimeout(() => {
                            row.remove();
                            showNotification(`Заказ #${id} удален`, 'success');
                            loadDashboardData();
                        }, 500);
                    }
                }
            })
            .catch(error => console.error('Error deleting order:', error));
        }
    } 
    else if (btn.classList.contains('complete')) {
        if (confirm(`Подтвердить выполнение заказа #${id}?`)) {
            fetch('ajax.php?action=completeOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(response => response.json())
            .then(() => {
                const statusCell = document.querySelector(`tr[data-id="${id}"] .status`);
                if (statusCell) {
                    statusCell.className = 'status status-resolved';
                    statusCell.textContent = 'Выполнен';
                    showNotification(`Заказ #${id} подтвержден`, 'success');
                    loadDashboardData();
                }
            })
            .catch(error => console.error('Error completing order:', error));
        }
    }
});

loadDashboardData();
loadCars().then(renderCarList);
loadFeedback().then(renderFeedback);
loadOrders().then(renderOrders);
}

window.initAdminPage = initAdminPage;