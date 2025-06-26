function initContactsPage() {
    // Улучшенная функция показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    // Обработка формы обратной связи через AJAX
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Создаем объект с данными формы
            const formData = {
                name: this.name.value,
                email: this.email.value,
                message: this.message.value
            };

            try {
                // Отправляем запрос на сервер
                const response = await fetch('ajax.php?action=addFeedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Обрабатываем ответ сервера
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Ваше сообщение успешно отправлено!');
                    this.reset();
                } else {
                    showNotification(
                        `Ошибка: ${result.error || 'Неизвестная ошибка'}`,
                        'error'
                    );
                }
            } catch (error) {
                showNotification(
                    'Ошибка сети или сервера',
                    'error'
                );
            }
        });
    }
    
    // Инициализация при загрузке страницы
    updateHeaderCounters();
}

window.initContactsPage = initContactsPage;