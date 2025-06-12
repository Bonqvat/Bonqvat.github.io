// Инициализация состояния приложения
function initCarPage() {
    if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
    localStorage.setItem('futureAutoState', JSON.stringify({
        user: null,
        cart: [],
        favorites: [],
        currentCarId: null
    }));
    }

    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    const carId = state?.currentCarId;
    
    if (carId) {
      const car = carsData.find(c => c.id === carId);
      
      if (car) {
        renderCar(car);
      } else {
        showError('Автомобиль не найден');
      }
    } else {
      showError('Не выбран автомобиль для просмотра');
    }

    // Обработчики форм
    document.getElementById('orderForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Ваш заказ успешно оформлен! С вами свяжется менеджер для подтверждения.');
      closeModal('orderModal');
    });

    document.getElementById('testDriveForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Вы успешно записаны на тест-драйв! С вами свяжется менеджер для подтверждения.');
      closeModal('testDriveModal');
    });
}

const carsData = [
    {
      id: 1,
      brand: 'Toyota',
      model: 'Camry',
      year: 2024,
      bodyType: 'sedan',
      drive: 'front',
      power: 181,
      price: 2450000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      description: '2.5 (181 л.с.), автомат, передний привод',
      features: ['Автомат', 'Климат-контроль', 'Кожаный салон'],
      status: 'Новый'
    },
    {
      id: 2,
      brand: 'Audi',
      model: 'A6',
      year: 2023,
      bodyType: 'sedan',
      drive: 'full',
      power: 245,
      price: 4120000,
      image: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/',
      description: '2.0 TFSI (245 л.с.), автомат, полный привод',
      features: ['Автомат', 'Полный привод', 'Парктроник'],
      status: 'Новый'
    },
    {
      id: 3,
      brand: 'BMW',
      model: 'X5',
      year: 2025,
      bodyType: 'suv',
      drive: 'full',
      power: 340,
      price: 6890000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2021936/a4e06ec3ec1f96d539a96eb1c9f9b1c3/',
      description: '3.0 (340 л.с.), автомат, полный привод',
      features: ['Автомат', 'Полный привод', 'Панорамная крыша'],
      status: 'Новый'
    },
    {
      id: 4,
      brand: 'Skoda',
      model: 'Superb',
      year: 2024,
      bodyType: 'hatchback',
      drive: 'front',
      power: 190,
      price: 2950000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      description: '2.0 TSI (190 л.с.), автомат, передний привод',
      features: ['Автомат', 'Климат-контроль', 'Круиз-контроль'],
      status: 'Новый'
    },
    {
      id: 5,
      brand: 'Toyota',
      model: 'RAV4',
      year: 2023,
      bodyType: 'crossover',
      drive: 'full',
      power: 194,
      price: 3200000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      description: '2.5 (194 л.с.), автомат, полный привод',
      features: ['Автомат', 'Полный привод', 'Камера заднего вида'],
      status: 'Новый'
    },
    {
      id: 6,
      brand: 'Audi',
      model: 'Q5',
      year: 2024,
      bodyType: 'suv',
      drive: 'full',
      power: 265,
      price: 4850000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      description: '2.0 TFSI (265 л.с.), автомат, полный привод',
      features: ['Автомат', 'Полный привод', 'Кожаный салон'],
      status: 'Новый'
    },
    {
      id: 7,
      brand: 'BMW',
      model: '3 Series',
      year: 2024,
      bodyType: 'sedan',
      drive: 'rear',
      power: 184,
      price: 3750000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      description: '2.0 (184 л.с.), автомат, задний привод',
      features: ['Автомат', 'Задний привод', 'Спортивный пакет'],
      status: 'Новый'
    },
    {
      id: 8,
      brand: 'Skoda',
      model: 'Octavia',
      year: 2024,
      bodyType: 'hatchback',
      drive: 'front',
      power: 150,
      price: 2200000,
      image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      description: '1.4 TSI (150 л.с.), автомат, передний привод',
      features: ['Автомат', 'Климат-контроль', 'Мультимедия'],
      status: 'Новый'
    }
  ];

  // Вспомогательные функции для перевода значений
  function getBodyType(type) {
    const types = {
      'sedan': 'Седан',
      'hatchback': 'Хэтчбэк',
      'suv': 'Кроссовер',
      'crossover': 'Внедорожник',
      'coupe': 'Купе'
    };
    return types[type] || type;
  }

  function getDriveType(type) {
    const types = {
      'front': 'Передний',
      'rear': 'Задний',
      'full': 'Полный'
    };
    return types[type] || type;
  }

  // Генерация характеристик для автомобиля
  function generateCarDetails(car) {
    // Генерация объема двигателя на основе мощности
    const engineVolume = (car.power / 90).toFixed(1) + ' л';
    
    // Генерация разгона 0-100 км/ч
    const acceleration = (10 - car.power / 50).toFixed(1) + ' с';
    
    // Генерация расхода топлива
    const fuelConsumption = (car.power / 35).toFixed(1) + ' л / 100 км';
    
    // Определение страны производителя
    const countryMap = {
      'Toyota': 'Япония',
      'Audi': 'Германия',
      'BMW': 'Германия',
      'Skoda': 'Чехия'
    };
    const country = countryMap[car.brand] || 'Китай';
    
    // Определение количества дверей
    const doors = car.bodyType === 'sedan' ? '4' : '5';
    
    return {
      engineVolume,
      acceleration,
      fuelConsumption,
      country,
      doors,
      torque: (car.power * 1.7).toFixed(0) + ' Нм'
    };
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных автомобиля
    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    const carId = state?.currentCarId;
    
    if (carId) {
      const car = carsData.find(c => c.id === carId);
      
      if (car) {
        renderCar(car);
      } else {
        showError('Автомобиль не найден');
      }
    } else {
      showError('Не выбран автомобиль для просмотра');
    }

    // Обработчики форм
    document.getElementById('orderForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Ваш заказ успешно оформлен! С вами свяжется менеджер для подтверждения.');
      closeModal('orderModal');
    });

    document.getElementById('testDriveForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Вы успешно записаны на тест-драйв! С вами свяжется менеджер для подтверждения.');
      closeModal('testDriveModal');
    });
  });
  
  function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `<div class="error">${message}</div>`;
  }

  // Функция отображения данных автомобиля
  function renderCar(car) {
    // Генерация дополнительных характеристик
    const details = generateCarDetails(car);
    
    // Обновляем данные на странице
    document.getElementById('car-title').textContent = `${car.brand} ${car.model}`;
    document.getElementById('car-price').textContent = `${car.price.toLocaleString('ru-RU')}₽`;
    document.getElementById('car-description').textContent = car.description;
    
    // Устанавливаем изображение автомобиля (с заглушкой при ошибке)
    const img = document.getElementById('mainImage');
    img.src = car.image;
    img.alt = `${car.brand} ${car.model}`;
    img.onerror = function() {
      // Если изображение не загрузилось, используем заглушку
      const carIndex = car.id % 8; // Получаем число от 0 до 7
      this.src = `images/image${carIndex}.png`;
    };
    
    // Обновляем характеристики
    document.getElementById('specs-main').innerHTML = `
      <tr><td>Мощность двигателя</td><td>${car.power} л.с.</td></tr>
      <tr><td>Объем двигателя</td><td>${details.engineVolume}</td></tr>
      <tr><td>Разгон 0-100 км/ч</td><td>${details.acceleration}</td></tr>
      <tr><td>Расход топлива</td><td>${details.fuelConsumption}</td></tr>
      <tr><td>Привод</td><td>${getDriveType(car.drive)}</td></tr>
    `;
    
    document.getElementById('specs-engine').innerHTML = `
      <tr><td>Рабочий объем</td><td>${details.engineVolume}</td></tr>
      <tr><td>Тип двигателя</td><td>Бензиновый</td></tr>
      <tr><td>Конфигурация</td><td>Рядный</td></tr>
      <tr><td>Обороты макс.</td><td>6500 об/мин</td></tr>
      <tr><td>Крутящий момент</td><td>${details.torque}</td></tr>
    `;
    
    document.getElementById('specs-general').innerHTML = `
      <tr><td>Страна</td><td>${details.country}</td></tr>
      <tr><td>Год</td><td>${car.year}</td></tr>
      <tr><td>Кузов</td><td>${getBodyType(car.bodyType)}</td></tr>
      <tr><td>Комплектация</td><td>Flagship Sport</td></tr>
      <tr><td>Количество дверей</td><td>${details.doors}</td></tr>
    `;
  }

  // Функция смены цвета автомобиля
  function changeColor(color, imageUrl) {
    document.getElementById('mainImage').src = imageUrl;
    
    // Обновление активного цвета
    const colors = document.querySelectorAll('.color');
    colors.forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
  }

  // Функция добавления в корзину
  function addToCart() {
    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    const carId = state?.currentCarId;
    
    if (carId) {
      const car = carsData.find(c => c.id === carId);
      if (car) {
        // Обновление состояния корзины
        const existingItem = state.cart.find(item => item.id === carId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.cart.push({
            id: car.id,
            brand: car.brand,
            model: car.model,
            price: car.price,
            quantity: 1
          });
        }
        
        localStorage.setItem('futureAutoState', JSON.stringify(state));
        updateHeaderCounters(); // Обновляем счетчики
        alert(`Автомобиль ${car.brand} ${car.model} добавлен в корзину!`);
        return;
      }
    }
    alert('Ошибка: автомобиль не выбран');
  }

  // Функция добавления в избранное
  function addToFavorites() {
    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    const carId = state?.currentCarId;
    
    if (carId) {
      const car = carsData.find(c => c.id === carId);
      if (car) {
        // Обновляем состояние
        if (!state.favorites.includes(carId)) {
          state.favorites.push(carId);
          localStorage.setItem('futureAutoState', JSON.stringify(state));
          
          // Обновляем счетчики
          updateHeaderCounters();
          alert(`Автомобиль ${car.brand} ${car.model} добавлен в избранное!`);
        } else {
          alert('Этот автомобиль уже в избранном');
        }
        return;
      }
    }
    alert('Ошибка: автомобиль не выбран');
  }

  function showOrderModal() {
    document.getElementById('orderModal').style.display = 'block';
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