// ============================================
// NAVARO Portfolio - 3D Interactive JavaScript
// ============================================

// Detect device type and capabilities
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ============================================
// IntersectionObserver for Scroll Animations (Responsive)
// ============================================

// Adjust observer options based on screen size
const getObserverOptions = () => {
    if (isSmallScreen) {
        return {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        };
    }
    return {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            if (isSmallScreen) {
                observer.unobserve(entry.target);
            }
        }
    });
}, getObserverOptions());

// Observe all elements that need animation
document.querySelectorAll('.section-title, .bio-card, .album-card, .music-card, .social-link, .press-card, .fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// 3D Tilt Effect for Cards (Responsive)
// ============================================

function init3DTilt(element, maxRotation = 15) {
    // Reduce rotation on mobile devices
    const rotation = isSmallScreen ? maxRotation * 0.3 : maxRotation;
    
    // Only apply 3D tilt on non-touch devices or large screens
    if (isTouchDevice && isSmallScreen) {
        // Use simple scale effect for touch devices
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        });
        return;
    }
    
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -rotation;
        const rotateY = ((x - centerX) / centerX) * rotation;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
}

// Apply 3D tilt to bio cards (reduced on mobile)
document.querySelectorAll('.bio-card').forEach(card => {
    init3DTilt(card, isSmallScreen ? 5 : 10);
});

// Apply 3D tilt to music cards (reduced on mobile)
document.querySelectorAll('.music-card').forEach(card => {
    init3DTilt(card, isSmallScreen ? 4 : 8);
});

// Apply 3D tilt to social links (reduced on mobile)
document.querySelectorAll('.social-link').forEach(link => {
    init3DTilt(link, isSmallScreen ? 6 : 12);
});

// ============================================
// Parallax Effect on Scroll (Responsive)
// ============================================

let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    // Reduce parallax intensity on mobile for performance
    const parallaxIntensity = isSmallScreen ? 0.2 : 0.5;
    const imageIntensity = isSmallScreen ? 0.1 : 0.3;
    const contentIntensity = isSmallScreen ? 0.05 : 0.2;
    
    const scrolled = window.scrollY;
    const parallaxLayer = document.querySelector('.parallax-layer');
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    
    // Disable parallax on very small screens for performance
    if (isSmallScreen && window.innerWidth < 400) {
        if (parallaxLayer) parallaxLayer.style.transform = 'none';
        if (heroImage) heroImage.style.transform = 'none';
        if (heroContent) heroContent.style.transform = 'none';
        ticking = false;
        return;
    }
    
    if (parallaxLayer) {
        parallaxLayer.style.transform = `translateY(${scrolled * parallaxIntensity}px)`;
    }
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * imageIntensity}px) translateZ(0) rotateY(0deg)`;
    }
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * contentIntensity}px)`;
    }
    
    ticking = false;
}

// Throttled scroll handler
const throttledParallax = throttle(() => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, 16);

window.addEventListener('scroll', throttledParallax, { passive: true });

// ============================================
// Mouse Movement Parallax for Hero (Desktop Only)
// ============================================

const hero = document.querySelector('.hero');
const heroImageContainer = document.querySelector('.hero-image-container');

// Only enable mouse parallax on desktop
if (hero && heroImageContainer && !isTouchDevice && !isSmallScreen) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / centerX * 30;
        const moveY = (y - centerY) / centerY * 30;
        
        heroImageContainer.style.transform = `translateY(-50%) translateX(${moveX}px) translateY(${moveY}px)`;
        
        // Also affect hero content slightly
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const contentMoveX = (x - centerX) / centerX * 10;
            const contentMoveY = (y - centerY) / centerY * 10;
            heroContent.style.transform = `translateX(${contentMoveX}px) translateY(${contentMoveY}px)`;
        }
    });
    
    hero.addEventListener('mouseleave', () => {
        heroImageContainer.style.transform = 'translateY(-50%) translateX(0) translateY(0)';
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = 'translateX(0) translateY(0)';
        }
    });
}

// ============================================
// 3D Button Hover Effects (Responsive)
// ============================================

document.querySelectorAll('[data-button]').forEach(button => {
    // Only apply 3D effects on desktop
    if (isTouchDevice && isSmallScreen) {
        // Simple touch feedback for mobile
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        });
        return;
    }
    
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Continuous Floating Animation for Hero Image (Responsive)
// ============================================

function animateHeroImage() {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;
    
    // Reduce animation intensity on mobile
    const floatRange = isSmallScreen ? 10 : 20;
    const rotationRange = isSmallScreen ? 2 : 5;
    const speed = isSmallScreen ? 0.2 : 0.5;
    
    let rotation = 0;
    let floatY = 0;
    let direction = 1;
    let animationId;
    
    function animate() {
        // Pause animation when not visible or on very small screens
        if (isSmallScreen && window.innerWidth < 400) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        rotation += speed;
        floatY += 0.3 * direction;
        
        if (floatY > floatRange || floatY < -floatRange) {
            direction *= -1;
        }
        
        const scrollOffset = isSmallScreen ? window.scrollY * 0.1 : window.scrollY * 0.3;
        heroImage.style.transform = `
            translateY(${floatY + scrollOffset}px) 
            translateZ(${Math.sin(rotation * Math.PI / 180) * (floatRange * 0.5)}px) 
            rotateY(${Math.sin(rotation * Math.PI / 180) * rotationRange}deg)
        `;
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation only if image is visible
    if (heroImage.offsetParent !== null) {
        animate();
    }
    
    // Pause animation when page is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// Start hero image animation
if (!isSmallScreen || window.innerWidth >= 400) {
    animateHeroImage();
}

// ============================================
// 3D Social Icon Rotation on Hover (Responsive)
// ============================================

document.querySelectorAll('[data-social]').forEach(socialLink => {
    const icon = socialLink.querySelector('.social-icon');
    
    // Simplified animation for mobile
    if (isTouchDevice && isSmallScreen) {
        socialLink.addEventListener('touchstart', () => {
            icon.style.transform = 'scale(1.1)';
        });
        
        socialLink.addEventListener('touchend', () => {
            icon.style.transform = 'scale(1)';
        });
        return;
    }
    
    socialLink.addEventListener('mouseenter', () => {
        let rotation = 0;
        const rotate = () => {
            rotation += 10;
            if (rotation < 360) {
                icon.style.transform = `scale(1.2) rotateY(${rotation}deg)`;
                requestAnimationFrame(rotate);
            } else {
                icon.style.transform = 'scale(1.2) rotateY(360deg)';
            }
        };
        rotate();
    });
    
    socialLink.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotateY(0deg)';
    });
});

// ============================================
// Press Cards 3D Stack Effect (Responsive)
// ============================================

document.querySelectorAll('.press-card').forEach((card, index) => {
    // Reduce stack depth on mobile
    const stackDepth = isSmallScreen ? index * -5 : index * -10;
    card.style.transform = `translateX(0) rotateY(0deg) translateZ(${stackDepth}px)`;
    
    if (isTouchDevice && isSmallScreen) {
        // Simple touch feedback for mobile
        card.addEventListener('touchstart', () => {
            card.style.transform = `translateX(5px) translateZ(10px)`;
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = `translateX(0) rotateY(0deg) translateZ(${stackDepth}px)`;
        });
        return;
    }
    
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
        const liftAmount = isSmallScreen ? 20 : 50;
        card.style.transform = 'translateX(10px) rotateY(5deg) translateZ(' + liftAmount + 'px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
        card.style.transform = `translateX(0) rotateY(0deg) translateZ(${stackDepth}px)`;
    });
});

// ============================================
// Contact Form Handling with FormSubmit.co
// ============================================

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Get form elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

// Error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// Function to show error message
function showError(input, errorElement, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Add shake animation
    input.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

// Function to show success state
function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Function to clear error
function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Real-time validation
if (nameInput) {
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Full name is required');
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
        } else {
            showSuccess(nameInput);
        }
    });
    
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            clearError(nameInput);
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'Email address is required');
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address');
        } else {
            showSuccess(emailInput);
        }
    });
    
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '' && emailRegex.test(emailInput.value.trim())) {
            clearError(emailInput);
        }
    });
}

if (messageInput) {
    messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim() === '') {
            showError(messageInput, messageError, 'Message is required');
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters');
        } else {
            showSuccess(messageInput);
        }
    });
    
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            clearError(messageInput);
        }
    });
}

// Form submission handler
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset all errors
        clearError(nameInput);
        clearError(emailInput);
        clearError(messageInput);
        
        let isValid = true;
        
        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, nameError, 'Full name is required');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess(nameInput);
        }
        
        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, emailError, 'Email address is required');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }
        
        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput, messageError, 'Message is required');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            showSuccess(messageInput);
        }
        
        // If validation fails, scroll to first error
        if (!isValid) {
            const firstError = contactForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Add ripple effect to button
        submitBtn.classList.add('ripple');
        setTimeout(() => {
            submitBtn.classList.remove('ripple');
        }, 600);
        
        // Show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText) btnText.style.display = 'none';
        if (btnIcon) btnIcon.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
        
        submitBtn.disabled = true;
        
        // Create a hidden iframe for form submission (prevents page reload)
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe_' + Date.now();
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
        
        // Set form target to iframe
        const originalTarget = contactForm.target;
        contactForm.target = iframe.name;
        
        // Handle iframe load (form submission complete)
        iframe.onload = function() {
            // FormSubmit.co redirects to a success page
            // Since we can't access iframe content due to CORS, we'll show success after a delay
            setTimeout(() => {
                // Show success message
                if (formSuccess) {
                    formSuccess.style.display = 'flex';
                    contactForm.style.display = 'none';
                }
                
                // Reset form
                contactForm.reset();
                
                // Clear all errors
                clearError(nameInput);
                clearError(emailInput);
                clearError(messageInput);
                
                // Scroll to success message
                if (formSuccess) {
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Reset button state
                if (btnText) btnText.style.display = 'flex';
                if (btnIcon) btnIcon.style.display = 'flex';
                if (btnLoading) btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                
                // Clean up iframe
                setTimeout(() => {
                    if (iframe.parentNode) {
                        document.body.removeChild(iframe);
                    }
                    contactForm.target = originalTarget;
                }, 1000);
            }, 1500);
        };
        
        // Fallback: If iframe doesn't load within 5 seconds, show success anyway
        setTimeout(() => {
            if (submitBtn.disabled) {
                // Assume success (FormSubmit.co usually works)
                if (formSuccess) {
                    formSuccess.style.display = 'flex';
                    contactForm.style.display = 'none';
                }
                contactForm.reset();
                clearError(nameInput);
                clearError(emailInput);
                clearError(messageInput);
                
                // Reset button
                if (btnText) btnText.style.display = 'flex';
                if (btnIcon) btnIcon.style.display = 'flex';
                if (btnLoading) btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                
                // Clean up iframe
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                contactForm.target = originalTarget;
            }
        }, 5000);
        
        // Submit the form natively (FormSubmit.co handles this)
        // The form will submit to the iframe, preventing page reload
        contactForm.submit();
    });
}

// Add shake animation to CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0) translateZ(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) translateZ(0); }
        20%, 40%, 60%, 80% { transform: translateX(5px) translateZ(0); }
    }
`;
document.head.appendChild(style);

// Observe contact form for scroll animation
if (contactForm) {
    const formObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                contactForm.classList.add('visible');
                formObserver.unobserve(contactForm);
            }
        });
    }, { threshold: 0.1 });
    
    formObserver.observe(contactForm);
}

// ============================================
// Navbar Background on Scroll
// ============================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(255, 0, 110, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Depth Animation on Scroll for Sections (Responsive)
// ============================================

function updateDepthOnScroll() {
    // Disable depth effect on mobile for performance
    if (isSmallScreen) {
        return;
    }
    
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate how much of the section is visible
        const visibleHeight = Math.min(windowHeight, sectionTop + sectionHeight) - Math.max(0, sectionTop);
        const visibilityRatio = visibleHeight / sectionHeight;
        
        if (visibilityRatio > 0) {
            // Apply depth effect based on scroll position (reduced intensity)
            const depth = (1 - visibilityRatio) * 30;
            section.style.transform = `translateZ(${-depth}px)`;
        }
    });
}

// Only enable depth effect on desktop
if (!isSmallScreen) {
    window.addEventListener('scroll', throttle(() => {
        requestAnimationFrame(updateDepthOnScroll);
    }, 16), { passive: true });
}

// ============================================
// Glow Effect on Hover for Interactive Elements
// ============================================

document.querySelectorAll('.music-card, .album-card, .bio-card, .social-link').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.boxShadow = '0 20px 60px rgba(255, 0, 110, 0.4)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.boxShadow = '';
    });
});

// ============================================
// Initialize on Load
// ============================================

window.addEventListener('load', () => {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.section-title').forEach(title => {
            observer.observe(title);
        });
    }, 100);
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
});

// ============================================
// Performance Optimization: Throttle Functions
// ============================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle window resize for responsive behavior
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-check device type on resize
        const newIsSmallScreen = window.matchMedia('(max-width: 767px)').matches;
        if (newIsSmallScreen !== isSmallScreen) {
            location.reload(); // Reload to reinitialize with correct settings
        }
    }, 250);
}, { passive: true });

// ============================================
// 3D Perspective on Container Elements
// ============================================

document.querySelectorAll('.discography-grid, .music-grid, .biography-content').forEach(container => {
    container.style.perspective = '2000px';
    container.style.transformStyle = 'preserve-3d';
});

// ============================================
// Enhanced Card Flip Animations (Responsive)
// ============================================

document.querySelectorAll('[data-flip]').forEach(card => {
    const inner = card.querySelector('.album-inner');
    
    // On mobile, use tap to flip instead of hover
    if (isTouchDevice && isSmallScreen) {
        let isFlipped = false;
        card.addEventListener('click', (e) => {
            e.preventDefault();
            isFlipped = !isFlipped;
            inner.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        });
    } else {
        // Desktop hover behavior
        card.addEventListener('mouseenter', () => {
            inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
});

// ============================================
// Smooth Entrance Animations with Stagger
// ============================================

function staggerAnimation(elements, delay = 100) {
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * delay);
    });
}

// Apply stagger to grid items
const albumCards = document.querySelectorAll('.album-card');
const musicCards = document.querySelectorAll('.music-card');
const socialLinks = document.querySelectorAll('.social-link');

// Use IntersectionObserver to trigger stagger when section is visible
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const container = entry.target;
            const items = container.querySelectorAll('.album-card, .music-card, .social-link, .bio-card');
            staggerAnimation(Array.from(items), 150);
            staggerObserver.unobserve(container);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.discography-grid, .music-grid, .social-grid, .biography-content').forEach(container => {
    staggerObserver.observe(container);
});

// ============================================
// Prevent horizontal scroll on mobile
// ============================================

function preventHorizontalScroll() {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // Fix for iOS Safari
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) return; // Allow pinch zoom
        
        const target = e.target;
        const scrollable = target.closest('.discography-grid, .music-grid, .biography-content, .social-grid');
        
        if (!scrollable) {
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            if (scrollLeft > 0) {
                e.preventDefault();
            }
        }
    }, { passive: false });
}

preventHorizontalScroll();

// ============================================
// Viewport height fix for mobile browsers
// ============================================

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight, { passive: true });
window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
});

// ============================================
// Optimize images loading on mobile
// ============================================

if (isSmallScreen) {
    document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
        if (img.src && !img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s';
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
}

console.log('NAVARO Portfolio - 3D Interactive Website Loaded!');
console.log('Device Type:', isMobile ? 'Mobile' : 'Desktop');
console.log('Touch Device:', isTouchDevice);
console.log('Small Screen:', isSmallScreen);
