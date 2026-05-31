/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */

(function () {
  function toggleMenu() {
    const sidebar = document.getElementById('sidebarMenumobile');
    const overlay = document.getElementById('menuOverlay');
    const buttons = document.querySelectorAll('.mobilemenu-btn');

    if (!sidebar || !overlay) {
      return;
    }

    const isActive = !sidebar.classList.contains('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    buttons.forEach(function (button) {
      button.classList.toggle('active');
      button.setAttribute('aria-expanded', isActive);
    });

    if (!isActive) {
      closeAllMobileDropdowns();
    }
  }

  function createBackToTopButton() {
    if (document.getElementById('backToTop')) {
      return;
    }
    var button = document.createElement('button');
    button.id = 'backToTop';
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<span>↑</span>';
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(button);
  }

  function toggleBackToTopButton() {
    var button = document.getElementById('backToTop');
    if (!button) {
      return;
    }
    if (window.pageYOffset > 400) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  }

  function initBackToTop() {
    createBackToTopButton();
    toggleBackToTopButton();
    window.addEventListener('scroll', toggleBackToTopButton);
  }

  function toggleDropdown(event, element) {
    if (event) {
      event.preventDefault();
    }

    const dropdown = element.closest('.dropdownmobile');
    if (!dropdown) {
      return;
    }

    const isOpen = dropdown.classList.toggle('open');
    if (element) {
      element.setAttribute('aria-expanded', isOpen);
    }
  }

  function closeAllMobileDropdowns() {
    const openDropdowns = document.querySelectorAll('.dropdownmobile.open');
    openDropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('open');
      const toggle = dropdown.querySelector('.dropdownmobile-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initMobileMenu() {
    const menuButtons = document.querySelectorAll('.mobilemenu-btn');
    const closeButton = document.querySelector('.sidebarmobile .closebtn');
    const overlay = document.getElementById('menuOverlay');
    const dropdownToggles = document.querySelectorAll('.dropdownmobile-toggle');

    menuButtons.forEach(function (button) {
      button.setAttribute('aria-expanded', 'false');
    });

    if (closeButton) {
    }

    if (overlay) {
    }

    dropdownToggles.forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    });

    document.body.addEventListener('click', function (event) {
      const mobileMenuButton = event.target.closest('.mobilemenu-btn');
      const closeButtonClick = event.target.closest('.sidebarmobile .closebtn');
      const overlayClick = event.target.closest('#menuOverlay');
      const dropdownToggle = event.target.closest('.dropdownmobile-toggle');

      if (mobileMenuButton || closeButtonClick || overlayClick) {
        event.preventDefault();
        toggleMenu();
        return;
      }

      if (dropdownToggle) {
        toggleDropdown(event, dropdownToggle);
      }
    });
  }

  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main_menu_list .nav-link');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) {
        return;
      }

      const linkPage = href.split('?')[0];
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.classList.add('active');
          // If this link is inside a dropdown, also mark the dropdown parent active
          const dropdownParent = parentLi.closest('.dropdown');
          if (dropdownParent) {
            dropdownParent.classList.add('active');
            const dropdownToggle = dropdownParent.querySelector('.nav-link');
            if (dropdownToggle) {
              dropdownToggle.classList.add('active');
            }
          }
        }
      }
    });

    const normalizePage = function (href) {
      const cleaned = href.split('?')[0].split('#')[0].trim();
      if (cleaned === '' || cleaned === './') {
        return 'index.html';
      }
      return cleaned.split('/').pop();
    };

    const mobileLinks = document.querySelectorAll('.sidebarmobile a[href]');
    mobileLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('javascript:') || href === '#') {
        return;
      }

      const linkPage = normalizePage(href);
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
        const dropdownParent = link.closest('.dropdownmobile');
        if (dropdownParent) {
          dropdownParent.classList.add('open');
          const toggleLink = dropdownParent.querySelector('.dropdownmobile-toggle');
          if (toggleLink) {
            toggleLink.classList.add('active');
            toggleLink.setAttribute('aria-expanded', 'true');
          }
        }
      }
    });
  }

  window.toggleMenu = toggleMenu;
  window.toggleDropdown = toggleDropdown;

  function initDesktopDropdowns() {
    // Only apply hover behavior on desktop (screens >= 992px)
    // Bootstrap dropdowns are still handled by data-bs-toggle="dropdown" for click fallback
    
    const desktopDropdowns = document.querySelectorAll('.main_menu_list .dropdown');
    
    desktopDropdowns.forEach(function (dropdownItem) {
      const dropdownLink = dropdownItem.querySelector('.nav-link[data-bs-toggle="dropdown"]');
      const dropdownMenu = dropdownItem.querySelector('.dropdown-menu');
      
      if (!dropdownLink || !dropdownMenu) {
        return;
      }
      
      // On hover, show the dropdown menu
      dropdownItem.addEventListener('mouseenter', function () {
        // Check if we're on desktop (not mobile)
        if (window.innerWidth >= 992) {
          // Remove data-bs-toggle to prevent Bootstrap click handling
          dropdownLink.removeAttribute('data-bs-toggle');
          dropdownLink.removeAttribute('role');
          
          // Show the dropdown menu
          dropdownMenu.classList.add('show');
          dropdownLink.setAttribute('aria-expanded', 'true');
        }
      });
      
      // On mouse leave, hide the dropdown menu
      dropdownItem.addEventListener('mouseleave', function () {
        // Check if we're on desktop (not mobile)
        if (window.innerWidth >= 992) {
          // Hide the dropdown menu
          dropdownMenu.classList.remove('show');
          dropdownLink.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Prevent menu from closing when hovering over the dropdown itself
      dropdownMenu.addEventListener('mouseenter', function () {
        if (window.innerWidth >= 992) {
          dropdownMenu.classList.add('show');
          dropdownLink.setAttribute('aria-expanded', 'true');
        }
      });
      
      dropdownMenu.addEventListener('mouseleave', function () {
        if (window.innerWidth >= 992) {
          dropdownMenu.classList.remove('show');
          dropdownLink.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function initStickyHeader() {
    const header = document.querySelector('.site_header');
    if (!header) {
      return;
    }

    // Track if we've already scrolled past the initial position
    let hasScrolled = false;
    const scrollThreshold = 10; // Add sticky class after scrolling 10px

    function updateStickyHeader() {
      const scrollPosition = window.scrollY || window.pageYOffset;

      if (scrollPosition > scrollThreshold && !hasScrolled) {
        // User has scrolled down - add sticky class
        header.classList.add('sticky');
        hasScrolled = true;
      } else if (scrollPosition <= scrollThreshold && hasScrolled) {
        // User has scrolled back to top - remove sticky class
        header.classList.remove('sticky');
        hasScrolled = false;
      }
    }

    // Add scroll event listener with throttling for better performance
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateStickyHeader();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Check initial scroll position in case page is already scrolled
    updateStickyHeader();
  }

  function initScrollAnimation() {
    // Helper function to add staggered delays to container children
    const addStaggeredDelays = function (container, baseDelay) {
      if (!container) return;
      let count = 0;
      const children = container.querySelectorAll('.text-focus-in');
      children.forEach(function (child, idx) {
        if (child.parentElement === container || child.closest(':not(.text-focus-in)') === container) {
          count = (idx % 5) + 1; // Cycle through delays 1-5
          if (!child.getAttribute('data-animation-delay')) {
            child.setAttribute('data-animation-delay', count.toString());
          }
        }
      });
    };

    const autoAnimateSelectors = [
      // Heading and text classes (specific)
      '.page_title',
      '.page_description',
      '.heading_text',
      '.heading_description',
      '.register_heading',
      '.register_heading_description',
      '.meta_info_list',
      '.info_list',
      '.section_heading h1',
      '.section_heading h2',
      '.section_heading p',
      '.breadcrumb_nav',
      '.error_title',
      '.error_description',
      '.section-title',
      '.section-subtitle',
      '.card-title',
      '.card-text',
      '.footer_widget_title',
      '.hero_banner h1',
      '.hero_banner h2',
      '.hero_banner h3',
      '.hero_banner p',
      '.hero_banner .testimonial_item_2',
      '.testimonial_item_2 .testimonial_image',
      '.testimonial_item_2 img',
      // Generic content containers and text
      'main p',
      'main h1',
      'main h2',
      'main h3',
      'main h4',
      'main h5',
      'main h6',
      'main li',
      'main span',
      'main strong',
      'main em',
      'section p',
      'section h1',
      'section h2',
      'section h3',
      'section h4',
      'section h5',
      'section h6',
      'section li',
      '.container p',
      '.container h1',
      '.container h2',
      '.container h3',
      '.container h4',
      '.container h5',
      '.container h6',
      // Card, blog, and list items
      '.card p',
      '.card h1',
      '.card h2',
      '.card h3',
      '.card h4',
      '.card h5',
      '.card h6',
      '.blog_small',
      '.blog_item',
      '.item_title',
      '.item_content',
      '.course_item',
      '.service_item',
      '.program_item',
      '.faq_item',
      '.news_item',
      '.team_member',
      '.testimonial_item_2',
      '.testimonial_image',
      // Buttons and interactive elements
      '.btn',
      'button',
      // Lists
      'ul li',
      'ol li',
      '.list-item',
      // Specific layout containers
      '.hero_banner',
      '.banner_content',
      '.banner_big_title',
      '.banner_text',
      '.cta_block',
      '.feature_item',
      '.advantage_item',
      '.benefit_item',
      // Footer and sidebar content
      '.footer_widget',
      '.footer_widget_title',
      '.widget_title',
      '.widget_content',
      '.sidebar_widget',
      // Navigation and menu
      '.nav-link',
      '.menu-item',
      // Miscellaneous text containers
      'article',
      'aside p',
      'aside h1',
      'aside h2',
      'aside h3',
      'aside h4',
      'aside h5',
      'aside h6',
      '.text-content',
      '[role="main"] p',
      '[role="main"] h1',
      '[role="main"] h2',
      '[role="main"] h3'
    ];

    // Helper: check if element is part of a menu/navigation or accordion
    const isMenuElement = function (el) {
      // First check: is this element or any parent an accordion-related element?
      if (el.closest('.accordion') || 
          el.closest('.accordion-item') || 
          el.closest('.accordion-button') ||
          el.closest('.accordion-collapse') ||
          el.closest('.accordion-body')) {
        return true;
      }
      
      // Also check by class
      if (el.classList.contains('accordion') ||
          el.classList.contains('accordion-item') ||
          el.classList.contains('accordion-button') ||
          el.classList.contains('accordion-collapse') ||
          el.classList.contains('accordion-body')) {
        return true;
      }
      
      // Check for menu elements
      return el.closest('.main_menu') || 
             el.closest('.nav-link') || 
             el.closest('.main_menu_list') ||
             el.closest('.sidebarmobile') ||
             el.closest('.dropdown-menu') ||
             el.closest('.mobilemenu-btn') ||
             el.closest('header nav') ||
             el.classList.contains('nav-link') ||
             el.classList.contains('navbar');
    };

    autoAnimateSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        // Skip menu items
        if (isMenuElement(element)) {
          return;
        }
        if (!element.classList.contains('text-focus-in')) {
          element.classList.add('text-focus-in');
          // mark we auto-added this so we can debug later
          try { element.dataset.srAutoAdded = '1'; } catch (e) {}
        }
      });
    });

    // Only pick elements that haven't been observed/initialized yet
    let animatedElementsAll = Array.from(document.querySelectorAll('.text-focus-in'));
    if (animatedElementsAll.length === 0) {
      // Fallback: apply to all main headings, paragraphs, and common text containers
      const fallbackSelectors = [
        'main',
        'section',
        'article'
      ];
      const fallbackElements = new Set();
      fallbackSelectors.forEach(function (selector) {
        const containers = document.querySelectorAll(selector);
        containers.forEach(function (container) {
          // Get all text nodes and elements within these containers
          container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, strong, em, .card, .item_title, .item_content, button, .btn').forEach(function (el) {
            if (!isMenuElement(el)) {
              fallbackElements.add(el);
            }
          });
        });
      });
      // Also add from header and footer if they have content (but skip menu items and accordion content)
      document.querySelectorAll('header p, header h1, header h2, header h3, header h4, header h5, header h6').forEach(function (el) {
        if (!isMenuElement(el) &&
            !el.closest('nav')) {
          fallbackElements.add(el);
        }
      });
      fallbackElements.forEach(function (element) {
        if (!element.classList.contains('text-focus-in')) {
          element.classList.add('text-focus-in');
          try { element.dataset.srAutoAdded = '1'; } catch (e) {}
        }
      });
      animatedElementsAll = Array.from(document.querySelectorAll('.text-focus-in'));
    }

    const animatedElements = animatedElementsAll.filter(function (el) {
      return !el.dataset.srInitialized;
    });

    if (animatedElements.length === 0) {
      // nothing new to do
      console.debug && console.debug('script.js:initScrollAnimation – no new .text-focus-in elements found');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(function (element) {
        element.classList.add('animated');
        element.dataset.srInitialized = '1';
      });
      console.debug && console.debug('script.js:initScrollAnimation – IntersectionObserver not supported, applied .animated to', animatedElements.length, 'elements');
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add staggered delays for child elements within containers
          if (entry.target.children && entry.target.children.length > 0) {
            let delayCount = 0;
            Array.from(entry.target.children).forEach(function (child, idx) {
              if (child.classList.contains('text-focus-in')) {
                delayCount = (idx % 5) + 1;
                if (!child.getAttribute('data-animation-delay')) {
                  child.setAttribute('data-animation-delay', delayCount.toString());
                }
              }
            });
          }
          
          entry.target.classList.add('animated');
          try { entry.target.dataset.srInitialized = '1'; } catch (e) {}
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Apply staggered delays to sections before observing
    document.querySelectorAll('section, .container, main').forEach(function (container) {
      let delayCount = 0;
      container.querySelectorAll(':scope > .text-focus-in, :scope > * > .text-focus-in').forEach(function (el, idx) {
        if (!el.getAttribute('data-animation-delay') && el.classList.contains('text-focus-in')) {
          delayCount = (idx % 5) + 1;
          el.setAttribute('data-animation-delay', delayCount.toString());
        }
      });
    });

    animatedElements.forEach(function (element) {
      try { element.dataset.srInitialized = 'observing'; } catch (e) {}
      observer.observe(element);
    });
    console.debug && console.debug('script.js:initScrollAnimation – observing', animatedElements.length, 'elements (total text-focus-in:', animatedElementsAll.length, ')');
  }

  function initScrollReveal() {
    const selectors = [
      'main h1',
      'main h2',
      'main h3',
      'main h4',
      'main h5',
      'main h6',
      'main p',
      '.hero_banner',
      '.section_heading',
      '.section-title',
      '.section-subtitle',
      '.heading_text',
      '.heading_description',
      '.register_heading',
      '.register_heading_description',
      '.meta_info_list',
      '.info_list',
      '.breadcrumb_nav',
      '.card',
      '.testimonial_item_2',
      '.testimonial_image',
      '.item_title',
      '.footer_widget_title',
      '.error_title',
      '.error_description',
      '.blog_small',
      '.item_content',
      '.course_item',
      '.service_item',
      '.program_item',
      '.faq_item',
      '.news_item'
    ];

    const elements = [];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        if (!element.classList.contains('scroll-reveal') && !element.closest('header') && !element.closest('footer')) {
          elements.push(element);
          element.classList.add('scroll-reveal');
          try { element.dataset.srAutoAdded = '1'; } catch (e) {}
        }
      });
    });

    if (elements.length === 0) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        element.classList.add('scroll-reveal-visible');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    });

    elements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
    document.addEventListener('DOMContentLoaded', initActiveNav);
    document.addEventListener('DOMContentLoaded', initStickyHeader);
    document.addEventListener('DOMContentLoaded', initDesktopDropdowns);
    document.addEventListener('DOMContentLoaded', initScrollAnimation);
    document.addEventListener('DOMContentLoaded', initScrollReveal);
    document.addEventListener('DOMContentLoaded', initBackToTop);
  } else {
    initMobileMenu();
    initActiveNav();
    initStickyHeader();
    initDesktopDropdowns();
    initScrollAnimation();
    initScrollReveal();
    initBackToTop();
  }

  // Run again on window.load as a fallback for pages that mutate DOM after scripts
  if (typeof window !== 'undefined') {
    window.addEventListener('load', function () {
      try {
        initScrollAnimation();
        initScrollReveal();
      } catch (e) {
        console.error && console.error('script.js:initScrollAnimation (load) error', e);
      }
    });
  }

  // Watch for DOM changes and re-run initScrollAnimation for newly added nodes (debounced)
  try {
    var _srObserverTimer = null;
    var _srObserverCallCount = 0;
    var _srObserverMaxCalls = 20; // Limit to 20 calls total to prevent runaway loops
    var _srObserver = new MutationObserver(function (mutations) {
      // Prevent excessive observer calls that could cause performance issues
      if (_srObserverCallCount >= _srObserverMaxCalls) {
        try {
          _srObserver.disconnect();
        } catch (e) {}
        return;
      }

      var found = false;
      mutations.forEach(function (m) {
        if (m.addedNodes && m.addedNodes.length) {
          // Filter out debugger/console related mutations
          for (var i = 0; i < m.addedNodes.length; i++) {
            var node = m.addedNodes[i];
            // Skip if it's a text node or comment
            if (node.nodeType !== 1) continue;
            // Skip if it's part of DevTools or browser UI
            if (node.id && (node.id.indexOf('devtools') !== -1 || node.id.indexOf('__') === 0)) continue;
            if (node.className && typeof node.className === 'string' && 
                (node.className.indexOf('devtools') !== -1 || node.className.indexOf('--') === 0)) continue;
            found = true;
            break;
          }
        }
      });

      if (found) {
        _srObserverCallCount++;
        if (_srObserverTimer) {
          clearTimeout(_srObserverTimer);
        }
        _srObserverTimer = setTimeout(function () {
          try { initScrollAnimation(); } catch (e) { console.error && console.error('script.js:mutation init error', e); }
          try { initScrollReveal(); } catch (e) { console.error && console.error('script.js:mutation reveal error', e); }
        }, 120);
      }
    });

    if (document && document.body) {
      _srObserver.observe(document.body, { childList: true, subtree: true });
    }
  } catch (e) {
    // MutationObserver may be unavailable in some older environments
  }

  // ===== DIAGNOSTIC: Console Auto-Refresh Tracker =====
  (function() {
    var _diagnosticLog = [];
    var _originalLog = console.log;
    var _pageLoadTime = new Date();
    
    // Track location.reload calls
    var originalReload = window.location.reload;
    window.location.reload = function() {
      var stack = new Error().stack;
      var timeSinceLoad = new Date() - _pageLoadTime;
      _diagnosticLog.push({
        type: 'RELOAD',
        time: new Date().toISOString(),
        timeSincePageLoad: timeSinceLoad + 'ms',
        stack: stack.substring(0, 300)
      });
      _originalLog('[AUTO-RELOAD DETECTED]', 'Time since page load: ' + timeSinceLoad + 'ms', stack);
      originalReload.apply(window.location, arguments);
    };
    
    // Track href assignments (only if property is configurable)
    var descriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
    if (descriptor && descriptor.configurable) {
      Object.defineProperty(window.location, 'href', {
        set: function(url) {
          var stack = new Error().stack;
          var timeSinceLoad = new Date() - _pageLoadTime;
          _diagnosticLog.push({
            type: 'HREF_ASSIGNMENT',
            url: url,
            time: new Date().toISOString(),
            timeSincePageLoad: timeSinceLoad + 'ms',
            stack: stack.substring(0, 300)
          });
          _originalLog('[LOCATION.HREF CHANGED]', url, 'Time: ' + timeSinceLoad + 'ms', stack);
          descriptor.set.call(this, url);
        },
        get: function() {
          return descriptor.get.call(this);
        }
      });
    }
    
    // Track window.location assignment directly
    try {
      var originalLocationAssign = window.location.assign;
      window.location.assign = function(url) {
        var stack = new Error().stack;
        var timeSinceLoad = new Date() - _pageLoadTime;
        _diagnosticLog.push({
          type: 'LOCATION_ASSIGN',
          url: url,
          time: new Date().toISOString(),
          timeSincePageLoad: timeSinceLoad + 'ms',
          stack: stack.substring(0, 300)
        });
        _originalLog('[LOCATION.ASSIGN CALLED]', url, 'Time: ' + timeSinceLoad + 'ms', stack);
        originalLocationAssign.apply(window.location, arguments);
      };
    } catch (e) {
      _originalLog('[DIAG] Could not override location.assign:', e.message);
    }
    
    // Expose diagnostic
    window._diagnosticLog = _diagnosticLog;
    window._pageLoadTime = _pageLoadTime;
    window._showDiagnostics = function() {
      _originalLog('=== AUTO-REFRESH DIAGNOSTICS ===');
      _originalLog('Page loaded at:', _pageLoadTime.toISOString());
      _originalLog('Current time:', new Date().toISOString());
      _originalLog('Time elapsed:', (new Date() - _pageLoadTime) + 'ms');
      _originalLog('Reload events log:');
      _originalLog(_diagnosticLog);
      return _diagnosticLog;
    };
    
    _originalLog('[DIAG] Diagnostic tracking active. Call window._showDiagnostics() when page reloads to see what triggered it.');
  })();
  // ===== END DIAGNOSTIC =====
})();
