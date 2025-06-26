let cars = [];
let carData = [];

const state = {
  cart: [],
  favorites: []
};

async function initFavoritesPage() {
  try {
    // Загрузка данных с сервера
    const favResponse = await fetch('script.php?action=getFavorites');
    const favData = await favResponse.json();
    
    const cartResponse = await fetch('script.php?action=getCart');
    const cartData = await cartResponse.json();
    
    state.favorites = favData.map(car => car.id);
    state.cart = cartData.map(car => car.id);

    await loadCarsFromDB();
    
    renderFavorites();
    renderCart();
    updateHeaderCounters();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

async function loadCarsFromDB() {
  try {
    const response = await fetch('script.php?action=getCars');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      cars = data.map(car => ({
        ...car,
        features: car.features ? JSON.parse(car.features) : [],
        images: car.images ? JSON.parse(car.images) : [],
        power: parseInt(car.power) || 0
      }));
      
      carData = cars.map(car => `${car.brand} ${car.model}`);
    } else {
      console.error('Invalid data format:', data);
    }
  } catch (error) {
    console.error('Error loading cars:', error);
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartItemsContainer || !cartSummary) return;
  
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-message">Ваша корзина пуста</div>';
    cartSummary.style.display = 'none';
  } else {
    cartItemsContainer.innerHTML = '';
    state.cart.forEach(carId => {
      const car = cars.find(c => c.id == carId);
      if (!car) return;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      let imageUrl = 'images/no-image.jpg';
      const colorKeys = Object.keys(car.images);
      if (colorKeys.length > 0) {
          imageUrl = car.images[colorKeys[0]]; 
      }
      itemElement.innerHTML = `
        <img src="${imageUrl}" alt="${car.brand} ${car.model}">
        <div class="item-details">
          <h3>${car.brand} ${car.model}</h3>
          <p>${car.description}</p>
          <p class="price">${formatPrice(car.price)}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary" onclick="checkoutOne(${car.id})">
            <i class="fas fa-shopping-bag"></i> Заказать
          </button>
          <button class="btn btn-outline" onclick="removeFromCart(${car.id})">
            <i class="fas fa-trash"></i> Удалить
          </button>
        </div>
      `;
      const imgElement = itemElement.querySelector('img');
      imgElement.onerror = function() {
          this.src = 'images/no-image.jpg';
          this.onerror = null;
      };
      cartItemsContainer.appendChild(itemElement);
    });
    
    // Обновление итоговой суммы
    const subtotal = state.cart.reduce((sum, carId) => {
      const car = cars.find(c => c.id == carId);
      return sum + (car ? car.price : 0);
    }, 0);
    
    // Новый дизайн блока итогов
    cartSummary.innerHTML = `
      <div class="summary-card">
        <div class="summary-header">
          <h3>Ваша корзина</h3>
          <span class="badge">${state.cart.length} товара</span>
        </div>
        
        <div class="summary-row">
          <span>Подытог:</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        
        <div class="summary-row total">
          <span>Итого:</span>
          <span class="total-price">${formatPrice(subtotal)}</span>
        </div>
        
        <div class="summary-footer">
          <p><i class="fas fa-info-circle"></i> Доставка рассчитывается на следующем шаге</p>
        </div>
      </div>
    `;
    
    cartSummary.style.display = 'block';
  }
  
  // Обновление счетчика в шапке
  document.getElementById('cart-count').textContent = state.cart.length;
}

function renderFavorites() {
  const favoritesContainer = document.getElementById('favorites-items');
  if (!favoritesContainer) return;
  
  if (state.favorites.length === 0) {
    favoritesContainer.innerHTML = '<div class="empty-message">У вас пока нет избранных товаров</div>';
  } else {
    favoritesContainer.innerHTML = '';
    state.favorites.forEach(carId => {
      const car = cars.find(c => c.id == carId);
      if (!car) return;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'fav-item';
      let imageUrl = 'images/no-image.jpg';
      const colorKeys = Object.keys(car.images);
      if (colorKeys.length > 0) {
          imageUrl = car.images[colorKeys[0]]; 
      }
      itemElement.innerHTML = `
        <img src="${imageUrl}" alt="${car.brand} ${car.model}">
        <div class="item-details">
          <h3>${car.brand} ${car.model}</h3>
          <p>${car.description}</p>
          <p class="price">${formatPrice(car.price)}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary" onclick="addToCart(${car.id})">
            <i class="fas fa-shopping-cart"></i> В корзину
          </button>
          <button class="btn btn-outline" onclick="removeFromFavorites(${car.id})">
            <i class="fas fa-trash"></i> Удалить
          </button>
        </div>
      `;
      const imgElement = itemElement.querySelector('img');
      imgElement.onerror = function() {
          this.src = 'images/no-image.jpg';
          this.onerror = null;
      };
      favoritesContainer.appendChild(itemElement);
    });
  }
  document.getElementById('favorites-count').textContent = state.favorites.length;
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB',
    maximumFractionDigits: 0 
  }).format(price);
}

async function addToCart(productId) {
  try {
    const response = await fetch('script.php?action=addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ carId: productId })
    });
    
    const result = await response.json();
    if (result.success) {
      // Обновляем локальное состояние
      if (!state.cart.includes(productId)) {
        state.cart.push(productId);
        // Сохраняем в localStorage
        const stateObj = JSON.parse(localStorage.getItem('futureAutoState')) || {};
        stateObj.cart = state.cart;
        localStorage.setItem('futureAutoState', JSON.stringify(stateObj));
      }
      
      // Обновляем UI
      showNotification(`Товар добавлен в корзину`);
      updateHeaderCounters();
      renderCart();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function removeFromCart(productId) {
  try {
    const response = await fetch('script.php?action=removeFromCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ carId: productId })
    });
    
    const result = await response.json();
    if (result.success) {
      // Обновляем локальное состояние
      state.cart = state.cart.filter(id => id !== productId);
      // Сохраняем в localStorage
      const stateObj = JSON.parse(localStorage.getItem('futureAutoState')) || {};
      stateObj.cart = state.cart;
      localStorage.setItem('futureAutoState', JSON.stringify(stateObj));
      
      // Обновляем UI
      renderCart();
      updateHeaderCounters();
      showNotification(`Товар удален из корзины`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function removeFromFavorites(productId) {
  try {
    const response = await fetch('script.php?action=removeFromFavorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ carId: productId })
    });
    
    const result = await response.json();
    if (result.success) {
      // Обновляем локальное состояние
      state.favorites = state.favorites.filter(id => id !== productId);
      // Сохраняем в localStorage
      const stateObj = JSON.parse(localStorage.getItem('futureAutoState')) || {};
      stateObj.favorites = state.favorites;
      localStorage.setItem('futureAutoState', JSON.stringify(stateObj));
      
      // Обновляем UI
      renderFavorites();
      updateHeaderCounters();
      showNotification(`Товар удален из избранного`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function saveState() {
  const appState = JSON.parse(localStorage.getItem('futureAutoState')) || {};
  appState.cart = state.cart;
  appState.favorites = state.favorites;
  localStorage.setItem('futureAutoState', JSON.stringify(appState));
}

// Функция для оформления одного товара
async function checkoutOne(productId) {
  try {
    // Сохраняем выбранный автомобиль
    const car = cars.find(c => c.id == productId);
    if (car) {
      localStorage.setItem('selectedProduct', JSON.stringify({
        brand: car.brand,
        model: car.model,
        price: car.price,
        id: car.id
      }));
    }
    
    // Очищаем корзину
    const currentCart = [...state.cart];
    for (const id of currentCart) {
      await removeFromCart(id);
    }
    
    // Добавляем выбранный товар обратно
    await addToCart(productId);
    
    // Переходим на страницу оформления заказа
    window.location.hash = '#order';
  } catch (error) {
    console.error('Error during single product checkout:', error);
    showNotification('Ошибка при оформлении заказа');
  }
}

window.initFavoritesPage = initFavoritesPage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.removeFromFavorites = removeFromFavorites;
window.checkoutOne = checkoutOne;