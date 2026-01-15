'use client';

import { useEffect } from 'react';

export default function YummyScripts() {
  useEffect(() => {
    // Dynamically import client-side libraries
    const loadLibraries = async () => {
      const [AOS, GLightbox, Swiper] = await Promise.all([
        import('aos'),
        import('glightbox'),
        import('swiper')
      ]);

      // Apply .scrolled class to the body as the page is scrolled down
      const toggleScrolled = () => {
        const selectBody = document.querySelector('body');
        const selectHeader = document.querySelector('#header');
        if (!selectHeader?.classList.contains('scroll-up-sticky') &&
            !selectHeader?.classList.contains('sticky-top') &&
            !selectHeader?.classList.contains('fixed-top')) return;
        window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
      };

      document.addEventListener('scroll', toggleScrolled);
      window.addEventListener('load', toggleScrolled);

      // Mobile nav toggle
      const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
      if (mobileNavToggleBtn) {
        const mobileNavToogle = () => {
          document.querySelector('body').classList.toggle('mobile-nav-active');
          mobileNavToggleBtn.classList.toggle('bi-list');
          mobileNavToggleBtn.classList.toggle('bi-x');
        };
        mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

        // Hide mobile nav on same-page/hash links
        document.querySelectorAll('#navmenu a').forEach(navmenu => {
          navmenu.addEventListener('click', () => {
            if (document.querySelector('.mobile-nav-active')) {
              mobileNavToogle();
            }
          });
        });

        // Toggle mobile nav dropdowns
        document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
          navmenu.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentNode.classList.toggle('active');
            this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
          });
        });
      }

      // Preloader
      const preloader = document.querySelector('#preloader');
      if (preloader) {
        window.addEventListener('load', () => {
          preloader.remove();
        });
      }

      // Scroll top button
      const scrollTop = document.querySelector('.scroll-top');
      if (scrollTop) {
        const toggleScrollTop = () => {
          if (scrollTop) {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
          }
        };
        scrollTop.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });

        window.addEventListener('load', toggleScrollTop);
        document.addEventListener('scroll', toggleScrollTop);
      }

      // Animation on scroll function and init
      AOS.default.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });

      // Initiate glightbox
      GLightbox.default({
        selector: '.glightbox'
      });

      // Init swiper sliders
      const initSwiper = () => {
        document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
          let config = JSON.parse(
            swiperElement.querySelector(".swiper-config").innerHTML.trim()
          );

          if (swiperElement.classList.contains("swiper-tab")) {
            // Custom init for tabs if needed
            new Swiper.default(swiperElement, config);
          } else {
            new Swiper.default(swiperElement, config);
          }
        });
      };

      window.addEventListener("load", initSwiper);

      // Correct scrolling position upon page load for URLs containing hash links.
      window.addEventListener('load', function(e) {
        if (window.location.hash) {
          if (document.querySelector(window.location.hash)) {
            setTimeout(() => {
              let section = document.querySelector(window.location.hash);
              let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
              window.scrollTo({
                top: section.offsetTop - parseInt(scrollMarginTop),
                behavior: 'smooth'
              });
            }, 100);
          }
        }
      });

      // Navmenu Scrollspy
      const navmenulinks = document.querySelectorAll('.navmenu a');
      const navmenuScrollspy = () => {
        navmenulinks.forEach(navmenulink => {
          if (!navmenulink.hash) return;
          let section = document.querySelector(navmenulink.hash);
          if (!section) return;
          let position = window.scrollY + 200;
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
            navmenulink.classList.add('active');
          } else {
            navmenulink.classList.remove('active');
          }
        });
      };
      window.addEventListener('load', navmenuScrollspy);
      document.addEventListener('scroll', navmenuScrollspy);

      // Handle navmenu link clicks
      navmenulinks.forEach(link => {
        link.addEventListener('click', () => {
          document.querySelectorAll('.navmenu a.active').forEach(activeLink => activeLink.classList.remove('active'));
          link.classList.add('active');
        });
      });

      // Initialize Bootstrap tabs for menu section
      const menuTabLinks = document.querySelectorAll('#menu .nav-link');
      menuTabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove active class from all tabs
          menuTabLinks.forEach(link => link.classList.remove('active', 'show'));
          
          // Add active class to clicked tab
          this.classList.add('active', 'show');
          
          // Hide all tab panes
          const tabPanes = document.querySelectorAll('#menu .tab-pane');
          tabPanes.forEach(pane => pane.classList.remove('active', 'show'));
          
          // Show the target tab pane
          const targetId = this.getAttribute('data-bs-target');
          const targetPane = document.querySelector(targetId);
          if (targetPane) {
            targetPane.classList.add('active', 'show');
          }
        });
      });

      // Initiate Pure Counter
      // Note: PureCounter is loaded via script tag
      if (typeof window !== 'undefined' && window.PureCounter) {
        new window.PureCounter();
      }
    };

    loadLibraries();

    // Cleanup function
    return () => {
      // Add cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything
}
