export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="testimonials section light-background">
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
    </section>
  );
}
