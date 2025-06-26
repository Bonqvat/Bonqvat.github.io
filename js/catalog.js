import { brands, modelsByBrand } from '/data/data.js';

let currentPage = 1;
const itemsPerPage = 8;

let cars = [];
let carData = [];
let currentFilteredCars = [];

async function initCatalogPage() {
  await loadCarsFromDB();
  currentFilteredCars = [...cars];
  populateBrandFilter();
  setupEventListeners();
  initPriceSlider();
  
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get('brand');
  const model = urlParams.get('model');
  const maxPrice = urlParams.get('maxPrice');
  const bodyType = urlParams.get('bodyType');
  const searchQuery = urlParams.get('search');
  const status = urlParams.get('status');

  if (brand) {
    document.getElementById('brandSelect').value = brand;
    updateModels(false);
  }
  
  if (model) {
    document.getElementById('modelSelect').value = model;
  }
  
  if (maxPrice) {
    document.getElementById('maxPrice').value = maxPrice;
  }
  
  if (bodyType) {
    document.getElementById('bodyTypeSelect').value = bodyType;
  }

  if (searchQuery) {
    document.getElementById('search').value = searchQuery;
  }
  
  if (status) {
    document.getElementById('statusSelect').value = status;
  }
  
  applyUrlFilters()
  filterCars();
  updateFilterOptions(currentFilteredCars);
  updatePagination();
  updateHeaderCounters();
}

function applyUrlFilters() {
  const state = getAppState();
  
  if (state.currentPage !== 'catalog') return;
  
  const filters = state.searchParams;
  
  if (filters.brand) {
    document.getElementById('brandSelect').value = filters.brand;
    updateModels();
  }
  
  if (filters.model) {
    setTimeout(() => {
      document.getElementById('modelSelect').value = filters.model;
    }, 100);
  }
  
  if (filters.maxPrice) {
    document.getElementById('maxPrice').value = filters.maxPrice;
  }
  
  if (filters.bodyType) {
    document.getElementById('bodyTypeSelect').value = filters.bodyType;
  }
  
  if (filters.status) {
    document.getElementById('statusSelect').value = filters.status;
  }
  
  setTimeout(() => filterCars(), 200);
}

function setupEventListeners() {
  document.getElementById('filterToggle')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const panel = document.getElementById('filtersPanel');
    if (panel) {
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    }
  });

  document.addEventListener('click', function(e) {
    const panel = document.getElementById('filtersPanel');
    const button = document.getElementById('filterToggle');
    
    if (panel && button && !panel.contains(e.target) && !button.contains(e.target)) {
      panel.style.display = 'none';
    }
  });

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      showSuggestions(this.value);
    });
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  const searchButton = document.querySelector('.search-btn');
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  const priceSlider = document.getElementById('priceSlider');
  if (priceSlider) {
    priceSlider.addEventListener('input', updatePriceInputs);
  }

  const minPriceInput = document.getElementById('minPrice');
  if (minPriceInput) {
    minPriceInput.addEventListener('change', updatePriceSlider);
  }

  const maxPriceInput = document.getElementById('maxPrice');
  if (maxPriceInput) {
    maxPriceInput.addEventListener('change', filterCars);
  }

  const applyFiltersBtn = document.querySelector('.apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
  }

  const brandSelect = document.getElementById('brandSelect');
  if (brandSelect) {
    brandSelect.addEventListener('change', updateModels);
  }

  const modelSelect = document.getElementById('modelSelect');
  if (modelSelect) {
    modelSelect.addEventListener('change', filterCars);
  }

  const bodyTypeSelect = document.getElementById('bodyTypeSelect');
  if (bodyTypeSelect) {
    bodyTypeSelect.addEventListener('change', filterCars);
  }

  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    yearSelect.addEventListener('change', filterCars);
  }

  const driveTypeSelect = document.getElementById('driveTypeSelect');
  if (driveTypeSelect) {
    driveTypeSelect.addEventListener('change', filterCars);
  }

  const powerSelect = document.getElementById('powerSelect');
  if (powerSelect) {
    powerSelect.addEventListener('change', filterCars);
  }

  const statusSelect = document.getElementById('statusSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', filterCars);
  }

  document.querySelectorAll('.reset-filter').forEach(button => {
    button.addEventListener('click', function() {
      const filterId = this.dataset.filter;
      resetFilter(filterId);
    });
  });

  const resetPriceBtn = document.querySelector('.reset-price-filter');
  if (resetPriceBtn) {
    resetPriceBtn.addEventListener('click', resetPriceFilter);
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

function populateBrandFilter() {
  const brandSelect = document.getElementById('brandSelect');
  if (!brandSelect) return;
  
  brandSelect.innerHTML = '<option value="" selected>Все марки</option>';
  
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

function initPriceSlider() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (!minPrice || !maxPrice || !priceSlider) return;
  
  const min = Math.min(...cars.map(car => car.price));
  const max = Math.max(...cars.map(car => car.price));
  
  const safeMin = isFinite(min) ? min : 0;
  const safeMax = isFinite(max) ? max : 10000000;
  
  minPrice.min = safeMin;
  minPrice.max = safeMax;
  minPrice.value = safeMin;
  minPrice.placeholder = `от ${safeMin.toLocaleString()}`;
  
  maxPrice.min = safeMin;
  maxPrice.max = safeMax;
  maxPrice.value = safeMax;
  maxPrice.placeholder = `до ${safeMax.toLocaleString()}`;
  
  priceSlider.min = safeMin;
  priceSlider.max = safeMax;
  priceSlider.value = safeMin;
}

function updatePriceInputs() {
  const priceSlider = document.getElementById('priceSlider');
  const minPrice = document.getElementById('minPrice');
  
  if (!priceSlider || !minPrice) return;
  
  minPrice.value = priceSlider.value;
  filterCars();
}

function updatePriceSlider() {
  const minPrice = document.getElementById('minPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (!minPrice || !priceSlider) return;
  
  priceSlider.value = minPrice.value;
  filterCars();
}

function renderCatalog(carsToShow) {
  const carGrid = document.getElementById('carGrid');
  if (!carGrid) return;
  
  carGrid.innerHTML = '';
  
  if (!carsToShow || carsToShow.length === 0) {
    carGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Автомобили по вашему запросу не найдены</p>';
    return;
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = carsToShow.slice(startIndex, startIndex + itemsPerPage);
  
  paginatedCars.forEach((car, index) => {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    carCard.style.animationDelay = `${0.1 * index}s`;
    
    let imageUrl = 'images/no-image.jpg';
    const colorKeys = Object.keys(car.images);
    if (colorKeys.length > 0) {
        imageUrl = car.images[colorKeys[0]]; 
    }
    
    carCard.innerHTML = `
      <div class="car-status">${car.status}</div>
      <img src="${imageUrl}" alt="${car.brand} ${car.model}" loading="lazy">
      <div class="car-info">
        <h3>${car.brand} ${car.model} ${car.year}</h3>
        <p>${car.description}</p>
        <div class="car-features">
          ${car.features.map(feature => `<span class="car-feature">${feature}</span>`).join('')}
        </div>
        <p class="car-price">${car.price.toLocaleString()} ₽</p>
      </div>
      <div class="card-buttons">
        <button class="favorite-btn">В избранное</button>
        <button class="cart-btn">В корзину</button>
        <button class="details-btn">Подробнее</button>
      </div>
    `;

    const imgElement = carCard.querySelector('img');
    imgElement.onerror = function() {
        this.src = 'images/no-image.jpg';
        this.onerror = null;
    };
    
    carCard.querySelector('.favorite-btn')?.addEventListener('click', () => addToFavorites(car.id));
    carCard.querySelector('.cart-btn')?.addEventListener('click', () => addToCart(car.id));
    carCard.querySelector('.details-btn')?.addEventListener('click', () => showCarDetails(car.id));
    
    carGrid.appendChild(carCard);
  });
  
  updatePagination();
}

function showCarDetails(carId) {
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || {};
  state.currentCarId = carId;
  localStorage.setItem('futureAutoState', JSON.stringify(state));
  window.location.href = `#car-page?id=${carId}`;
}

function updateFilterOptions(filteredCars) {
  const brandSelect = document.getElementById('brandSelect');
  const modelSelect = document.getElementById('modelSelect');
  
  if (!brandSelect || !modelSelect) return;
  
  const selectedBrand = brandSelect.value;
  
  if (selectedBrand && modelsByBrand[selectedBrand]) {
    modelSelect.innerHTML = '<option value="" selected>Выберите модель</option>';
    modelSelect.disabled = false;
    
    modelsByBrand[selectedBrand].forEach(model => {
      const option = document.createElement('option');
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.innerHTML = '<option value="" selected>Сначала выберите марку</option>';
    modelSelect.disabled = true;
  }
  
  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    const availableYears = [...new Set(filteredCars.map(car => car.year))].sort((a, b) => b - a);
    yearSelect.innerHTML = '<option value="" selected>Любой</option>';
    availableYears.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }
  
  const driveSelect = document.getElementById('driveTypeSelect');
  if (driveSelect) {
    const availableDrives = [...new Set(filteredCars.map(car => car.drive))];
    driveSelect.innerHTML = '<option value="" selected>Любой</option>';
    availableDrives.forEach(drive => {
      const option = document.createElement('option');
      option.value = drive;
      option.textContent = 
        drive === 'front' ? 'Передний' : 
        drive === 'rear' ? 'Задний' : 'Полный';
      driveSelect.appendChild(option);
    });
    
    const currentValue = driveSelect.value;
    const isValid = availableDrives.includes(currentValue) || currentValue === '';
    if (!isValid) {
      driveSelect.value = '';
    }
  }
  
  const powerSelect = document.getElementById('powerSelect');
  if (powerSelect) {
    const powerRanges = [
      { value: 50, label: "до 50 л.с." },
      { value: 100, label: "51-100 л.с." },
      { value: 150, label: "101-150 л.с." },
      { value: 200, label: "151-200 л.с." },
      { value: 300, label: "201-300 л.с." },
      { value: 500, label: "301-500 л.с." },
      { value: 750, label: "501-750 л.с." },
      { value: 1000, label: "751-1000 л.с." },
      { value: 1001, label: "более 1000 л.с." }
    ];
    
    powerSelect.innerHTML = '<option value="" selected>Любая</option>';
    powerRanges.forEach(range => {
      const option = document.createElement('option');
      option.value = range.value;
      option.textContent = range.label;
      powerSelect.appendChild(option);
    });
  }
  
  const statusSelect = document.getElementById('statusSelect');
  if (statusSelect) {
    const availableStatuses = [...new Set(filteredCars.map(car => car.status))];
    statusSelect.innerHTML = '<option value="" selected>Любой</option>';
    availableStatuses.forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      statusSelect.appendChild(option);
    });
  }
  
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (minPriceInput && maxPriceInput && priceSlider && filteredCars.length > 0) {
    const minPrice = Math.min(...filteredCars.map(car => car.price));
    const maxPrice = Math.max(...filteredCars.map(car => car.price));
    
    minPriceInput.min = minPrice;
    minPriceInput.placeholder = `от ${minPrice.toLocaleString()}`;
    maxPriceInput.placeholder = `до ${maxPrice.toLocaleString()}`;
    priceSlider.min = minPrice;
    priceSlider.max = maxPrice;
  }
}

function showSuggestions(value) {
  const suggestions = document.getElementById('suggestions');
  if (!suggestions) return;
  
  suggestions.innerHTML = '';
  if (!value) return;
  
  const filteredSuggestions = carData.filter(car => 
    car.toLowerCase().includes(value.toLowerCase())
  );
  
  filteredSuggestions.forEach(suggestion => {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.textContent = suggestion;
    suggestionDiv.onclick = function() {
      document.getElementById('search').value = suggestion;
      suggestions.innerHTML = '';
      performSearch();
    };
    suggestions.appendChild(suggestionDiv);
  });
}

function updateModels(triggerFilter = true) {
  const brandSelect = document.getElementById('brandSelect');
  const modelSelect = document.getElementById('modelSelect');
  
  if (!brandSelect || !modelSelect) return;
  
  const selectedBrand = brandSelect.value;
  
  modelSelect.innerHTML = '<option value="" selected>Выберите модель</option>';
  modelSelect.disabled = !selectedBrand;
  
  if (selectedBrand && modelsByBrand[selectedBrand]) {
    modelsByBrand[selectedBrand].forEach(model => {
      const option = document.createElement('option');
      option.value = model.toLowerCase();
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }
  
  if (triggerFilter) filterCars();
}
    
function filterCars() {
  const brand = document.getElementById('brandSelect')?.value || '';
  const model = document.getElementById('modelSelect')?.value || '';
  const year = document.getElementById('yearSelect')?.value || '';
  const bodyType = document.getElementById('bodyTypeSelect')?.value || '';
  const driveType = document.getElementById('driveTypeSelect')?.value || '';
  const power = document.getElementById('powerSelect')?.value || '';
  const status = document.getElementById('statusSelect')?.value || '';
  const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
  const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
  const searchText = document.getElementById('search')?.value || '';
  
  currentFilteredCars = cars.filter(car => {
    if (brand && car.brand.toLowerCase() !== brand.toLowerCase()) return false;
    
    if (model && car.model.toLowerCase() !== model.toLowerCase()) return false;
    
    if (year && car.year !== parseInt(year)) return false;
    
    if (bodyType && car.bodyType !== bodyType) return false;
    
    if (driveType && car.drive !== driveType) return false;
    
    if (status && car.status !== status) return false;
    
    if (power) {
      const carPower = car.power;
      const powerValue = parseInt(power);
      if (powerValue === 50 && carPower > 50) return false;
      if (powerValue === 100 && (carPower <= 50 || carPower > 100)) return false;
      if (powerValue === 150 && (carPower <= 100 || carPower > 150)) return false;
      if (powerValue === 200 && (carPower <= 150 || carPower > 200)) return false;
      if (powerValue === 300 && (carPower <= 200 || carPower > 300)) return false;
      if (powerValue === 500 && (carPower <= 300 || carPower > 500)) return false;
      if (powerValue === 750 && (carPower <= 500 || carPower > 750)) return false;
      if (powerValue === 1000 && (carPower <= 750 || carPower > 1000)) return false;
      if (powerValue === 1001 && carPower <= 1000) return false;
    }
    
    const carPrice = car.price;
    if (carPrice < minPrice || carPrice > maxPrice) return false;
    
    if (searchText) {
      const carName = `${car.brand} ${car.model}`.toLowerCase();
      if (!carName.includes(searchText.toLowerCase())) return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  renderCatalog(currentFilteredCars);
}
    
function applyFilters() {
  filterCars();
  const panel = document.getElementById('filtersPanel');
  if (panel) {
    panel.style.display = 'none';
  }
}

function performSearch() {
  const searchText = document.getElementById('search').value;
  
  const state = getAppState();
  state.searchParams.search = searchText;
  localStorage.setItem('futureAutoState', JSON.stringify(state));
  
  const url = new URL(window.location);
  url.searchParams.set('search', searchText);
  window.history.replaceState(null, '', url);
  
  filterCars();
}

function resetFilter(filterId) {
  const element = document.getElementById(filterId);
  if (element) {
    element.value = '';
    
    if (filterId === 'brandSelect') {
      const modelSelect = document.getElementById('modelSelect');
      if (modelSelect) {
        modelSelect.innerHTML = '<option value="" selected>Сначала выберите марку</option>';
        modelSelect.disabled = true;
      }
    }
    
    filterCars();
  }
}

function resetPriceFilter() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (minPrice && maxPrice && priceSlider) {
    const min = Math.min(...cars.map(car => car.price));
    const max = Math.max(...cars.map(car => car.price));
    
    const safeMin = isFinite(min) ? min : 0;
    const safeMax = isFinite(max) ? max : 10000000;
    
    minPrice.value = safeMin;
    maxPrice.value = safeMax;
    priceSlider.value = safeMin;
  }
  
  filterCars();
}

function changePage(page) {
  const totalPages = Math.ceil(currentFilteredCars.length / itemsPerPage);
  
  if (page === -1 && currentPage > 1) {
    currentPage--;
  } else if (page === 1 && currentPage < totalPages) {
    currentPage++;
  } else if (page > 0) {
    currentPage = page;
  }
  
  renderCatalog(currentFilteredCars);
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  const totalPages = Math.ceil(currentFilteredCars.length / itemsPerPage);
  
  while (pagination.children.length > 2) {
    pagination.removeChild(pagination.children[1]);
  }
  
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.onclick = function() { changePage(i); };
    if (i === currentPage) {
      button.classList.add('active-page');
    }
    pagination.insertBefore(button, pagination.lastElementChild);
  }
  
  const prevButton = pagination.firstElementChild;
  const nextButton = pagination.lastElementChild;
  
  if (prevButton) prevButton.disabled = currentPage === 1;
  if (nextButton) nextButton.disabled = currentPage === totalPages || totalPages === 0;
}

document.addEventListener('DOMContentLoaded', async function() {
  await initCatalogPage();
});

window.initCatalogPage = initCatalogPage;
window.resetFilter = resetFilter;