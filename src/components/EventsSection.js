export default function EventsSection() {
  return (
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
  );
}
