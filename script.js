// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const body = document.body;
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentLang = localStorage.getItem('language') || 'en';

// Initialize theme and language
function initializeApp() {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    setupEventListeners();
    setupAnimations();
    setupSmoothScrolling();
}

// Theme switching functionality
function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

// Language switching functionality
function applyLanguage(lang) {
    body.setAttribute('data-lang', lang);
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data attributes
    updateLanguageElements();
}

// Update all language-specific elements
function updateLanguageElements() {
    const elements = document.querySelectorAll('[data-en], [data-ar]');
    elements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const arText = element.getAttribute('data-ar');
        
        if (currentLang === 'ar' && arText) {
            element.textContent = arText;
        } else if (currentLang === 'en' && enText) {
            element.textContent = enText;
        }
    });
}

// Tab functionality
function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and target content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation setup
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.course-card, .language-card, .resource-item, .stat-item');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Floating elements animation enhancement
function enhanceFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add random movement
        element.style.animationDelay = `${index * 2}s`;
        
        // Add hover effect
        element.addEventListener('mouseenter', () => {
            element.style.opacity = '0.8';
            element.style.transform = 'scale(1.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.opacity = '0.3';
            element.style.transform = 'scale(1)';
        });
    });
}

// Enhanced Floating Sidebar Navigation
function setupFloatingSidebarNavigation() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    // Define course mapping for each icon
    const courseMapping = {
        'Web Development': 'web-development',
        'Mobile Apps': 'mobile-development', 
        'AI & Machine Learning': 'ai-machine-learning',
        'Cybersecurity': 'cybersecurity',
        'Data Science': 'data-science',
        'Game Development': 'game-development'
    };
    
    floatingIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const tooltip = icon.getAttribute('data-tooltip');
            const courseId = courseMapping[tooltip];
            
            if (courseId) {
                // Smooth scroll to courses section first
                const coursesSection = document.getElementById('courses');
                if (coursesSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = coursesSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Highlight the specific course after scrolling
                    setTimeout(() => {
                        highlightCourse(courseId, tooltip);
                    }, 800);
                }
            }
        });
        
        // Add click animation
        icon.addEventListener('click', () => {
            icon.style.transform = 'translateX(-10px) scale(0.95)';
            setTimeout(() => {
                icon.style.transform = 'translateX(-10px) scale(1.1)';
            }, 150);
        });
    });
}

// Highlight specific course function
function highlightCourse(courseId, courseName) {
    // Remove any existing highlights
    const allCourseCards = document.querySelectorAll('.course-card');
    allCourseCards.forEach(card => {
        card.classList.remove('highlighted');
    });
    
    // Find and highlight the matching course
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const courseTitle = card.querySelector('h3');
        if (courseTitle) {
            const titleText = courseTitle.textContent.toLowerCase();
            const searchTerm = courseName.toLowerCase();
            
            // Check if course matches
            if ((searchTerm.includes('web') && titleText.includes('web')) ||
                (searchTerm.includes('mobile') && titleText.includes('mobile')) ||
                (searchTerm.includes('ai') && (titleText.includes('ai') || titleText.includes('machine'))) ||
                (searchTerm.includes('cyber') && titleText.includes('cyber')) ||
                (searchTerm.includes('data') && titleText.includes('data')) ||
                (searchTerm.includes('game') && titleText.includes('game'))) {
                
                card.classList.add('highlighted');
                
                // Show notification
                showCourseNotification(courseName);
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    card.classList.remove('highlighted');
                }, 3000);
            }
        }
    });
}

// Show course notification
function showCourseNotification(courseName) {
    const notification = document.createElement('div');
    notification.className = 'course-notification';
    notification.innerHTML = `
        <i class="fas fa-graduation-cap"></i>
        <span>Showing ${courseName} Course</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Code editor typing effect
function setupCodeEditor() {
    const codeEditor = document.querySelector('.code-editor');
    if (!codeEditor) return;
    
    // Add cursor blink effect
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '|';
    cursor.style.animation = 'blink 1s infinite';
    
    const editorContent = codeEditor.querySelector('.python-code');
    if (editorContent) {
        editorContent.appendChild(cursor);
    }
}

// Add cursor blink animation to CSS
function addCursorAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        .cursor {
            color: var(--accent-primary);
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for floating elements
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Interactive course cards
function setupInteractiveCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Language card interactions
function setupLanguageCards() {
    const languageCards = document.querySelectorAll('.language-card');
    
    languageCards.forEach(card => {
        const lang = card.getAttribute('data-lang');
        
        card.addEventListener('click', () => {
            // Add click effect
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
            
            // Show language info (you can expand this)
            console.log(`Selected language: ${lang}`);
        });
    });
}

// Resource download simulation
function setupResourceDownloads() {
    const downloadBtns = document.querySelectorAll('.btn-outline');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Simulate download
            const originalText = btn.textContent;
            btn.textContent = currentLang === 'ar' ? 'جاري التحميل...' : 'Downloading...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = currentLang === 'ar' ? 'تم التحميل' : 'Downloaded!';
                btn.style.background = 'var(--accent-tertiary)';
                btn.style.color = 'var(--bg-primary)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 2000);
            }, 2000);
        });
    });
}

// Statistics counter animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                animateCounter(target, 0, finalNumber, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + (element.textContent.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Mobile menu toggle (for future mobile navigation)
function setupMobileMenu() {
    // This can be expanded for mobile navigation
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile toggle button for small screens
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.nav');
        nav.insertBefore(mobileToggle, nav.querySelector('.nav-controls'));
        
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Performance optimization
function setupPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based animations
        }, 16); // ~60fps
    });
    
    // Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Event listeners setup
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
    
    // Language toggle
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        applyLanguage(newLang);
    });
    
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn && !settingsBtn.dataset.bound) {
        settingsBtn.dataset.bound = 'true';
        settingsBtn.addEventListener('click', () => {
            if (window.settingsSystem && typeof window.settingsSystem.openSettings === 'function') {
                window.settingsSystem.openSettings();
            } else {
                const modal = document.getElementById('settingsModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }
    
    // Window resize handler
    window.addEventListener('resize', () => {
        setupMobileMenu();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + T for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        }
        
        // Ctrl/Cmd + L for language toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            applyLanguage(newLang);
        }
    });
    
    // Setup floating sidebar navigation
    setupFloatingSidebarNavigation();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupTabs();
    enhanceFloatingElements();
    setupCodeEditor();
    addCursorAnimation();
    setupParallax();
    setupInteractiveCards();
    setupLanguageCards();
    setupResourceDownloads();
    animateStats();
    setupMobileMenu();
    setupPerformanceOptimizations();
    setupFloatingSidebar();
    setupEnhancedAnimations();
    
    // Add loading animation class to body
    setTimeout(() => {
        body.classList.add('loaded');
    }, 100);
});

// Add some additional interactive features
window.addEventListener('load', () => {
    // Add particle effect to hero section
    createParticles();
    
    // Add typing effect to hero title
    typeWriter();
});

// Particle effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = prefersReduced ? 0 : 25;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent-primary);
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
            animation: particleFloat ${3 + Math.random() * 4}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
    
    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.6;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Typing effect for hero title
function typeWriter() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Add smooth reveal animations for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
}

// Add section reveal CSS
function addSectionRevealCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .section-revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    addSectionRevealCSS();
    revealOnScroll();
});

// Client-side auth hardening and backend check
function setupAuthGuards() {
    const disposableDomains = new Set([
        'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','yopmail.com','trashmail.com','sharklasers.com','getnada.com','maildrop.cc','dispostable.com','fakeinbox.com'
    ]);

    function isDisposable(email) {
        const parts = String(email).toLowerCase().split('@');
        if (parts.length !== 2) return true;
        return disposableDomains.has(parts[1]);
    }

    // Guard register/login forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    [loginForm, registerForm].forEach(form => {
        if (!form) return;
        if (form.dataset.hardened === 'true') return;
        form.dataset.hardened = 'true';
        form.addEventListener('submit', async (e) => {
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';
            if (!email || isDisposable(email)) {
                e.preventDefault();
                e.stopPropagation();
                if (emailInput) emailInput.focus();
                showNotification('Please use a real email address (disposable domains are not allowed).', 'error');
                return;
            }

            // Try backend availability; if unreachable on register, block
            if (form.id === 'registerForm') {
                try {
                    const res = await fetch('api/auth.php?action=csrf', { method: 'GET' });
                    if (!res.ok) throw new Error('no api');
                } catch {
                    e.preventDefault();
                    e.stopPropagation();
                    showNotification('Registration requires the secure server. Please run the PHP backend.', 'error');
                }
            }
        }, true);
    });

    // Assist header settings button presence
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.classList.add('settings-btn-nav');
    }
}

document.addEventListener('DOMContentLoaded', setupAuthGuards);

// Floating Sidebar Functionality
function setupFloatingSidebar() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const tooltip = icon.getAttribute('data-tooltip');
            
            // Add click animation
            icon.style.transform = 'translateX(-10px) scale(0.9)';
            setTimeout(() => {
                icon.style.transform = 'translateX(-10px) scale(1.1)';
            }, 150);
            
            // Navigate to relevant section based on tooltip
            let targetSection = '';
            switch(tooltip) {
                case 'Web Development':
                    targetSection = '#courses';
                    break;
                case 'Mobile Apps':
                    targetSection = '#courses';
                    break;
                case 'AI & Machine Learning':
                    targetSection = '#courses';
                    break;
                case 'Cybersecurity':
                    targetSection = '#courses';
                    break;
                case 'Data Science':
                    targetSection = '#courses';
                    break;
                case 'Game Development':
                    targetSection = '#courses';
                    break;
            }
            
            if (targetSection) {
                const section = document.querySelector(targetSection);
                if (section) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = section.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
        
        // Add hover sound effect simulation
        icon.addEventListener('mouseenter', () => {
            icon.style.boxShadow = '0 8px 25px var(--glow-color)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.boxShadow = '0 4px 15px var(--shadow-color)';
        });
    });
}

// Enhanced Animations
function setupEnhancedAnimations() {
    // Enhanced floating elements with more dynamic movement
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add random movement patterns
        const randomDelay = Math.random() * 5;
        const randomDuration = 15 + Math.random() * 10;
        
        element.style.animationDelay = `${randomDelay}s`;
        element.style.animationDuration = `${randomDuration}s`;
        
        // Add mouse interaction
        element.addEventListener('mouseenter', () => {
            element.style.opacity = '0.9';
            element.style.transform = 'scale(1.3) rotate(10deg)';
            element.style.textShadow = '0 0 20px currentColor';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.opacity = '0.4';
            element.style.transform = 'scale(1) rotate(0deg)';
            element.style.textShadow = '0 0 10px var(--glow-color)';
        });
    });
    
    // Enhanced geometric shapes animation
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const randomDelay = Math.random() * 10;
        const randomDuration = 20 + Math.random() * 15;
        
        shape.style.animationDelay = `${randomDelay}s`;
        shape.style.animationDuration = `${randomDuration}s`;
    });
    
    // Add scroll-based floating sidebar movement
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const sidebar = document.querySelector('.floating-sidebar');
        
        if (sidebar) {
            // Subtle movement based on scroll direction
            if (currentScrollY > lastScrollY) {
                sidebar.style.transform = 'translateY(-50%) translateX(5px)';
            } else {
                sidebar.style.transform = 'translateY(-50%) translateX(-5px)';
            }
            
            // Reset position after scroll stops
            clearTimeout(window.scrollTimeout);
            window.scrollTimeout = setTimeout(() => {
                sidebar.style.transform = 'translateY(-50%) translateX(0)';
            }, 150);
        }
        
        lastScrollY = currentScrollY;
    });
}

// Enhanced course card interactions
function setupEnhancedCourseCards() {
    const courseCards = document.querySelectorAll('.course-card, .language-course-card');
    
    courseCards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(88, 166, 255, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Enhanced video thumbnail interactions
function setupVideoThumbnails() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Simulate video opening
            const playIcon = thumbnail.querySelector('i');
            const originalClass = playIcon.className;
            
            playIcon.className = 'fas fa-spinner fa-spin';
            thumbnail.style.background = 'var(--accent-primary)';
            thumbnail.style.color = 'var(--bg-primary)';
            
            setTimeout(() => {
                playIcon.className = originalClass;
                thumbnail.style.background = '';
                thumbnail.style.color = '';
                
                // Show video modal or redirect (simulation)
                alert(currentLang === 'ar' ? 'سيتم فتح الفيديو قريباً' : 'Video will open soon!');
            }, 2000);
        });
    });
}

// Video Modal Functionality
function setupVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    // Enhanced video data for different courses - Real YouTube videos
    const videoData = {
        // Python Videos
        'python-intro': {
            title: 'Python for Beginners - Full Course',
            description: 'Learn Python programming from scratch with this comprehensive beginner course covering syntax, variables, and basic operations.',
            url: 'https://www.youtube.com/embed/kqtD5dpn9C8' // Python for Beginners
        },
        'python-data-structures': {
            title: 'Python Data Structures and Algorithms',
            description: 'Master Python data structures including lists, dictionaries, tuples, sets, and advanced algorithms.',
            url: 'https://www.youtube.com/embed/pkYVOmU3MgA' // Python Data Structures
        },
        'python-web': {
            title: 'Python Web Development with Django',
            description: 'Build web applications using Python and Django framework with database integration and user authentication.',
            url: 'https://www.youtube.com/embed/F5mRW0jo-U4' // Django Tutorial
        },
        'python-ai': {
            title: 'Python for Artificial Intelligence',
            description: 'Learn how to use Python for AI, machine learning, and data science with practical examples.',
            url: 'https://www.youtube.com/embed/7eh4d6sabA0' // Python AI Tutorial
        },
        
        // JavaScript Videos
        'javascript-intro': {
            title: 'JavaScript Tutorial for Beginners',
            description: 'Learn JavaScript from scratch with modern ES6+ features, DOM manipulation, and best practices.',
            url: 'https://www.youtube.com/embed/PkZNo7MFNFg' // JavaScript Tutorial
        },
        'javascript-react': {
            title: 'React Tutorial for Beginners',
            description: 'Build modern web applications with React, component-based architecture, and state management.',
            url: 'https://www.youtube.com/embed/SqcY0GlETPk' // React Tutorial
        },
        'javascript-node': {
            title: 'Node.js Tutorial for Beginners',
            description: 'Learn server-side JavaScript with Node.js, Express.js, and building RESTful APIs.',
            url: 'https://www.youtube.com/embed/TlB_eWDSMt4' // Node.js Tutorial
        },
        'javascript-vue': {
            title: 'Vue.js Tutorial for Beginners',
            description: 'Build reactive web applications with Vue.js framework and component-based architecture.',
            url: 'https://www.youtube.com/embed/qZXt1Aom3Cs' // Vue.js Tutorial
        },
        
        // Java Videos
        'java-basics': {
            title: 'Java Programming Tutorial',
            description: 'Learn Java fundamentals including object-oriented programming concepts, syntax, and best practices.',
            url: 'https://www.youtube.com/embed/eIrMbAQSU34' // Java Tutorial
        },
        'spring-framework': {
            title: 'Spring Framework Tutorial',
            description: 'Master the Spring framework for building enterprise Java applications with dependency injection and MVC.',
            url: 'https://www.youtube.com/embed/9SGDpanrc8U' // Spring Framework
        },
        'java-android': {
            title: 'Android Development with Java',
            description: 'Create Android mobile applications using Java and Android Studio with practical examples.',
            url: 'https://www.youtube.com/embed/fis26HvvDII' // Android Development
        },
        
        // C++ Videos
        'cpp-fundamentals': {
            title: 'C++ Programming Tutorial',
            description: 'Learn C++ from basics including memory management, object-oriented programming, and STL.',
            url: 'https://www.youtube.com/embed/vLnP7Zd8nQ4' // C++ Tutorial
        },
        'cpp-games': {
            title: 'Game Development with C++',
            description: 'Create amazing games using C++, SFML, and game development frameworks with practical examples.',
            url: 'https://www.youtube.com/embed/2VLaIr5Ckbs' // C++ Game Development
        },
        'cpp-advanced': {
            title: 'Advanced C++ Programming',
            description: 'Master advanced C++ concepts including templates, smart pointers, and modern C++ features.',
            url: 'https://www.youtube.com/embed/8jLOx1hD3_o' // Advanced C++
        },
        
        // C# Videos
        'csharp-basics': {
            title: 'C# Programming Tutorial',
            description: 'Learn C# fundamentals and the .NET framework for building desktop and web applications.',
            url: 'https://www.youtube.com/embed/gfkTfCPYqKM' // C# Tutorial
        },
        'unity-games': {
            title: 'Unity Game Development Tutorial',
            description: 'Create stunning games using Unity engine and C# scripting with step-by-step tutorials.',
            url: 'https://www.youtube.com/embed/XtQMytORBmM' // Unity Tutorial
        },
        'csharp-aspnet': {
            title: 'ASP.NET Core Web Development',
            description: 'Build modern web applications using C# and ASP.NET Core with MVC pattern and Entity Framework.',
            url: 'https://www.youtube.com/embed/hZ1DASYd9rk' // ASP.NET Core
        },
        
        
        
        // Web Development Videos
        'html-css': {
            title: 'HTML and CSS Tutorial',
            description: 'Learn the fundamentals of web development with HTML5 and CSS3, including responsive design.',
            url: 'https://www.youtube.com/embed/1Rs2ND1ryYc' // HTML CSS Tutorial
        },
        'responsive-design': {
            title: 'Responsive Web Design',
            description: 'Master responsive web design techniques using CSS Grid, Flexbox, and media queries.',
            url: 'https://www.youtube.com/embed/srvUrASL0N0' // Responsive Design
        },
        
        // AI and Machine Learning Videos
        'machine-learning': {
            title: 'Machine Learning Tutorial',
            description: 'Introduction to machine learning concepts, algorithms, and implementation with Python.',
            url: 'https://www.youtube.com/embed/7eh4d6sabA0' // Machine Learning
        },
        'deep-learning': {
            title: 'Deep Learning with TensorFlow',
            description: 'Learn deep learning concepts and implementation using TensorFlow and Keras frameworks.',
            url: 'https://www.youtube.com/embed/tPYj3fFJGjk' // Deep Learning
        },
        
        // Database Videos
        'sql-basics': {
            title: 'SQL Tutorial for Beginners',
            description: 'Learn SQL fundamentals including queries, joins, and database design principles.',
            url: 'https://www.youtube.com/embed/HXV3zeQKqGY' // SQL Tutorial
        },
        'mongodb': {
            title: 'MongoDB Tutorial',
            description: 'Learn NoSQL database concepts with MongoDB, including document storage and queries.',
            url: 'https://www.youtube.com/embed/-56x56UppqQ' // MongoDB Tutorial
        },
        
        // DevOps Videos
        'docker': {
            title: 'Docker Tutorial for Beginners',
            description: 'Learn containerization with Docker, including images, containers, and orchestration.',
            url: 'https://www.youtube.com/embed/pTFZFxd4hOI' // Docker Tutorial
        },
        'kubernetes': {
            title: 'Kubernetes Tutorial',
            description: 'Master container orchestration with Kubernetes for scalable application deployment.',
            url: 'https://www.youtube.com/embed/X48VuDVv0do' // Kubernetes Tutorial
        }
    };
    
    // Open modal function
    function openVideoModal(videoId) {
        const video = videoData[videoId];
        if (video) {
            videoPlayer.src = video.url;
            videoTitle.textContent = video.title;
            videoDescription.textContent = video.description;
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close modal function
    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoPlayer.src = '';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    closeModal.addEventListener('click', closeVideoModal);
    modalOverlay.addEventListener('click', closeVideoModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    // Make openVideoModal globally available
    window.openVideoModal = openVideoModal;
}

// WhatsApp Chat Functionality
function setupWhatsAppChat() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappContact = document.querySelector('.whatsapp-contact');
    
    // Main WhatsApp button
    whatsappBtn.addEventListener('click', () => {
        openWhatsAppChat();
    });
    
    // WhatsApp contact in founder section
    if (whatsappContact) {
        whatsappContact.addEventListener('click', () => {
            openWhatsAppChat();
        });
    }
}

// Function to open WhatsApp chat
function openWhatsAppChat() {
    // WhatsApp number for CodeMaster Pro
    const phoneNumber = '201153718088'; // WhatsApp number with country code
    const message = encodeURIComponent('Hello! I\'m interested in learning programming with CodeMaster Pro. Can you help me get started?');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
}

// Function to update founder image
function updateFounderImage(imageUrl) {
    const founderImage = document.getElementById('founderImage');
    if (founderImage && imageUrl) {
        founderImage.src = imageUrl;
        founderImage.alt = 'Engineer Mohammed Abd Al Majeed Mohammed - Founder of CodeMaster Pro';
    }
}

// AI Chat Functionality
function setupAIChat() {
    const aiBtn = document.getElementById('aiBtn');
    const aiChat = document.getElementById('aiChat');
    const closeAiChat = document.getElementById('closeAiChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Enhanced AI responses database
    const aiResponses = {
        'hello': {
            en: 'Hello! I\'m your AI programming assistant. I can help you with coding questions, explain concepts, and guide you through your learning journey. What would you like to know?',
            ar: 'مرحباً! أنا مساعدك الذكي للبرمجة. يمكنني مساعدتك في أسئلة البرمجة وشرح المفاهيم وتوجيهك في رحلة التعلم. ماذا تريد أن تعرف؟'
        },
        'السلام عليكم': {
            en: 'Peace be upon you! How can I help you today?',
            ar: 'وعليكم السلام ورحمة الله وبركاته! كيف يمكنني مساعدتك اليوم؟'
        },
        'python': {
            en: 'Python is a versatile programming language perfect for beginners! It\'s used in web development, data science, AI, and automation. Would you like to learn about Python basics, data structures, or specific applications?',
            ar: 'Python هي لغة برمجة متعددة الاستخدامات مثالية للمبتدئين! تُستخدم في تطوير الويب وعلم البيانات والذكاء الاصطناعي والأتمتة. هل تريد تعلم أساسيات Python أو هياكل البيانات أو تطبيقات محددة؟'
        },
        'javascript': {
            en: 'JavaScript is the language of the web! It powers interactive websites and can be used for both frontend and backend development. Are you interested in learning DOM manipulation, React, Node.js, or modern ES6+ features?',
            ar: 'JavaScript هي لغة الويب! تشغل المواقع التفاعلية ويمكن استخدامها لتطوير الواجهة الأمامية والخلفية. هل أنت مهتم بتعلم التلاعب بـ DOM أو React أو Node.js أو ميزات ES6+ الحديثة؟'
        },
        'web development': {
            en: 'Web development involves creating websites and web applications. The main technologies are HTML (structure), CSS (styling), and JavaScript (functionality). Modern development also includes frameworks like React, Vue, or Angular. What aspect interests you most?',
            ar: 'تطوير الويب يتضمن إنشاء المواقع والتطبيقات الويب. التقنيات الرئيسية هي HTML (الهيكل) و CSS (التصميم) و JavaScript (الوظائف). التطوير الحديث يتضمن أيضاً إطارات مثل React أو Vue أو Angular. أي جانب يهمك أكثر؟'
        },
        'ai': {
            en: 'Artificial Intelligence is transforming the world! It includes machine learning, deep learning, natural language processing, and computer vision. Python is the most popular language for AI development. Would you like to explore machine learning basics, neural networks, or AI applications?',
            ar: 'الذكاء الاصطناعي يحول العالم! يتضمن تعلم الآلة والتعلم العميق ومعالجة اللغة الطبيعية ورؤية الحاسوب. Python هي اللغة الأكثر شعبية لتطوير الذكاء الاصطناعي. هل تريد استكشاف أساسيات تعلم الآلة أو الشبكات العصبية أو تطبيقات الذكاء الاصطناعي؟'
        },
        'java': {
            en: 'Java is a powerful, object-oriented programming language used for enterprise applications, Android development, and large-scale systems. It\'s known for its "write once, run anywhere" philosophy. Would you like to learn about Java basics, Spring framework, or Android development?',
            ar: 'Java هي لغة برمجة قوية وموجهة للكائنات تُستخدم للتطبيقات المؤسسية وتطوير Android والأنظمة واسعة النطاق. تشتهر بفلسفة "اكتب مرة واحدة، شغل في أي مكان". هل تريد تعلم أساسيات Java أو إطار Spring أو تطوير Android؟'
        },
        'c++': {
            en: 'C++ is a high-performance programming language used for system programming, game development, and applications requiring speed and efficiency. It\'s the foundation for many modern technologies. Are you interested in learning C++ basics, memory management, or game development?',
            ar: 'C++ هي لغة برمجة عالية الأداء تُستخدم لبرمجة الأنظمة وتطوير الألعاب والتطبيقات التي تتطلب السرعة والكفاءة. إنها الأساس للعديد من التقنيات الحديثة. هل أنت مهتم بتعلم أساسيات C++ أو إدارة الذاكرة أو تطوير الألعاب؟'
        },
        'c#': {
            en: 'C# is Microsoft\'s modern programming language, perfect for Windows applications, web development with ASP.NET, and game development with Unity. It combines the power of C++ with the simplicity of Visual Basic. What would you like to explore?',
            ar: 'C# هي لغة البرمجة الحديثة من Microsoft، مثالية لتطبيقات Windows وتطوير الويب مع ASP.NET وتطوير الألعاب مع Unity. تجمع بين قوة C++ وبساطة Visual Basic. ماذا تريد استكشافه؟'
        },
        
        'react': {
            en: 'React is a powerful JavaScript library for building user interfaces, especially single-page applications. It uses a component-based architecture and virtual DOM for efficient rendering. Are you interested in learning React basics, hooks, or state management?',
            ar: 'React هي مكتبة JavaScript قوية لبناء واجهات المستخدم، خاصة التطبيقات أحادية الصفحة. تستخدم هندسة مبنية على المكونات و DOM افتراضي للعرض الفعال. هل أنت مهتم بتعلم أساسيات React أو hooks أو إدارة الحالة؟'
        },
        'node': {
            en: 'Node.js allows you to run JavaScript on the server-side, enabling full-stack JavaScript development. It\'s perfect for building APIs, real-time applications, and microservices. Would you like to learn Node.js basics, Express.js, or building APIs?',
            ar: 'Node.js يسمح لك بتشغيل JavaScript على جانب الخادم، مما يتيح تطوير JavaScript كامل المكدس. مثالي لبناء APIs والتطبيقات في الوقت الفعلي والخدمات المصغرة. هل تريد تعلم أساسيات Node.js أو Express.js أو بناء APIs؟'
        },
        'database': {
            en: 'Databases are essential for storing and managing data in applications. Popular options include MySQL, PostgreSQL, MongoDB, and Redis. Each has its strengths for different use cases. What type of database are you interested in learning about?',
            ar: 'قواعد البيانات ضرورية لتخزين وإدارة البيانات في التطبيقات. الخيارات الشائعة تشمل MySQL و PostgreSQL و MongoDB و Redis. لكل منها نقاط قوة لحالات استخدام مختلفة. أي نوع من قواعد البيانات تريد تعلمه؟'
        },
        'help': {
            en: 'I can help you with:\n• Programming concepts and syntax\n• Code debugging and optimization\n• Learning path recommendations\n• Technology comparisons\n• Project ideas and best practices\n• Career guidance in tech\n\nJust ask me anything about programming!',
            ar: 'يمكنني مساعدتك في:\n• مفاهيم البرمجة وبناء الجملة\n• تصحيح الكود وتحسينه\n• توصيات مسارات التعلم\n• مقارنات التقنيات\n• أفكار المشاريع وأفضل الممارسات\n• التوجيه المهني في التقنية\n\nفقط اسألني أي شيء عن البرمجة!'
        },
        'career': {
            en: 'A career in programming offers many opportunities! Popular paths include:\n• Frontend Developer (React, Vue, Angular)\n• Backend Developer (Node.js, Python, Java)\n• Full-Stack Developer\n• Mobile Developer (React Native, Flutter)\n• Data Scientist (Python, R)\n• DevOps Engineer\n\nWhat interests you most?',
            ar: 'المهنة في البرمجة تقدم العديد من الفرص! المسارات الشائعة تشمل:\n• مطور الواجهة الأمامية (React, Vue, Angular)\n• مطور الخلفية (Node.js, Python, Java)\n• مطور كامل المكدس\n• مطور الموبايل (React Native, Flutter)\n• عالم البيانات (Python, R)\n• مهندس DevOps\n\nماذا يهمك أكثر؟'
        },
        'project': {
            en: 'Great! Here are some project ideas to practice your skills:\n• Todo App with React\n• Weather App with API integration\n• E-commerce website\n• Chat application\n• Portfolio website\n• Blog with CMS\n• Mobile app with React Native\n\nWhich type of project interests you?',
            ar: 'رائع! إليك بعض أفكار المشاريع لممارسة مهاراتك:\n• تطبيق المهام مع React\n• تطبيق الطقس مع تكامل API\n• موقع التجارة الإلكترونية\n• تطبيق الدردشة\n• موقع المحفظة\n• مدونة مع نظام إدارة المحتوى\n• تطبيق موبايل مع React Native\n\nأي نوع من المشاريع يهمك؟'
        }
    };
    
    // Default responses
    const defaultResponses = {
        en: 'That\'s a great question! I\'m here to help you learn programming. Could you be more specific about what you\'d like to know? For example, you can ask about Python, JavaScript, web development, AI, or any programming concept.',
        ar: 'هذا سؤال رائع! أنا هنا لمساعدتك في تعلم البرمجة. هل يمكنك أن تكون أكثر تحديداً حول ما تريد معرفته؟ على سبيل المثال، يمكنك السؤال عن Python أو JavaScript أو تطوير الويب أو الذكاء الاصطناعي أو أي مفهوم برمجي.'
    };
    
    // Enhanced function to get AI response
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for multiple keywords and provide context-aware responses
        const matchedKeywords = [];
        for (const [keyword, response] of Object.entries(aiResponses)) {
            if (lowerMessage.includes(keyword)) {
                matchedKeywords.push({ keyword, response });
            }
        }
        
        // If multiple keywords match, provide a comprehensive response
        if (matchedKeywords.length > 1) {
            const primaryResponse = matchedKeywords[0].response[currentLang] || matchedKeywords[0].response.en;
            const additionalInfo = matchedKeywords.slice(1).map(match => 
                `\n\nAlso, regarding ${match.keyword}: ${match.response[currentLang] || match.response.en}`
            ).join('');
            return primaryResponse + additionalInfo;
        }
        
        // Single keyword match
        if (matchedKeywords.length === 1) {
            return matchedKeywords[0].response[currentLang] || matchedKeywords[0].response.en;
        }
        
        // Conversational small talk
        if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u') || lowerMessage.includes('كيف حالك') || lowerMessage.includes('عامل ايه') || lowerMessage.includes('ازيك')) {
            return currentLang === 'ar'
                ? 'أنا بخير، الحمد لله! كيف يمكنني مساعدتك اليوم؟'
                : 'I am great, Alhamdulillah! How can I help you today?';
        }

        // Check for programming-related questions
        if (lowerMessage.includes('how to') || lowerMessage.includes('كيف')) {
            return currentLang === 'ar' 
                ? 'أحب أن أساعدك! يمكنك أن تسألني عن كيفية تعلم لغة برمجة معينة، أو كيفية بناء مشروع، أو كيفية حل مشكلة برمجية. كن أكثر تحديداً وسأقدم لك إرشادات مفصلة.'
                : 'I\'d love to help! You can ask me about how to learn a specific programming language, how to build a project, or how to solve a coding problem. Be more specific and I\'ll give you detailed guidance.';
        }
        
        if (lowerMessage.includes('what is') || lowerMessage.includes('ما هو')) {
            return currentLang === 'ar'
                ? 'يمكنني شرح أي مفهوم برمجي لك! اسألني عن أي لغة برمجة أو تقنية أو مفهوم تريد فهمه. على سبيل المثال: "ما هو Python؟" أو "ما هو React؟"'
                : 'I can explain any programming concept to you! Ask me about any programming language, technology, or concept you want to understand. For example: "What is Python?" or "What is React?"';
        }
        
        if (lowerMessage.includes('best') || lowerMessage.includes('أفضل')) {
            return currentLang === 'ar'
                ? 'يمكنني مساعدتك في اختيار أفضل التقنيات أو المسارات! اسألني عن أفضل لغة برمجة للمبتدئين، أو أفضل إطار عمل لمشروعك، أو أفضل طريقة لتعلم البرمجة.'
                : 'I can help you choose the best technologies or paths! Ask me about the best programming language for beginners, the best framework for your project, or the best way to learn programming.';
        }
        
        // Check for beginner questions
        if (lowerMessage.includes('beginner') || lowerMessage.includes('مبتدئ')) {
            return currentLang === 'ar'
                ? 'رائع! أنا هنا لمساعدة المبتدئين. أنصحك بالبدء بـ Python أو JavaScript. يمكنني إرشادك خطوة بخطوة في رحلة التعلم. ما الذي تريد تعلمه أولاً؟'
                : 'Great! I\'m here to help beginners. I recommend starting with Python or JavaScript. I can guide you step by step in your learning journey. What would you like to learn first?';
        }
        
        return defaultResponses[currentLang] || defaultResponses.en;
    }
    
    // Function to add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add typing animation for AI messages
        if (!isUser) {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.transition = 'opacity 0.3s ease';
                messageDiv.style.opacity = '1';
            }, 100);
        }
    }
    
    // Function to send message
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            // Simulate AI thinking
            setTimeout(() => {
                const response = getAIResponse(message);
                addMessage(response);
            }, 1000);
        }
    }
    
    // Event listeners
    aiBtn.addEventListener('click', () => {
        aiChat.classList.toggle('active');
        if (aiChat.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    closeAiChat.addEventListener('click', () => {
        aiChat.classList.remove('active');
    });
    
    sendMessage.addEventListener('click', sendUserMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!aiChat.contains(e.target) && !aiBtn.contains(e.target) && aiChat.classList.contains('active')) {
            aiChat.classList.remove('active');
        }
    });
}

// Enhanced Video Thumbnail Interactions
function setupEnhancedVideoThumbnails() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video');
            if (videoId && window.openVideoModal) {
                window.openVideoModal(videoId);
            } else {
                // Fallback for videos without modal
                const playIcon = thumbnail.querySelector('i');
                const originalClass = playIcon.className;
                
                playIcon.className = 'fas fa-spinner fa-spin';
                thumbnail.style.background = 'var(--accent-primary)';
                thumbnail.style.color = 'var(--bg-primary)';
                
                setTimeout(() => {
                    playIcon.className = originalClass;
                    thumbnail.style.background = '';
                    thumbnail.style.color = '';
                    
                    // Show video modal or redirect (simulation)
                    alert(currentLang === 'ar' ? 'سيتم فتح الفيديو قريباً' : 'Video will open soon!');
                }, 2000);
            }
        });
    });
}

// Authentication System
function setupAuthentication() {
    const authModal = document.getElementById('authModal');
    const authBtn = document.getElementById('authBtn');
    const closeAuth = document.getElementById('closeAuth');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalOverlay = document.querySelector('.auth-modal .modal-overlay');
    
    // Social login buttons
    const googleBtn = document.querySelector('.social-btn.google');
    const facebookBtn = document.querySelector('.social-btn.facebook');
    const githubBtn = document.querySelector('.social-btn.github');
    
    // Open auth modal
    authBtn.addEventListener('click', () => {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close auth modal
    function closeAuthModal() {
        authModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeAuth.addEventListener('click', closeAuthModal);
    modalOverlay.addEventListener('click', closeAuth);
    
    // Switch between login and register forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });
    
    // Form submissions
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate login
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        
        if (email && password) {
            // Show success message
            showNotification('Login successful!', 'success');
            closeAuthModal();
            // Update auth button
            authBtn.innerHTML = '<i class="fas fa-user-check"></i><span data-en="Welcome!" data-ar="مرحباً!"></span>';
        }
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate registration
        const formData = new FormData(e.target);
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        
        if (email && password) {
            // Show success message
            showNotification('Account created successfully!', 'success');
            closeAuthModal();
            // Switch to login form
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        }
    });
    
    // Social login handlers
    googleBtn.addEventListener('click', () => {
        showNotification('Google login coming soon!', 'info');
    });
    
    facebookBtn.addEventListener('click', () => {
        showNotification('Facebook login coming soon!', 'info');
    });
    
    githubBtn.addEventListener('click', () => {
        showNotification('GitHub login coming soon!', 'info');
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeAuthModal();
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Welcome Message System
function setupWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const body = document.body;
    if (!welcomeMessage) return;
    // Ensure it is visible and centered
    welcomeMessage.style.display = 'flex';
    welcomeMessage.style.alignItems = 'center';
    welcomeMessage.style.justifyContent = 'center';
    
    // Show welcome message on page load
    body.style.overflow = 'hidden';
    
    // Hide welcome message after 5 seconds
    setTimeout(() => {
        welcomeMessage.style.animation = 'welcomeFadeOut 0.6s ease-in-out forwards';
        body.style.overflow = 'auto';
        
        // Remove from DOM after animation
        setTimeout(() => {
            welcomeMessage.style.display = 'none';
            // If not authenticated, open auth modal immediately
            try {
                const hasUser = localStorage.getItem('codemaster_current_user') || sessionStorage.getItem('codemaster_current_user');
                if (!hasUser) {
                    const authModal = document.getElementById('authModal');
                    if (authModal) {
                        authModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            } catch {}
        }, 500);
    }, 5000);
    
    // Add typing effect to code lines
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation to download items
    const downloadItems = document.querySelectorAll('.download-item');
    downloadItems.forEach((item, index) => {
        item.style.animationDelay = `${0.5 + index * 0.5}s`;
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    setupWelcomeMessage();
    setupEnhancedCourseCards();
    setupEnhancedVideoThumbnails();
    setupVideoModal();
    setupWhatsAppChat();
    setupAIChat();
    setupAuthentication();
    setupAdvancedInteractions();
    setupParticleSystem();
    setupSoundEffects();
    setupSiteSounds();
    setupCoursePlayer();
});

// Advanced Interactions System
function setupAdvancedInteractions() {
    // Add mouse trail effect
    let mouseTrail = [];
    const maxTrailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            animation: trailFade 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        mouseTrail.push(trail);
        
        if (mouseTrail.length > maxTrailLength) {
            const oldTrail = mouseTrail.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
        
        setTimeout(() => {
            if (trail && trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 500);
    });
    
    // Add trail fade animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes trailFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
        }
    `;
    document.head.appendChild(style);
    
    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .chat-btn, .floating-icon');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(88, 166, 255, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple && ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Enhanced Particle System
function setupParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particleContainer);
    
    // Create floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endY = -10;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--accent-primary);
            border-radius: 50%;
            left: ${startX}px;
            top: ${startY}px;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: particleFloat ${duration}s linear ${delay}s infinite;
            box-shadow: 0 0 10px var(--accent-primary);
        `;
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }
    
    // Create particles periodically
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
        setInterval(createParticle, 3000);
    }
    
    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-${window.innerHeight + 20}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Sound Effects System (Visual feedback)
function setupSoundEffects() {
    // Add visual feedback for interactions
    const elements = document.querySelectorAll('.btn, .chat-btn, .floating-icon, .video-thumbnail');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.filter = 'brightness(1.1) saturate(1.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.filter = 'brightness(1) saturate(1)';
        });
        
        element.addEventListener('click', () => {
            // Add click flash effect
            element.style.filter = 'brightness(1.3) saturate(1.5)';
            setTimeout(() => {
                element.style.filter = 'brightness(1) saturate(1)';
            }, 150);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            // Add focus indicators
            const focusedElement = document.activeElement;
            if (focusedElement && (focusedElement.classList.contains('btn') || 
                focusedElement.classList.contains('chat-btn') || 
                focusedElement.classList.contains('floating-icon'))) {
                focusedElement.style.outline = '2px solid var(--accent-primary)';
                focusedElement.style.outlineOffset = '2px';
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
            // Remove focus indicators
            const elements = document.querySelectorAll('.btn, .chat-btn, .floating-icon');
            elements.forEach(el => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
        }
    });
}

// Site subtle sounds (toggled by settingsSystem if desired)
function setupSiteSounds() {
    const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
    if (!audioCtx) return;
    function playClick() {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = 440; g.gain.value = 0.02;
        o.connect(g); g.connect(audioCtx.destination);
        o.start(); setTimeout(()=>{ o.stop(); }, 80);
    }
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .chat-btn, .floating-icon, .settings-close, .course-close, .btn-small');
        if (target) {
            try { if (settingsSystem && settingsSystem.settings && settingsSystem.settings.soundEffects === false) return; } catch {}
            playClick();
        }
    });
}

// Course player wiring
function setupCoursePlayer() {
    const modal = document.getElementById('courseModal');
    const overlay = modal?.querySelector('.course-overlay');
    const closeBtn = document.getElementById('closeCourse');
    const iframe = document.getElementById('courseIframe');
    const titleEl = document.getElementById('courseTitle');
    const descEl = document.getElementById('courseDesc');
    const listEl = document.getElementById('moduleList');
    const prevBtn = document.getElementById('prevModule');
    const nextBtn = document.getElementById('nextModule');
    if (!modal || !iframe || !listEl) return;

    const courseMap = {
        'Full-Stack Web Development': [
            { t: 'Intro & Setup', v: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
            { t: 'JavaScript Basics', v: 'https://www.youtube.com/embed/PkZNo7MFNFg' },
            { t: 'React Overview', v: 'https://www.youtube.com/embed/SqcY0GlETPk' },
        ],
        'Python Programming': [
            { t: 'Python for Beginners', v: 'https://www.youtube.com/embed/kqtD5dpn9C8' },
            { t: 'Data Structures', v: 'https://www.youtube.com/embed/pkYVOmU3MgA' },
            { t: 'Django Intro', v: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
        ],
        'JavaScript Mastery': [
            { t: 'JS Basics', v: 'https://www.youtube.com/embed/PkZNo7MFNFg' },
            { t: 'Node.js Intro', v: 'https://www.youtube.com/embed/TlB_eWDSMt4' },
            { t: 'Vue Basics', v: 'https://www.youtube.com/embed/qZXt1Aom3Cs' },
        ]
    };

    let currentIndex = 0;
    let currentCourse = '';

    function openCourse(courseName) {
        const modules = courseMap[courseName] || courseMap['Full-Stack Web Development'];
        currentCourse = courseName;
        currentIndex = 0;
        renderModules(modules);
        loadModule(modules[0]);
        titleEl.textContent = courseName;
        descEl.textContent = `Enjoy your learning journey: ${courseName}`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCourse() {
        modal.classList.remove('active');
        iframe.src = '';
        document.body.style.overflow = '';
    }

    function renderModules(mods) {
        listEl.innerHTML = '';
        mods.forEach((m, i) => {
            const li = document.createElement('li');
            li.className = 'module-item' + (i === 0 ? ' active' : '');
            li.innerHTML = `<span class="module-index">${i+1}</span><span class="module-title">${m.t}</span>`;
            li.addEventListener('click', () => { currentIndex = i; setActive(mods); loadModule(mods[i]); });
            listEl.appendChild(li);
        });
    }

    function setActive(mods) {
        listEl.querySelectorAll('.module-item').forEach((el, idx)=>{
            if (idx === currentIndex) el.classList.add('active'); else el.classList.remove('active');
        });
        descEl.textContent = `${currentCourse} • ${mods[currentIndex].t}`;
    }

    function loadModule(mod) { iframe.src = mod.v; }

    prevBtn?.addEventListener('click', ()=>{
        const mods = courseMap[currentCourse] || [];
        if (!mods.length) return;
        currentIndex = Math.max(0, currentIndex - 1);
        setActive(mods); loadModule(mods[currentIndex]);
    });
    nextBtn?.addEventListener('click', ()=>{
        const mods = courseMap[currentCourse] || [];
        if (!mods.length) return;
        currentIndex = Math.min(mods.length - 1, currentIndex + 1);
        setActive(mods); loadModule(mods[currentIndex]);
    });

    closeBtn?.addEventListener('click', closeCourse);
    overlay?.addEventListener('click', closeCourse);
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && modal.classList.contains('active')) closeCourse(); });

    // Attach to "Start Course" buttons
    document.querySelectorAll('.course-card .btn.btn-primary, .language-course-card .btn.btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.course-card, .language-course-card');
            const nameEl = card?.querySelector('h3');
            const courseName = nameEl ? nameEl.textContent.trim() : 'Full-Stack Web Development';
            openCourse(courseName);
        });
    });
}

// Export functions for potential external use
window.CodeMaster = {
    switchTheme: applyTheme,
    switchLanguage: applyLanguage,
    getCurrentTheme: () => currentTheme,
    getCurrentLanguage: () => currentLang,
    openVideoModal: window.openVideoModal
};
