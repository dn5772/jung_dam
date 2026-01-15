import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <header id="header" className="header d-flex align-items-center sticky-top">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <a href="/" className="logo d-flex align-items-center me-auto me-xl-0">
            <h1 className="sitename">Jung Dam</h1>
            <span>.</span>
          </a>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#hero" className="active">Home<br /></a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#events">Events</a></li>
              {/* <li><a href="#chefs">Chefs</a></li> */}
              <li><a href="#gallery">Gallery</a></li>
              {/* <li className="dropdown"><a href="#"><span>Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                <ul>
                  <li><a href="#">Dropdown 1</a></li>
                  <li className="dropdown"><a href="#"><span>Deep Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul>
                    </ul>
                  </li>
                  <li><a href="#">Dropdown 2</a></li>
                  <li><a href="#">Dropdown 3</a></li>
                  <li><a href="#">Dropdown 4</a></li>
                </ul>
              </li> */}
              <li><a href="#contact">Contact</a></li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
          <a className="btn-getstarted" href="#book-a-table">Book a Table</a>
        </div>
      </header>

      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero section light-background">
          <div className="container">
            <div className="row gy-4 justify-content-center justify-content-lg-between">
              <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
                <h1 data-aos="fade-up">Enjoy Your Healthy<br />Delicious Food</h1>
                <p data-aos="fade-up" data-aos-delay="100">We are team of talented designers making websites with Bootstrap</p>
                <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
                  <a href="#book-a-table" className="btn-get-started">Book a Table</a>
                  <a href="https://youtu.be/xu4JsZpwk84?si=kZ2AKM4WGC_6SL7l" className="glightbox btn-watch-video d-flex align-items-center"><i className="bi bi-play-circle"></i><span>Watch Video</span></a>
                </div>
              </div>
              <div className="col-lg-5 order-1 order-lg-2 hero-img" data-aos="zoom-out">
                <img src="/img/hero-img.png" className="img-fluid animated" alt="" />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container section-title" data-aos="fade-up">
            <h2>About Us<br /></h2>
            <p><span>Learn More</span> <span className="description-title">About Us</span></p>
          </div>
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-7" data-aos="fade-up" data-aos-delay="100">
                <img src="/img/about.jpg" className="img-fluid mb-4" alt="" />
                <div className="book-a-table">
                  <h3>Book a Table</h3>
                  <p>+64 9 441 7080</p>
                </div>
              </div>
              <div className="col-lg-5" data-aos="fade-up" data-aos-delay="250">
                <div className="content ps-0 ps-lg-5">
                  <p className="fst-italic">
                    Welcome to Jung Dam, where we bring you the authentic flavors of Korea right here in Auckland. Our restaurant is dedicated to providing a warm and inviting atmosphere where you can enjoy traditional Korean dishes made with the freshest ingredients.
                  </p>
                  <ul></ul>
                  <p></p>
                  <div className="position-relative mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        {/* <section id="why-us" className="why-us section light-background">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div className="why-box">
                  <h3>Why Choose Yummy</h3>
                  <p></p>
                  <div className="text-center"></div>
                </div>
              </div>
              <div className="col-lg-8 d-flex align-items-stretch">
                <div className="row gy-4" data-aos="fade-up" data-aos-delay="200">
                  <div className="col-xl-4"></div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay="300"></div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay="400"></div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Stats Section */}
        <section id="stats" className="stats section dark-background">
          <img src="/img/stats-bg.jpg" alt="" data-aos="fade-in" />
          <div className="container position-relative" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              <div className="col-lg-3 col-md-6">
                <div className="stats-item text-center w-100 h-100">
                  <span data-purecounter-start="0" data-purecounter-end="232" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Clients</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item text-center w-100 h-100">
                  <span data-purecounter-start="0" data-purecounter-end="521" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Projects</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item text-center w-100 h-100">
                  <span data-purecounter-start="0" data-purecounter-end="1453" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Hours Of Support</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="stats-item text-center w-100 h-100">
                  <span data-purecounter-start="0" data-purecounter-end="32" data-purecounter-duration="1" className="purecounter"></span>
                  <p>Workers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="menu section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Our Menu</h2>
            <p><span>Check Our</span> <span className="description-title">Menu</span></p>
          </div>

          <div className="container">
            <ul className="nav nav-tabs d-flex justify-content-center" data-aos="fade-up" data-aos-delay="100">
              <li className="nav-item">
                <a className="nav-link active show" data-bs-toggle="tab" data-bs-target="#menu-Dak-galbi">
                  <h4>Dak-galbi</h4>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-Tteokbokki">
                  <h4>Tteokbokki</h4>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-main-dishes">
                  <h4>Main dishes</h4>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-stir-fried">
                  <h4>Stir-Fried</h4>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-soup-stew">
                  <h4>Soup & Stew</h4>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-stone-pot">
                  <h4>Stone Pot</h4>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-fried">
                  <h4>Fried</h4>
                </a>
              </li>
            </ul>
            
            <div className="tab-content" data-aos="fade-up" data-aos-delay="200">

              {/* Dak-galbi */}
              <div className="tab-pane fade active show" id="menu-Dak-galbi">
                <div className="tab-header text-center">
                  <h3>Dak-galbi</h3>
                  <p>Korean stir-fried chicken cooked with vegetables and rice cakes.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-1.png" className="glightbox"><img src="/img/menu/menu-item-1.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Spicy Dak-galbi</h4>
                    <p className="ingredients">
                      Stir-fried chicken with vegetables, sweet potato, cabbage in spicy sauce
                    </p>
                    <p className="price">
                      $18.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-2.png" className="glightbox"><img src="/img/menu/menu-item-2.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Beef Dak-galbi</h4>
                    <p className="ingredients">
                      Stir-fried beef with vegetables, rice cakes, sweet potato in mild sauce
                    </p>
                    <p className="price">
                      $20.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-3.png" className="glightbox"><img src="/img/menu/menu-item-3.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Seafood Dak-galbi</h4>
                    <p className="ingredients">
                      Stir-fried seafood with vegetables, noodles, cabbage in spicy sauce
                    </p>
                    <p className="price">
                      $22.95
                    </p>
                  </div>
                </div>
              </div>

              {/* Tteokbokki */}
              <div className="tab-pane fade" id="menu-Tteokbokki">
                <div className="tab-header text-center">
                  <h3>Tteokbokki</h3>
                  <p>Chewy rice cakes simmered in a sweet and spicy Korean chili sauce.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-1.png" className="glightbox"><img src="/img/menu/menu-item-1.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Original Tteokbokki</h4>
                    <p className="ingredients">
                      Spicy rice cakes with fish cakes, boiled eggs, vegetables in gochujang sauce
                    </p>
                    <p className="price">
                      $12.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-2.png" className="glightbox"><img src="/img/menu/menu-item-2.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Cream Tteokbokki</h4>
                    <p className="ingredients">
                      Rice cakes in creamy white sauce with cheese, vegetables, and ham
                    </p>
                    <p className="price">
                      $14.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-3.png" className="glightbox"><img src="/img/menu/menu-item-3.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Rose Tteokbokki</h4>
                    <p className="ingredients">
                      Rice cakes in sweet and spicy rose sauce with cheese and vegetables
                    </p>
                    <p className="price">
                      $15.95
                    </p>
                  </div>
                </div>
              </div>
              {/* Main Dishes */}
              <div className="tab-pane fade" id="menu-main-dishes">
                <div className="tab-header text-center">
                  <h3>Main dishes</h3>
                  <p className="ingredients">Hearty Korean dishes perfect for sharing.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-4.png" className="glightbox"><img src="/img/menu/menu-item-4.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Bulgogi</h4>
                    <p className="ingredients">
                      Marinated grilled beef with vegetables, served with rice and side dishes
                    </p>
                    <p className="price">
                      $19.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-5.png" className="glightbox"><img src="/img/menu/menu-item-5.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Galbi</h4>
                    <p className="ingredients">
                      Grilled short ribs marinated in sweet soy sauce with steamed rice
                    </p>
                    <p className="price">
                      $24.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-6.png" className="glightbox"><img src="/img/menu/menu-item-6.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Samgyetang</h4>
                    <p className="ingredients">
                      Ginseng chicken soup with rice, jujube, garlic, and ginseng
                    </p>
                    <p className="price">
                      $21.95
                    </p>
                  </div>
                </div>
              </div>

              {/* Stir-Fried */}
              <div className="tab-pane fade" id="menu-stir-fried">
                <div className="tab-header text-center">
                  <h3>Stir-Fried</h3>
                  <p>Korean stir-fried dishes, sweet, savory, or spicy.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-1.png" className="glightbox"><img src="/img/menu/menu-item-1.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Kimchi Bokkeumbap</h4>
                    <p className="ingredients">
                      Stir-fried rice with kimchi, vegetables, and choice of protein
                    </p>
                    <p className="price">
                      $13.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-2.png" className="glightbox"><img src="/img/menu/menu-item-2.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Dwaeji Bulgogi</h4>
                    <p className="ingredients">
                      Stir-fried pork with vegetables in sweet and spicy sauce
                    </p>
                    <p className="price">
                      $16.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-3.png" className="glightbox"><img src="/img/menu/menu-item-3.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Japchae</h4>
                    <p className="ingredients">
                      Stir-fried glass noodles with vegetables and choice of beef or tofu
                    </p>
                    <p className="price">
                      $15.95
                    </p>
                  </div>
                </div>
              </div>

              {/* Soup & Stew */}
              <div className="tab-pane fade" id="menu-soup-stew">
                <div className="tab-header text-center">
                  <h3>Soup & Stew</h3>
                  <p>Warm and comforting Korean soups and stews.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-4.png" className="glightbox"><img src="/img/menu/menu-item-4.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Kimchi Jjigae</h4>
                    <p className="ingredients">
                      Spicy kimchi stew with pork, tofu, and vegetables
                    </p>
                    <p className="price">
                      $14.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-5.png" className="glightbox"><img src="/img/menu/menu-item-5.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Dwaeji Jjigae</h4>
                    <p className="ingredients">
                      Pork stew with vegetables and tofu in spicy broth
                    </p>
                    <p className="price">
                      $15.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-6.png" className="glightbox"><img src="/img/menu/menu-item-6.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Miyeok Guk</h4>
                    <p className="ingredients">
                      Seaweed soup with beef, served with rice
                    </p>
                    <p className="price">
                      $12.95
                    </p>
                  </div>
                </div>
              </div>

              {/* Stone Pot */}
              <div className="tab-pane fade" id="menu-stone-pot">
                <div className="tab-header text-center">
                  <h3>Stone Pot</h3>
                  <p>Served sizzling hot in a traditional stone bowl.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-1.png" className="glightbox"><img src="/img/menu/menu-item-1.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Dolsot Bibimbap</h4>
                    <p className="ingredients">
                      Mixed rice with vegetables, beef, and fried egg in hot stone pot
                    </p>
                    <p className="price">
                      $16.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-2.png" className="glightbox"><img src="/img/menu/menu-item-2.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Stone Pot Kimchi Jjigae</h4>
                    <p className="ingredients">
                      Kimchi stew in stone pot with pork and tofu
                    </p>
                    <p className="price">
                      $17.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-3.png" className="glightbox"><img src="/img/menu/menu-item-3.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Haemul Dolsot</h4>
                    <p className="ingredients">
                      Seafood stone pot with mixed seafood and vegetables
                    </p>
                    <p className="price">
                      $19.95
                    </p>
                  </div>
                </div>
              </div>

              {/* Fried */}
              <div className="tab-pane fade" id="menu-fried">
                <div className="tab-header text-center">
                  <h3>Fried</h3>
                  <p>Korean-style fried dishes.</p>
                </div>
                <div className="row gy-5">
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-4.png" className="glightbox"><img src="/img/menu/menu-item-4.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Korean Fried Chicken</h4>
                    <p className="ingredients">
                      Crispy fried chicken with sweet and spicy sauce
                    </p>
                    <p className="price">
                      $13.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-5.png" className="glightbox"><img src="/img/menu/menu-item-5.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Tempura</h4>
                    <p className="ingredients">
                      Lightly battered and fried vegetables and seafood
                    </p>
                    <p className="price">
                      $11.95
                    </p>
                  </div>
                  <div className="col-lg-4 menu-item">
                    <a href="/img/menu/menu-item-6.png" className="glightbox"><img src="/img/menu/menu-item-6.png" className="menu-img img-fluid" alt=""/></a>
                    <h4>Mandu</h4>
                    <p className="ingredients">
                      Fried dumplings filled with vegetables and choice of meat
                    </p>
                    <p className="price">
                      $9.95
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section id="testimonials" className="testimonials section light-background">
          <div className="container section-title" data-aos="fade-up">
            <h2>TESTIMONIALS</h2>
            <p>What Are They <span className="description-title">Saying About Us</span></p>
          </div>
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="swiper init-swiper">
              <script type="application/json" className="swiper-config">
                {JSON.stringify({
                  loop: true,
                  speed: 600,
                  autoplay: { delay: 5000 },
                  slidesPerView: "auto",
                  pagination: { el: ".swiper-pagination", type: "bullets", clickable: true }
                })}
              </script>
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="testimonial-item"></div>
                </div>
                <div className="swiper-slide">
                  <div className="testimonial-item"></div>
                </div>
                <div className="swiper-slide">
                  <div className="testimonial-item"></div>
                </div>
                <div className="swiper-slide">
                  <div className="testimonial-item"></div>
                </div>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section> */}

        {/* Events Section */}
        <section id="events" className="events section">
          <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
            <div className="swiper init-swiper">
              <script type="application/json" className="swiper-config">
                {JSON.stringify({
                  loop: true,
                  speed: 600,
                  autoplay: { delay: 5000 },
                  slidesPerView: "auto",
                  pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
                  breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 40 },
                    1200: { slidesPerView: 3, spaceBetween: 1 }
                  }
                })}
              </script>
              <div className="swiper-wrapper">
                <div className="swiper-slide event-item d-flex flex-column justify-content-end" style={{ backgroundImage: "url(/img/events-1.jpg)" }}>
                  <h3>Custom Parties</h3>
                  <div className="price align-self-start">$99</div>
                  <p className="description"></p>
                </div>
                <div className="swiper-slide event-item d-flex flex-column justify-content-end" style={{ backgroundImage: "url(/img/events-2.jpg)" }}>
                  <h3>Private Parties</h3>
                  <div className="price align-self-start">$289</div>
                  <p className="description"></p>
                </div>
                <div className="swiper-slide event-item d-flex flex-column justify-content-end" style={{ backgroundImage: "url(/img/events-3.jpg)" }}>
                  <h3>Birthday Parties</h3>
                  <div className="price align-self-start">$499</div>
                  <p className="description"></p>
                </div>
                <div className="swiper-slide event-item d-flex flex-column justify-content-end" style={{ backgroundImage: "url(/img/events-4.jpg)" }}>
                  <h3>Wedding Parties</h3>
                  <div className="price align-self-start">$899</div>
                  <p className="description"></p>
                </div>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section>

        {/* Chefs Section */}
        {/* <section id="chefs" className="chefs section">
          <div className="container section-title" data-aos="fade-up">
            <h2>chefs</h2>
            <p><span>Our</span> <span className="description-title">Proffesional Chefs<br /></span></p>
          </div>
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-4 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">
                <div className="team-member">
                  <div className="member-img"></div>
                  <div className="member-info"></div>
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="200">
                <div className="team-member">
                  <div className="member-img"></div>
                  <div className="member-info"></div>
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="300">
                <div className="team-member">
                  <div className="member-img"></div>
                  <div className="member-info"></div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Book A Table Section */}
        {/* <section id="book-a-table" className="book-a-table section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Book A Table</h2>
            <p><span>Book Your</span> <span className="description-title">Stay With Us<br /></span></p>
          </div>
          <div className="container">
            <div className="row g-0" data-aos="fade-up" data-aos-delay="100">
              <div className="col-lg-4 reservation-img" style={{ backgroundImage: "url(/img/reservation.jpg)" }}></div>
              <div className="col-lg-8 d-flex align-items-center reservation-form-bg" data-aos="fade-up" data-aos-delay="200">
                <form action="forms/book-a-table.php" method="post" role="form" className="php-email-form">
                  <div className="row gy-4"></div>
                  <div className="form-group mt-3"></div>
                  <div className="text-center mt-3"></div>
                </form>
              </div>
            </div>
          </div>
        </section> */}

        {/* Gallery Section */}
        <section id="gallery" className="gallery section light-background">
          <div className="container section-title" data-aos="fade-up">
            <h2>Gallery</h2>
            <p><span>Check</span> <span className="description-title">Our Gallery</span></p>
          </div>
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="swiper init-swiper">
              <script type="application/json" className="swiper-config">
                {JSON.stringify({
                  loop: true,
                  speed: 600,
                  autoplay: { delay: 5000 },
                  slidesPerView: "auto",
                  centeredSlides: true,
                  pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
                  breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 0 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1200: { slidesPerView: 5, spaceBetween: 20 }
                  }
                })}
              </script>
              <div className="swiper-wrapper align-items-center">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="swiper-slide">
                    <a className="glightbox" data-gallery="images-gallery" href={`/img/gallery/gallery-${i + 1}.jpg`}>
                      <img src={`/img/gallery/gallery-${i + 1}.jpg`} className="img-fluid" alt="" />
                    </a>
                  </div>
                ))}
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Contact</h2>
            <p><span>Need Help?</span> <span className="description-title">Contact Us</span></p>
          </div>
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="mb-5">
              <iframe
                style={{ width: "100%", height: "400px" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6392.606848229572!2d174.73737699999998!3d-36.7632878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d399a1e237b75%3A0xbc883ebee83bbb6b!2z7KCV64u0IEp1bmcgRGFtIGtvcmVhbiByZXN0YXVyYW50!5e0!3m2!1sko!2snz!4v1768427448011!5m2!1sko!2snz"
                frameBorder="0"
                allowFullScreen=""
              ></iframe>
            </div>
            <div className="row gy-4">
              <div className="col-md-6">
                <div className="info-item d-flex align-items-center" data-aos="fade-up" data-aos-delay="200">
                  <i className="icon bi bi-geo-alt flex-shrink-0"></i>
                  <div>
                    <h3>Address</h3>
                    <p>20a Link Drive, Wairau Valley, Auckland 0627</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item d-flex align-items-center" data-aos="fade-up" data-aos-delay="300">
                  <i className="icon bi bi-telephone flex-shrink-0"></i>
                  <div>
                    <h3>Call Us</h3>
                    <p>09 441 7080</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item d-flex align-items-center" data-aos="fade-up" data-aos-delay="400">
                  <i className="icon bi bi-envelope flex-shrink-0"></i>
                  <div></div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item d-flex align-items-center" data-aos="fade-up" data-aos-delay="500">
                  <i className="icon bi bi-clock flex-shrink-0"></i>
                  <div>
                    <h3>Open Hours</h3>
                    <p>
                      <strong>Mon-Sat:</strong> 11:30AM - 9PM<br />
                      <strong>Break Time:</strong> 3PM - 5PM<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="600">
              <div className="row gy-4">
                <div className="col-md-6">
                  <input type="text" name="name" className="form-control" placeholder="Your Name" required="" />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" name="email" placeholder="Your Email" required="" />
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" name="subject" placeholder="Subject" required="" />
                </div>
                <div className="col-md-12">
                  <textarea className="form-control" name="message" rows="6" placeholder="Message" required=""></textarea>
                </div>
                <div className="col-md-12 text-center">
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">Your message has been sent. Thank you!</div>
                  <button type="submit">Send Message</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer dark-background">
        <div className="container">
          <div className="row gy-3">
            <div className="col-lg-3 col-md-6 d-flex">
              <i className="bi bi-geo-alt icon"></i>
              <div className="address">
                <h4>Address</h4>
                <p>20a Link Drive</p>
                <p>Wairau Valley, Auckland 0627</p>
                <p></p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <i className="bi bi-telephone icon"></i>
              <div>
                <h4>Contact</h4>
                <p>
                  <strong>Phone:</strong> <span>+64 9 441 7080</span><br />
                  <strong>Email:</strong> <span>info@example.com</span><br />
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <i className="bi bi-clock icon"></i>
              <div>
                <h4>Opening Hours</h4>
                <p>
                  <strong>Mon-Sat:</strong> <span>11:30 AM - 9 PM</span><br />
                  <strong>Break Time:</strong> <span>3 PM - 5 PM</span><br />
                  <strong>Sunday</strong>: <span>Closed</span>
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4>Follow Us</h4>
              <div className="social-links d-flex">
                <a href="#" className="twitter"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="container copyright text-center mt-4">
          <p>© <span>Copyright</span> <strong className="px-1 sitename">Yummy</strong> <span>All Rights Reserved</span></p>
          <div className="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> Distributed by <a href="https://themewagon.com">ThemeWagon</a>
          </div>
        </div>
      </footer>

      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
      {/* <div id="preloader"></div> */}
    </>
  );
}
