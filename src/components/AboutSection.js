export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container section-title" data-aos="fade-up">
        <h2>About Us<br /></h2>
        <p><span>Learn More</span> <span className="description-title">About Us</span></p>
      </div>
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-7" data-aos="fade-up" data-aos-delay="100">
            <img src="/img/about.png" className="img-fluid mb-4" alt="" />
            <div className="book-a-table">
              <h3>Book a Table</h3>
              <p><a href="tel:+6494417080">+64 9 441 7080</a></p>
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
  );
}
