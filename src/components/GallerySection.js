export default function GallerySection() {
  return (
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
  );
}
