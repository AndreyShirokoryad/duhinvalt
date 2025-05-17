// Галерея изображений
const galleryItems = document.querySelectorAll('.gallery-item');
const popup = document.querySelector('.popup-gallery');
const popupImg = document.getElementById('popup-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;

// ----------------- ФИКСАЦИЯ МЕНЮ ПРИ СКРОЛЛЕ -------------------
const header = document.getElementById('header');
const mainStage = document.getElementById('main-stage');

function handleScroll() {
    const mainStageHeight = mainStage.offsetHeight;
    if (window.scrollY > mainStageHeight * 0.9) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

const feedbackPopup = document.querySelector('.feedback-popup');
const openFeedbackBtn = document.getElementById('open-feedback-btn');
let currentWorkingButtonIndex = null;

function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
}

function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Функции для галереи изображений
function openGalleryPopup(index) {
    currentIndex = index;
    popupImg.src = galleryItems[currentIndex].src;
    popup.classList.add('active');
    disableScroll();
    updateNavButtons();
}

function closeGalleryPopup() {
    popup.classList.remove('active');
    setTimeout(enableScroll, 300);
}

function updateNavButtons() {
    prevBtn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
    nextBtn.style.visibility = currentIndex < galleryItems.length - 1 ? 'visible' : 'hidden';
}

// Функции для формы обратной связи
function openFeedbackPopup() {
    feedbackPopup.classList.add('active');
    disableScroll();
    
    const closeButtons = document.querySelectorAll('.close-feedback');
    
    // Сбрасываем все кнопки
    closeButtons.forEach(btn => {
        btn.classList.remove('wrong');
        btn.style.display = 'flex';
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1) rotate(0deg)';
        btn.onclick = null;
    });
    
    // Выбираем случайный рабочий крестик
    currentWorkingButtonIndex = Math.floor(Math.random() * closeButtons.length);
    
    // Назначаем обработчики
    closeButtons.forEach((button, index) => {
        if (index === currentWorkingButtonIndex) {
            button.onclick = closeFeedbackPopup;
        } else {
            button.onclick = function() {
                this.classList.add('wrong');
                setTimeout(() => {
                    this.style.display = 'none';
                }, 600);
            };
        }
    });
}

function closeFeedbackPopup() {
    feedbackPopup.classList.remove('active');
    setTimeout(enableScroll, 300);
}

// Обработчики событий для галереи
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openGalleryPopup(index));
});

closeBtn.addEventListener('click', closeGalleryPopup);

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        popupImg.src = galleryItems[currentIndex].src;
        updateNavButtons();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < galleryItems.length - 1) {
        currentIndex++;
        popupImg.src = galleryItems[currentIndex].src;
        updateNavButtons();
    }
});

// Обработчики для формы обратной связи
openFeedbackBtn.addEventListener('click', openFeedbackPopup);

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (popup.classList.contains('active')) closeGalleryPopup();
    }
}); 

// Закрытие при нажатии на x (икс) или x (хэ)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'x' || e.key.toLowerCase() === 'х') {
        if (feedbackPopup.classList.contains('active')) closeFeedbackPopup();
    }
});


// Закрытие при нажатии на вне попапа
document.addEventListener('DOMContentLoaded', function() {
    feedbackPopup.addEventListener('click', function(e) {
        if (e.target === feedbackPopup) {
            closeFeedbackPopup();
        }
    });
});

// WELCOME POPUP
if (!localStorage.getItem('welcomePopupClosed')) {
    setTimeout(() => {
        const popup = document.querySelector('.welcome-delayed-popup');
        popup.style.display = 'flex';
        
        document.querySelector('.welcome-popup-close-btn').addEventListener('click', closeWelcomePopup);
        
        document.querySelectorAll('.welcome-popup-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                closeWelcomePopup();
            });
        });
    }, 30000);
}

function closeWelcomePopup() {
    const popup = document.querySelector('.welcome-delayed-popup');
    popup.classList.add('welcome-popup-hiding');
    
    setTimeout(() => {
        popup.style.display = 'none';
        localStorage.setItem('welcomePopupClosed', 'true');
    }, 300);
}

// Таймер до окончания 1 курса на 21 июня 2025
function updateYearCountdown() {
    const endDate = new Date('June 21, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = endDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('year-days').textContent = days.toString().padStart(2, '0');
    document.getElementById('year-hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('year-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('year-seconds').textContent = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        document.querySelector('.year-countdown').innerHTML = 
            '<span style="color:#4CAF50">1st year completed!</span>';
    }
}

// Запускаем таймер
setInterval(updateYearCountdown, 1000);
updateYearCountdown();

/*-------------------contact forms handling----------------*/
document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы
    const mainForm = document.querySelector('#contact .contact-form');
    const popupForm = document.querySelector('.feedback-popup .contact-form');
    const formSuccess = document.getElementById('form-success');
    
    // Обработчики для обеих форм
    [mainForm, popupForm].forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmit(e, form);
            });
            
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(input, form);
                });
            });
        }
    });
    
    function validateField(input, form) {
        const name = input.getAttribute('name');
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(name) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
                    errorMessage = 'Only letters, spaces and hyphens are allowed';
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value && !/^(\+?\d{1,3}[\s\-]?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (!/^[a-zA-Zа-яА-ЯёЁ0-9\s\.,!?\-'"\n]+$/.test(value)) {
                    errorMessage = 'Only English/Russian letters, numbers and basic punctuation are allowed';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message should be at least 10 characters long';
                    isValid = false;
                }
                break;
        }
        
        const errorElement = input.nextElementSibling || 
                           input.closest('.form-group').querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            input.closest('.form-group').classList.toggle('invalid', !isValid);
        }
        
        return isValid;
    }
    
    function handleFormSubmit(e, form) {
        e.preventDefault();
        
        // Валидируем все поля
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            const isValid = validateField(input, form);
            if (!isValid) isFormValid = false;
        });
        
        if (isFormValid) {
            const submitBtn = form.querySelector('.submit-btn') || 
                             form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
            
            if (submitBtn) {
                submitBtn.classList.add('sending');
                submitBtn.disabled = true;
                
                if (btnText) btnText.textContent = 'SENDING...';
            }
            
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1;
                
                if (submitBtn) {
                    if (isSuccess) {
                        submitBtn.classList.remove('sending');
                        submitBtn.classList.add('success');
                        if (btnText) btnText.textContent = 'SUCCESS!';
                        
                        if (form === mainForm && formSuccess) {
                            formSuccess.style.display = 'block';
                        }
                        
                        form.reset();
                        
                        setTimeout(() => {
                            submitBtn.classList.remove('success');
                            if (btnText) btnText.textContent = 'SUBMIT';
                            submitBtn.disabled = false;
                            
                            if (form === popupForm) {
                                setTimeout(() => {
                                    closeFeedbackPopup();
                                }, 500);
                            }
                        }, 2000);
                    } else {
                        submitBtn.classList.remove('sending');
                        submitBtn.classList.add('error');
                        if (btnText) btnText.textContent = 'ERROR! TRY AGAIN';
                        
                        setTimeout(() => {
                            submitBtn.classList.remove('error');
                            if (btnText) btnText.textContent = 'SUBMIT';
                            submitBtn.disabled = false;
                        }, 2000);
                    }
                }
            }, 1500);
        }
    }
});

/* -----------АНИМАЦИЯ ТЕНИ ----------------- */
let lastMouseX = 0;
let lastMouseY = 0;
let lastTimestamp = 0;
let speed = 0;
const button = document.getElementById('open-feedback-btn');

function trackMouseSpeed(e) {
  const now = performance.now();
  const timeDiff = now - lastTimestamp;
  
  if (timeDiff > 0) {
    const distance = Math.sqrt(
      Math.pow(e.clientX - lastMouseX, 2) + 
      Math.pow(e.clientY - lastMouseY, 2)
    );
    
    speed = distance / timeDiff;
    updateButtonShadow();
  }
  
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lastTimestamp = now;
}

function updateButtonShadow() {
  const maxSpeed = 2;
  const normalizedSpeed = Math.min(speed, maxSpeed) / maxSpeed;
  const shadowIntensity = normalizedSpeed * 10;
  
  button.style.boxShadow = `0 0 ${shadowIntensity}px ${shadowIntensity/2}px rgba(106, 50, 159, ${0.4 + normalizedSpeed * 0.3})`;
}

function decayShadow() {
  if (speed > 0.2) {
    updateButtonShadow();
    requestAnimationFrame(decayShadow);
  } else {
    button.style.boxShadow = 'none';
  }
}

document.addEventListener('mousemove', trackMouseSpeed);
button.addEventListener('mouseenter', () => {
  lastTimestamp = performance.now();
});
button.addEventListener('mouseleave', () => {
  decayShadow();
  speed = 0;
});

// Фильтрация галереи
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');            
            
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else {
                    const tags = item.getAttribute('data-tags');
                    item.style.display = tags.includes(filter) ? 'block' : 'none';
                }
            });
        });
    });
});
