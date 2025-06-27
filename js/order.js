async function initOrderPage() {
  if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
    localStorage.setItem('futureAutoState', JSON.stringify({
      user: null,
      cart: [],
      favorites: []
    }));
  }

  // Загружаем данные о машинах с сервера
  const [cars] = await Promise.all([
    loadCarsFromDB(),
  ]);

  // Создаем структуры данных для работы
  const { carData, carPrices, carIds } = processCarData(cars);

  const DELIVERY_COST = 7500;

  function updateModels() {
    const brand = document.getElementById("brand").value;
    const modelSelect = document.getElementById("model");
    
    modelSelect.innerHTML = '<option value="">Выберите модель</option>';
    document.getElementById("carPreview").style.display = 'none';
    document.querySelector(".car-preview-placeholder").style.display = 'flex';
    
    if (brand) {
      carData[brand].models.forEach(model => {
        let option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  }

  function updateCarDetails() {
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    
    if (brand && model) {
      const preview = document.getElementById('carPreview');
      preview.src = carData[brand].images[model];
      preview.alt = `${brand} ${model}`;
      preview.onerror = function() {
        this.src = 'images/no-image.jpg';
        this.classList.add('placeholder-image');
      };
      preview.style.display = 'block';
      document.querySelector(".car-preview-placeholder").style.display = 'none';
      updatePrice();
    }
  }

  function updatePrice() {
    const model = document.getElementById("model").value;
    const price = carPrices[model] || 0;
    const carPriceElement = document.getElementById("carPrice");
    if (carPriceElement) {
      carPriceElement.textContent = price.toLocaleString() + " руб.";
    }
    const carPriceSummaryElement = document.getElementById("carPriceSummary");
    if (carPriceSummaryElement) {
      carPriceSummaryElement.textContent = price.toLocaleString() + " руб.";
    }
    updateTotal();
  }

  function updateDelivery() {
    const deliveryHome = document.querySelector('input[name="delivery"][value="home"]').checked;
    const addressField = document.getElementById('addressField');
    const autosalonSelection = document.querySelector('.autosalon-selection');
    
    if (addressField) addressField.style.display = deliveryHome ? 'block' : 'none';
    if (autosalonSelection) autosalonSelection.style.display = deliveryHome ? 'none' : 'block';
    
    document.querySelectorAll('.radio-option').forEach(option => {
      option.classList.toggle('selected', option.querySelector('input').checked);
    });
    
    const deliveryPriceElement = document.getElementById("deliveryPrice");
    if (deliveryPriceElement) {
      deliveryPriceElement.textContent = 
        deliveryHome ? DELIVERY_COST.toLocaleString() + " руб." : "0 руб.";
    }
    
    updateMap();
    updateTotal();
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается вашим браузером");
      return;
    }
    
    const addressInput = document.getElementById('address');
    if (!addressInput) return;
    
    addressInput.placeholder = "Определение местоположения...";
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            addressInput.value = results[0].formatted_address;
            updateMap();
          } else {
            addressInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            alert("Не удалось определить адрес, используйте ручной ввод");
          }
        });
      },
      error => {
        if (addressInput) addressInput.placeholder = "Введите ваш адрес";
        alert(`Ошибка определения местоположения: ${error.message}`);
      }
    );
  }

  function updateMap() {
    const deliveryHome = document.querySelector('input[name="delivery"][value="home"]').checked;
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    let mapUrl = '';
    
    if (deliveryHome) {
      const address = document.getElementById('address').value;
      if (address) {
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
      }
    } else {
      const dealer = document.getElementById('dealer').value;
      if (dealer) {
        mapUrl = `https://www.google.com/maps?q=${dealer}&output=embed`;
      }
    }
    
    if (mapUrl) {
      mapContainer.innerHTML = `
        <iframe 
          src="${mapUrl}" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy">
        </iframe>`;
    } else {
      const deliveryType = deliveryHome ? "доставки" : "автосалона";
      mapContainer.innerHTML = `
        <div class="map-placeholder">
          <i class="fas fa-map-marked-alt"></i>
          <p>Выберите ${deliveryType} для отображения карты</p>
        </div>`;
    }
  }

  function initAutocomplete() {
    const addressInput = document.getElementById('address');
    if (!addressInput) return;
    
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
      types: ['address'],
      componentRestrictions: { country: 'ru' }
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        alert("Место не найдено: '" + place.name + "'");
        return;
      }
      updateMap();
    });
  }

  function showOrderConfirmation() {
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const phone = document.getElementById("phone").value.trim();
    const phoneRegex = /^\+7\d{10}$/;
    
    if (!brand || !model) {
      alert("Пожалуйста, выберите марку и модель автомобиля!");
      return;
    }
    
    if (!phoneRegex.test(phone)) {
      alert("Пожалуйста, введите номер телефона в формате +7XXXXXXXXXX");
      return;
    }
    
    const totalPrice = document.getElementById("totalPrice").textContent;
    const dealerSelect = document.getElementById("dealer");
    if (!dealerSelect) return;
    
    const selectedDealer = dealerSelect.options[dealerSelect.selectedIndex].text;
    
    const deliveryHome = document.querySelector('input[name="delivery"][value="home"]').checked;
    const address = document.getElementById("address").value.trim();
    
    if (deliveryHome && !address) {
      alert("Пожалуйста, укажите адрес доставки!");
      return;
    }
    
    const orderId = Math.floor(1000 + Math.random() * 9000);
    const orderIdElement = document.getElementById("orderId");
    if (orderIdElement) orderIdElement.textContent = orderId;
    
    const orderTotalElement = document.getElementById("orderTotal");
    if (orderTotalElement) orderTotalElement.textContent = totalPrice;
    
    const dealerAddressElement = document.getElementById("dealerAddress");
    if (dealerAddressElement) dealerAddressElement.textContent = selectedDealer;
    
    const deliveryMethodTextElement = document.getElementById("deliveryMethodText");
    if (deliveryMethodTextElement) {
      deliveryMethodTextElement.textContent = 
        deliveryHome ? "Доставка по адресу" : "Самовывоз из автосалона";
    }
    
    if (deliveryHome) {
      const deliveryAddressTextElement = document.getElementById("deliveryAddressText");
      if (deliveryAddressTextElement) deliveryAddressTextElement.textContent = address;
      
      const deliveryAddressItem = document.getElementById("deliveryAddressItem");
      if (deliveryAddressItem) deliveryAddressItem.style.display = "flex";
      
      const deliveryStep = document.getElementById("deliveryStep");
      if (deliveryStep) deliveryStep.textContent = "Ожидайте доставку по указанному адресу";
    } else {
      const deliveryAddressItem = document.getElementById("deliveryAddressItem");
      if (deliveryAddressItem) deliveryAddressItem.style.display = "none";
      
      const deliveryStep = document.getElementById("deliveryStep");
      if (deliveryStep) deliveryStep.textContent = "Направьтесь в выбранный автосалон";
    }
    
    const orderModal = document.getElementById("orderModal");
    if (orderModal) orderModal.style.display = "flex";
  }

  function closeOrderModal() {
    const orderModal = document.getElementById("orderModal");
    if (orderModal) orderModal.style.display = "none";
  }

  function updateServicesCost() {
    const services = document.querySelectorAll('.service-option:checked');
    let total = 0;
    
    services.forEach(service => {
      const priceText = service.closest('.option-item').querySelector('.option-price').textContent;
      const price = parseInt(priceText.replace(/\D/g, ''));
      total += price;
    });
    
    const servicePriceElement = document.getElementById("servicePrice");
    if (servicePriceElement) servicePriceElement.textContent = total.toLocaleString() + " руб.";
    updateTotal();
  }

  function updateOptionsCost() {
    const options = document.querySelectorAll('.feature-option:checked');
    let total = 0;
    
    options.forEach(option => {
      const priceText = option.closest('.option-item').querySelector('.option-price').textContent;
      const price = parseInt(priceText.replace(/\D/g, ''));
      total += price;
    });
    
    const insurancePriceElement = document.getElementById("insurancePrice");
    if (insurancePriceElement) insurancePriceElement.textContent = total.toLocaleString() + " руб.";
    updateTotal();
  }

  function updateTotal() {
    const car = parseInt(document.getElementById("carPrice").textContent.replace(/\D/g, '')) || 0;
    const services = parseInt(document.getElementById("servicePrice").textContent.replace(/\D/g, '')) || 0;
    const options = parseInt(document.getElementById("insurancePrice").textContent.replace(/\D/g, '')) || 0;
    const delivery = parseInt(document.getElementById("deliveryPrice").textContent.replace(/\D/g, '')) || 0;
    const total = car + services + options + delivery;
    
    const totalPriceElement = document.getElementById("totalPrice");
    if (totalPriceElement) totalPriceElement.textContent = total.toLocaleString() + " руб.";
  }

  function findCarId(brand, model) {
    return carIds[brand]?.[model] || null;
  }

  function submitOrder() {
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const phone = document.getElementById("phone").value.trim();
    const phoneRegex = /^\+7\d{10}$/;
    const carId = findCarId(brand, model);
    
    if (!carId) {
      alert("Ошибка: Не удалось определить ID автомобиля");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("Пожалуйста, введите номер телефона в формате +7XXXXXXXXXX");
      return;
    }

    const selectedServices = Array.from(
      document.querySelectorAll('.service-option:checked')
    ).map(input => input.value);
    
    const selectedOptions = Array.from(
      document.querySelectorAll('.feature-option:checked')
    ).map(input => input.value);
    
    const dealerSelect = document.getElementById("dealer");
    if (!dealerSelect) return;
    
    const dealer = dealerSelect.options[dealerSelect.selectedIndex].text;
    const totalPrice = parseInt(
      document.getElementById("totalPrice").textContent.replace(/\D/g, '')
    );

    const deliveryHome = document.querySelector('input[name="delivery"][value="home"]').checked;
    const address = document.getElementById("address").value.trim();
    
    if (!brand || !model || !dealer || totalPrice <= 0) {
      alert("Пожалуйста, заполните все обязательные поля!");
      return;
    }

    if (deliveryHome && !address) {
      alert("Пожалуйста, укажите адрес доставки!");
      return;
    }

    fetch('script.php?action=placeOrder', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        carId: carId,
        services: selectedServices,
        options: selectedOptions,
        dealer: dealer,
        totalPrice: totalPrice,
        phone: phone,
        deliveryType: deliveryHome ? "home" : "pickup",
        deliveryAddress: deliveryHome ? address : null,
        deliveryCost: deliveryHome ? DELIVERY_COST : 0
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        const realOrderIdElement = document.getElementById("realOrderId");
        if (realOrderIdElement) realOrderIdElement.textContent = "#" + data.orderId;
        
        closeOrderModal();
        resetOrderForm();
        alert(`Заказ #${data.orderId} успешно оформлен!`);
      } else {
        throw new Error(data.error || 'Неизвестная ошибка сервера');
      }
    })
    .catch(error => {
      alert(`Ошибка оформления заказа: ${error.message}`);
    });
  }

  function resetOrderForm() {
    document.getElementById("brand").value = "";
    document.getElementById("model").innerHTML = '<option value="">Выберите модель</option>';
    document.getElementById("carPreview").style.display = 'none';
    document.querySelector(".car-preview-placeholder").style.display = 'flex';
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    document.querySelector('input[name="delivery"][value="pickup"]').checked = true;
    document.getElementById('addressField').style.display = 'none';
    document.getElementById('address').value = '';
    
    document.getElementById("dealer").selectedIndex = 0;
    document.getElementById("phone").value = "";
    updateMap();
    updateDelivery();
    updateTotal();
  }

  function initPage() {
    const brandSelect = document.getElementById("brand");
    if (brandSelect) {
      Object.keys(carData).forEach(brand => {
        let option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
      });
    }

    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    
    if (selectedProduct) {
      document.getElementById('brand').value = selectedProduct.brand;
      updateModels();
      
      setTimeout(() => {
        const modelSelect = document.getElementById('model');
        if (modelSelect) {
          const modelOption = Array.from(modelSelect.options).find(
            option => option.value === selectedProduct.model
          );
          
          if (modelOption) {
            modelOption.selected = true;
            updateCarDetails();
          }
          
          localStorage.removeItem('selectedProduct');
        }
      }, 100);
    }

    document.querySelectorAll('.service-option').forEach(checkbox => {
      checkbox.addEventListener('change', updateServicesCost);
    });
    
    document.querySelectorAll('.feature-option').forEach(checkbox => {
      checkbox.addEventListener('change', updateOptionsCost);
    });

    updateMap();
    updateDelivery();
    
    if (typeof google !== 'undefined') {
      initAutocomplete();
    } else {
      console.warn("Google Maps API не загружена");
    }
    
    const addressInput = document.getElementById('address');
    if (addressInput) {
      addressInput.addEventListener('input', function() {
        if (this.value.length > 3) {
          updateMap();
        }
      });
    }
    
    updateTotal();
  }

  initPage();

  window.updateModels = updateModels;
  window.updateCarDetails = updateCarDetails;
  window.updateMap = updateMap;
  window.showOrderConfirmation = showOrderConfirmation;
  window.closeOrderModal = closeOrderModal;
  window.submitOrder = submitOrder;
  window.updateDelivery = updateDelivery;
  window.detectLocation = detectLocation;
}

// Функция загрузки данных о машинах с сервера
async function loadCarsFromDB() {
  try {
    const response = await fetch('script.php?action=getCars');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки данных о машинах:', error);
    return [];
  }
}

// Обработка данных о машинах для использования в форме
function processCarData(cars) {
  const carData = {};
  const carPrices = {};
  const carIds = {};

  cars.forEach(car => {
    const brand = car.brand;
    const model = car.model;
    
    if (!carData[brand]) {
      carData[brand] = {
        models: [],
        images: {}
      };
    }
    
    if (!carData[brand].models.includes(model)) {
      carData[brand].models.push(model);
    }
    
    // Получаем первое изображение
    let firstImage = '';
    if (car.images && typeof car.images === 'object' && Object.keys(car.images).length > 0) {
      firstImage = car.images[Object.keys(car.images)[0]];
    } else if (typeof car.images === 'string') {
      try {
        const parsedImages = JSON.parse(car.images);
        if (parsedImages && Object.keys(parsedImages).length > 0) {
          firstImage = parsedImages[Object.keys(parsedImages)[0]];
        }
      } catch (e) {
        firstImage = 'images/no-image.jpg';
      }
    }
    
    carData[brand].images[model] = firstImage;
    carPrices[model] = car.price;
    
    if (!carIds[brand]) {
      carIds[brand] = {};
    }
    carIds[brand][model] = car.id;
  });

  return { carData, carPrices, carIds };
}

window.initOrderPage = initOrderPage;