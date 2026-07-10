/* ==========================================================================
   Luxe Salon Dwarka — main.js (Vanilla JS, no dependencies)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Sticky header shadow ---------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScrollHeader = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ---------------- Mobile navigation menu ---------------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    var closeMenu = function () {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    };
    var openMenu = function () {
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960) closeMenu();
    });
  }

  /* ---------------- Scroll reveal + part-line draw ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .part-line');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------- FAQ Accordion ---------------- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.accordion-item').forEach(function (other) {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.setAttribute('data-open', 'false');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.setAttribute('data-open', 'true');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Gallery filter ---------------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.masonry-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          var show = filter === 'all' || filter === category;
          item.hidden = !show;
        });
      });
    });
  }

  /* ---------------- Gallery lightbox ---------------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('figcaption');
    var currentIndex = 0;
    var visibleItems = function () {
      return Array.prototype.filter.call(galleryItems, function (i) { return !i.hidden; });
    };

    var showImage = function (index) {
      var items = visibleItems();
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      var item = items[currentIndex];
      var img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
    };

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var items = visibleItems();
        currentIndex = items.indexOf(item);
        showImage(currentIndex);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    var closeLightbox = function () {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { showImage(currentIndex - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { showImage(currentIndex + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  /* ---------------- Before / After slider ---------------- */
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var afterImg = slider.querySelector('.after-img');
    var divider = slider.querySelector('.divider');
    var handle = slider.querySelector('.handle');
    var range = slider.querySelector('input[type="range"]');
    if (!range) return;
    var update = function () {
      var val = range.value;
      afterImg.style.clipPath = 'inset(0 0 0 ' + val + '%)';
      divider.style.left = val + '%';
      handle.style.left = val + '%';
    };
    range.addEventListener('input', update);
    update();
  });

  /* ---------------- Back to top ---------------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Contact form validation ---------------- */
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
      phone: function (v) { return /^[6-9]\d{9}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit phone number.'; },
      email: function (v) {
        if (!v.trim()) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.';
      },
      service: function (v) { return v ? '' : 'Please select a service.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'; }
    };

    var showError = function (field, message) {
      var wrapper = field.closest('.form-field');
      var errorEl = wrapper.querySelector('.error-msg');
      if (message) {
        wrapper.classList.add('has-error');
        errorEl.textContent = message;
      } else {
        wrapper.classList.remove('has-error');
        errorEl.textContent = '';
      }
    };

    Object.keys(validators).forEach(function (name) {
      var field = contactForm.querySelector('[name="' + name + '"]');
      if (!field) return;
      field.addEventListener('blur', function () {
        showError(field, validators[name](field.value));
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      Object.keys(validators).forEach(function (name) {
        var field = contactForm.querySelector('[name="' + name + '"]');
        if (!field) return;
        var message = validators[name](field.value);
        showError(field, message);
        if (message) valid = false;
      });
      if (valid) {
        var successEl = document.querySelector('.form-success');
        contactForm.reset();
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

});
