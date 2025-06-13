const recommendedCars = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    price: '2 450 000',
    image: 'https://gaztormoz.ru/_next/image?url=https%3A%2F%2Fstatic.gaztormoz.ru%2Fchina%2FModels%2FImages%2F1714470011720.jpeg&w=2048&q=75/1200x900n'
  },
  {
    id: 2,
    brand: 'BMW',
    model: 'X5',
    price: '6 890 000',
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2021936/a4e06ec3ec1f96d539a96eb1c9f9b1c3/1200x900n'
  },
  {
    id: 3,
    brand: 'Audi',
    model: 'A6',
    price: '4 120 000',
    image: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/1200x900n'
  },
  {
    id: 4,
    brand: 'Skoda',
    model: 'Superb',
    price: '2 950 000',
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2177055/e49e3cbe7278978151aa5a83e7f1b8e0/1200x900'
  }
];

const modelsByBrand = {
  "BMW": ["X5", "X3", "3 Series", "5 Series", "7 Series"],
  "Audi": ["A4", "A6", "Q5", "Q7"],
  "Mercedes": ["C-Class", "E-Class", "GLC", "GLE"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander"],
  "Honda": ["Civic", "Accord", "CR-V", "HR-V"],
  "Ford": ["Focus", "Mustang", "Explorer", "F-150"],
  "Chevrolet": ["Malibu", "Tahoe", "Camaro"],
  "Volkswagen": ["Golf", "Passat", "Tiguan"],
  "Nissan": ["Altima", "Sentra", "Rogue"],
  "Hyundai": ["Elantra", "Tucson", "Santa Fe"],
  "Kia": ["Sportage", "Sorento", "Optima"],
  "Peugeot": ["208", "308", "3008"],
  "Renault": ["Clio", "Megane", "Koleos"],
  "Skoda": ["Octavia", "Superb", "Kodiaq"],
  "Mazda": ["Mazda3", "CX-5", "MX-5"],
  "Subaru": ["Impreza", "Forester", "Outback"],
  "Volvo": ["XC40", "XC60", "XC90"],
  "Land Rover": ["Range Rover", "Discovery"],
  "Jaguar": ["F-Type", "XF"],
  "Lexus": ["RX", "NX", "IS"],
  "Porsche": ["911", "Cayenne", "Panamera"],
  "Ferrari": ["488", "F8", "Roma"],
  "Lamborghini": ["Huracan", "Urus", "Aventador"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Jeep": ["Wrangler", "Cherokee", "Grand Cherokee"],
  "Dodge": ["Charger", "Challenger", "Durango"],
  "Chrysler": ["300", "Pacifica"],
  "Suzuki": ["Swift", "Vitara", "Jimny"],
  "Mitsubishi": ["Outlander", "Lancer"],
  "Opel": ["Astra", "Insignia"],
  "Mini": ["Cooper", "Countryman"],
  "Alfa Romeo": ["Giulia", "Stelvio"],
  "Citroen": ["C3", "C5 Aircross"],
  "FIAT": ["500", "Panda"],
  "Genesis": ["G70", "G80"],
  "Geely": ["Atlas", "Coolray"],
  "Great Wall": ["Haval H6"],
  "BYD": ["Han", "Tang"],
  "Chery": ["Tiggo 7", "Arrizo 5"],
  "MG": ["ZS", "HS"],
  "SSANGYONG": ["Korando", "Tivoli"],
  "Isuzu": ["D-Max", "MU-X"],
  "MAZ": ["MAZ-5440"],
  "Lada": ["Granta", "Vesta", "Xray", "Niva"]
};

function initIndexPage() {
  populateBrandList();
  loadRecommendedCars();
  setupEventListeners();
}

function populateBrandList() {
  const brandList = document.getElementById('brandList');
  brandList.innerHTML = '';
  
  Object.keys(modelsByBrand).forEach(brand => {
    const p = document.createElement('p');
    p.textContent = brand;
    p.addEventListener('click', () => selectBrand(brand));
    brandList.appendChild(p);
  });
}

// Загрузка рекомендуемых автомобилей
function loadRecommendedCars() {
  const container = document.getElementById('recommendedCars');
  container.innerHTML = '';
  
  recommendedCars.forEach(car => {
    const carElement = document.createElement('div');
    carElement.className = 'recommended-car';
    carElement.innerHTML = `
      <img src="${car.image}" alt="${car.brand} ${car.model}">
      <h3>${car.brand} ${car.model}</h3>
      <p>${car.price} ₽</p>
      <button class="btn add-to-cart" data-id="${car.id}" style="padding: 8px 15px; font-size: 14px;">В корзину</button>
    `;
    container.appendChild(carElement);
  });
}

function setupEventListeners() {
  // Фильтры
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      setFilter(this);
    });
  });
  
  // Кнопка поиска
  document.getElementById('searchButton').addEventListener('click', performSearch);
  
  // Кнопки типов автомобилей
  document.querySelectorAll('.car-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      navigateToCatalog(this.dataset.type);
    });
  });
  
  // Кнопки "В корзину"
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      addToCart(parseInt(e.target.dataset.id));
    }
  });
}

// Добавление в корзину
function addToCart(carId) {
  const car = recommendedCars.find(c => c.id === carId);
  if (car) {
    alert(`Автомобиль ${car.brand} ${car.model} добавлен в корзину!`);
    // Здесь можно добавить логику для реального добавления в корзину
  }
}

// Поиск автомобилей
function performSearch() {
  const brand = document.getElementById('brandButton').textContent;
  const model = document.getElementById('modelButton').textContent;
  const price = document.querySelector('.price-input').value;
  
  const params = new URLSearchParams();
  
  // Обработка параметров
  if (brand !== 'Любые марки') params.set('brand', brand);
  if (model !== 'Любые модели') params.set('model', model);
  if (price) params.set('maxPrice', price);
  
  // Всегда перенаправляем в каталог
  window.location.href = `#catalog?${params.toString()}`;
}

function navigateToCatalog(type) {
  window.location.href = `catalog.html?bodyType=${type}`;
}

// Управление фильтрами
function setFilter(selected) {
  document.querySelectorAll(".filter-option").forEach(el => el.classList.remove("selected"));
  selected.classList.add("selected");
}

function selectBrand(brand) {
  document.getElementById("brandButton").textContent = brand;
  updateModels(brand);
}

function updateModels(brand) {
  let modelList = document.getElementById("modelList");
  modelList.innerHTML = "";
  
  if (modelsByBrand[brand]) {
    modelsByBrand[brand].forEach(model => {
      let p = document.createElement("p");
      p.textContent = model;
      p.onclick = function () {
        document.getElementById("modelButton").textContent = model;
      };
      modelList.appendChild(p);
    });
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  loadRecommendedCars();
});

window.initIndexPage = initIndexPage;