// Smamo LP Full Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-In Effects
    const fadeElements = document.querySelectorAll('.fade-in, .reveal-text, .fade-simple');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            }
        });
    }, observerOptions);
    fadeElements.forEach(el => observer.observe(el));

    // 2. Survey Section Scroll Logic (Fixed: Targets .survey-card instead of .survey-item-btn)
    const surveyCards = document.querySelectorAll('.survey-card');
    const solutionSection = document.getElementById('solution-section');
    if (surveyCards.length > 0 && solutionSection) {
        surveyCards.forEach((card) => {
            card.addEventListener('click', () => {
                solutionSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // 3. FAQ Filtering Logic
    const filterButtons = document.querySelectorAll('.faq-tab-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    function applyFilter(filter) {
        faqItems.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || (category && category.includes(filter))) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    }
    // Initial Filter for FAQ
    const initialActive = document.querySelector('.faq-tab-btn.active');
    if (initialActive) {
        applyFilter(initialActive.dataset.filter);
    }
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilter(button.dataset.filter);

            // Re-trigger fade effect
            faqItems.forEach(item => {
                if (!item.classList.contains('hide')) {
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.opacity = '1'; }, 10);
                }
            });
        });
    });

    // 4. Case Study Carousel Logic (Updated with Dragging)
    const carousel = document.getElementById('caseCarousel');
    const slides = document.querySelectorAll('.case-slide');
    const prevBtn = document.getElementById('casePrev');
    const nextBtn = document.getElementById('caseNext');
    const dots = document.querySelectorAll('#caseDots .dot');
    let currentCaseIndex = 0;

    let isDragging = false;
    let startPosX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    const dragThreshold = 70;

    if (carousel && slides.length > 0) {
        function updateCaseCarousel() {
            const containerWidth = carousel.parentElement.offsetWidth;
            const targetSlide = slides[currentCaseIndex];

            // Get the current slide's position relative to the track
            const slideWidth = targetSlide.offsetWidth;
            const slideLeft = targetSlide.offsetLeft;

            // Target: Center of the slide (slideLeft + slideWidth/2) should be at Screen Center (containerWidth/2)
            // currentTranslate = (containerWidth / 2) - (slideLeft + slideWidth / 2)
            currentTranslate = (containerWidth / 2) - (slideLeft + (slideWidth / 2));

            carousel.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            carousel.style.transform = `translateX(${currentTranslate}px)`;

            prevTranslate = currentTranslate;

            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentCaseIndex);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentCaseIndex);
            });
        }

        // Drag functions
        function dragStart(e) {
            isDragging = true;
            startPosX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            carousel.style.transition = 'none';
        }

        function dragMove(e) {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diffX = currentX - startPosX;
            carousel.style.transform = `translateX(${prevTranslate + diffX}px)`;
        }

        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startPosX);
            const diffX = endX - startPosX;

            if (diffX < -dragThreshold) {
                currentCaseIndex = Math.min(currentCaseIndex + 1, slides.length - 1);
            } else if (diffX > dragThreshold) {
                currentCaseIndex = Math.max(currentCaseIndex - 1, 0);
            }
            updateCaseCarousel();
        }

        // Event Listeners
        carousel.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        carousel.addEventListener('touchstart', dragStart);
        window.addEventListener('touchmove', dragMove);
        window.addEventListener('touchend', dragEnd);

        // Prevent images from being dragged natively
        carousel.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        prevBtn?.addEventListener('click', () => {
            currentCaseIndex = (currentCaseIndex > 0) ? currentCaseIndex - 1 : slides.length - 1;
            updateCaseCarousel();
        });

        nextBtn?.addEventListener('click', () => {
            currentCaseIndex = (currentCaseIndex < slides.length - 1) ? currentCaseIndex + 1 : 0;
            updateCaseCarousel();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentCaseIndex = index;
                updateCaseCarousel();
            });
        });

        window.addEventListener('resize', updateCaseCarousel);
        setTimeout(updateCaseCarousel, 100);
    }

    // 5. Modal Popup Logic
    const modal = document.getElementById('contactModal');
    const ctaButtons = document.querySelectorAll('.cta-link-main');
    const closeModal = document.getElementById('closeModal');
    const modalFormArea = document.getElementById('modalFormArea');
    const applicationForm = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccess');

    if (modal) {
        // Open Modal
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('is-active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        // Close Modal (Close X)
        closeModal?.addEventListener('click', () => {
            modal.classList.remove('is-active');
            document.body.style.overflow = ''; // Restore scroll
            resetModal();
        });

        // Close Modal (Overlay Click)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-active');
                document.body.style.overflow = '';
                resetModal();
            }
        });

        // Close Modal (Success Message Close)
        closeSuccessBtn?.addEventListener('click', () => {
            modal.classList.remove('is-active');
            document.body.style.overflow = '';
            resetModal();
        });

        function resetModal() {
            setTimeout(() => {
                if (modalFormArea) modalFormArea.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
                applicationForm.reset();
                applicationForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
            }, 500); // Wait for transition out
        }

        // Form Submit
        applicationForm?.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const inputs = applicationForm.querySelectorAll('input[required]');

            inputs.forEach(input => {
                const group = input.closest('.form-group');
                if (!input.checkValidity()) {
                    isValid = false;
                    group?.classList.add('has-error');
                } else {
                    group?.classList.remove('has-error');
                }
            });

            // Check terms checkbox
            const terms = document.getElementById('terms');
            if (terms && !terms.checked) {
                isValid = false;
            }

            if (isValid) {
                // Simulate loading or transition
                if (modalFormArea) modalFormArea.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';
            }
        });
    }
});
