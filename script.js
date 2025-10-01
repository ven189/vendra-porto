/* ========================================
   PORTFOLIO WEBSITE - MINECRAFT THEME
   ======================================== */

/* Minecraft Sound Effects */
const createMinecraftSounds = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playClickSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    const playHoverSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    };
    
    return { playClickSound, playHoverSound };
};

let minecraftSounds = null;
const initSounds = () => {
    if (!minecraftSounds) {
        minecraftSounds = createMinecraftSounds();
    }
};

/* Sound Effects Initialization */
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, .link, .card:not(#creeper)');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            initSounds();
            if (minecraftSounds) minecraftSounds.playHoverSound();
        });
        
        button.addEventListener('click', () => {
            initSounds();
            if (minecraftSounds) minecraftSounds.playClickSound();
        });
    });
    
    const creeperElement = document.getElementById('creeper');
    if (creeperElement) {
        creeperElement.addEventListener('click', () => {
            initSounds();
            if (minecraftSounds) minecraftSounds.playClickSound();
        });
    }
});

/* Mobile Navigation */
const navToggleButton = document.querySelector('.nav__toggle');
const navMenu = document.getElementById('primary-nav');

if (navToggleButton && navMenu) {
    navToggleButton.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggleButton.setAttribute('aria-expanded', String(isOpen));
    });
}

/* Smooth Scrolling */
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.matches('a[href^="#"]')) {
        const href = target.getAttribute('href');
        if (href && href.length > 1) {
            const el = document.querySelector(href);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navMenu && navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggleButton?.setAttribute('aria-expanded', 'false');
                }
            }
        }
    }
});

/* ========================================
   DYNAMIC YEAR UPDATE
   ======================================== */
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

/* ========================================
   THEME TOGGLE SYSTEM
   ======================================== */
const themeButton = document.querySelector('.theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
    if (themeButton) themeButton.setAttribute('aria-pressed', String(savedTheme === 'light'));
}
themeButton?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    themeButton.setAttribute('aria-pressed', String(next === 'light'));
    localStorage.setItem('theme', next);
});

// Back to top button
const toTop = document.getElementById('toTop');
if (toTop) {
    window.addEventListener('scroll', () => {
        const show = window.scrollY > 400;
        toTop.toggleAttribute('hidden', !show);
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Tabs logic
const tabButtons = Array.from(document.querySelectorAll('.tab'));
const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('aria-controls');
            if (!targetId) return;
            // update buttons
            tabButtons.forEach((b) => {
                const isActive = b === btn;
                b.classList.toggle('is-active', isActive);
                b.setAttribute('aria-selected', String(isActive));
                b.setAttribute('tabindex', isActive ? '0' : '-1');
            });
            // update panels
            tabPanels.forEach((panel) => {
                const isMatch = panel.id === targetId;
                panel.toggleAttribute('hidden', !isMatch);
                panel.classList.toggle('is-active', isMatch);
            });
        });
    });
}

// Counter animation on visible
const counters = Array.from(document.querySelectorAll('.stat__num[data-count]'));
if (counters.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = Number(el.getAttribute('data-count')) || 0;
                const duration = 800;
                const start = performance.now();
                function tick(now){
                    const p = Math.min(1, (now - start) / duration);
                    const val = Math.floor(p * target);
                    el.textContent = String(val);
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                observer.unobserve(el);
            }
        })
    }, { threshold: 0.3 });
    counters.forEach((c) => observer.observe(c));
}

/* ========================================
   FLOATING PARTICLE EFFECTS
   ======================================== */
const PARTICLES = 30;
const frag = document.createDocumentFragment();
for (let i = 0; i < PARTICLES; i++){
    const s = document.createElement('span');
    s.className = 'pixel';
    s.style.left = Math.random()*100 + 'vw';
    s.style.top = Math.random()*100 + 'vh';
    s.style.animationDuration = (6 + Math.random()*6) + 's';
    s.style.animationDelay = (Math.random()*-6) + 's';
    frag.appendChild(s);
}
document.body.appendChild(frag);

// Auto-spawn particles continuously
setInterval(() => {
    const particle = document.createElement('span');
    particle.className = 'pixel';
    particle.style.left = Math.random()*100 + 'vw';
    particle.style.top = '100vh';
    particle.style.animationDuration = (8 + Math.random()*4) + 's';
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 12000);
}, 2000);

// Add special particles on scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    
    if (scrollDelta > 50) {
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'scroll-sparkle';
            sparkle.style.left = Math.random()*100 + 'vw';
            sparkle.style.top = Math.random()*100 + 'vh';
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
    lastScrollY = currentScrollY;
});

/* ========================================
   MINECRAFT CHARACTER INTERACTIONS
   ======================================== */

// Creeper/Steve character interactions
const creeper = document.getElementById('creeper');
if (creeper) {
    // Create speech bubble
    const bubble = document.createElement('div');
    bubble.className = 'creeper-talk';
    bubble.textContent = 'sssss...';
    document.body.appendChild(bubble);

    // Array of Steve phrases
    const steveMessages = [
        'Hei!',
        'Halo!',
        'Nice!', 
        'Awesome!',
        'Let\'s build!',
        'Cool project!',
        'Keep coding!',
        'Great work!'
    ];

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light';
    }

    function getRandomSteveMessage() {
        return steveMessages[Math.floor(Math.random() * steveMessages.length)];
    }

    function creeperPuff() {
        // Use different effects based on theme
        if (getCurrentTheme()) {
            // Light theme (Steve mode) - bounce + sparkles
            document.body.classList.add('bounce');
            createSparkles();
            bubble.textContent = getRandomSteveMessage();
            bubble.classList.add('show', 'steve-mode');
            
            setTimeout(() => {
                document.body.classList.remove('bounce');
                bubble.classList.remove('show', 'steve-mode');
            }, 800);
        } else {
            // Dark theme (Creeper mode) - explosive shake + explosion particles
            document.body.classList.add('shake');
            createExplosionEffect();
            bubble.textContent = 'BOOM! 💥';
            bubble.classList.add('show');
            
            setTimeout(() => {
                document.body.classList.remove('shake');
                bubble.classList.remove('show');
            }, 600);
        }
        
        createMagicalFloatingEffect();
    }

    function createMagicalFloatingEffect() {
        let centerX, centerY;
        
        try {
            const creeperRect = creeper.getBoundingClientRect();
            centerX = creeperRect.left + (creeperRect.width / 2);
            centerY = creeperRect.top + (creeperRect.height / 2);
        } catch (error) {
            centerX = window.innerWidth / 2;
            centerY = window.innerHeight / 2;
        }
        
        // Array of floating emojis/symbols
        const floatingSymbols = ['⭐', '✨', '💫', '🌟', '💥', '💎', '🔥', '⚡'];
        
        // Create floating symbols with better error handling
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                try {
                    const symbol = document.createElement('div');
                    symbol.innerHTML = floatingSymbols[i % floatingSymbols.length];
                    symbol.style.position = 'fixed';
                    symbol.style.left = centerX + 'px';
                    symbol.style.top = centerY + 'px';
                    symbol.style.fontSize = '30px';
                    symbol.style.zIndex = '999999';
                    symbol.style.pointerEvents = 'none';
                    symbol.style.transform = 'translate(-50%, -50%)';
                    symbol.style.textShadow = '0 0 10px #ffff00';
                    symbol.style.userSelect = 'none';
                    
                    if (document.body) {
                        document.body.appendChild(symbol);
                        
                        // Animate each symbol to float upward and outward
                        let startTime = performance.now();
                        const duration = 2000;
                        const angle = (i / 8) * Math.PI * 2;
                        const distance = 100;
                        
                        const animateSymbol = (currentTime) => {
                            try {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                
                                // Calculate new position (float up and outward)
                                const newX = centerX + Math.cos(angle) * distance * progress;
                                const newY = centerY - (50 * progress) + Math.sin(angle) * distance * progress * 0.3;
                                const scale = 1 + progress * 0.5;
                                const opacity = 1 - progress;
                                
                                symbol.style.left = newX + 'px';
                                symbol.style.top = newY + 'px';
                                symbol.style.transform = `translate(-50%, -50%) scale(${scale})`;
                                symbol.style.opacity = opacity;
                                
                                if (progress < 1 && symbol.parentNode) {
                                    requestAnimationFrame(animateSymbol);
                                } else {
                                    if (symbol.parentNode) {
                                        symbol.remove();
                                    }
                                }
                            } catch (animError) {
                                console.error('Animation error:', animError);
                                if (symbol.parentNode) symbol.remove();
                            }
                        };
                        
                        requestAnimationFrame(animateSymbol);
                    }
                } catch (createError) {
                    console.error('Symbol creation error:', createError);
                }
            }, i * 100);
        }
    }

    function steveHit(){
        // Steve hit effect - red flash + shake + damage sound effect
        const steveElement = creeper; // same element, different behavior
        
        // Add hit effect class
        steveElement.classList.add('steve-hit');
        document.body.classList.add('steve-damage');
        
        // Show damage message
        bubble.textContent = 'Ouch!';
        bubble.classList.add('show', 'steve-damage-bubble');
        
        // Create damage particles
        createDamageParticles();
        
        // Remove effects after animation
        setTimeout(() => {
            steveElement.classList.remove('steve-hit');
            document.body.classList.remove('steve-damage');
            bubble.classList.remove('show', 'steve-damage-bubble');
        }, 600);
    }

    function createDamageParticles() {
        // Get Steve's current position more accurately
        const steveRect = creeper.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Center of Steve element
        const centerX = steveRect.left + scrollLeft + (steveRect.width / 2);
        const centerY = steveRect.top + scrollTop + (steveRect.height / 2);
        
        // Create red damage particles that fly out from Steve's center
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'damage-particle';
            
            // Position exactly at Steve's center
            const angle = (i / 10) * Math.PI * 2;
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--angle', angle + 'rad');
            particle.style.animationDelay = (i * 0.03) + 's';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
        
        // Add extra impact particles for more visual feedback
        for (let i = 0; i < 6; i++) {
            const impactParticle = document.createElement('div');
            impactParticle.className = 'impact-particle';
            
            // Random position around Steve's center
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            
            impactParticle.style.left = (centerX + offsetX) + 'px';
            impactParticle.style.top = (centerY + offsetY) + 'px';
            impactParticle.style.animationDelay = (i * 0.02) + 's';
            
            document.body.appendChild(impactParticle);
            
            setTimeout(() => impactParticle.remove(), 500);
        }
    }

    function createSparkles() {
        // Get Steve's accurate position
        const steveRect = creeper.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Center of Steve element
        const centerX = steveRect.left + scrollLeft + (steveRect.width / 2);
        const centerY = steveRect.top + scrollTop + (steveRect.height / 2);
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Position sparkles around Steve's center with some randomness
            const offsetX = (Math.random() - 0.5) * steveRect.width;
            const offsetY = (Math.random() - 0.5) * steveRect.height;
            
            sparkle.style.left = (centerX + offsetX) + 'px';
            sparkle.style.top = (centerY + offsetY) + 'px';
            sparkle.style.animationDelay = (i * 0.08) + 's';
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }

    function createSparkles() {
        // Get creeper position for sparkle effects
        const creeperRect = creeper.getBoundingClientRect();
        const centerX = creeperRect.left + (creeperRect.width / 2);
        const centerY = creeperRect.top + (creeperRect.height / 2);

        // Create golden sparkles for Steve mode
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            
            sparkle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
            sparkle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }

    function createExplosionEffect() {
        // Get creeper position for explosion effects
        const creeperRect = creeper.getBoundingClientRect();
        const centerX = creeperRect.left + (creeperRect.width / 2);
        const centerY = creeperRect.top + (creeperRect.height / 2);

        // Create explosion particles - more chaotic and explosive
        const explosionParticles = ['💥', '🔥', '💨', '⚡', '🌪️', '💢'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = explosionParticles[Math.floor(Math.random() * explosionParticles.length)];
            particle.className = 'explosion-particle';
            
            // Random explosion directions - more chaotic
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            const speed = 0.8 + Math.random() * 0.6;
            
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.fontSize = (20 + Math.random() * 15) + 'px';
            particle.style.zIndex = '999999';
            particle.style.pointerEvents = 'none';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.textShadow = '0 0 10px #ff4444, 0 0 20px #ff0000';
            particle.style.userSelect = 'none';
            
            document.body.appendChild(particle);
            
            // Explosive animation - fast and chaotic
            let startTime = performance.now();
            const duration = 800 + Math.random() * 400;
            
            const animateExplosion = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Explosive movement - faster start, slower end
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const newX = centerX + Math.cos(angle) * distance * easeOut;
                const newY = centerY + Math.sin(angle) * distance * easeOut - (30 * progress);
                
                // Scale and rotation for more dynamic effect
                const scale = 1 + progress * 0.8;
                const rotation = progress * 360 * (Math.random() > 0.5 ? 1 : -1);
                const opacity = 1 - Math.pow(progress, 2);
                
                particle.style.left = newX + 'px';
                particle.style.top = newY + 'px';
                particle.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
                particle.style.opacity = opacity;
                
                if (progress < 1 && particle.parentNode) {
                    requestAnimationFrame(animateExplosion);
                } else {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }
            };
            
            // Stagger the start times for more explosive feel
            setTimeout(() => {
                requestAnimationFrame(animateExplosion);
            }, i * 30);
        }
        
        // Add screen shake effect
        document.body.style.animation = 'explosionShake 0.5s ease-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    // Click handler
    creeper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        creeperPuff();
        
        if (getCurrentTheme()) {
            setTimeout(() => steveHit(), 100);
        }
    });

    // Hover handler
    creeper.addEventListener('mouseenter', () => {
        if (getCurrentTheme()) {
            bubble.textContent = getRandomSteveMessage();
            bubble.classList.add('show', 'steve-mode');
        } else {
            bubble.textContent = 'sssss...';
            bubble.classList.add('show');
            bubble.classList.remove('steve-mode');
        }
    });

    creeper.addEventListener('mouseleave', () => {
        bubble.classList.remove('show', 'steve-mode');
    });
}