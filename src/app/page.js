import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import MenuSection from "../components/MenuSection";
import EventsSection from "../components/EventsSection";
import GallerySection from "../components/GallerySection";
import ContactSection from "../components/ContactSection";

// 메뉴 섹션이 실시간 데이터를 사용하므로 동적 렌더링 강제
export const dynamic = 'force-dynamic';

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
          <a className="btn-getstarted" href="tel:+6494417080">Book a Table</a>
        </div>
      </header>

      <main className="main">
        <HeroSection />
        <AboutSection />
        {/* <StatsSection /> */}
        <MenuSection />
        {/* <EventsSection /> */}
        <GallerySection />
        <ContactSection />
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
                  <strong>Email:</strong> <span>jungdam534@gmail.com</span><br />
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
      <div id="preloader"></div>
    </>
  );
}
