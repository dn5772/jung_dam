'use client';

import { useState, useEffect } from 'react';

const DEFAULT_LOCALE = 'en';

const getLocalizedValue = (value, locale) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return (
      value[locale] ||
      value[DEFAULT_LOCALE] ||
      Object.values(value).find((entry) => entry) ||
      ''
    );
  }
  return '';
};

export default function MenuSection() {
  const [menuData, setMenuData] = useState({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const browserLocale = typeof navigator !== 'undefined' && navigator.language
      ? navigator.language.slice(0, 2)
      : DEFAULT_LOCALE;
    setCurrentLocale(browserLocale || DEFAULT_LOCALE);
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          setMenuData(data);
        } else {
          console.error('Failed to fetch menu data:', response.status, response.statusText);
          // 사용자에게 에러 표시 (선택사항)
          setMenuData({ categories: [] }); // 빈 데이터로 폴백
        }
      } catch (error) {
        console.error('Network error while fetching menu data:', error);
        setMenuData({ categories: [] }); // 빈 데이터로 폴백
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    // GLightbox 초기화
    const initGLightbox = async () => {
      try {
        const GLightbox = (await import('glightbox')).default;
        const lightbox = GLightbox({
          selector: '.glightbox',
          touchNavigation: true,
          loop: true,
          autoplayVideos: true
        });
        
        // 클린업 함수 반환
        return () => {
          if (lightbox && typeof lightbox.destroy === 'function') {
            lightbox.destroy();
          }
        };
      } catch (error) {
        console.error('Failed to initialize GLightbox:', error);
      }
    };

    // 메뉴 데이터가 로드된 후에만 GLightbox 초기화
    if (!loading && menuData.categories.length > 0) {
      // DOM이 완전히 렌더링된 후에 GLightbox 초기화
      setTimeout(() => {
        initGLightbox();
      }, 100);
    }

    const handleScroll = () => {
      // 메뉴 섹션이 화면에 보일 때 버튼 표시
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        const rect = menuSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowScrollTop(isVisible);
      }
    };

    const handleScrollTopClick = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 설정

    // 버튼 클릭 이벤트 리스너 추가
    const scrollButton = document.querySelector('.scroll-top-menu');
    if (scrollButton) {
      scrollButton.addEventListener('click', handleScrollTopClick);
    }

    // 클린업
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollButton) {
        scrollButton.removeEventListener('click', handleScrollTopClick);
      }
    };
  }, [loading, menuData]); // loading과 menuData가 변경될 때마다 재실행

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
                <h4>{getLocalizedValue(category.name, currentLocale)}</h4>
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
          {menuData.categories.map((category, index) => (
            <div key={category.id} className={`tab-pane fade ${index === 0 ? 'active show' : ''}`} id={category.id}>
              <div className="tab-header text-center">
                <h3>{getLocalizedValue(category.name, currentLocale)}</h3>
                <p>{getLocalizedValue(category.description, currentLocale)}</p>
              </div>
              <div className="row gy-5">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={`col-lg-4 menu-item`}>
                    {item.image ? (
                      <a href={item.image} className={`glightbox`}>
                        <img
                          src={item.image}
                          className={`menu-img img-fluid`}
                          alt={getLocalizedValue(item.title, currentLocale)}
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
                    <h4>{getLocalizedValue(item.title, currentLocale)}</h4>
                    <p className="ingredients">{getLocalizedValue(item.ingredients, currentLocale)}</p>
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
