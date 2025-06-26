function initUserPage() {
    // Инициализация состояния приложения
    let state = JSON.parse(localStorage.getItem('futureAutoState'));
    if (!state) {
        state = {
            user: null,
            cart: [],
            favorites: []
        };
        localStorage.setItem('futureAutoState', JSON.stringify(state));
    }

    let currentEditType = '';
    window.closeModal('loginModal');

    // Проверка авторизации пользователя
    const currentState = JSON.parse(localStorage.getItem('futureAutoState'));
    if (!currentState || !currentState.user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = '#index';
        return;
    }

    // Обработчики событий
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            document.getElementById('editModal').style.display = 'none';
        }
    };
    document.getElementById('orders-button').addEventListener('click', function() {
        const target = document.getElementById('ordersSection');
        target.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('tickets-button').addEventListener('click', function() {
        const target = document.getElementById('supportSection');
        target.scrollIntoView({ behavior: 'smooth' });
    });

    // Обработчик изменения файла аватарки в модальном окне
    const editAvatarInput = document.getElementById('editAvatar');
    if (editAvatarInput) {
        editAvatarInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                document.getElementById('avatarFileName').textContent = this.files[0].name;
            } else {
                document.getElementById('avatarFileName').textContent = '';
            }
        });
    }

    // Обработчик прямой загрузки аватарки в профиле
    const avatarUpload = document.getElementById('avatarUpload');
    const userAvatar = document.getElementById('userAvatar');
    
    if (avatarUpload && userAvatar) {
        avatarUpload.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const file = this.files[0];
                
                // Показываем превью
                const reader = new FileReader();
                reader.onload = function(e) {
                    userAvatar.src = e.target.result;
                }
                reader.readAsDataURL(file);
                
                // Отправляем на сервер
                uploadAvatar(file)
                    .then(avatarPath => {
                        showNotification('Аватар успешно обновлен');
                        
                        // Обновляем путь в локальном состоянии
                        const state = JSON.parse(localStorage.getItem('futureAutoState'));
                        if (state.user) {
                            state.user.avatar_path = avatarPath;
                            localStorage.setItem('futureAutoState', JSON.stringify(state));
                        }
                    })
                    .catch(error => {
                        showNotification('Ошибка: ' + error, 'error');
                        // Восстанавливаем старую аватарку
                        if (state.user && state.user.avatar_path) {
                            userAvatar.src = state.user.avatar_path;
                        } else {
                            loadUserData();
                        }
                    });
            }
        });
    }
    
    // Инициализация при загрузке
    loadUserData();
    loadOrders(); // Загружаем последние 2 заказа для профиля
    loadSupportTickets();

    
// Функции работы с модальными окнами
function openEditModal(type) {
    currentEditType = type;
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    
    // Показать нужные поля и установить заголовок
    switch(type) {
        case 'personal':
            title.textContent = 'Редактирование личных данных';
            document.getElementById('personalFields').style.display = 'block';
            // Предзаполняем поля текущими значениями
            document.getElementById('editName').value = document.getElementById('userFullName').textContent;
            document.getElementById('editPhone').value = document.getElementById('userPhone').textContent;
            document.getElementById('avatarFileName').textContent = '';
            break;
        case 'address':
            title.textContent = 'Редактирование адреса';
            document.getElementById('addressFields').style.display = 'block';
            document.getElementById('editAddress').value = document.getElementById('userAddress').textContent;
            break;
        case 'security':
            title.textContent = 'Изменение пароля';
            document.getElementById('securityFields').style.display = 'block';
            // Очищаем поля паролей
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            break;
        case 'notifications':
            title.textContent = 'Настройки уведомлений';
            document.getElementById('notificationsFields').style.display = 'block';
            break;
    }
    
    modal.style.display = 'block';
}

function saveChanges() {
    const formData = {};
    switch(currentEditType) {
        case 'personal':
            formData.type = 'personal';
            formData.name = document.getElementById('editName').value;
            formData.phone = document.getElementById('editPhone').value;
            const avatarFile = document.getElementById('editAvatar').files[0];
            
            // Если выбран файл, сначала загружаем его
            if (avatarFile) {
                uploadAvatar(avatarFile)
                    .then(avatarPath => {
                        // После загрузки обновляем остальные данные
                        return updateUserDataOnServer({
                            type: 'personal',
                            name: formData.name,
                            phone: formData.phone,
                            avatar_path: avatarPath
                        });
                    })
                    .then(() => {
                        showNotification('Изменения успешно сохранены');
                        closeModal('editModal');
                        loadUserData();
                    })
                    .catch(error => {
                        showNotification('Ошибка: ' + error.message, 'error');
                    });
            } else {
                // Без файла
                updateUserDataOnServer(formData)
                    .then(() => {
                        showNotification('Изменения успешно сохранены');
                        closeModal('editModal');
                        loadUserData();
                    })
                    .catch(error => {
                        showNotification('Ошибка: ' + error.message, 'error');
                    });
            }
            return;
        case 'address':
            formData.type = 'address';
            formData.address = document.getElementById('editAddress').value;
            break;
        case 'security':
            formData.type = 'security';
            formData.currentPassword = document.getElementById('currentPassword').value;
            formData.newPassword = document.getElementById('newPassword').value;
            formData.confirmPassword = document.getElementById('confirmPassword').value;
            break;
        case 'notifications':
            // Локальная обработка без сервера
            showNotification('Настройки уведомлений сохранены');
            document.getElementById('editModal').style.display = 'none';
            return;
    }

    fetch('script.php?action=updateUserData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            showNotification('Изменения успешно сохранены');
            document.getElementById('editModal').style.display = 'none';
            loadUserData(); // Обновляем данные
        }
    })
    .catch(error => {
        showNotification('Ошибка сети: ' + error.message, 'error');
    });
  }
  window.openEditModal = openEditModal;
  window.saveChanges = saveChanges;
}

// Функция загрузки данных пользователя
function loadUserData() {
    fetch('script.php?action=getUserData')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
                // Если ошибка авторизации - перенаправляем на главную
                if (data.error.includes('Not authorized')) {
                    setTimeout(() => {
                        window.location.href = '#index';
                    }, 2000);
                }
                return;
            }
            updateUserUI(data);
        })
        .catch(error => {
            showNotification('Ошибка загрузки данных: ' + error.message, 'error');
        });
}

// Обновление UI данными пользователя
function updateUserUI(user) {
    document.getElementById('userName').textContent = user.name || user.email;
    document.getElementById('userFullName').textContent = user.name || 'Не указано';
    document.getElementById('userEmail').textContent = user.email || 'Не указан';
    document.getElementById('userPhone').textContent = user.phone || 'Не указан';
    document.getElementById('userAddress').textContent = user.address || 'Не указан';
    
    // Обновляем аватар
    if (user.avatar_path) {
        document.getElementById('userAvatar').src = user.avatar_path;
    }
    
    // Форматируем дату последнего входа
    if (user.last_login) {
        const lastLogin = new Date(user.last_login);
        document.getElementById('userLastLogin').textContent = 
            lastLogin.toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
    } else {
        document.getElementById('userLastLogin').textContent = 'Никогда';
    }
    
    // Обновляем глобальное состояние
    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    if (state) {
        state.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            last_login: user.last_login,
            avatar_path: user.avatar_path,
            isAdmin: user.is_admin || false,
        };
        localStorage.setItem('futureAutoState', JSON.stringify(state));
    }

    if (state.user?.isAdmin) {
      const nav = document.querySelector('nav');
      const existingAdminBtn = document.querySelector('.admin-btn');
      if (!existingAdminBtn && nav) {
        const adminLink = document.createElement('a');
        adminLink.href = '#admin';
        adminLink.className = 'admin-btn';
        adminLink.textContent = 'ПАНЕЛЬ';
        nav.appendChild(adminLink);
      }
    } else {
      const adminBtn = document.querySelector('.admin-btn');
      if (adminBtn) {
        adminBtn.remove();
      }
    }
}

// Функция для загрузки аватарки
function uploadAvatar(file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('avatar', file);
        
        fetch('script.php?action=uploadAvatar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.avatarPath);
            }
        })
        .catch(error => reject(error));
    });
}

// Функция обновления данных пользователя на сервере
function updateUserDataOnServer(formData) {
    return new Promise((resolve, reject) => {
        fetch('script.php?action=updateUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve();
            }
        })
        .catch(error => reject(error));
    });
}

// Вспомогательные функции
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'success' ? '#4c6ef5' : '#dc3545';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function loadOrders(limit = null) {
  fetch(`script.php?action=getOrders${limit ? '&limit='+limit : ''}`)
    .then(response => response.json())
    .then(orders => {
      if (limit) {
        renderOrders(orders, 'ordersList', false);
      } else {
        renderOrders(orders, 'ordersContainer', true);
      }
    })
    .catch(error => {
      showNotification('Ошибка загрузки заказов: ' + error.message, 'error');
    });
}

function renderOrders(orders, containerId, isFullList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (!orders || orders.length === 0) {
    container.innerHTML = '<div class="empty-message">Заказов пока нет</div>';
    return;
  }

  let html = '';
  orders.forEach(order => {
    // Парсим характеристики машины из JSON
    let engine = '';
    let transmission = '';
    let drive = '';
    let specsHtml = '';
    
    try {
      if (order.car.specs && typeof order.car.specs === 'string') {
        const specs = JSON.parse(order.car.specs);
        if (Array.isArray(specs)) {
          specs.forEach(spec => {
            if (spec.name === 'Двигатель') engine = spec.value;
            if (spec.name === 'Трансмиссия') transmission = spec.value;
            if (spec.name === 'Привод') drive = spec.value;
            specsHtml += `<div class="spec-item"><span class="spec-name">${spec.name}:</span> ${spec.value}</div>`;
          });
        }
      }
    } catch (e) {
      console.error('Error parsing car specs:', e);
    }
    
    // Добавляем основные характеристики
    if (order.car.enginek) engine = order.car.engine;
    if (order.car.transmission) transmission = order.car.transmission;
    if (order.car.drive) drive = order.car.drive;

    const statusMap = {
      'Ожидает подтверждения': {text: 'Ожидает подтверждения', class: 'status-new'},
      'В обработке': {text: 'В обработке', class: 'status-processing'},
      'Выполнен': {text: 'Завершен', class: 'status-completed'},
      'Отменен': {text: 'Отменен', class: 'status-cancelled'}
    };
    
    const status = statusMap[order.status] || {text: order.status, class: ''};
    
    html += `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">Заказ #${order.id}</span>
        <span class="order-date">${new Date(order.date).toLocaleDateString('ru-RU')}</span>
      </div>
      <div class="order-status ${status.class}">${status.text}</div>
      <div class="order-details">
        ${order.car.image ? `<img src="${order.car.image}" alt="${order.car.model}" class="order-car">` : ''}
        <div class="order-info">
          <div class="order-model">${order.car.brand} ${order.car.model} ${order.car.year}</div>
          <div class="order-specs">
            ${engine ? `<div class="spec-item"><span class="spec-name">Двигатель:</span> ${engine}</div>` : ''}
            ${transmission ? `<div class="spec-item"><span class="spec-name">Трансмиссия:</span> ${transmission}</div>` : ''}
            ${drive ? `<div class="spec-item"><span class="spec-name">Привод:</span> ${drive}</div>` : ''}
          </div>
          <div class="order-price">${order.total_price.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>
      <div class="order-actions">
        <button class="action-btn" onclick="viewOrderDetails(${order.id})">Подробнее</button>
        ${status.text === 'Завершен' ? 
          `<button class="action-btn" onclick="repeatOrder(${order.id})">Повторить заказ</button>` : ''}
        ${['Ожидает подтверждения', 'В обработке'].includes(status.text) ? 
          `<button class="action-btn" onclick="cancelOrder(${order.id})">Отменить</button>` : ''}
      </div>
    </div>`;
  });
  
  container.innerHTML = html;
}

function loadSupportTickets() {
  fetch('script.php?action=getTickets')
    .then(response => response.json())
    .then(tickets => {
      renderTickets(tickets);
    })
    .catch(error => {
      showNotification('Ошибка загрузки обращений: ' + error.message, 'error');
    });
}

function renderTickets(tickets) {
  const container = document.getElementById('ticketsContainer');
  if (!container) return;
  
  if (!tickets || tickets.length === 0) {
    container.innerHTML = '<div class="empty-message">Обращений пока нет</div>';
    return;
  }

  let html = '<div class="tickets-list">';
  tickets.forEach(ticket => {
    const statusMap = {
      'open': {text: 'Открыто', class: 'ticket-open'},
      'closed': {text: 'Закрыто', class: 'ticket-closed'},
      'pending': {text: 'В обработке', class: 'ticket-pending'}
    };
    
    const status = statusMap[ticket.status] || {text: ticket.status, class: ''};
    
    html += `
    <div class="ticket-card">
      <div class="ticket-header">
        <span class="ticket-id">#${ticket.id}</span>
        <span class="ticket-date">${new Date(ticket.created_at).toLocaleDateString('ru-RU')}</span>
        <span class="ticket-status ${status.class}">${status.text}</span>
      </div>
      <div class="ticket-subject">${ticket.subject}</div>
      <div class="ticket-message">${ticket.message}</div>
      ${ticket.answer ? 
        `<div class="ticket-answer"><strong>Ответ поддержки:</strong> ${ticket.answer}</div>` : ''}
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function openCreateTicketModal() {
  document.getElementById('ticketModal').style.display = 'block';
}

function submitTicket() {
  const state = JSON.parse(localStorage.getItem('futureAutoState'));
  if (!state || !state.user) {
    showNotification('Ошибка: пользователь не авторизован', 'error');
    return;
  }

  const subject = document.getElementById('ticketSubject').value;
  const message = document.getElementById('ticketMessage').value;

  if (!subject.trim() || !message.trim()) {
    showNotification('Заполните все поля', 'error');
    return;
  }

  const user = state.user;
  const ticketData = {
    name: user.name || 'Не указано',
    email: user.email || '',
    phone: user.phone || '',
    subject,
    message
  };

  fetch('ajax.php?action=addFeedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      showNotification(data.error, 'error');
    } else {
      showNotification('Обращение создано');
      closeModal('ticketModal');
      document.getElementById('ticketForm').reset();
      loadSupportTickets();
    }
  })
  .catch(error => {
    showNotification('Ошибка: ' + error.message, 'error');
  });
}

function viewOrderDetails(orderId) {
  fetch(`script.php?action=getOrderDetails&order_id=${orderId}`)
    .then(response => response.json())
    .then(order => {
      if (!order || order.error) {
        showNotification(order?.error || 'Заказ не найден', 'error');
        return;
      }
      
      let specsHtml = '';
      if (order.car.specs && typeof order.car.specs === 'string') {
        try {
          const specs = JSON.parse(order.car.specs);
          if (Array.isArray(specs)) {
            specsHtml = '<div class="specs-grid">';
            specs.forEach(spec => {
              specsHtml += `<div class="spec-item"><strong>${spec.name}:</strong> ${spec.value}</div>`;
            });
            specsHtml += '</div>';
          }
        } catch (e) {
          console.error('Error parsing car specs:', e);
        }
      }
      
      const optionsHtml = order.options && order.options.length > 0 
        ? `<div class="details-section">
             <h4>Дополнительные опции</h4>
             <ul>${order.options.map(opt => `<li>${opt}</li>`).join('')}</ul>
           </div>` 
        : '';
      
      const servicesHtml = order.services && order.services.length > 0 
        ? `<div class="details-section">
             <h4>Дополнительные услуги</h4>
             <ul>${order.services.map(srv => `<li>${srv}</li>`).join('')}</ul>
           </div>` 
        : '';
      
      const modalContent = `
        <span class="close" onclick="closeModal('orderDetailsModal')">&times;</span>
        <div class="order-details-modal">
          <h3>Детали заказа #${order.id}</h3>
          
          <div class="details-row">
            <div class="detail-item">
              <strong>Статус:</strong> ${order.status}
            </div>
            <div class="detail-item">
              <strong>Дата оформления:</strong> ${new Date(order.created_at).toLocaleString('ru-RU')}
            </div>
          </div>
          
          <div class="car-details">
            <h4>Автомобиль</h4>
            <div class="car-info">
              ${order.car.image ? `<img src="${order.car.image}" alt="${order.car.brand} ${order.car.model}" class="car-image">` : ''}
              <div>
                <div><strong>Модель:</strong> ${order.car.brand} ${order.car.model} ${order.car.year}</div>
                <div><strong>Цена:</strong> ${order.car.price?.toLocaleString('ru-RU') || '0'} ₽</div>
              </div>
            </div>
            ${specsHtml}
          </div>
          
          ${optionsHtml}
          ${servicesHtml}
          
          <div class="details-section">
            <h4>Информация о заказе</h4>
            <div><strong>Дилер:</strong> ${order.dealer}</div>
            <div><strong>Итоговая цена:</strong> ${order.total_price.toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>`;
      
      const modal = document.getElementById('orderDetailsModal');
      if (!modal) return;
      
      modal.querySelector('.modal-content').innerHTML = modalContent;
      modal.style.display = 'block';
    })
    .catch(error => {
      showNotification('Ошибка загрузки деталей заказа: ' + error.message, 'error');
    });
}

function repeatOrder(orderId) {
  fetch(`script.php?action=repeatOrder&order_id=${orderId}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showNotification(data.error, 'error');
      } else {
        // Обновляем корзину в локальном хранилище
        const state = JSON.parse(localStorage.getItem('futureAutoState'));
        state.cart = data.cart;
        localStorage.setItem('futureAutoState', JSON.stringify(state));
        showNotification('Товары из заказа добавлены в корзину');
      }
    })
    .catch(error => {
      showNotification('Ошибка: ' + error.message, 'error');
    });
}

function cancelOrder(orderId) {
  if (confirm(`Вы уверены, что хотите отменить заказ #${orderId}?`)) {
    fetch(`script.php?action=cancelOrder&order_id=${orderId}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          showNotification(data.error, 'error');
        } else {
          showNotification(`Заказ #${orderId} отменен`);
          // Обновляем списки заказов
          loadOrders(2);
          if (document.getElementById('ordersSection').style.display === 'block') {
            loadOrders();
          }
        }
      })
      .catch(error => {
        showNotification('Ошибка: ' + error.message, 'error');
      });
  }
}

// Переключение между разделами
function showSection(sectionId) {  
  // Показываем запрошенный раздел
  const section = document.getElementById(sectionId);
  if (section) section.style.display = 'block';
  
  // Загружаем данные при необходимости
  if (sectionId === 'ordersSection') {
    loadOrders();
  } else if (sectionId === 'supportSection') {
    loadSupportTickets();
  }
}

window.openCreateTicketModal = openCreateTicketModal;
window.submitTicket = submitTicket;
window.viewOrderDetails = viewOrderDetails;
window.repeatOrder = repeatOrder;
window.cancelOrder = cancelOrder;
window.initUserPage = initUserPage;