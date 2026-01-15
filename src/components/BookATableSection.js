export default function BookATableSection() {
  return (
    <section id="book-a-table" className="book-a-table section">
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
    </section>
  );
}
