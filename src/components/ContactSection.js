export default function ContactSection() {
  return (
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <p><span>Need Help?</span> <span className="description-title">Contact Us</span></p>
      </div>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="mb-5">
          <iframe
            style={{ width: "100%", height: "400px" }}
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d25569.624427299554!2d174.7255296!3d-36.765696!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d399a1e237b75%3A0xbc883ebee83bbb6b!2z7KCV64u0IEp1bmcgRGFtIGtvcmVhbiByZXN0YXVyYW50!5e0!3m2!1sen!2snz!4v1768595330134!5m2!1sen!2snz"
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
              <div>
                <h3>Email Us</h3>
                <p>jungdam534@gmail.com</p>
              </div>
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
  );
}
