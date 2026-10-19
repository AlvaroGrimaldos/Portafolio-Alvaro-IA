// =============================================
// SCRIPT.JS - Portafolio Álvaro Grimaldos
// =============================================

// Marca que el JS está vivo antes de pintar: el CSS solo oculta
// contenido para animarlo cuando esta clase existe.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==================== NAVBAR SCROLL ====================
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (!navbar) return;
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }

    // ==================== MOBILE MENU ====================
    function setupMobileMenu() {
        const toggleBtn = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!toggleBtn || !mobileMenu) return;

        const setOpen = (open) => {
            mobileMenu.classList.toggle('hidden', !open);
            toggleBtn.setAttribute('aria-expanded', String(open));
        };

        setOpen(false);

        toggleBtn.addEventListener('click', () => {
            setOpen(mobileMenu.classList.contains('hidden'));
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => setOpen(false));
        });

        // Escape cierra el menú y devuelve el foco al botón
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                setOpen(false);
                toggleBtn.focus();
            }
        });

        // Un clic fuera también lo cierra
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('hidden')) return;
            if (mobileMenu.contains(e.target) || toggleBtn.contains(e.target)) return;
            setOpen(false);
        });
    }

    // ==================== TABS DE HABILIDADES ====================
    function setupTabs() {
        const techTab = document.getElementById('tab-tech');
        const softTab = document.getElementById('tab-soft');
        const techSkills = document.getElementById('tech-skills');
        const softSkills = document.getElementById('soft-skills');

        if (!techTab || !softTab || !techSkills || !softSkills) return;

        const tabs = [
            { btn: techTab, panel: techSkills },
            { btn: softTab, panel: softSkills },
        ];

        function select(index) {
            tabs.forEach(({ btn, panel }, i) => {
                const active = i === index;
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-selected', String(active));
                btn.setAttribute('tabindex', active ? '0' : '-1');
                panel.classList.toggle('hidden', !active);
                panel.hidden = !active;
            });
            if (index === 1) animateSkillBars();
        }

        tabs.forEach(({ btn }, i) => {
            btn.addEventListener('click', () => select(i));
            // Flechas izquierda/derecha, como espera un tablist
            btn.addEventListener('keydown', (e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
                select(next);
                tabs[next].btn.focus();
            });
        });

        select(0);
    }

    // ==================== BARRAS DE HABILIDADES ====================
    // El ancho inline se guarda y se repone al revelar, para que la
    // transición de 1.4s tenga de dónde partir.
    function prepareSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const target = bar.style.width;
            if (target) bar.dataset.target = target;
            bar.style.width = prefersReducedMotion ? (target || '0%') : '0%';
        });
    }

    function animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            if (bar.dataset.target) bar.style.width = bar.dataset.target;
        });
    }

    // ==================== TARJETAS QUE GIRAN ====================
    // Con ratón basta el hover; con teclado y en táctil hacía falta esto.
    function setupFlipCards() {
        document.querySelectorAll('.flip-card').forEach(card => {
            const label = card.querySelector('.flip-card-front p');
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-expanded', 'false');
            if (label) {
                card.setAttribute('aria-label', `${label.textContent.trim()}: ver detalle`);
            }

            const toggle = () => {
                const flipped = card.classList.toggle('is-flipped');
                card.setAttribute('aria-expanded', String(flipped));
            };

            card.addEventListener('click', toggle);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    toggle();
                }
            });
            card.addEventListener('blur', () => {
                card.classList.remove('is-flipped');
                card.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==================== ANIMACIÓN DE CONTADORES ====================
    function animateCounters(scope) {
        const counters = scope.querySelectorAll('.counter[data-target]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (Number.isNaN(target)) return;

            if (prefersReducedMotion) {
                counter.textContent = target;
                return;
            }

            const duration = 1100;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                // Desaceleración exponencial, no lineal
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
        });
    }

    // ==================== CREACIÓN DE PARTÍCULAS ====================
    function createParticles() {
        const container = document.querySelector('.particles-container');
        if (!container || prefersReducedMotion) return;

        const particleCount = window.innerWidth < 768 ? 25 : 45;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `-${Math.random() * 10}s`;

            fragment.appendChild(particle);
        }

        container.appendChild(fragment);
    }

    // ==================== BACK TO TOP ====================
    const backToTop = document.getElementById('back-to-top');

    function handleBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }

    // ==================== SECCIÓN ACTIVA EN LA NAVEGACIÓN ====================
    function setupSectionHighlight() {
        const links = [...document.querySelectorAll('.nav-link')];
        const sections = links
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        if (!sections.length) return;

        const visible = new Set();

        const paint = () => {
            // La sección activa es la primera visible en orden de documento,
            // y arriba del todo siempre manda la primera.
            const current = window.scrollY < 120
                ? sections[0]
                : sections.find(section => visible.has(section));
            links.forEach(link => {
                link.classList.toggle(
                    'is-current',
                    !!current && link.getAttribute('href') === `#${current.id}`
                );
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
            paint();
        }, { rootMargin: '-30% 0px -55% 0px' });

        sections.forEach(section => observer.observe(section));
        window.addEventListener('scroll', paint, { passive: true });
        paint();
    }

    // ==================== REVELADO AL SCROLL ====================
    function setupReveals() {
        const items = document.querySelectorAll('.animate-item');
        if (!items.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('animate'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        items.forEach(item => observer.observe(item));
    }

    // ==================== OBSERVER PARA CONTADORES Y BARRAS ====================
    function setupObservers() {
        // El grid de estadísticas, no el contenedor de toda la sección:
        // con el grande, el umbral no se alcanzaba nunca en móvil.
        const statsGrid = document.querySelector('.stat-card')?.parentElement;

        if (statsGrid) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    animateCounters(entry.target);
                    counterObserver.unobserve(entry.target);
                });
            }, { threshold: 0.35 });

            counterObserver.observe(statsGrid);
        }

        const softSkills = document.getElementById('soft-skills');
        if (softSkills) {
            const barObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    animateSkillBars();
                    barObserver.unobserve(entry.target);
                });
            }, { threshold: 0.2 });

            barObserver.observe(softSkills);
        }
    }

    // ==================== FORMULARIO DE CONTACTO ====================
    // Mismo endpoint de Formspree, pero sin salir de la página y con
    // estados de envío, éxito y error.
    function setupContactForm() {
        const form = document.querySelector('form[action*="formspree"]');
        if (!form) return;

        const status = document.getElementById('form-status');
        const button = form.querySelector('button[type="submit"]');
        const buttonLabel = button ? button.innerHTML : '';

        const say = (message, kind) => {
            if (!status) return;
            status.textContent = message;
            status.classList.remove('is-success', 'is-error');
            status.classList.add('is-visible', kind);
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (button) {
                button.setAttribute('aria-busy', 'true');
                button.disabled = true;
                button.innerHTML = 'Enviando<span class="spinner" aria-hidden="true"></span>';
            }
            if (status) status.classList.remove('is-visible');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' },
                });

                if (response.ok) {
                    form.reset();
                    say('Mensaje enviado. Te respondo lo antes posible.', 'is-success');
                } else {
                    const data = await response.json().catch(() => null);
                    const detail = data?.errors?.map(err => err.message).join('. ');
                    say(
                        detail
                            ? `No se pudo enviar: ${detail}`
                            : 'No se pudo enviar el mensaje. Escríbeme a alvarogrimaldos21@gmail.com.',
                        'is-error'
                    );
                }
            } catch (error) {
                say(
                    'No hay conexión con el servidor. Revisa tu red o escríbeme a alvarogrimaldos21@gmail.com.',
                    'is-error'
                );
            } finally {
                if (button) {
                    button.removeAttribute('aria-busy');
                    button.disabled = false;
                    button.innerHTML = buttonLabel;
                }
            }
        });
    }

    // ==================== INIT ====================
    function init() {
        // Un solo listener de scroll, sincronizado con el repintado
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                handleNavbarScroll();
                handleBackToTop();
                ticking = false;
            });
        }, { passive: true });

        handleNavbarScroll();
        handleBackToTop();

        setupMobileMenu();
        prepareSkillBars();
        setupTabs();
        setupFlipCards();
        createParticles();
        setupReveals();
        setupObservers();
        setupSectionHighlight();
        setupContactForm();

        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                });
                document.getElementById('inicio')?.focus?.();
            });
        }
    }

    init();
});
