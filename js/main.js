/* ==========================================================================
   InvoiceFine Website Core JavaScript (main.js) - Pro Version
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initFaqAccordion();
  initRoiCalculator();
  initStatCounters();
  initScreenshotAutoSlider();
  initLightbox();
  initContactForm();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Dark / Light Theme Controller
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const savedTheme = localStorage.getItem('invoicefine_theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('invoicefine_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('invoicefine_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcons(newTheme);
    }
  });
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Auto-Sliding Screenshot Carousel (PRO)
   -------------------------------------------------------------------------- */
function initScreenshotAutoSlider() {
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide-card');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const slideWidth = slides[0].offsetWidth + 28; // card width + gap
  const totalSlides = slides.length;
  const visibleSlides = Math.max(1, Math.floor(track.parentElement.offsetWidth / slideWidth));
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    const dotCount = maxIndex + 1;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = maxIndex;
    } else if (index > maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    const offset = currentIndex * slideWidth;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 3500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoSlide);
  track.addEventListener('mouseleave', startAutoSlide);
  track.addEventListener('touchstart', stopAutoSlide, { passive: true });
  track.addEventListener('touchend', startAutoSlide);

  startAutoSlide();
}

/* --------------------------------------------------------------------------
   4. Image Lightbox for Screenshots
   -------------------------------------------------------------------------- */
function initLightbox() {
  const slides = document.querySelectorAll('.slide-card img, .lightbox-trigger');
  if (!slides.length) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'imgLightbox';
  lightbox.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.9); z-index: 9999;
    display: none; align-items: center; justify-content: center;
    backdrop-filter: blur(8px); cursor: pointer; padding: 20px;
  `;
  lightbox.innerHTML = `
    <div style="position: relative; max-width: 90%; max-height: 90%;">
      <img id="lightboxImg" src="" style="max-width: 100%; max-height: 85vh; border-radius: 18px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); border: 2px solid rgba(255,255,255,0.2);">
      <button style="position: absolute; top: -18px; right: -18px; background: #D93632; color: #FFF; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; font-weight: bold; cursor: pointer;">✕</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById('lightboxImg');

  slides.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. Scroll-Triggered Reveal Animation (Pro UI)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. Interactive Pricing ROI Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const billsPerDayInput = document.getElementById('calcBillsPerDay');
  const cloudAppPriceInput = document.getElementById('calcCloudAppPrice');
  const savingsDisplay = document.getElementById('calcTotalSavings');
  const hoursSavedDisplay = document.getElementById('calcHoursSaved');

  if (!billsPerDayInput || !savingsDisplay) return;

  function calculate() {
    const billsPerDay = parseInt(billsPerDayInput.value, 10) || 15;
    const competitorPrice = parseInt(cloudAppPriceInput ? cloudAppPriceInput.value : 3000, 10) || 3000;
    
    const invoiceFineCost = 299;
    const moneySaved = Math.max(0, competitorPrice - invoiceFineCost);
    const annualHoursSaved = Math.round((billsPerDay * 3 * 300) / 60);

    savingsDisplay.innerText = `₹${moneySaved.toLocaleString('en-IN')}`;
    if (hoursSavedDisplay) {
      hoursSavedDisplay.innerText = `${annualHoursSaved} Hours`;
    }
  }

  billsPerDayInput.addEventListener('input', calculate);
  if (cloudAppPriceInput) {
    cloudAppPriceInput.addEventListener('input', calculate);
  }

  calculate();
}

/* --------------------------------------------------------------------------
   8. Statistics Counter Animation
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-counter');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-count'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = 20;
        const increment = Math.ceil(targetValue / 50);

        const timer = setInterval(() => {
          count += increment;
          if (count >= targetValue) {
            count = targetValue;
            clearInterval(timer);
          }
          el.innerText = `${prefix}${count.toLocaleString('en-IN')}${suffix}`;
        }, speed);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

/* --------------------------------------------------------------------------
   9. Contact Form (progressive enhancement over FormSubmit)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = document.getElementById('contactSubmitBtn');
  const status = document.getElementById('contactFormStatus');
  const honey = form.querySelector('[name="_honey"]');
  const originalBtnHtml = btn ? btn.innerHTML : '';
  const supportEmail = 'jitendraeditiz@gmail.com';

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status is-visible form-status-' + type;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Silent drop if the honeypot was filled (bot).
    if (honey && honey.value.trim() !== '') return;

    // Native constraint validation (required, email format).
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Sending…</span>';
    }
    setStatus('Sending your message…', 'info');

    // Post to the AJAX variant of whatever endpoint the form action points to.
    const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && (data.success === true || data.success === 'true');

      if (ok) {
        form.reset();
        setStatus('✓ Thank you! Your message has been sent. We reply within 24 hours (Mon–Sat).', 'success');
      } else {
        throw new Error(data.message || 'Request failed');
      }
    } catch (err) {
      setStatus('Could not send right now. Please email us directly at ' + supportEmail + '.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
      }
    }
  });
}
