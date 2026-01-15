export default function ChefsSection() {
  return (
    <section id="chefs" className="chefs section">
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
    </section>
  );
}
