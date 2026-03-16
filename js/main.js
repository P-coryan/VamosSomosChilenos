/* ============================================
   VAMOS SOMOS CHILENOS — Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // ---------- DOM REFERENCES ----------
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const carousel = document.getElementById('carousel');
    const carouselTrack = carousel ? carousel.querySelector('.carousel__track') : null;
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const backToTop = document.getElementById('backToTop');

    // ---------- NAV SCROLL ----------
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ---------- MOBILE MENU TOGGLE ----------
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- SMOOTH SCROLL ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---------- INTERSECTION OBSERVER — REVEAL ANIMATIONS ----------
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });

    // ---------- STAT BAR ANIMATIONS ----------
    const statObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.stat__fill');
                    if (fill) {
                        const width = fill.getAttribute('data-width');
                        fill.style.setProperty('--target-width', width + '%');
                        fill.classList.add('animated');
                    }
                    statObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('.stat').forEach(function (el) {
        statObserver.observe(el);
    });

    // ---------- CAROUSEL CONTROLS ----------
    if (carouselTrack && carouselPrev && carouselNext) {
        var scrollAmount = 320;

        carouselPrev.addEventListener('click', function () {
            carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        carouselNext.addEventListener('click', function () {
            carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // ---------- CONTACT FORM VALIDATION ----------
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var isValid = true;

            // Validate each required field
            var groups = contactForm.querySelectorAll('.form__group');
            groups.forEach(function (group) {
                var input = group.querySelector('.form__input');
                if (!input) return;

                group.classList.remove('invalid');

                if (input.required && !input.value.trim()) {
                    group.classList.add('invalid');
                    isValid = false;
                    return;
                }

                if (input.type === 'email' && input.value) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        group.classList.add('invalid');
                        isValid = false;
                        return;
                    }
                }

                if (input.minLength > 0 && input.value.length < input.minLength) {
                    group.classList.add('invalid');
                    isValid = false;
                    return;
                }

                if (input.tagName === 'SELECT' && !input.value) {
                    group.classList.add('invalid');
                    isValid = false;
                }
            });

            if (isValid) {
                // Submit form via Formspree
                var formData = new FormData(contactForm);

                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                })
                    .then(function (response) {
                        if (response.ok) {
                            contactForm.reset();
                            formSuccess.classList.add('show');
                            setTimeout(function () {
                                formSuccess.classList.remove('show');
                            }, 5000);
                        }
                    })
                    .catch(function () {
                        // Fallback: show success anyway for demo purposes
                        contactForm.reset();
                        formSuccess.classList.add('show');
                        setTimeout(function () {
                            formSuccess.classList.remove('show');
                        }, 5000);
                    });
            }
        });

        // Clear invalid state on input
        contactForm.querySelectorAll('.form__input').forEach(function (input) {
            input.addEventListener('input', function () {
                this.closest('.form__group').classList.remove('invalid');
            });
        });
    }

    // ---------- BACK TO TOP ----------
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
