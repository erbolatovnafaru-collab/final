// Общие функции для всех страниц
$(document).ready(function() {
    // Инициализация всех модулей
    initTheme();
    initMobileMenu();
    initAnimations();
    initNotifications();
    initScrollProgress();
    initLazyLoading();
    initModals();
    initTryForFree();
    initLightbox(); // ✅ ДОБАВЛЕНО
    initGalleryFiltering(); // ✅ ДОБАВЛЕНО
    initPasswordValidation(); // ✅ ДОБАВЛЕНО
    
    // Страничные инициализации
    if ($('#scheduleTable').length) initCRUD();
    if ($('.team-grid').length) initInstructorSearch();
    if ($('.grid').length) initPricingSearch();
    if ($('.accordion').length) initAccordion();
    if ($('#contactForm').length) initFormValidation();
    if ($('.stats-section').length) initCounters();
});

// ==================== ТЁМНАЯ ТЕМА ====================
function initTheme() {
    const toggleBtn = $('#themeToggle');
    if (!toggleBtn.length) return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        $('body').addClass("dark");
        toggleBtn.text("☀️ Day");
    }

    toggleBtn.on('click', function() {
        $('body').toggleClass("dark");
        const isDark = $('body').hasClass("dark");

        toggleBtn.text(isDark ? "☀️ Day" : "🌙 Night");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        
        showNotification(isDark ? "Dark theme activated" : "Light theme activated", "info");
    });
}

// ==================== АНИМАЦИИ ====================
function initAnimations() {
    // Плавное появление хедера и контента
    $("header").css("opacity", "0").animate({opacity: 1}, 800);
    $(".hero-center").css("opacity", "0").delay(400).animate({opacity: 1}, 1200);
    
    // Анимация карточек при появлении в viewport
    $('.card, .teacher, .slot, .feature').each(function() {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(30px)',
            'transition': 'all 0.6s ease'
        });
    });
    
    // Запуск анимации при скролле
    $(window).on('scroll', function() {
        $('.card, .teacher, .slot, .feature').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    }).scroll();
}

// ==================== СИСТЕМА УВЕДОМЛЕНИЙ ====================
function initNotifications() {
    // Создаем контейнер для уведомлений
    if (!$('#notificationContainer').length) {
        $('body').append('<div id="notificationContainer"></div>');
    }
}

function showNotification(message, type = "info") {
    const notification = $(`
        <div class="notification ${type}">
            ${message}
        </div>
    `);
    
    $('#notificationContainer').append(notification);
    
    notification.fadeIn(300);
    
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

// ==================== ПРОГРЕСС-БАР ПРОКРУТКИ ====================
function initScrollProgress() {
    $(window).on('scroll', function() {
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollTop = $(window).scrollTop();
        
        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
        $('#scrollProgress').css('width', progress + '%');
    });
}

// ==================== LAZY LOADING ====================
function initLazyLoading() {
    function lazyLoad() {
        $('.lazy').each(function() {
            const $img = $(this);
            if ($img.attr('src')) return;
            
            if (isElementInViewport($img[0])) {
                const src = $img.data('src');
                $img.attr('src', src)
                    .on('load', function() {
                        $(this).addClass('loaded');
                    });
            }
        });
    }
    
    $(window).on('scroll resize', lazyLoad);
    lazyLoad();
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================
function initModals() {
    // Модальное окно для выбора времени (schedule.html)
    $(".slot").on('click', function() {
        const name = $(this).find(".name").text().trim();
        const time = $(this).find(".time").text().trim();
        
        showModal(`
            <h3>Book Your Session</h3>
            <p>You selected: <strong>${name}</strong> at <strong>${time}</strong></p>
            <div class="modal-buttons">
                <button class="btn primary" onclick="bookSession('${name}', '${time}')">Confirm Booking</button>
                <button class="btn secondary" onclick="closeModal()">Cancel</button>
            </div>
        `);
    });
    
    // Модальное окно для выбора тарифа (pricing.html)
    $(".card .primary").on('click', function(e) {
        e.preventDefault();
        const plan = $(this).siblings("h3").text().trim();
        const price = $(this).siblings(".price").text().trim();
        
        showModal(`
            <h3>Choose Plan</h3>
            <p>You selected: <strong>${plan}</strong></p>
            <p>Price: <strong>${price}</strong></p>
            <div class="modal-buttons">
                <button class="btn primary" onclick="selectPlan('${plan}')">Select Plan</button>
                <button class="btn secondary" onclick="closeModal()">Cancel</button>
            </div>
        `);
    });
}

function showModal(content) {
    // Удаляем существующее модальное окно
    $('#dynamicModal').remove();
    
    // Создаем новое
    $('body').append(`
        <div id="dynamicModal" class="modal active">
            <div class="modal-box">
                ${content}
            </div>
        </div>
    `);
}

function closeModal() {
    $('#dynamicModal').remove();
}

function bookSession(name, time) {
    showNotification(`✅ Successfully booked ${name} at ${time}!`, "success");
    closeModal();
    // Перенаправление на страницу контактов с параметрами
    setTimeout(() => {
        window.location.href = `contact.html?class=${encodeURIComponent(name)}&time=${encodeURIComponent(time)}`;
    }, 1500);
}

function selectPlan(plan) {
    showNotification(`✅ Selected plan: ${plan}`, "success");
    closeModal();
    // Перенаправление на страницу контактов с параметрами
    setTimeout(() => {
        window.location.href = `contact.html?plan=${encodeURIComponent(plan)}`;
    }, 1500);
}

// ==================== ПОИСК ИНСТРУКТОРОВ (ABOUT) ====================
function initInstructorSearch() {
    const $searchInput = $('#instructorSearch');
    const $searchMessage = $('#instructorSearchMessage');
    const $teachers = $('.teacher');
    
    if (!$searchInput.length) return;
    
    // Расширенные данные инструкторов
    const instructorsData = [
        { 
            element: $teachers.eq(0), 
            name: "Elena", 
            specialization: "Vinyasa Hatha", 
            experience: "8 years",
            style: "Dynamic flowing sequences",
            bio: "RYT-500 certified with international teaching experience. Specializes in creative Vinyasa flows."
        },
        { 
            element: $teachers.eq(1), 
            name: "Kate", 
            specialization: "Restorative Nidra", 
            experience: "6 years",
            style: "Gentle relaxing practices",
            bio: "Yoga Alliance certified with focus on therapeutic yoga and stress relief techniques."
        },
        { 
            element: $teachers.eq(2), 
            name: "Maya", 
            specialization: "Power Mobility", 
            experience: "5 years",
            style: "Strength building intensive",
            bio: "CPT certified fitness expert combining strength training with traditional yoga."
        },
        { 
            element: $teachers.eq(3), 
            name: "Irina", 
            specialization: "Yin Mindfulness", 
            experience: "7 years",
            style: "Deep stretch meditation",
            bio: "RYT-200 certified meditation teacher specializing in Yin yoga and mindfulness."
        }
    ];
    
    $searchInput.on('input', function() {
        const query = $(this).val().toLowerCase().trim();
        let visibleCount = 0;
        
        if (query.length === 0) {
            $teachers.show();
            $searchMessage.text('Search instructors by name, style, or specialization').css('color', '#666');
            // Сброс подсветки
            $teachers.find('h4').each(function() {
                const $this = $(this);
                $this.text($this.text());
            });
            return;
        }
        
        instructorsData.forEach(instructor => {
            const matches = 
                instructor.name.toLowerCase().includes(query) ||
                instructor.specialization.toLowerCase().includes(query) ||
                instructor.style.toLowerCase().includes(query) ||
                instructor.experience.includes(query) ||
                instructor.bio.toLowerCase().includes(query);
            
            if (matches) {
                instructor.element.show();
                visibleCount++;
                
                // Подсветка совпадений в имени
                const $name = instructor.element.find('h4');
                const originalText = $name.text();
                const highlightedText = originalText.replace(
                    new RegExp(query, 'gi'),
                    match => `<span class="highlighted">${match}</span>`
                );
                $name.html(highlightedText);
            } else {
                instructor.element.hide();
            }
        });
        
        // Обновление сообщения
        if (visibleCount === 0) {
            $searchMessage.text('No instructors found. Try different keywords.').css('color', '#f44336');
        } else {
            $searchMessage.text(`Found ${visibleCount} instructor(s)`).css('color', '#4CAF50');
        }
    });
}

// ==================== ФИЛЬТРАЦИЯ В PRICING ====================
function initPricingSearch() {
    const $filterButtons = $('.filter-btn');
    const $cards = $('.card');
    
    if (!$filterButtons.length) return;
    
    // Добавляем data-атрибуты для фильтрации
    $cards.each(function() {
        const $card = $(this);
        const title = $card.find('h3').text().toLowerCase();
        let category = 'all';
        
        if (title.includes('online')) category = 'online';
        else if (title.includes('single')) category = 'single';
        else if (title.includes('morning') || title.includes('weekend')) category = 'package';
        else if (title.includes('monthly')) category = 'monthly';
        else if (title.includes('friend')) category = 'membership';
        else if (title.includes('private')) category = 'private';
        else if (title.includes('student')) category = 'student';
        else if (title.includes('unlimited')) category = 'unlimited';
        
        $card.attr('data-category', category);
    });

    function filterCards() {
        const activeFilter = $('.filter-btn.active').data('filter');
        let visibleCount = 0;
        
        $cards.each(function() {
            const $card = $(this);
            const category = $card.attr('data-category');
            const shouldShow = activeFilter === 'all' || category === activeFilter;
            
            if (shouldShow) {
                $card.removeClass('hidden').fadeIn(300);
                visibleCount++;
            } else {
                $card.addClass('hidden').fadeOut(300);
            }
        });
        
        // Показать сообщение, если ничего не найдено
        if (visibleCount === 0) {
            showNotification('No plans match your filter', 'info');
        }
    }
    
    // Обработчики для кнопок фильтра
    $filterButtons.on('click', function() {
        $filterButtons.removeClass('active');
        $(this).addClass('active');
        filterCards();
    });
    
    // Упрощенный сброс фильтров
    window.resetFilters = function() {
        $filterButtons.removeClass('active');
        $filterButtons.first().addClass('active');
        filterCards();
    };
}
// Обновляем функцию карусели отзывов
function initTestimonialsCarousel() {
    const $wrapper = $('.reviews-wrapper');
    const $slides = $('.review-slide');
    const $prevBtn = $('.nav-btn').first();
    const $nextBtn = $('.nav-btn').last();
    
    if (!$wrapper.length) return;
    
    let currentIndex = 0;
    let slidesToShow = 3;
    
    // Определяем количество показываемых слайдов в зависимости от ширины экрана
    function updateSlidesToShow() {
        if (window.innerWidth <= 600) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 900) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
    }
    
    function updateCarousel() {
        const slideWidth = $slides.outerWidth(true);
        const translateX = -currentIndex * slideWidth;
        $wrapper.css('transform', `translateX(${translateX}px)`);
    }
    
    function nextSlide() {
        if (currentIndex < $slides.length - slidesToShow) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = $slides.length - slidesToShow;
        }
        updateCarousel();
    }
    
    $nextBtn.on('click', nextSlide);
    $prevBtn.on('click', prevSlide);
    
    // Обновляем при изменении размера окна
    $(window).on('resize', function() {
        updateSlidesToShow();
        updateCarousel();
    });
    
    // Автопрокрутка
    let autoScroll = setInterval(nextSlide, 5000);
    
    // Останавливаем автопрокрутку при наведении
    $wrapper.hover(
        function() { clearInterval(autoScroll); },
        function() { autoScroll = setInterval(nextSlide, 5000); }
    );
    
    // Инициализация
    updateSlidesToShow();
    initAdditionalTestimonials();
}

// Обновляем инициализацию в главной функции
$(document).ready(function() {
    // ... остальной код инициализации ...
    
    if ($('.grid').length) initPricingSearch(); // Заменяем на фильтрацию
    if ($('.reviews-wrapper').length) initTestimonialsCarousel();
    
    // ... остальной код ...
});
// Добавляем функцию для бургер меню
function initMobileMenu() {
    const $menuToggle = $('#menuToggle');
    const $navMenu = $('.nav-menu');
    
    if (!$menuToggle.length) return;
    
    $menuToggle.on('click', function() {
        $navMenu.toggleClass('active');
        $menuToggle.text($navMenu.hasClass('active') ? '✕' : '☰');
    });
    
    // Закрываем меню при клике на ссылку
    $navMenu.find('a').on('click', function() {
        $navMenu.removeClass('active');
        $menuToggle.text('☰');
    });
    
    // Закрываем меню при клике вне его
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.header-container').length) {
            $navMenu.removeClass('active');
            $menuToggle.text('☰');
        }
    });
}

// Упрощаем карусель отзывов
function initTestimonialsCarousel() {
    const $slides = $('.review-slide');
    const $prevBtn = $('.nav-btn').first();
    const $nextBtn = $('.nav-btn').last();
    
    if (!$slides.length || $slides.length <= 1) return;
    
    let currentIndex = 0;
    
    function showSlide(index) {
        // Скрываем все слайды
        $slides.removeClass('active').css({
            'opacity': '0',
            'position': 'absolute'
        });
        
        // Показываем текущий слайд
        $slides.eq(index).addClass('active').css({
            'opacity': '1',
            'position': 'relative'
        });
        
        currentIndex = index;
    }
    
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= $slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = $slides.length - 1;
        }
        showSlide(prevIndex);
    }
    
    $nextBtn.on('click', nextSlide);
    $prevBtn.on('click', prevSlide);
    
    // Автопрокрутка
    let autoScroll = setInterval(nextSlide, 5000);
    
    // Останавливаем автопрокрутку при наведении
    $('.testimonials-container').hover(
        function() { 
            clearInterval(autoScroll); 
        },
        function() { 
            autoScroll = setInterval(nextSlide, 5000); 
        }
    );
    
    // Инициализация - показываем первый слайд
    showSlide(0);
}

$(document).ready(function() {
    // Инициализация всех модулей
    initTheme();
    initAnimations();
    initNotifications();
    initScrollProgress();
    initLazyLoading();
    initModals();
    initMobileMenu();
    
    // Страничные инициализации
    if ($('#scheduleTable').length) initCRUD();
    if ($('.team-grid').length) initInstructorSearch();
    if ($('.grid').length) initPricingSearch();
    // УБРАТЬ: if ($('.reviews-wrapper').length) initTestimonialsCarousel();
    if ($('.accordion').length) initAccordion();
    if ($('#contactForm').length) initFormValidation();
    if ($('.stats-section').length) initCounters();
});



// ==================== АНИМИРОВАННЫЕ СЧЁТЧИКИ ====================
function initCounters() {
    const $counters = $('.counter');
    
    if (!$counters.length) return;
    
    // Запускаем анимацию при появлении в viewport
    $(window).on('scroll', function() {
        $counters.each(function() {
            const $counter = $(this);
            const target = parseInt($counter.data('target'));
            const isInViewport = isElementInViewport($counter[0]);
            
            if (isInViewport && !$counter.hasClass('animated')) {
                animateCounter($counter, target);
                $counter.addClass('animated');
            }
        });
    }).scroll(); // Запускаем сразу
}

function animateCounter($element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            $element.text(target);
            clearInterval(timer);
        } else {
            $element.text(Math.floor(current));
        }
    }, stepTime);
}

// ==================== ВАЛИДАЦИЯ ФОРМ ====================
function initFormValidation() {
    const $form = $('#contactForm');
    
    if (!$form.length) return;
    
    // Real-time валидация
    $form.find('input, textarea').on('input', function() {
        validateField($(this));
    });
    
    // Submit валидация
    $form.on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const $fields = $form.find('input, textarea, select');
        
        $fields.each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Показываем loading state
            const $submitBtn = $form.find('button[type="submit"]');
            const originalText = $submitBtn.text();
            $submitBtn.addClass('loading').prop('disabled', true).text('Sending...');
            
            // Имитация отправки
            setTimeout(() => {
                $submitBtn.removeClass('loading').prop('disabled', false).text(originalText);
                showNotification('Thank you! Your message has been sent successfully!', 'success');
                $form[0].reset();
                $form.find('.form-group').removeClass('success error');
                $form.find('.success-message').fadeIn().delay(3000).fadeOut();
            }, 1500);
        } else {
            showNotification('Please correct the errors in the form', 'error');
        }
    });
}

function validateField($field) {
    const value = $field.val().trim();
    const $formGroup = $field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    $formGroup.removeClass('success error');
    
    // Проверка обязательных полей
    if ($field.prop('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Проверка email
    if ($field.attr('type') === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Проверка телефона
    if ($field.attr('type') === 'tel' && value) {
        const phonePattern = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phonePattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Обновление UI
    if (isValid && value) {
        $formGroup.addClass('success');
    } else if (!isValid) {
        $formGroup.addClass('error');
        $formGroup.find('.error-message').text(errorMessage);
    }
    
    return isValid;
}

// ==================== CRUD ТАБЛИЦА (schedule.html) ====================
function initCRUD() {
    // Инициализация данных таблицы
    let scheduleData = [
        { id: 1, day: 'Mon', className: 'Morning Flow', time: '09:00', instructor: 'Elena' },
        { id: 2, day: 'Wed', className: 'Day Energy', time: '15:00', instructor: 'Kate' },
        { id: 3, day: 'Fri', className: 'Evening Relax', time: '18:00', instructor: 'Maya' }
    ];
    
    // Загрузка данных из localStorage
    const savedData = localStorage.getItem('yogaSchedule');
    if (savedData) {
        scheduleData = JSON.parse(savedData);
    }
    
    // Отображение таблицы
    function renderTable() {
        const $tbody = $('#scheduleTable tbody');
        $tbody.empty();
        
        scheduleData.forEach((item, index) => {
            $tbody.append(`
                <tr data-id="${item.id}">
                    <td>${item.day}</td>
                    <td>${item.className}</td>
                    <td>${item.time}</td>
                    <td>${item.instructor}</td>
                    <td>
                        <button class="btn primary small" onclick="editClass(${item.id})">Edit</button>
                        <button class="btn secondary small" onclick="deleteClass(${item.id})">Delete</button>
                    </td>
                </tr>
            `);
        });
        
        // Сохранение в localStorage
        localStorage.setItem('yogaSchedule', JSON.stringify(scheduleData));
    }
    
    // Добавление класса
    window.addClass = function() {
        const day = $('#newDay').val();
        const className = $('#newClassName').val();
        const time = $('#newTime').val();
        const instructor = $('#newInstructor').val();
        
        if (!day || !className || !time || !instructor) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        const newClass = {
            id: Date.now(), // Простой ID на основе времени
            day: day,
            className: className,
            time: time,
            instructor: instructor
        };
        
        scheduleData.push(newClass);
        renderTable();
        
        // Очистка формы
        $('#newDay, #newClassName, #newTime, #newInstructor').val('');
        
        // Анимация добавления
        $(`tr[data-id="${newClass.id}"]`).hide().fadeIn(500);
        showNotification('Class added successfully!', 'success');
    };
    
    // Редактирование класса
    window.editClass = function(id) {
        const classItem = scheduleData.find(item => item.id === id);
        if (!classItem) return;
        
        const newDay = prompt('Enter new day:', classItem.day);
        const newClassName = prompt('Enter new class name:', classItem.className);
        const newTime = prompt('Enter new time:', classItem.time);
        const newInstructor = prompt('Enter new instructor:', classItem.instructor);
        
        if (newDay && newClassName && newTime && newInstructor) {
            classItem.day = newDay;
            classItem.className = newClassName;
            classItem.time = newTime;
            classItem.instructor = newInstructor;
            renderTable();
            showNotification('Class updated successfully!', 'success');
        }
    };
    
    // Удаление класса
    window.deleteClass = function(id) {
        if (!confirm('Are you sure you want to delete this class?')) return;
        
        const $row = $(`tr[data-id="${id}"]`);
        $row.fadeOut(300, function() {
            scheduleData = scheduleData.filter(item => item.id !== id);
            renderTable();
            showNotification('Class deleted successfully!', 'success');
        });
    };
    
    // Поиск в таблице
    $('#tableSearch').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('#scheduleTable tbody tr').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(query));
        });
    });
    
    // Сортировка таблицы
    window.sortTable = function(column) {
        scheduleData.sort((a, b) => {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        });
        renderTable();
        showNotification(`Table sorted by ${column}`, 'info');
    };
    
    // Инициализация таблицы
    renderTable();
}

// ==================== ACCORDION ====================
function initAccordion() {
    $('.acc-btn').on('click', function() {
        const $this = $(this);
        const $panel = $this.next('.acc-panel');
        const $plus = $this.find('.plus');
        
        // Закрываем все остальные
        $('.acc-panel').not($panel).slideUp(300).removeClass('active');
        $('.acc-btn').not($this).removeClass('active');
        $('.acc-btn .plus').not($plus).text('+');
        
        // Переключаем текущий
        $panel.slideToggle(300, function() {
            $(this).toggleClass('active', $panel.is(':visible'));
        });
        $this.toggleClass('active');
        $plus.text($this.hasClass('active') ? '–' : '+');
    });
}

// ==================== TRY FOR FREE КНОПКА ====================
function initTryForFree() {
    $('.try-btn').on('click', function(e) {
        e.preventDefault();
        showModal(`
            <h3>Try Your First Class Free!</h3>
            <p>Experience the Harmony difference with a complimentary yoga session.</p>
            <p><strong>What's included:</strong></p>
            <ul style="text-align: left; margin: 15px 0;">
                <li>60-minute beginner-friendly class</li>
                <li>Professional yoga mat provided</li>
                <li>Small group setting (max 8 people)</li>
                <li>Meet our certified instructors</li>
            </ul>
            <div class="modal-buttons">
                <button class="btn primary" onclick="bookFreeClass()">Book Free Class</button>
                <button class="btn secondary" onclick="closeModal()">Maybe Later</button>
            </div>
        `);
    });
}

function bookFreeClass() {
    showNotification('🎉 Your free class has been booked! We will contact you shortly to confirm.', 'success');
    closeModal();
    setTimeout(() => {
        window.location.href = 'contact.html?type=free_class';
    }, 2000);
}

// Инициализация Try for Free кнопки
$(document).ready(function() {
    initTryForFree();
});

// Инициализация при загрузке страницы
$(window).on('load', function() {
    // Дополнительная инициализация если нужна
});
// ==================== LIGHTBOX GALLERY ====================
function initLightbox() {
    // Создаем lightbox элементы
    if (!$('#lightbox').length) {
        $('body').append(`
            <div id="lightbox" class="lightbox">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-nav">
                    <button class="lightbox-prev">‹</button>
                    <button class="lightbox-next">›</button>
                </div>
                <div class="lightbox-content">
                    <img class="lightbox-img" src="" alt="">
                    <div class="lightbox-caption"></div>
                </div>
            </div>
        `);
    }

    const $lightbox = $('#lightbox');
    const $lightboxImg = $('.lightbox-img');
    const $lightboxCaption = $('.lightbox-caption');
    let currentImageIndex = 0;
    let images = [];

    // Инициализация галереи для pricing page
    function initPricingGallery() {
        images = [];
        $('.card img').each(function(index) {
            const $img = $(this);
            images.push({
                src: $img.attr('src'),
                alt: $img.attr('alt'),
                title: $img.closest('.card').find('h3').text()
            });
            
            // Добавляем обработчик клика
            $img.css('cursor', 'pointer');
            $img.on('click', function() {
                openLightbox(index);
            });
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        $lightbox.addClass('active');
        $('body').css('overflow', 'hidden'); // Блокируем скролл
    }

    function closeLightbox() {
        $lightbox.removeClass('active');
        $('body').css('overflow', 'auto'); // Разблокируем скролл
    }

    function updateLightbox() {
        const image = images[currentImageIndex];
        $lightboxImg.attr('src', image.src).attr('alt', image.alt);
        $lightboxCaption.text(image.title || image.alt);
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    // Обработчики событий
    $('.lightbox-close').on('click', closeLightbox);
    $('.lightbox-prev').on('click', prevImage);
    $('.lightbox-next').on('click', nextImage);

    // Закрытие по клику на фон
    $lightbox.on('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // Навигация клавиатурой
    $(document).on('keydown', function(e) {
        if (!$lightbox.hasClass('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Инициализация галереи при загрузке
    if ($('.grid').length) {
        initPricingGallery();
    }
}

// ==================== GALLERY FILTERING ====================
function initGalleryFiltering() {
    const $filterButtons = $('.gallery-filter-btn');
    const $cards = $('.card');
    
    if (!$filterButtons.length) return;
    
    // Добавляем data-атрибуты для фильтрации
    $cards.each(function() {
        const $card = $(this);
        const title = $card.find('h3').text().toLowerCase();
        let category = 'all';
        
        if (title.includes('online')) category = 'online';
        else if (title.includes('single')) category = 'single';
        else if (title.includes('morning') || title.includes('weekend')) category = 'package';
        else if (title.includes('monthly')) category = 'monthly';
        else if (title.includes('friend')) category = 'membership';
        else if (title.includes('private')) category = 'private';
        else if (title.includes('student')) category = 'student';
        else if (title.includes('unlimited')) category = 'unlimited';
        
        $card.attr('data-category', category);
    });

    $filterButtons.on('click', function() {
        const filter = $(this).data('filter');
        
        $filterButtons.removeClass('active');
        $(this).addClass('active');
        
        $cards.each(function() {
            const $card = $(this);
            const category = $card.attr('data-category');
            
            if (filter === 'all' || category === filter) {
                $card.fadeIn(300);
            } else {
                $card.fadeOut(300);
            }
        });
        
        showNotification(`Showing ${filter} plans`, 'info');
    });
}
// ==================== PASSWORD VALIDATION ====================
function initPasswordValidation() {
    const $password = $('#password');
    const $confirmPassword = $('#confirmPassword');
    const $passwordStrength = $('.password-strength');
    const $strengthFill = $('.strength-fill');
    const $strengthText = $('.strength-text');

    if (!$password.length) return;

    function checkPasswordStrength(password) {
        let strength = 0;
        let feedback = '';

        // Length check
        if (password.length >= 8) strength++;
        else feedback = 'Password should be at least 8 characters';

        // Lowercase check
        if (/[a-z]/.test(password)) strength++;
        else feedback = 'Add lowercase letters';

        // Uppercase check
        if (/[A-Z]/.test(password)) strength++;
        else feedback = 'Add uppercase letters';

        // Numbers check
        if (/[0-9]/.test(password)) strength++;
        else feedback = 'Add numbers';

        // Special characters check
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback = 'Add special characters';

        // Update UI
        $passwordStrength.addClass('visible');
        $strengthFill.removeClass('weak medium strong');

        if (password.length === 0) {
            $passwordStrength.removeClass('visible');
            return { strength: 0, feedback: '' };
        }

        if (strength <= 2) {
            $strengthFill.addClass('weak');
            $strengthText.text('Weak password').css('color', 'var(--error)');
        } else if (strength <= 4) {
            $strengthFill.addClass('medium');
            $strengthText.text('Medium password').css('color', 'var(--warning)');
        } else {
            $strengthFill.addClass('strong');
            $strengthText.text('Strong password').css('color', 'var(--success)');
        }

        return { strength, feedback };
    }

    $password.on('input', function() {
        const password = $(this).val();
        checkPasswordStrength(password);
        validatePasswordMatch();
    });

    function validatePasswordMatch() {
        const password = $password.val();
        const confirmPassword = $confirmPassword.val();
        const $confirmGroup = $confirmPassword.closest('.form-group');

        $confirmGroup.removeClass('success error');

        if (confirmPassword.length === 0) return true;

        if (password === confirmPassword) {
            $confirmGroup.addClass('success');
            return true;
        } else {
            $confirmGroup.addClass('error');
            $confirmGroup.find('.error-message').text('Passwords do not match');
            return false;
        }
    }

    $confirmPassword.on('input', validatePasswordMatch);
}

// Обновим функцию validateField для паролей
function validateField($field) {
    const value = $field.val().trim();
    const $formGroup = $field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    $formGroup.removeClass('success error');
    
    // Проверка обязательных полей
    if ($field.prop('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Проверка email
    if ($field.attr('type') === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Проверка телефона
    if ($field.attr('type') === 'tel' && value) {
        const phonePattern = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phonePattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Проверка пароля (минимальная длина)
    if ($field.attr('type') === 'password' && $field.attr('id') === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long';
        }
    }
    
    // Обновление UI
    if (isValid && value) {
        $formGroup.addClass('success');
    } else if (!isValid) {
        $formGroup.addClass('error');
        $formGroup.find('.error-message').text(errorMessage);
    }
    
    return isValid;
}