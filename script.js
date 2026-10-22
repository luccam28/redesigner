/* ============================================================
   script.js — ReDesigner Agência Digital
   ============================================================
   ⚠️ CORREÇÃO APLICADA:
   - Bloqueio de scroll do <body> ao abrir o menu mobile
     (evita que o overlay "role" junto com a página)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================================
    // 1. PARTICLES.JS (somente desktop)
    // ============================================================
    if (window.particlesJS && window.innerWidth > 768) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 45 },
                color: { value: '#ffffff' },
                opacity: { value: 0.15 },
                size: { value: 2 },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.05, width: 1 },
                move: { enable: true, speed: 0.8 }
            }
        });
    }

    // ============================================================
    // 2. NAVBAR SCROLL
    // ============================================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ============================================================
    // 3. MENU MOBILE
    // ============================================================
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    /**
     * Abre/fecha o menu mobile.
     * @param {boolean} open - Se `true`, força o fechamento. Se omitido, alterna.
     */
    function toggleMobileMenu(open) {
        const isOpen = typeof open === 'boolean' ? open : mobileMenu.classList.contains('active');
        if (isOpen) {
            // FECHAR
            mobileMenu.classList.remove('active');
            burgerBtn.classList.remove('open');
            burgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // ✅ libera o scroll
        } else {
            // ABRIR
            mobileMenu.classList.add('active');
            burgerBtn.classList.add('open');
            burgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // ✅ bloqueia o scroll
        }
    }

    burgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Fecha ao clicar em um link do menu
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            toggleMobileMenu(true);
        });
    });

    // Fecha ao clicar fora do menu (no overlay)
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            toggleMobileMenu(true);
        }
    });

    // ============================================================
    // 4. ROTAÇÃO DE IMAGENS DO HERO
    // ============================================================
    const bgImgs = document.querySelectorAll('.hero-bg-img');
    if (bgImgs.length > 1) {
        let bgIndex = 0;
        setInterval(function () {
            bgImgs[bgIndex].classList.remove('active');
            bgIndex = (bgIndex + 1) % bgImgs.length;
            bgImgs[bgIndex].classList.add('active');
        }, 5000);
    }

    // ============================================================
    // 5. DEPOIMENTOS (CARROSSEL)
    // ============================================================
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (track && dotsContainer) {
        const cards = Array.from(track.children);
        let currentSlide = 0;
        let autoSlideInterval;

        cards.forEach(function (_, i) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
            dot.addEventListener('click', function () {
                goToSlide(i);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
            document.querySelectorAll('.dot').forEach(function (d, i) {
                d.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            const next = (currentSlide + 1) % cards.length;
            goToSlide(next);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 6000);
        }

        autoSlideInterval = setInterval(nextSlide, 6000);

        const container = track.closest('.testimonials-container');
        container.addEventListener('mouseenter', function () {
            clearInterval(autoSlideInterval);
        });
        container.addEventListener('mouseleave', function () {
            resetAutoSlide();
        });
    }

    // ============================================================
    // 6. CASES (DUPLICAR PARA INFINITO)
    // ============================================================
    const casesTrack = document.getElementById('casesTrack');
    if (casesTrack) {
        const items = Array.from(casesTrack.children);
        items.forEach(function (item) {
            casesTrack.appendChild(item.cloneNode(true));
        });
        casesTrack.classList.add('animate');
    }

    // ============================================================
    // 7. WHATSAPP FLOATING
    // ============================================================
    const whatsappFloat = document.getElementById('whatsappFloatBtn');
    const whatsappModal = document.getElementById('whatsappModal');
    const whatsappClose = document.getElementById('whatsappModalClose');

    function toggleWhatsAppModal(forceClose) {
        if (forceClose) {
            whatsappModal.classList.remove('show');
            return;
        }
        whatsappModal.classList.toggle('show');
    }

    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function () {
            if (whatsappModal.classList.contains('show')) {
                toggleWhatsAppModal(true);
            } else {
                toggleWhatsAppModal();
                setTimeout(function () {
                    toggleWhatsAppModal(true);
                }, 8000);
            }
        });
        // Acessibilidade (Enter / Space)
        whatsappFloat.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                whatsappFloat.click();
            }
        });
    }

    if (whatsappClose) {
        whatsappClose.addEventListener('click', function () {
            toggleWhatsAppModal(true);
        });
    }

    document.addEventListener('click', function (e) {
        if (whatsappModal && whatsappModal.classList.contains('show')) {
            if (!whatsappModal.contains(e.target) && e.target !== whatsappFloat) {
                toggleWhatsAppModal(true);
            }
        }
    });

    // ============================================================
    // 8. COOKIE POPUP
    // ============================================================
    const cookiePopup = document.getElementById('cookiePopup');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    function showCookiePopup() {
        if (!localStorage.getItem('redesigner_cookies')) {
            setTimeout(function () {
                cookiePopup.classList.add('show');
            }, 2500);
        }
    }

    function acceptCookies() {
        localStorage.setItem('redesigner_cookies', 'true');
        cookiePopup.classList.remove('show');
    }

    function declineCookies() {
        localStorage.setItem('redesigner_cookies', 'false');
        cookiePopup.classList.remove('show');
    }

    if (cookieAccept) cookieAccept.addEventListener('click', acceptCookies);
    if (cookieDecline) cookieDecline.addEventListener('click', declineCookies);

    showCookiePopup();

    // ============================================================
    // 9. REVELAÇÃO (INTERSECTION OBSERVER)
    // ============================================================
    const revealElements = document.querySelectorAll(
        '.card, .testi-card, .case-item, .break-conversion, .problema-item, ' +
        '.processo-step, .autoridade-item, .faq-item'
    );

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ============================================================
    // 10. NAVEGAÇÃO SUAVE E DESTAQUE DO MENU
    // ============================================================
    const navLinks = document.querySelectorAll('.nav-items a:not(.mobile-link)');
    const sections = document.querySelectorAll('section[id]');

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu(true);
                }
            }
        });
    });

    function updateActiveNav() {
        let currentId = '';
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        const footer = document.querySelector('.site-footer');
        if (footer && window.pageYOffset + window.innerHeight >= footer.offsetTop + 100) {
            currentId = 'contato';
        }

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // ============================================================
    // 11. EXIT INTENT (para WhatsApp)
    // ============================================================
    let exitShown = false;
    document.addEventListener('mouseleave', function (e) {
        if (e.clientY <= 0 && !exitShown && !localStorage.getItem('exit_modal')) {
            exitShown = true;
            localStorage.setItem('exit_modal', 'true');
            whatsappModal.classList.add('show');
            setTimeout(function () {
                whatsappModal.classList.remove('show');
            }, 8000);
        }
    });
});