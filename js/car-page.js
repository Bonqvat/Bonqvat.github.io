let cars = [];
let carData = [];

async function initCarPage() {
  if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
    localStorage.setItem('futureAutoState', JSON.stringify({
      user: null,
      cart: [],
      currentCarId: [],
      currentCar: null
    }));
  }

  await loadCarsFromDB();

  const state = JSON.parse(localStorage.getItem('futureAutoState'));
  const carId = state?.currentCarId;
  
  if (carId) {
    const car = cars.find(c => c.id === carId);
    if (car) {
      renderCar(car);
      window.currentCar = car;

      document.querySelector('.cart-btn')?.addEventListener('click', () => addToCart(carId));
      document.querySelector('.favorite-btn')?.addEventListener('click', () => addToFavorites(carId));
      document.querySelector('.order-btn')?.addEventListener('click', () => {
        const selectedCar = {
          id: car.id,
          brand: car.brand,
          model: car.model,
          price: car.price,
          image: car.images[Object.keys(car.images)[0]] || 'images/no-image.jpg'
        };
        
        localStorage.setItem('selectedProduct', JSON.stringify(selectedCar));
        window.location.hash = '#order';
      });
      document.querySelector('.test-drive-btn')?.addEventListener('click', () => submitTicketTestDrive(car));
    } else {
      showError('Автомобиль не найден');
    }
  } else {
    showError('Не выбран автомобиль для просмотра');
  }
}

function submitTicketTestDrive(car) {
  const state = JSON.parse(localStorage.getItem('futureAutoState'));
  if (!state || !state.user) {
    showNotification('Ошибка: пользователь не авторизован', 'error');
    return;
  }

  const subject = 'Запись на тест-драйв';
  const message = `${car.brand} ${car.model} ${car.description}`;
  const user = state.user;
  const ticketData = {
    name: user.name || 'Не указано',
    email: user.email || '',
    phone: user.phone || '',
    subject,
    message,
    type: 'test-drive'
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
      showNotification('Вы успешно записаны на тест-драйв! С вами свяжется менеджер для подтверждения.');
    }
  })
  .catch(error => {
    showNotification('Ошибка: ' + error.message, 'error');
  });
}

async function loadCarsFromDB() {
  try {
    const response = await fetch('script.php?action=getCars');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      cars = data.map(car => ({
        ...car,
        features: car.features ? JSON.parse(car.features) : [],
        specs: car.specs ? JSON.parse(car.specs) : [],
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

function showError(message) {
  const container = document.querySelector('.container');
  container.innerHTML = `<div class="error">${message}</div>`;
}

function renderCar(car) {
  document.getElementById('car-title').textContent = `${car.brand} ${car.model}`;
  document.getElementById('car-price').textContent = `${car.price.toLocaleString('ru-RU')}₽`;
  document.getElementById('car-description').textContent = car.description;
  
  const img = document.getElementById('mainImage');
  img.src = car.images[Object.keys(car.images)[0]];
  img.alt = `${car.brand} ${car.model}`;
  img.onerror = function() {
    this.src = 'images/no-image.jpg';
    this.classList.add('placeholder-image');
  };
  
  const colorsContainer = document.getElementById('colors-container');
  colorsContainer.innerHTML = '';
  
  Object.entries(car.images).forEach(([colorName, imageUrl], index) => {
    const colorDiv = document.createElement('div');
    colorDiv.className = `color ${index === 0 ? 'active' : ''}`;
    colorDiv.style.background = colorName;
    colorDiv.onclick = (e) => {
      changeColor(imageUrl, e);
    };
    colorsContainer.appendChild(colorDiv);
  });

  function generateTableRows(items, isMain = false) {
    return items.map(item => 
      `<tr><td>${item.name || item.value}</td><td>${isMain && items.indexOf(item) === 0 ? item.value + ' л.с.' : item.value}</td></tr>`
    ).join('');
  }

  document.getElementById('specs-main').innerHTML = generateTableRows(car.specs.main, true);
  document.getElementById('specs-engine').innerHTML = generateTableRows(car.specs.engine);
  document.getElementById('specs-general').innerHTML = generateTableRows(car.specs.general);

  const titleContainer = document.getElementById('car-title').parentNode;
  const statusElement = document.createElement('div');
  statusElement.className = 'car-status';
  statusElement.textContent = car.status;
  titleContainer.insertBefore(
    statusElement, 
    document.getElementById('car-price')
  );
}

function changeColor(imageUrl, event) {
  document.getElementById('mainImage').src = imageUrl;
  
  const colors = document.querySelectorAll('.color');
  colors.forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
}

function showTestDriveModal() {
  document.getElementById('testDriveModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};

window.initCarPage = initCarPage;
window.changeColor = changeColor;