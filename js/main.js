import { recommendedCarIds, brands, modelsByBrand } from '/data/data.js';
let cars = [];
let carData = [];

async function initIndexPage() {
  await loadCarsFromDB();
  populateBrandList();
  loadRecommendedCars();
  setupEventListeners();
  updateHeaderCounters();
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

function populateBrandList() {
  const brandList = document.getElementById('brandList');
  brandList.innerHTML = '';
  
  brands.forEach(brand => {
    const p = document.createElement('p');
    p.textContent = brand;
    p.addEventListener('click', () => selectBrand(brand));
    brandList.appendChild(p);
  });
}

function loadRecommendedCars() {
  const container = document.getElementById('recommendedCars');
  container.innerHTML = '';
  
  const selectedFilter = document.querySelector('.filter-option.selected')?.dataset.filter || 'all';
  
  recommendedCarIds.forEach(carId => {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    
    if (selectedFilter === 'new' && car.status !== 'Новый') return;
    if (selectedFilter === 'used' && car.status !== 'Б/У') return;
    
    const carElement = document.createElement('div');
    carElement.className = 'recommended-car';
    let imageUrl = 'images/no-image.jpg';
    const colorKeys = Object.keys(car.images);
    if (colorKeys.length > 0) {
        imageUrl = car.images[colorKeys[0]]; 
    }
    
    carElement.innerHTML = `
      <a href="#car-page" class="car-link" data-id="${car.id}">
        <img src="${imageUrl}" alt="${car.brand} ${car.model}">
        <h3>${car.brand} ${car.model}</h3>
      </a>
      <p>${car.price.toLocaleString('ru-RU')} ₽</p>
      <button class="btn add-to-cart" data-id="${car.id}">В корзину</button>
    `;
    
    const imgElement = carElement.querySelector('img');
    imgElement.onerror = function() {
        this.src = 'images/no-image.jpg';
        this.onerror = null;
    };
    
    container.appendChild(carElement);
  });
}

function setupEventListeners() {
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      setFilter(this);
      loadRecommendedCars();
    });
  });
  
  document.getElementById('searchButton').addEventListener('click', performSearch);
  
  document.querySelectorAll('.car-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      navigateToCatalog(this.dataset.type);
    });
  });
  
  document.addEventListener('click', function(e) {
    if (e.target.closest('.car-link')) {
      const carId = parseInt(e.target.closest('.car-link').dataset.id);
      const state = JSON.parse(localStorage.getItem('futureAutoState')) || {};
      state.currentCarId = carId;
      localStorage.setItem('futureAutoState', JSON.stringify(state));
      window.location.href = `#car-page?id=${carId}`;
    }
    
    if (e.target.classList.contains('add-to-cart')) {
      const carId = parseInt(e.target.dataset.id);
      addToCart(carId);
    }
  });
}

function performSearch() {
  const brand = document.getElementById('brandButton').textContent;
  const model = document.getElementById('modelButton').textContent;
  const price = document.querySelector('.price-input').value;
  
  const params = new URLSearchParams();
  
  if (brand !== 'Любые марки') params.set('brand', brand);
  if (model !== 'Любые модели') params.set('model', model);
  if (price) params.set('maxPrice', price);
  
  window.location.href = `#catalog?${params.toString()}`;
}

function navigateToCatalog(type) {
  window.location.href = `#catalog?bodyType=${type}`;
}

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

document.addEventListener('DOMContentLoaded', function() {
  loadRecommendedCars();
  updateHeaderCounters();
});

window.initIndexPage = initIndexPage;