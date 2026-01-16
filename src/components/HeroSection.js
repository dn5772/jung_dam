export default function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container">
        <div className="row gy-4 justify-content-center justify-content-lg-between">
          <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
            <h1 data-aos="fade-up">Where Korean Flavors<br />Meet Heart</h1>
            <p data-aos="fade-up" data-aos-delay="100">At JungDam, we bring the warmth and care of Korean home cooking to your table.</p>
            <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
              <a href="tel:+6494417080" className="btn-get-started">Book a Table</a>
              <a href="https://youtu.be/xu4JsZpwk84?si=kZ2AKM4WGC_6SL7l" className="glightbox btn-watch-video d-flex align-items-center"><i className="bi bi-play-circle"></i><span>Watch Video</span></a>
            </div>
          </div>
          <div className="col-lg-5 order-1 order-lg-2 hero-img" data-aos="zoom-out">
            <img src="/img/hero.jpeg" className="img-fluid animated" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
