document.addEventListener('DOMContentLoaded', function() {
  // Загрузка хедера
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      // Инициализация обработчиков после загрузки
      initHeaderFunctionality();
      updateHeaderCounters();
    });

  // Загрузка футера
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      // Инициализация обработчиков после загрузки
      initFooterFunctionality();
    });
});

function initHeaderFunctionality() {
  // Инициализация модального окна
  document.getElementById('loginModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal('loginModal');
    }
  });
}

function initFooterFunctionality() {
  // Инициализация подписки
  document.querySelector('.footer-subscribe button')?.addEventListener('click', subscribe);
}

// Функция подписки (для футера)
function subscribe() {
  const email = document.getElementById('footerEmail').value;
  if (email && email.includes('@')) {
    showNotification('Спасибо за подписку! На ваш email будут приходить новости и акции.');
    document.getElementById('footerEmail').value = '';
  } else {
    showNotification('Пожалуйста, введите корректный email адрес');
  }
}