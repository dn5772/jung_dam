'use client';

import { useEffect } from 'react';

// Page-level template behaviors (nav, scrollspy, AOS, gallery Swiper).
// Note: GLightbox, the menu tabs (Bootstrap data API) and the in-menu
// "scroll to menu" button are owned by MenuSection, so they are intentionally
// NOT handled here to avoid double-initialization.
export default function YummyScripts() {
  useEffect(() => {
    let cancelled = false;
    const cleanups = [];
    const swipers = [];

    // Register a listener and remember how to remove it.
    const on = (target, type, handler, opts) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    const init = async () => {
      const [AOSmod, SwiperMod] = await Promise.all([import('aos'), import('swiper')]);
      if (cancelled) return;
      const AOS = AOSmod.default;
      const Swiper = SwiperMod.default;

      const body = document.body;

      // ── Header "scrolled" class ──
      const header = document.querySelector('#header');
      const toggleScrolled = () => {
        if (!header) return;
        if (
          !header.classList.contains('scroll-up-sticky') &&
          !header.classList.contains('sticky-top') &&
          !header.classList.contains('fixed-top')
        ) return;
        body.classList.toggle('scrolled', window.scrollY > 100);
      };
      on(document, 'scroll', toggleScrolled);
      toggleScrolled();

      // ── Mobile nav toggle ──
      const navToggleBtn = document.querySelector('.mobile-nav-toggle');
      if (navToggleBtn) {
        const toggleMobileNav = () => {
          body.classList.toggle('mobile-nav-active');
          navToggleBtn.classList.toggle('bi-list');
          navToggleBtn.classList.toggle('bi-x');
        };
        on(navToggleBtn, 'click', toggleMobileNav);
        // Close the mobile menu when a nav link is tapped.
        document.querySelectorAll('#navmenu a').forEach((link) => {
          on(link, 'click', () => {
            if (body.classList.contains('mobile-nav-active')) toggleMobileNav();
          });
        });
      }

      // ── Preloader ──
      document.querySelector('#preloader')?.remove();

      // ── Scroll-to-top button ──
      const scrollTop = document.querySelector('.scroll-top');
      if (scrollTop) {
        const toggleScrollTop = () => scrollTop.classList.toggle('active', window.scrollY > 100);
        on(scrollTop, 'click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        on(document, 'scroll', toggleScrollTop);
        toggleScrollTop();
      }

      // ── Animate-on-scroll ──
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });

      // ── Swiper sliders (gallery) ──
      document.querySelectorAll('.init-swiper').forEach((el) => {
        const configEl = el.querySelector('.swiper-config');
        if (!configEl) return;
        let config = {};
        try {
          config = JSON.parse(configEl.innerHTML.trim());
        } catch {
          return;
        }
        swipers.push(new Swiper(el, config));
      });

      // ── Smooth-scroll to a hash target present on load ──
      if (window.location.hash) {
        const section = document.querySelector(window.location.hash);
        if (section) {
          const marginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;
          window.scrollTo({ top: section.offsetTop - marginTop, behavior: 'smooth' });
        }
      }

      // ── Navmenu scrollspy ──
      const navLinks = document.querySelectorAll('.navmenu a');
      const scrollspy = () => {
        const position = window.scrollY + 200;
        navLinks.forEach((link) => {
          if (!link.hash) return;
          const section = document.querySelector(link.hash);
          if (!section) return;
          if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
            document.querySelectorAll('.navmenu a.active').forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      };
      on(document, 'scroll', scrollspy);
      scrollspy();
    };

    init();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      swipers.forEach((s) => s?.destroy?.(true, true));
    };
  }, []);

  return null;
}
