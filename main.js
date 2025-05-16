// Галерея изображений
const galleryItems = document.querySelectorAll('.gallery-item');
const popup = document.querySelector('.popup-gallery');
const popupImg = document.getElementById('popup-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;

// ==================== ФИКСАЦИЯ МЕНЮ ПРИ СКРОЛЛЕ ====================
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


/*-------------------contact form----------------*/
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        document.getElementById('name').addEventListener('blur', validateName);
        document.getElementById('email').addEventListener('blur', validateEmail);
        document.getElementById('phone').addEventListener('blur', validatePhone);
        document.getElementById('message').addEventListener('blur', validateMessage);
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        resetErrors();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            
            submitBtn.classList.add('sending');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // В 90% случаев показываем успех, в 10% - ошибку
                const isSuccess = Math.random() > 0.1;
                
                if (isSuccess) {
                    submitBtn.classList.remove('sending');
                    submitBtn.classList.add('success');
                    btnText.textContent = 'SUCCESS!';
                    
                    formSuccess.style.display = 'block';
                    form.reset();
                    
                    // Через 2 секунды возвращаем кнопку в исходное состояние
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                        btnText.textContent = 'SUBMIT';
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    submitBtn.classList.remove('sending');
                    submitBtn.classList.add('error');
                    btnText.textContent = 'ERROR! TRY AGAIN';
                    
                    setTimeout(() => {
                        submitBtn.classList.remove('error');
                        btnText.textContent = 'SUBMIT';
                        submitBtn.disabled = false;
                    }, 2000);
                }
            }, 1500);
        }
    }
    
    function validateName() {
        const input = document.getElementById('name');
        const error = document.getElementById('name-error');
        const value = input.value.trim();
        
        if (!value) {
            showError(input, error, 'Name is required');
            return false;
        }
        
        if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
            showError(input, error, 'Only letters, spaces and hyphens are allowed');
            return false;
        }
        
        return true;
    }
    
    function validateEmail() {
        const input = document.getElementById('email');
        const error = document.getElementById('email-error');
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            showError(input, error, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            showError(input, error, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    function validatePhone() {
        const input = document.getElementById('phone');
        const error = document.getElementById('phone-error');
        const value = input.value.trim();
        
        // Поле телефона необязательное
        if (!value) return true;
        
        const phoneRegex = /^(\+?\d{1,3}[\s\-]?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        
        if (!phoneRegex.test(value)) {
            showError(input, error, 'Please enter a valid phone number');
            return false;
        }
        
        return true;
    }
    
    function validateMessage() {
        const input = document.getElementById('message');
        const error = document.getElementById('message-error');
        const value = input.value.trim();
        const messageRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\s\.,!?\-'"\n]+$/;
        if (!value) {
            showError(input, error, 'Message is required');
            return false;
        }
        if (!messageRegex.test(value)) {
            showError(input, error, 'Only English/Russian letters, numbers and basic punctuation are allowed');
            return false;
        }
        if (value.length < 10) {
            showError(input, error, 'Message should be at least 10 characters long');
            return false;
        }
        return true;
    }
    
    function showError(input, errorElement, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('invalid');
        errorElement.textContent = message;
    }

    function resetErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const formGroups = document.querySelectorAll('.form-group');
        
        errorMessages.forEach(el => el.textContent = '');
        formGroups.forEach(el => el.classList.remove('invalid'));
        formSuccess.style.display = 'none';
    }

    function sendFormData() {
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };   
        showSuccess();
        form.reset();
    }

    function showSuccess() {
        formSuccess.style.display = 'block';
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    }
});


/* -----------АНИМАЦИЯ ТЕНИ ----------------- */
// Переменные для отслеживания движения мыши
let lastMouseX = 0;
let lastMouseY = 0;
let lastTimestamp = 0;
let speed = 0;
const button = document.getElementById('open-feedback-btn');

// Функция для вычисления скорости мыши
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

// Замедление тени со временем
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