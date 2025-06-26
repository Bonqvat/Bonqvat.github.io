function initRegistrationPage() {
    // Инициализация состояния приложения
    if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
        localStorage.setItem('futureAutoState', JSON.stringify({
            user: null,
            cart: [],
            favorites: []
        }));
    }

    // Обработчики событий
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleFormSubmit);
    }

    const avatarInput = document.getElementById('avatar');
    const previewImage = document.getElementById('previewImage');
    const fileNameElement = document.getElementById('fileName');
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const file = this.files[0];
                fileNameElement.textContent = file.name;
                fileNameElement.style.display = 'block';
                
                // Превью изображения
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                }
                reader.readAsDataURL(file);
                
                if (file.size > 5 * 1024 * 1024) {
                    fileNameElement.textContent = 'Файл слишком большой (макс. 5MB)';
                    fileNameElement.style.color = '#dc3545';
                    this.value = '';
                    previewImage.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                } else {
                    fileNameElement.style.color = '#6c757d';
                }
            } else {
                fileNameElement.style.display = 'none';
            }
        });
    }

    const successButton = document.querySelector('#successMessage button');
    if (successButton) {
        successButton.addEventListener('click', hideSuccessMessage);
    }

    // Функции валидации и обработки
    function handleFormSubmit(e) {
        e.preventDefault();
        let isValid = true;

        // Валидация email
        const emailInput = document.getElementById('register_email');
        const email = emailInput.value.trim().toLowerCase();
        if (!email.includes('@')) {
            showError('emailError', 'Email должен содержать символ "@"');
            emailInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('emailError');
            emailInput.classList.remove('input-error');
        }

        // Валидация пароля
        const passwordInput = document.getElementById('register_password');
        const password = passwordInput.value;
        if (password.length < 6) {
            showError('passwordError', 'Пароль должен быть минимум 6 символов');
            passwordInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('passwordError');
            passwordInput.classList.remove('input-error');
        }

        // Валидация ФИО
        const fioInput = document.getElementById('register_fio');
        const fio = fioInput.value.trim();
        if (fio.length < 3) {
            showError('fioError', 'Введите ваше ФИО');
            fioInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('fioError');
            fioInput.classList.remove('input-error');
        }

        // Валидация адреса
        const addressInput = document.getElementById('register_address');
        const address = addressInput.value.trim();
        if (address.length < 5) {
            showError('addressError', 'Введите адрес');
            addressInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('addressError');
            addressInput.classList.remove('input-error');
        }

        // Валидация телефона
        const phoneInput = document.getElementById('register_phone');
        const phone = phoneInput.value.trim();
        if (phone.length < 6) {
            showError('phoneError', 'Введите номер телефона');
            phoneInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('phoneError');
            phoneInput.classList.remove('input-error');
        }

        // Проверка согласия
        const consentInput = document.getElementById('consent');
        if (!consentInput.checked) {
            showError('consentError', 'Подтвердите согласие');
            isValid = false;
        } else {
            hideError('consentError');
        }

        // Отправка данных на сервер
        if (isValid) {
            // Скрываем предыдущие ошибки
            hideError('generalError');

            // Создаем FormData для отправки файла
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('name', fio);
            formData.append('phone', phone);
            formData.append('address', address);
            
            // Добавляем аватар если выбран
            const avatarFile = avatarInput.files[0];
            if (avatarFile && avatarFile.size <= 5 * 1024 * 1024) {
                formData.append('avatar', avatarFile);
            }

            // Отправляем на сервер
            fetch('script.php?action=registerUser', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Показываем ошибку сервера
                    showError('generalError', data.error);
                } else {
                    // Сохраняем только ID пользователя
                    const appState = JSON.parse(localStorage.getItem('futureAutoState')) || {};
                    appState.user = { id: data.userId };
                    localStorage.setItem('futureAutoState', JSON.stringify(appState));
                    
                    showSuccessMessage();
                }
            })
            .catch(error => {
                showError('generalError', 'Ошибка сети. Попробуйте позже.');
            });
        }
    }

    function showError(id, message) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideError(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    function showSuccessMessage() {
        const overlay = document.getElementById('overlay');
        const successMessage = document.getElementById('successMessage');
        if (overlay && successMessage) {
            overlay.style.display = 'block';
            successMessage.style.display = 'block';
        }
    }

    function hideSuccessMessage() {
        const overlay = document.getElementById('overlay');
        const successMessage = document.getElementById('successMessage');
        if (overlay && successMessage) {
            overlay.style.display = 'none';
            successMessage.style.display = 'none';
            window.location.href = '#index';
        }
    }
}

window.initRegistrationPage = initRegistrationPage;