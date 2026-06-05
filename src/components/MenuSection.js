'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MenuSection() {
  const { locale } = useLanguage();
  const [menuData, setMenuData] = useState({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/menu?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setMenuData(data);
        } else {
          console.error('Failed to fetch menu data:', response.status, response.statusText);
          setMenuData({ categories: [] });
        }
      } catch (error) {
        console.error('Network error while fetching menu data:', error);
        setMenuData({ categories: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [locale]);

  useEffect(() => {
    let timeoutId;

    if (!loading && menuData.categories.length > 0) {
      timeoutId = setTimeout(async () => {
        // Destroy existing lightbox before creating a new one
        if (lightboxRef.current) {
          lightboxRef.current.destroy();
          lightboxRef.current = null;
        }
        try {
          const GLightbox = (await import('glightbox')).default;
          lightboxRef.current = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true,
          });
        } catch (error) {
          console.error('Failed to initialize GLightbox:', error);
        }
      }, 100);
    }

    const handleScroll = () => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        const rect = menuSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowScrollTop(isVisible);
      }
    };

    const handleScrollTopClick = (e) => {
      e.preventDefault();
      const target = document.getElementById('menu');
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const scrollButton = document.querySelector('.scroll-top-menu');
    if (scrollButton) {
      scrollButton.addEventListener('click', handleScrollTopClick);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      if (scrollButton) {
        scrollButton.removeEventListener('click', handleScrollTopClick);
      }
    };
  }, [loading, menuData]);

  // Clean up lightbox on unmount
  useEffect(() => {
    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <section id="menu" className="menu section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Our Menu</h2>
          <p><span>Check Our</span> <span className="description-title">Menu</span></p>
        </div>
        <div className="container text-center">
          <p>Loading menu...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="menu section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Our Menu</h2>
        <p><span>Check Our</span> <span className="description-title">Menu</span></p>
      </div>
      <div className="container">
        <ul className="nav nav-tabs d-flex justify-content-center" data-aos="fade-up" data-aos-delay="100">
          {menuData.categories.map((category, index) => (
            <li key={category.id} className="nav-item">
              <a className={`nav-link ${index === 0 ? 'active show' : ''}`} data-bs-toggle="tab" data-bs-target={`#${category.id}`}>
                <h4>{category.name}</h4>
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
          {menuData.categories.map((category, index) => (
            <div key={category.id} className={`tab-pane fade ${index === 0 ? 'active show' : ''}`} id={category.id}>
              <div className="tab-header text-center">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="row gy-5">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={`col-lg-4 menu-item`}>
                    {item.image ? (
                      <a href={item.image} className={`glightbox`}>
                        <img
                          src={item.image}
                          className={`menu-img img-fluid`}
                          alt={item.title}
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <div className="menu-img-placeholder" style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        <span>이미지 준비중</span>
                      </div>
                    )}
                    <h4>{item.title}</h4>
                    <p className="ingredients">{item.ingredients}</p>
                    <p className="price">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <a href="#menu" className={`scroll-top-menu d-flex align-items-center justify-content-center ${showScrollTop ? 'active' : ''}`}>MENU</a>
    </section>
  );
}
