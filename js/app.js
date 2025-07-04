// Инициализация состояния приложения
function initAppState() {
  if (!localStorage.getItem('futureAutoState')) {
    const initialState = {
      user: null, // По умолчанию пользователь не авторизован
      users: [], // Добавляем массив для хранения зарегистрированных пользователей
      cart: [],
      favorites: [],
      currentPage: 'index',
      currentCar: null,
      searchParams: {},
      services: [
        { id: 1, title: 'Тест-драйв', description: 'Попробуйте автомобиль перед покупкой' },
        { id: 2, title: 'Кредитование', description: 'Выгодные условия кредита' },
        { id: 3, title: 'Страхование', description: 'Полное страхование автомобиля' },
        { id: 4, title: 'Trade-in', description: 'Обмен вашего авто на новое' }
      ],
      contacts: {
        phone: '+7 (8422) 56-34-89',
        email: 'info@futureauto.com',
        address: 'г. Ульяновск, ул. Автомобильная, 42',
        schedule: 'Пн-Пт: 9:00-18:00'
      },
      // Добавляем поле для администраторов
      adminUsers: [
        { email: 'admin@futureauto.com', password: 'admin123' }
      ]
    };
    localStorage.setItem('futureAutoState', JSON.stringify(initialState));
  }
}

// Получение текущего состояния
function getAppState() {
  return JSON.parse(localStorage.getItem('futureAutoState'));
}

// Сохранение состояния
function saveAppState(state) {
  localStorage.setItem('futureAutoState', JSON.stringify(state));
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
  initAppState();
  initRouter();
  
  const { page, queryParams } = parseHash(window.location.hash);
  loadPage(page || 'index', queryParams);
  updateUI();
});

// Роутер
const pageResources = {
  'index': {
    styles: ['css/main.css'],
    scripts: ['js/main.js']
  },
  'catalog': {
    styles: ['css/catalog.css'],
    scripts: ['js/catalog.js']
  },
  'favorites': {
    styles: ['css/favorites.css'],
    scripts: ['js/favorites.js']
  },
  'contacts': {
    styles: ['css/contacts.css'],
    scripts: ['js/contacts.js']
  },
  'about': {
    styles: ['css/about.css'],
    scripts: ['js/about.js']
  },
  'admin': {
    styles: ['css/admin.css'],
    scripts: ['js/admin.js']
  },
  'car-page': {
    styles: ['css/car-page.css'],
    scripts: ['js/car-page.js']
  },
  'order': {
    styles: ['css/order.css'],
    scripts: ['js/order.js']
  },
  'registration': {
    styles: ['css/registration.css'],
    scripts: ['js/registration.js']
  },
  'services': {
    styles: ['css/services.css'],
    scripts: ['js/services.js']
  },
  'support': {
    styles: ['css/support.css'],
    scripts: ['js/support.js']
  },
  'termsprivacy': {
    styles: ['css/termsprivacy.css'],
    scripts: ['js/termsprivacy.js']
  },
  'user': {
    styles: ['css/user.css'],
    scripts: ['js/user.js']
  }
};

const pageInitializers = {
  'favorites': () => {
    if (typeof initFavoritesPage === 'function') {
      initFavoritesPage();
    }
  },
  'catalog': () => {
    if (typeof initCatalogPage === 'function') {
      initCatalogPage();
    }
  },
  'contacts': () => {
    if (typeof initContactsPage === 'function') {
      initContactsPage();
    }
  },
  'car-page': () => {
    if (typeof initCarPage === 'function') {
      initCarPage();
    }
  },
  'about': () => {
    if (typeof initAboutPage === 'function') {
      initAboutPage();
    }
  },
  'admin': () => {
    if (typeof initAdminPage === 'function') {
      initAdminPage();
    }
  },
  'order': () => {
    if (typeof initOrderPage === 'function') {
      initOrderPage();
    }
  },
  'registration': () => {
    if (typeof initRegistrationPage === 'function') {
      initRegistrationPage();
    }
  },
  'services': () => {
    if (typeof initServicesPage === 'function') {
      initServicesPage();
    }
  },
  'support': () => {
    if (typeof initSupportPage === 'function') {
      initSupportPage();
    }
  },
  'user': () => {
    if (typeof initUserPage === 'function') {
      initUserPage();
    }
  }
};

let currentPageStyles = [];
let currentPageScripts = [];

function parseHash(hash) {
  if (!hash || hash === '#') {
    return { page: 'index', queryParams: {} };
  }

  const str = hash.startsWith('#') ? hash.substring(1) : hash;
  const [path, queryString] = str.split('?');
  const queryParams = {};

  if (queryString) {
    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      queryParams[key] = value;
    });
  }

  return {
    page: path || 'index',
    queryParams
  };
}

function formatQueryString(params) {
  const keys = Object.keys(params);
  if (keys.length === 0) return '';
  return '?' + new URLSearchParams(params).toString();
}

function initRouter() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const hash = link.getAttribute('href');
      const { page, queryParams } = parseHash(hash);
      loadPage(page, queryParams);
    }
  });

  window.addEventListener('popstate', function() {
    const { page, queryParams } = parseHash(window.location.hash);
    loadPage(page, queryParams);
  });
}

// Загрузка страницы
async function loadPage(page, queryParams = {}) {
  const state = getAppState();
  state.currentPage = page;
  state.searchParams = queryParams;
  saveAppState(state);

  // Обновляем URL в браузере
  const hash = `#${page}${formatQueryString(queryParams)}`;
  if (window.location.hash !== hash) {
    window.history.pushState({}, '', hash);
  }

  showLoader();
  
  cleanupPageResources();

  setTimeout(async () => {
    try {
      const content = await getPageContent(page);
      document.getElementById('main-content').innerHTML = content;
      if (pageResources[page]) {
        await loadPageResources(pageResources[page]);
      }
      initPageScripts(page);
      updateUI();
    } catch (error) {
      console.error("Ошибка загрузки страницы:", error);
      document.getElementById('main-content').innerHTML = '<div class="error">Ошибка загрузки</div>';
    } finally {
      hideLoader();
    }
  }, 100);
}

function loadPageResources(resources) {
  return new Promise((resolve) => {
    const totalResources = [
      ...(resources.styles || []),
      ...(resources.scripts || [])
    ].length;
    
    let loadedCount = 0;
    
    if (totalResources === 0) {
      resolve();
      return;
    }
    
    // Загрузка стилей
    (resources.styles || []).forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resourceLoaded;
      document.head.appendChild(link);
      currentPageStyles.push(link);
    });
    
    // Загрузка скриптов
    (resources.scripts || []).forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.type = "module";
      script.onload = resourceLoaded;
      document.head.appendChild(script);
      currentPageScripts.push(script);
    });
    
    function resourceLoaded() {
      loadedCount++;
      if (loadedCount === totalResources) {
        resolve();
      }
    }
  });
}

function cleanupPageResources() {
  currentPageStyles.forEach(style => style.remove());
  currentPageScripts.forEach(script => script.remove());
  currentPageStyles = [];
  currentPageScripts = [];
}

// Получение содержимого страницы
async function getPageContent(page) {
  switch(page) {
    case 'index': return await fetch('partials/main.html').then(r => r.text());
    case 'catalog': return await fetch('partials/catalog.html').then(r => r.text());
    case 'favorites': return await fetch('partials/favorites.html').then(r => r.text());
    case 'car-page': return await fetch('partials/car-page.html').then(r => r.text());
    case 'services': return await fetch('partials/services.html').then(r => r.text());
    case 'contacts': return await fetch('partials/contacts.html').then(r => r.text());
    case 'registration': return await fetch('partials/registration.html').then(r => r.text());
    case 'admin': return await fetch('partials/admin.html').then(r => r.text());
    case 'user': return await fetch('partials/user.html').then(r => r.text());
    case 'about': return await fetch('partials/about.html').then(r => r.text());
    case 'footer': return await fetch('partials/footer.html').then(r => r.text());
    case 'header': return await fetch('partials/header.html').then(r => r.text());
    case 'main': return await fetch('partials/main.html').then(r => r.text());
    case 'order': return await fetch('partials/order.html').then(r => r.text());
    case 'support': return await fetch('partials/support.html').then(r => r.text());
    case 'termsprivacy': return await fetch('partials/termsprivacy.html').then(r => r.text());
  }
}

// Инициализация скриптов страницы
async function initPageScripts(page) {
  // Ждем 100мс чтобы скрипты успели выполниться
  await new Promise(resolve => setTimeout(resolve, 100));
  
  switch(page) {
    case 'about': 
      if (typeof initAboutPage === 'function') initAboutPage();
      break;

    case 'car-page': 
      if (typeof initCarPage === 'function') initCarPage();
      break;

    case 'catalog': 
      if (typeof initCatalogPage === 'function') initCatalogPage();
      break;

    case 'favorites': 
      if (typeof initFavoritesPage === 'function') initFavoritesPage();
      break;

    case 'footer': 
      if (typeof initFooterPage === 'function') initFooterPage();
      break;

    case 'header': 
      if (typeof initHeaderPage === 'function') initHeaderPage();
      break;

    case 'main': 
      if (typeof initMainPage === 'function') initMainPage();
      break;

    case 'admin': 
      if (typeof initAdminPage === 'function') initAdminPage();
      break;

    case 'contacts': 
      if (typeof initContactsPage === 'function') initContactsPage();
      break;

    case 'index': 
      if (typeof initIndexPage === 'function') initIndexPage();
      break;

    case 'order': 
      if (typeof initOrderPage === 'function') initOrderPage();
      break;

    case 'registration': 
      if (typeof initRegistrationPage === 'function') initRegistrationPage();
      break;

    case 'services': 
      if (typeof initServicesPage === 'function') initServicesPage();
      break;

    case 'support': 
      if (typeof initSupportPage === 'function') initSupportPage();
      break;

    case 'termsprivacy': 
      if (typeof initTermsPrivacyPage === 'function') initTermsPrivacyPage();
      break;

    case 'user': 
      if (typeof initUserPage === 'function') initUserPage();
      break;
  }
  
  // Вызываем универсальный инициализатор если он есть
  if (typeof window.initPage === 'function') {
    window.initPage();
  }
}

// Обновление интерфейса
function updateUI() {
  updateNavigation();
  updateHeaderCounters();
  updateAuthUI();
}

// Обновление навигации
function updateNavigation() {
  const state = getAppState();
  const currentPath = window.location.pathname;
  
  document.querySelectorAll('nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    const isActive = 
      linkPath === currentPath ||
      (linkPath === '/' && currentPath === '/index.html') ||
      (linkPath === '/index' && currentPath === '/') ||
      (linkPath + '.html') === currentPath;
      
    link.classList.toggle('active', isActive);
  });
}

// Добавление в избранное
async function addToFavorites(carId) {
  try {
    const response = await fetch('script.php?action=addToFavorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ carId })
    });
    
    const result = await response.json();
    if (result.success) {
      // Обновление UI
      const favIcon = document.getElementById('favorites-icon');
      favIcon.classList.add('bounce-animation');
      setTimeout(() => favIcon.classList.remove('bounce-animation'), 500);
      
      updateHeaderCounters();
      showNotification(`Автомобиль добавлен в избранное!`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Добавление в корзину
async function addToCart(carId) {
  try {
    const response = await fetch('script.php?action=addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ carId })
    });
    
    const result = await response.json();
    if (result.success) {
      // Обновление UI
      const cartIcon = document.getElementById('cart-icon');
      cartIcon.classList.add('bounce-animation');
      setTimeout(() => cartIcon.classList.remove('bounce-animation'), 500);
      
      updateHeaderCounters();
      showNotification(`Автомобиль добавлен в корзину!`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Модальные окна
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Уведомления
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, 10);
}

// Loader
function showLoader() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = '<div class="loader-spinner"></div>';
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) loader.remove();
}

function loadCarPage(carId) {
  const state = getAppState();
  state.currentCar = carId;
  saveAppState(state);
  loadPage('car-page');
}

// Переключение основного изображения
function changeMainImage(src) {
  const mainImage = document.getElementById('mainCarImage');
  if (mainImage) {
    mainImage.src = src;
  }
}

// Функция для обработки поискового запроса
window.performSearch = function() {
  const brand = document.getElementById('brandButton')?.textContent || '';
  const model = document.getElementById('modelButton')?.textContent || '';
  const price = document.querySelector('.price-input')?.value || '';
  
  const params = new URLSearchParams();
  if (brand && brand !== 'Любые марки') params.set('brand', brand);
  if (model && model !== 'Любые модели') params.set('model', model);
  if (price) params.set('maxPrice', price);
  
  // Сохраняем параметры поиска в состоянии приложения
  const state = getAppState();
  state.searchParams = {
    brand,
    model,
    maxPrice: price
  };
  saveAppState(state);
  
  loadPage('catalog');
};

// Экспорт функций в глобальную область видимости
window.getAppState = getAppState;
window.addToCart = addToCart;
window.addToFavorites = addToFavorites;
window.showNotification = showNotification;
window.loadCarPage = loadCarPage;
window.openLoginModal = openLoginModal;
window.closeModal = closeModal;
window.performSearch = window.performSearch;
window.changeMainImage = changeMainImage;
window.loadPage = loadPage;