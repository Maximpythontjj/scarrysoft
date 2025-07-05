// Modern JavaScript with improved performance and animations

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        this.currentTheme = theme;
        
        // Add smooth transition for theme change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Modern header scroll effect with better performance
const header = document.querySelector('.header');
const handleScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    
    if (scrolled > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Parallax effect for background
    const matrixBg = document.querySelector('.matrix-bg');
    if (matrixBg) {
        const rate = scrolled * -0.3;
        matrixBg.style.transform = `translateY(${rate}px)`;
    }
}, 16);

window.addEventListener('scroll', handleScroll);

// Enhanced terminal animation with typing effect
class TerminalAnimator {
    constructor() {
        this.lines = [
            { element: null, text: 'root@broadcaster:~$ python main.py', delay: 500 },
            { element: null, text: '[✓] Загружено 10 аккаунтов', delay: 1000 },
            { element: null, text: '[✓] Прокси подключены', delay: 1500 },
            { element: null, text: '[i] Начинаю рассылку...', delay: 2000 },
            { element: null, text: '[✓] Отправлено в 247 групп', delay: 2500 }
        ];
        this.init();
    }
    
    init() {
        const terminalLines = document.querySelectorAll('.terminal-line');
        terminalLines.forEach((line, index) => {
            if (this.lines[index]) {
                this.lines[index].element = line;
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
            }
        });
        
        this.startAnimation();
    }
    
    startAnimation() {
        this.lines.forEach((line, index) => {
            setTimeout(() => {
                if (line.element) {
                    line.element.style.transition = 'all 0.5s ease';
                    line.element.style.opacity = '1';
                    line.element.style.transform = 'translateX(0)';
                    
                    // Add typing sound effect (visual)
                    line.element.classList.add('typing');
                    setTimeout(() => {
                        line.element.classList.remove('typing');
                    }, 300);
                }
            }, line.delay);
        });
    }
}

// Counter animation with easing
class CounterAnimator {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.startTime = null;
        this.startValue = 0;
    }
    
    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    animate(currentTime) {
        if (!this.startTime) this.startTime = currentTime;
        
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const easedProgress = this.easeOutQuart(progress);
        
        const currentValue = Math.floor(this.startValue + (this.target - this.startValue) * easedProgress);
        this.element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame((time) => this.animate(time));
        } else {
            this.element.textContent = this.target;
        }
    }
    
    start() {
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Enhanced Intersection Observer with better performance
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Animation observer
const animationObserver = createObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate counters when stats section is visible
            if (entry.target.classList.contains('hero-stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    if (!isNaN(target)) {
                        const counter = new CounterAnimator(stat, target, 1500);
                        counter.start();
                    }
                });
            }
            
            // Stagger animation for cards
            if (entry.target.classList.contains('features-grid') || 
                entry.target.classList.contains('files-grid') || 
                entry.target.classList.contains('audience-grid')) {
                const cards = entry.target.querySelectorAll('.feature-card, .file-card, .audience-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
        }
    });
});

// Modern button interactions
class ButtonEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Enhanced primary buttons
        document.querySelectorAll('.btn-primary').forEach(button => {
            this.enhanceButton(button);
        });
        
        // Purchase button functionality
        const purchaseBtn = document.querySelector('.btn-purchase');
        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', () => {
                this.handlePurchaseClick();
            });
        }
        
        // Demo and primary button functionality
        document.querySelectorAll('.btn-secondary, .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleContactClick();
            });
        });
    }
    
    enhanceButton(button) {
        // Add ripple effect
        button.addEventListener('click', (e) => {
            this.createRipple(e, button);
        });
        
        // Add hover glow effect
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    }
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    handlePurchaseClick() {
        // Add loading state
        const btn = document.querySelector('.btn-purchase');
        const originalText = btn.textContent;
        btn.textContent = 'Переход в Telegram...';
        btn.disabled = true;
        
        setTimeout(() => {
            window.open('https://t.me/MNGR813', '_blank');
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);
    }
    
    handleContactClick() {
        window.open('https://t.me/MNGR813', '_blank');
    }
}

// Enhanced card hover effects
class CardEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('.feature-card, .file-card, .audience-card').forEach(card => {
            this.enhanceCard(card);
        });
    }
    
    enhanceCard(card) {
        card.addEventListener('mouseenter', (e) => {
            this.handleMouseEnter(e, card);
        });
        
        card.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, card);
        });
        
        card.addEventListener('mouseleave', (e) => {
            this.handleMouseLeave(e, card);
        });
    }
    
    handleMouseEnter(e, card) {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
    
    handleMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor scroll performance
        let scrollCount = 0;
        const scrollStart = performance.now();
        
        window.addEventListener('scroll', () => {
            scrollCount++;
        });
        
        // Log performance after 5 seconds
        setTimeout(() => {
            const scrollEnd = performance.now();
            const avgScrollTime = (scrollEnd - scrollStart) / scrollCount;
            console.log(`Average scroll event time: ${avgScrollTime.toFixed(2)}ms`);
        }, 5000);
    }
}

// Modern loading screen
class LoadingScreen {
    constructor() {
        this.createLoader();
    }
    
    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.innerHTML = `
            <div class="loader-container">
                <div class="loader-logo">
                    <span class="loader-icon">⚡</span>
                    <span class="loader-text">SCARRY SOFT</span>
                </div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
                <div class="loader-status">Загрузка системы...</div>
            </div>
        `;
        
        // Add loader styles
        const loaderStyles = `
            #loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease, visibility 0.5s ease;
            }
            
            .loader-container {
                text-align: center;
                color: #fafafa;
            }
            
            .loader-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                font-family: 'Space Grotesk', sans-serif;
                font-size: 2rem;
                font-weight: 700;
            }
            
            .loader-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 3rem;
                background: linear-gradient(135deg, #00f5ff, #1de9b6);
                border-radius: 0.75rem;
                font-size: 1.5rem;
                animation: loaderFloat 2s ease-in-out infinite;
            }
            
            .loader-progress {
                width: 300px;
                height: 4px;
                background: rgba(0, 245, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 1rem;
            }
            
            .loader-bar {
                height: 100%;
                background: linear-gradient(90deg, #00f5ff, #1de9b6);
                border-radius: 2px;
                animation: loaderProgress 2s ease-in-out;
            }
            
            .loader-status {
                font-size: 1rem;
                color: #d4d4d4;
                font-weight: 500;
            }
            
            @keyframes loaderFloat {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-5px) rotate(5deg); }
            }
            
            @keyframes loaderProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = loaderStyles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(loader);
        
        // Remove loader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                setTimeout(() => {
                    loader.remove();
                    styleSheet.remove();
                }, 500);
            }, 1000);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize loading screen
    new LoadingScreen();
    
    // Initialize terminal animation
    new TerminalAnimator();
    
    // Initialize button enhancements
    new ButtonEnhancer();
    
    // Initialize card enhancements
    new CardEnhancer();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Observe elements for animations
    const elementsToObserve = document.querySelectorAll(
        '.hero-stats, .features-grid, .files-grid, .audience-grid, .security-item'
    );
    
    elementsToObserve.forEach(el => {
        animationObserver.observe(el);
    });
    
    // Add custom CSS animations
    const customStyles = document.createElement('style');
    customStyles.textContent = `
        .typing {
            position: relative;
        }
        
        .typing::after {
            content: '';
            position: absolute;
            right: -2px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #00f5ff;
            animation: blink 0.5s ease-in-out 3;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Enhanced card animations */
        .feature-card,
        .file-card,
        .audience-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card.animate-in,
        .file-card.animate-in,
        .audience-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Improved focus styles */
        .btn:focus-visible,
        a:focus-visible {
            outline: 2px solid #00f5ff;
            outline-offset: 2px;
            border-radius: 0.5rem;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    document.head.appendChild(customStyles);
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TerminalAnimator,
        CounterAnimator,
        ButtonEnhancer,
        CardEnhancer
    };
}