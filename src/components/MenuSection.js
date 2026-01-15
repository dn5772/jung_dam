export default function MenuSection() {
  return (
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
  );
}
