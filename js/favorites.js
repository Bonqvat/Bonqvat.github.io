  const products = {
    1: {
      id: "1",
      name: "Toyota Camry",
      price: 2450000,
      image: "images/camry.jpg",
      engine: "2.5 (181 л.с.)",
      transmission: "Автомат / Бензин",
      condition: "Новый",
      brand: "Toyota"
    },
    2: {
      id: "2",
      name: "BMW X5",
      price: 6890000,
      image: "images/x5.jpg",
      engine: "3.0 (249 л.с.)",
      transmission: "Автомат / Бензин",
      condition: "Новый",
      brand: "BMW"
    },
    3: {
      id: "3",
      name: "Audi A6",
      price: 4120000,
      image: "images/a6.jpg",
      engine: "2.0 (190 л.с.)",
      transmission: "Автомат / Бензин",
      condition: "Новый",
      brand: "Audi"
    },
    4: {
      id: "4",
      name: "Skoda Superb",
      price: 2950000,
      image: "images/superb.jpg",
      engine: "2.0 (190 л.с.)",
      transmission: "Автомат / Бензин",
      condition: "Новый",
      brand: "Skoda"
    },
    5: {
      id: "5",
      name: "Hyundai Tucson",
      price: 2850000,
      image: "images/tucson.jpg",
      engine: "2.5 (180 л.с.)",
      transmission: "Автомат / Бензин",
      condition: "Новый",
      brand: "Hyundai"
    }
  };

  // Состояние приложения
  const state = {
    cart: [],
    favorites: []
  };

function initFavoritesPage() {
  // Загружаем состояние из localStorage
  const savedState = localStorage.getItem('futureAutoState');
  if (savedState) {
    const stateObj = JSON.parse(savedState);
    
    // Проверка авторизации
    if (!stateObj.user) {
      alert('Пожалуйста, войдите в систему');
      loadPage('index'); // Используем нашу функцию роутера
      return;
    }
    
    // Загружаем состояние
    state.cart = stateObj.cart || [];
    state.favorites = stateObj.favorites || [];
  }
  
  renderCart();
  renderFavorites();
  updateHeaderCounters();
  
  // Назначаем обработчики
  document.getElementById('checkout-btn')?.addEventListener('click', checkoutAll);
}

  // Инициализация приложения
  document.addEventListener('DOMContentLoaded', function() {
    // Загружаем состояние из localStorage
    const savedState = localStorage.getItem('futureAutoState');
    if (savedState) {
      const stateObj = JSON.parse(savedState);
      
      // Проверка авторизации
      if (!stateObj.user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = '#index';
        return;
      }
      
      // Загружаем состояние
      state.cart = stateObj.cart || [];
      state.favorites = stateObj.favorites || [];
    }
    
    renderCart();
    renderFavorites();
    updateHeaderCounters();
  });

  // Рендер корзины
  function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-message">Ваша корзина пуста</div>';
      cartSummary.style.display = 'none';
    } else {
      cartItemsContainer.innerHTML = '';
      state.cart.forEach(itemId => {
        const product = products[itemId];
        if (product) {
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
              <h3>${product.name}</h3>
              <p>${product.engine} • ${product.transmission}</p>
              <p class="price">${formatPrice(product.price)}</p>
            </div>
            <div class="item-actions">
              <button class="btn btn-outline" onclick="removeFromCart('${product.id}')">
                <i class="fas fa-trash"></i> Удалить
              </button>
            </div>
          `;
          cartItemsContainer.appendChild(itemElement);
        }
      });
      
      // Обновляем итоговую сумму
      const subtotal = state.cart.reduce((sum, itemId) => sum + (products[itemId]?.price || 0), 0);
      document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
      document.getElementById('cart-total').textContent = formatPrice(subtotal);
      cartSummary.style.display = 'block';
    }
    
    document.getElementById('cart-count').textContent = state.cart.length;
  }

  // Рендер избранного
  function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites-items');
    
    if (state.favorites.length === 0) {
      favoritesContainer.innerHTML = '<div class="empty-message">У вас пока нет избранных товаров</div>';
    } else {
      favoritesContainer.innerHTML = '';
      state.favorites.forEach(itemId => {
        const product = products[itemId];
        if (product) {
          const itemElement = document.createElement('div');
          itemElement.className = 'fav-item';
          itemElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
              <h3>${product.name}</h3>
              <p>${product.engine} • ${product.transmission}</p>
              <p class="price">${formatPrice(product.price)}</p>
            </div>
            <div class="item-actions">
              <button class="btn btn-primary" onclick="addToCart('${product.id}')">
                <i class="fas fa-shopping-cart"></i> В корзину
              </button>
              <button class="btn btn-outline" onclick="removeFromFavorites('${product.id}')">
                <i class="fas fa-trash"></i> Удалить
              </button>
            </div>
          `;
          favoritesContainer.appendChild(itemElement);
        }
      });
    }
    
    document.getElementById('favorites-count').textContent = state.favorites.length;
  }

  // Экспортируем функции, которые используются в HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.checkoutAll = checkoutAll;

  // Обновление счетчиков в шапке
  function updateHeaderCounters() {
    const cartIcon = document.querySelector('.icons .fa-shopping-cart');
    const favIcon = document.querySelector('.icons .fa-star');
    
    if (cartIcon) {
      if (state.cart.length > 0) {
        cartIcon.setAttribute('data-count', state.cart.length);
      } else {
        cartIcon.removeAttribute('data-count');
      }
    }
    
    if (favIcon) {
      if (state.favorites.length > 0) {
        favIcon.setAttribute('data-count', state.favorites.length);
      } else {
        favIcon.removeAttribute('data-count');
      }
    }
  }

  // Форматирование цены
  function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      maximumFractionDigits: 0 
    }).format(price);
  }

  // Добавление в корзину
  function addToCart(productId) {
    if (!state.cart.includes(productId)) {
      state.cart.push(productId);
      saveState();
      renderCart();
      updateHeaderCounters();
      showNotification(`${products[productId].name} добавлен в корзину`);
    }
  }

  // Удаление из корзины
  function removeFromCart(productId) {
    state.cart = state.cart.filter(id => id !== productId);
    saveState();
    renderCart();
    updateHeaderCounters();
    showNotification(`${products[productId].name} удален из корзины`);
  }

  // Оформление всех товаров
  function checkoutAll() {
    if (state.cart.length === 0) {
      showNotification('Корзина пуста');
      return;
    }
    
    // Сохраняем все товары для оформления
    const cartProducts = state.cart.map(id => products[id]);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    
    // Переходим на страницу оформления заказа
    window.location.href = '#order';
    
    // Очищаем корзину после оформления
    state.cart = [];
    saveState();
  }

  // Добавление в избранное
  function addToFavorites(productId) {
    if (!state.favorites.includes(productId)) {
      state.favorites.push(productId);
      saveState();
      renderFavorites();
      updateHeaderCounters();
      showNotification(`${products[productId].name} добавлен в избранное`);
    }
  }

  // Удаление из избранного
  function removeFromFavorites(productId) {
    state.favorites = state.favorites.filter(id => id !== productId);
    saveState();
    renderFavorites();
    updateHeaderCounters();
    showNotification(`${products[productId].name} удален из избранного`);
  }

  // Сохранение состояния
  function saveState() {
    // Получаем текущее состояние
    const appState = JSON.parse(localStorage.getItem('futureAutoState')) || {};
    
    // Обновляем только корзину и избранное
    appState.cart = state.cart;
    appState.favorites = state.favorites;
    
    // Сохраняем обратно
    localStorage.setItem('futureAutoState', JSON.stringify(appState));
  }

  // Показать уведомление
  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  window.initFavoritesPage = initFavoritesPage;