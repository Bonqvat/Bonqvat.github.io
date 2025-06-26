function initAboutPage() {  
  // Инициализация страницы
  updateHeaderCounters();
  
  // Обработка кликов по соцсетям команды
  document.querySelectorAll('.team-social a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const memberName = this.closest('.team-info').querySelector('h3').textContent;
      showNotification(`Вы выбрали контакт ${memberName}. Социальная сеть откроется в новом окне.`);
    });
  });

  // Инициализация модальных окон
  initModals();
}

const modalContents = {
  special_offer: {
    title: "Специальное предложение",
    text: "При покупке любого автомобиля в нашем салоне вы получаете бесплатное годовое обслуживание и 3 бесплатные мойки."
  },
  new_cars: {
    title: "Продажа новых автомобилей",
    text: "Широкий выбор новых автомобилей от ведущих мировых производителей с официальной гарантией. У нас вы можете оформить тест-драйв и трейд-ин."
  },
  used_cars: {
    title: "Продажа авто с пробегом",
    text: "Проверенные автомобили с пробегом с гарантией от салона и полной проверкой состояния. Мы предоставляем полную диагностику, гарантию 1 год и историю обслуживания."
  },
  credit: {
    title: "Автокредитование",
    text: "Выгодные программы кредитования с минимальным пакетом документов и быстрым одобрением. Ставка от 5.9%, первый взнос от 10%, решение за 1 час."
  },
  insurance: {
    title: "Страхование",
    text: "Полный комплекс страховых услуг от ведущих страховых компаний с индивидуальным подходом. Мы предлагаем КАСКО и ОСАГО по лучшим тарифам и помощь при ДТП."
  },
  service: {
    title: "Сервисное обслуживание",
    text: "Профессиональное ТО и ремонт автомобилей любой сложности с использованием оригинальных запчастей. Наши квалифицированные мастера проведут диагностику и ремонт."
  },
  equipment: {
    title: "Дополнительное оборудование",
    text: "Установка дополнительного оборудования: от тонировок до премиальных аудиосистем. Мы гарантируем профессиональный монтаж, гарантию на работы и широкий выбор оборудования."
  }
};

function initModals() {
  const modal = document.getElementById('infoModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalText = modal.querySelector('.modal-text');
  const closeBtn = modal.querySelector('.close');
  
  function showModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.style.display = 'block';
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.querySelectorAll('[data-modal-id]').forEach(btn => {
    btn.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal-id');
      const content = modalContents[modalId];
      if (content) {
        showModal(content.title, content.text);
      }
    });
  });
}

window.initAboutPage = initAboutPage;