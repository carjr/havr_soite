// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    
    if (mobileMenuToggle && mobileMenuContent) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuContent.classList.toggle('active');
            
            // Change icon
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileMenuContent.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            
            // Refresh lucide icons
            lucide.createIcons();
        });
    }
});

// Close mobile menu function
function closeMobileMenu() {
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileMenuContent) {
        mobileMenuContent.classList.remove('active');
        
        // Reset icon
        const icon = mobileMenuToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 64; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 4000);
}

// WhatsApp mask and validation
let whatsappValid = false;
let validationTimeout = null;

function applyWhatsAppMask(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.substring(0, 11);
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length >= 1) {
        value = value.replace(/^(\d{0,2})$/, '($1');
    }
    
    input.value = value;
}

function getNumbersOnly(phone) {
    return phone.replace(/\D/g, '');
}

async function validateWhatsApp(phoneNumber) {
    try {
        console.log('Validando número:', phoneNumber);
        
        // First validate format
        if (phoneNumber.length !== 11 || !phoneNumber.match(/^[1-9][1-9][9][0-9]{8}$/)) {
            console.log('Número inválido - formato incorreto');
            return false;
        }
        
        // Call Evolution API directly
        const fullNumber = `55${phoneNumber}`;
        const requestBody = {
            numbers: [fullNumber]
        };
        
        console.log('=== CHAMADA DA API ===');
        console.log('URL:', 'https://evolutionapi.eduflow.com.br/chat/whatsappNumbers/havr');
        console.log('Method:', 'POST');
        console.log('Headers:', {
            'Content-Type': 'application/json',
            'apikey': 'vyspKHAUPJcGL5RkvdBrdUBGMDmnS6AG'
        });
        console.log('Body enviado:', JSON.stringify(requestBody));
        console.log('Número completo:', fullNumber);
        
        const response = await fetch('https://evolutionapi.eduflow.com.br/chat/whatsappNumbers/havr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'vyspKHAUPJcGL5RkvdBrdUBGMDmnS6AG'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('=== RESPOSTA DA API ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        let responseText = '';
        try {
            responseText = await response.text();
            console.log('Resposta bruta:', responseText);
        } catch (e) {
            console.error('Erro ao ler resposta:', e);
        }
        
        if (!response.ok) {
            console.error('=== ERRO NA API ===');
            console.error('Status:', response.status);
            console.error('Resposta completa:', responseText);
            // Se a API falhar, usar validação por formato como fallback
            return true;
        }
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('=== DADOS PARSEADOS ===');
            console.log('Resposta JSON:', data);
        } catch (e) {
            console.error('Erro ao parsear JSON:', e);
            console.log('Resposta não é JSON válido:', responseText);
            return true;
        }
        
        // Verificar se o número existe no WhatsApp
        if (data && Array.isArray(data) && data.length > 0) {
            const numberInfo = data[0];
            const hasWhatsApp = numberInfo.exists === true;
            console.log('Número tem WhatsApp:', hasWhatsApp);
            return hasWhatsApp;
        }
        
        // Se não conseguir validar, assumir que é válido
        console.log('Resposta inesperada da API, assumindo válido');
        return true;
    } catch (error) {
        console.error('Erro ao validar WhatsApp:', error);
        // Em caso de erro, assumir que o número é válido para não bloquear o usuário
        return true;
    }
}

function updateWhatsAppStatus(input, statusDiv, isValid, message) {
    statusDiv.className = 'whatsapp-status';
    input.className = 'form-input';
    
    if (isValid === null) {
        statusDiv.classList.add('validating');
        statusDiv.textContent = message;
    } else if (isValid) {
        statusDiv.classList.add('valid');
        input.classList.add('valid');
        statusDiv.textContent = message;
        whatsappValid = true;
    } else {
        statusDiv.classList.add('invalid');
        input.classList.add('invalid');
        statusDiv.textContent = message;
        whatsappValid = false;
    }
    
    updateSubmitButton();
}

function updateSubmitButton() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = !whatsappValid;
    }
}

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const whatsappInput = document.getElementById('whatsapp');
    const whatsappStatus = document.getElementById('whatsapp-status');
    
    // Initialize submit button as disabled
    updateSubmitButton();
    
    // WhatsApp input event listeners
    if (whatsappInput && whatsappStatus) {
        whatsappInput.addEventListener('input', function(e) {
            applyWhatsAppMask(e.target);
            
            const numbersOnly = getNumbersOnly(e.target.value);
            
            // Clear previous timeout
            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }
            
            // Reset validation state
            whatsappValid = false;
            updateSubmitButton();
            
            if (numbersOnly.length === 11) {
                // Show validating status
                updateWhatsAppStatus(whatsappInput, whatsappStatus, null, 'Verificando número...');
                
                // Set timeout for validation
                validationTimeout = setTimeout(async () => {
                    // Remove the leading 55 if it exists to avoid duplication
                    let cleanNumber = numbersOnly;
                    if (cleanNumber.startsWith('55') && cleanNumber.length === 13) {
                        cleanNumber = cleanNumber.substring(2);
                    }
                    
                    const isValid = await validateWhatsApp(cleanNumber);
                    
                    if (isValid) {
                        updateWhatsAppStatus(whatsappInput, whatsappStatus, true, 'Número válido! ✓');
                    } else {
                        updateWhatsAppStatus(whatsappInput, whatsappStatus, false, 'Este número não possui WhatsApp. Digite um número válido.');
                    }
                }, 1000);
            } else if (numbersOnly.length > 0) {
                updateWhatsAppStatus(whatsappInput, whatsappStatus, false, 'Digite um número completo (11 dígitos)');
            } else {
                whatsappStatus.className = 'whatsapp-status';
            }
        });
        
        // Prevent non-numeric input
        whatsappInput.addEventListener('keypress', function(e) {
            if (!/[\d\(\)\s\-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const whatsapp = formData.get('whatsapp');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !whatsapp || !message) {
                showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // WhatsApp validation
            if (!whatsappValid) {
                showToast('Por favor, insira um número de WhatsApp válido.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            try {
                // Simulate form submission (replace with actual endpoint if needed)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                // Reset form and validation state
                contactForm.reset();
                whatsappValid = false;
                whatsappStatus.className = 'whatsapp-status';
                updateSubmitButton();
                
                // Optional: Redirect to WhatsApp with pre-filled message
                const whatsappMessage = encodeURIComponent(
                    `Olá! Meu nome é ${name} e gostaria de saber mais sobre os serviços da HAVR Tecnologia. Meu WhatsApp é ${whatsapp}. Deixei uma mensagem através do site: ${message}`
                );
                
                setTimeout(() => {
                    window.open(`https://wa.me/5517992331492?text=${whatsappMessage}`, '_blank');
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                showToast('Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.', 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = !whatsappValid;
                submitButton.classList.remove('loading');
            }
        });
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards, system cards, and other elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .system-card, .advantage-item, .about-stat, .contact-form-wrapper, .contact-info'
    );
    
    elementsToAnimate.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Start observing
        observer.observe(element);
    });
});

// Smooth scrolling for all internal links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Add active class to navigation based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(currentSection)) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active navigation state
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary) !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Optimize images loading (excluding logo and critical images)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img:not(.logo):not(.hero-image):not(.system-image)');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.warn('Erro ao carregar imagem:', this.src);
            // You could add a placeholder image here if needed
        });
        
        // Set initial opacity for smooth loading (but not for logo or system images)
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Ensure logo and system images are always visible
    const criticalImages = document.querySelectorAll('.logo, .system-image');
    criticalImages.forEach(img => {
        img.style.opacity = '1';
        img.style.display = 'block';
    });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add click tracking for analytics (optional)
function trackEvent(category, action, label) {
    // You can integrate with Google Analytics, Facebook Pixel, or other analytics tools here
    console.log('Event tracked:', { category, action, label });
}

// Track WhatsApp clicks
document.addEventListener('DOMContentLoaded', function() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('WhatsApp', 'Click', this.getAttribute('data-testid') || 'Unknown');
        });
    });
});

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('Form', 'Submit', 'Contact Form');
        });
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    }, 250);
});

// Add smooth scroll behavior for older browsers
function smoothScrollTo(target, duration = 800) {
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - 64;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Fallback for browsers that don't support CSS scroll-behavior
if (!CSS.supports('scroll-behavior', 'smooth')) {
    // Override scrollToSection for smooth scrolling fallback
    window.scrollToSection = function(sectionId) {
        smoothScrollTo(sectionId);
    };
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Force logo and system images visibility as fallback
    setTimeout(function() {
        const criticalImages = document.querySelectorAll('.logo, .system-image');
        criticalImages.forEach(img => {
            img.style.opacity = '1';
            img.style.display = 'block';
            img.style.visibility = 'visible';
        });
    }, 100);
    
    console.log('HAVR Tecnologia website loaded successfully!');
});