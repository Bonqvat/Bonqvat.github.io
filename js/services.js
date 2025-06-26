function initServicesPage() {
    updateHeaderCounters();
    
    const modalTemplate = document.getElementById('service-modal-template');
    const modalClone = modalTemplate.content.cloneNode(true);
    document.body.appendChild(modalClone);
    const serviceModal = document.querySelector('.service-modal');
    const closeModal = document.querySelector('.close-modal');
    
    const serviceDetails = {
        "Продажа новых автомобилей": {
            subtitle: "Эксклюзивные модели 2025 года",
            image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "FutureAuto предлагает полный цикл покупки нового автомобиля от ведущих мировых производителей. Наши эксперты помогут подобрать оптимальную модель под ваши требования и бюджет. Все автомобили поставляются с официальной гарантией производителя и проходят предпродажную подготовку.",
            features: [
                "Эксклюзивные модели 2025 года в наличии",
                "Официальная гарантия 3+2 года",
                "Индивидуальный тест-драйв в день обращения",
                "Программа Trade-In с повышенной выгодой",
                "Финансовые программы с господдержкой"
            ],
            button: {text: "Оставить заявку", action: "consultation", type: "new-car"}
        },
        "Продажа авто с пробегом": {
            subtitle: "Проверенные автомобили с гарантией",
            image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Каждый автомобиль с пробегом проходит 150-пунктную диагностику и комплексную предпродажную подготовку. Мы гарантируем юридическую чистоту и техническую исправность. На все автомобили предоставляется гарантия 1 год.",
            features: [
                "150-пунктная диагностика перед продажей",
                "Гарантия 1 год или 30 000 км пробега",
                "Полная история обслуживания",
                "Проверка на юридическую чистоту",
                "Специальные условия кредитования"
            ],
            button: {text: "Оставить заявку", action: "consultation", type: "used-car"}
        },
        "Сервисное обслуживание": {
            subtitle: "Оригинальные запчасти и оборудование",
            image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Сертифицированный сервисный центр FutureAuto оснащен современным диагностическим оборудованием. Наши мастера проходят регулярное обучение у производителей. Используем только оригинальные запчасти и расходные материалы.",
            features: [
                "Компьютерная диагностика за 30 минут",
                "Оригинальные запчасти со скидкой 15%",
                "Техническое обслуживание по регламенту",
                "Кузовной ремонт любой сложности",
                "Мобильная служба техпомощи"
            ],
            button: {text: "Записаться на сервис", action: "consultation", type: "service"}
        },
        "Автокредитование": {
            subtitle: "Одобрение 95% заявок",
            image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Специальные программы кредитования от 20 банков-партнеров. Подберем оптимальные условия даже со сложной кредитной историей. Первоначальный взнос от 10%, решение по заявке за 30 минут.",
            features: [
                "Ставка от 5.9% годовых",
                "Без первоначального взноса",
                "Кредитный лимит до 5 млн рублей",
                "Рефинансирование действующих кредитов",
                "Онлайн-одобрение без визита в банк"
            ],
            button: {text: "Оформить кредит", action: "consultation", type: "credit"}
        },
        "Страхование": {
            subtitle: "Экспресс-оформление за 15 минут",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Оформление полисов КАСКО и ОСАГО по специальным тарифам от 12 страховых компаний. Помощь при ДТП 24/7. Гарантированная выплата в течение 7 дней при наступлении страхового случая.",
            features: [
                "Скидки до 40% при комплексном страховании",
                "Электронный полис с мгновенной доставкой",
                "Помощь при ДТП: эвакуатор, юрист, ремонт",
                "Страхование путешествий и жизни водителя",
                "Программа лояльности для постоянных клиентов"
            ],
            button: {text: "Оформить страховку", action: "consultation", type: "insurance"}
        },
        "Доп. оборудование": {
            subtitle: "Установка премиального оборудования",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Профессиональная установка дополнительного оборудования: от систем безопасности до мультимедийных комплексов. Работаем с премиальными брендами: Bosch, Alpine, Pioneer, Viper. Гарантия на работы - 2 года.",
            features: [
                "Тонирование стекол премиальными пленками",
                "Установка парктроников и камер 360°",
                "Мультимедиа системы с Apple CarPlay/Android Auto",
                "Противоугонные комплексы с GPS-мониторингом",
                "Обвесы и тюнинг от официальных ателье"
            ],
            button: {text: "Заказать установку", action: "consultation", type: "equipment"}
        },
        "promotion": {
            title: "Специальное предложение!",
            subtitle: "Бесплатное годовое обслуживание",
            image: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "При покупке любого нового автомобиля в нашем салоне вы получаете уникальный пакет услуг:",
            features: [
                "Бесплатное годовое ТО (2 посещения)",
                "3 профессиональные мойки премиум-класса",
                "Компьютерная диагностика в подарок",
                "Скидка 20% на дополнительное оборудование",
                "Бесплатная страховка КАСКО на 3 месяца"
            ],
            note: "Предложение действует до 31.08.2025. Подробности уточняйте у менеджеров.",
            button: {text: "Перейти в каталог", action: "redirect", url: "/catalog"}
        }
    };

    function openServiceModal(serviceKey) {
        const service = serviceDetails[serviceKey];
        
        document.querySelector('.modal-title').textContent = 
            serviceKey === 'promotion' ? service.title : serviceKey;
            
        document.querySelector('.modal-subtitle').textContent = service.subtitle;
        document.querySelector('.modal-image').style.backgroundImage = 
            `url('${service.image}')`;
        document.querySelector('.modal-description').innerHTML = 
            `<p>${service.description}</p>${service.note ? `<p class="note">${service.note}</p>` : ''}`;
            
        const featuresList = document.querySelector('.features-list');
        featuresList.innerHTML = '';
        service.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        document.querySelector('.consult-name').value = '';
        document.querySelector('.consult-phone').value = '';
        document.querySelector('.consult-email').value = '';
        
        serviceModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        const ctaButton = document.querySelector('.modal-cta');
        ctaButton.textContent = service.button.text;
        
        ctaButton.onclick = null;
        
        const modalForm = document.querySelector('.modal-form');
        const modalActions = document.querySelector('.modal-actions');
        
        if (serviceKey === 'promotion') {
            modalForm.style.display = 'none';
            modalActions.style.display = 'none';
        } else {
            modalForm.style.display = 'block';
            modalActions.style.display = 'block';
        }
        
        if (service.button.action === "consultation") {
            ctaButton.onclick = async function() {
                const name = document.querySelector('.consult-name').value;
                const phone = document.querySelector('.consult-phone').value;
                const email = document.querySelector('.consult-email').value;
                
                if (!name || !phone || !email) {
                    alert('Пожалуйста, заполните все поля');
                    return;
                }
                
                const serviceName = document.querySelector('.modal-title').textContent;
                const success = await sendConsultation(serviceName, name, phone, email, service.button.type);
                
                if (success) {
                    alert('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
                    serviceModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            };
        } else if (service.button.action === "redirect") {
            ctaButton.onclick = function() {
                window.location.href = service.button.url;
            };
        }
    }

    closeModal.addEventListener('click', () => {
        serviceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            serviceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceContent = this.closest('.service-content');
            if (serviceContent) {
                const serviceName = serviceContent.querySelector('h2').textContent;
                openServiceModal(serviceName);
            }
        });
    });
    
    const bannerButton = document.querySelector('.banner-btn');
    if (bannerButton) {
        bannerButton.addEventListener('click', function(e) {
            e.preventDefault();
            openServiceModal('promotion');
        });
    }
}

async function sendConsultation(serviceName, name, phone, email, type) {
    try {
        const response = await fetch('script.php?action=addFeedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                subject: 'Консультация по услуге: ' + serviceName,
                message: 'Запрос на консультацию по услуге: ' + serviceName,
                type: type
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Ошибка отправки:', error);
        alert('Ошибка соединения с сервером');
        return false;
    }
}

window.initServicesPage = initServicesPage;