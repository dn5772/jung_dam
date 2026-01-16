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
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-appetizers">
              <h4>Appetizers</h4>
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
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Dak-galbi/Original Dak-galbi.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Original Dak-galbi</h4>
                <p className="ingredients">
                  Spicy stir-fried chicken with vegetables and rice cakes.
                </p>
                <p className="price">
                  M $57 (2 people) / L $72 (3 people)
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Dak-galbi/Cheese Dak-galbi.png" className="glightbox"><img src="/img/menu/Dak-galbi/Cheese Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Cheese Dak-galbi</h4>
                <p className="ingredients">
                  Spicy chicken stir-fry topped with melted cheese.
                </p>
                <p className="price">
                  M $65 / L $79
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Dak-galbi/Salt-Grilled Dak-galbi.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Salt-Grilled Dak-galbi</h4>
                <p className="ingredients">
                  Chicken stir-fried with sesame oil and salt marinade.
                </p>
                <p className="price">
                  M $57 / L $72
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Dak-galbi/Creamy Dak-galbi.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Creamy Dak-galbi</h4>
                <p className="ingredients">
                  Tender chicken and vegetables in a rich gochujang Alfredo sauce.
                </p>
                <p className="price">
                  M $65 / L $79
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
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Tteokbokki/Original Tteokbokki.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Original Tteokbokki</h4>
                <p className="ingredients">
                  Rice cakes cooked in a sweet and spicy sauce.
                </p>
                <p className="price">
                  M $48
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Tteokbokki/Beef Brisket Tteokbokki.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Beef Brisket Tteokbokki</h4>
                <p className="ingredients">
                  Tteokbokki topped with sliced beef brisket.
                </p>
                <p className="price">
                  M $59
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Tteokbokki/Donkatsu Tteokbokki.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Donkatsu Tteokbokki</h4>
                <p className="ingredients">
                  Tteokbokki served with crispy pork cutlet.
                </p>
                <p className="price">
                  M $59
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Tteokbokki/Rose Tteokbokki.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Rose Tteokbokki</h4>
                <p className="ingredients">
                  Creamy rose-style sauce with rice cakes.
                </p>
                <p className="price">
                  M $59
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
              <div className="col-lg-2 menu-item">
                <a href="/img/menu/Main-dishes/Army Stew (Budae Jjigae).png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Army Stew (Budae Jjigae)</h4>
                <p className="ingredients">
                  Spicy stew with spam, sausage, cheese, and ramen noodles.
                </p>
                <p className="price">
                  M $65 / L $73
                </p>
              </div>
              <div className="col-lg-2 menu-item">
                <a href="/img/menu/Main-dishes/Seafood Soft Tofu Hotpot.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Seafood Soft Tofu Hotpot</h4>
                <p className="ingredients">
                  Hotpot with seafood, soft tofu, and vegetables.
                </p>
                <p className="price">
                  M $68
                </p>
              </div>
              <div className="col-lg-2 menu-item">
                <a href="/img/menu/Main-dishes/Soy Braised Chicken (Jjimdak).png" className="glightbox"><img src="/img/menu/Main-dishes/Soy Braised Chicken.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Soy Braised Chicken (Jjimdak)</h4>
                <p className="ingredients">
                  Chicken braised in a savory soy-based sauce.
                </p>
                <p className="price">
                  M $72 / L $84
                </p>
              </div>
              <div className="col-lg-2 menu-item">
                <a href="/img/menu/Main-dishes/Spicy Braised Chicken.png" className="glightbox"><img src="/img/menu/Main-dishes/Spicy Braised Chicken.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Spicy Braised Chicken</h4>
                <p className="ingredients">
                  Chicken braised in a spicy sauce with vegetables.
                </p>
                <p className="price">
                  M $70 / L $82
                </p>
              </div>
              <div className="col-lg-2 menu-item">
                <a href="/img/menu/Main-dishes/Fish Cake Hotpot.png" className="glightbox"><img src="/img/menu/Main-dishes/Fish Cake Hotpot.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Fish Cake Hotpot</h4>
                <p className="ingredients">
                  Fish cake hotpot with seafood in a deep broth.
                </p>
                <p className="price">
                  M $68
                </p>
              </div>
              <div className="col-lg-2 menu-item">
                <a href="/img/menu/Main-dishes/Spicy Pork Bone Stew.png" className="glightbox"><img src="/img/menu/Main-dishes/Spicy Pork Bone Stew.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Spicy Pork Bone Stew</h4>
                <p className="ingredients">
                  Spicy pork bone stew with vegetables.
                </p>
                <p className="price">
                  M $62
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
                <a href="/img/menu/Stir-Fried/Stir-Fried Pork.png" className="glightbox"><img src="/img/menu/Stir-Fried/Stir-Fried Pork.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stir-Fried Pork</h4>
                <p className="ingredients">
                  Stir-fried pork and vegetables marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Stir-Fried Chicken.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stir-Fried Chicken</h4>
                <p className="ingredients">
                  Stir-fried chicken and vegetables marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Stir-Fried Squid.png" className="glightbox"><img src="/img/menu/Stir-Fried/Stir-Fried Squid.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stir-Fried Squid</h4>
                <p className="ingredients">
                  Stir-fried squid and vegetables marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Squid & Pork Belly Stir-Fry.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Squid & Pork Belly Stir-Fry</h4>
                <p className="ingredients">
                  Stir-fried squid, pork belly, and vegetables in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Bulgogi.png" className="glightbox"><img src="/img/menu/Stir-Fried/Bulgogi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Bulgogi</h4>
                <p className="ingredients">
                  Stir-fried beef and vegetables marinated in a sweet soy-based sauce.
                </p>
                <p className="price">
                  $28
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Japchae.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Japchae</h4>
                <p className="ingredients">
                  Stir-fried glass noodles with vegetables.
                </p>
                <p className="price">
                  $24
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Galbi-Style Pork Belly.png" className="glightbox"><img src="/img/menu/Stir-Fried/Galbi-Style Pork Belly.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Galbi-Style Pork Belly</h4>
                <p className="ingredients">
                  Pork belly cooked in a traditional soy-based sauce with garlic and fruit.
                </p>
                <p className="price">
                  $28
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Semi-Dried Pollock Stir-Fry.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Semi-Dried Pollock Stir-Fry</h4>
                <p className="ingredients">
                  Naturally semi-dried pollock with a tender, chewy texture.
                </p>
                <p className="price">
                  $30
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Stir-Fried/Grilled Fish.png" className="glightbox"><img src="/img/menu/Stir-Fried/Grilled Fish.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Grilled Fish</h4>
                <p className="ingredients">
                  Grilled mackerel served with green onion oil.
                </p>
                <p className="price">
                  $30
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
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Lamb Nutrition Soup.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Lamb Nutrition Soup</h4>
                <p className="ingredients">
                  Rich lamb broth soup made with tender lamb.
                </p>
                <p className="price">
                  $26
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Fish Roe Soup (Altang).png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Fish Roe Soup (Altang)</h4>
                <p className="ingredients">
                  Spicy or non-spicy soup with fish roe.
                </p>
                <p className="price">
                  $26
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Beef Soft Tofu Stew.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Beef Soft Tofu Stew</h4>
                <p className="ingredients">
                  Spicy soft tofu stew with sliced beef.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Kimchi Stew.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Kimchi Stew</h4>
                <p className="ingredients">
                  Kimchi stew with pork and tofu.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Hot Pot Bulgogi.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Hot Pot Bulgogi</h4>
                <p className="ingredients">
                  Bulgogi served in a hot pot with vegetables and glass noodles.
                </p>
                <p className="price">
                  $26
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Pork Bone Soup.png" className="glightbox"><img src="/img/menu/Soup-Stew/Pork Bone Soup.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Pork Bone Soup</h4>
                <p className="ingredients">
                  Hearty soup made with pork backbone and potatoes.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Clear Chicken Soup.png" className="glightbox"><img src="/img/menu/Soup-Stew/Clear Chicken Soup.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Clear Chicken Soup</h4>
                <p className="ingredients">
                  Mild and comforting Korean chicken soup.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Seafood Soft Tofu Stew.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Seafood Soft Tofu Stew</h4>
                <p className="ingredients">
                  Spicy soft tofu stew with seafood.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Spicy Beef Soup (Yukgaejang).png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Spicy Beef Soup (Yukgaejang)</h4>
                <p className="ingredients">
                  Spicy soup with beef, brisket, and glass noodles.
                </p>
                <p className="price">
                  $26
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Seafood Noodle Soup.png" className="glightbox"><img src="/img/menu/Soup-Stew/Seafood Noodle Soup.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Seafood Noodle Soup</h4>
                <p className="ingredients">
                  Noodle soup with seafood and vegetables.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Cold Noodles.png" className="glightbox"><img src="/img/menu/Soup-Stew/Cold Noodles.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Cold Noodles</h4>
                <p className="ingredients">
                  Chilled noodle soup served with kimchi.
                </p>
                <p className="price">
                  $22
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Soup-Stew/Spicy Cold Noodles.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Spicy Cold Noodles</h4>
                <p className="ingredients">
                  House special cold noodles with a spicy kick.
                </p>
                <p className="price">
                  $22
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
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Bibimbap.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Bibimbap</h4>
                <p className="ingredients">
                  Rice topped with assorted vegetables and beef mince, mixed with gochujang.
                </p>
                <p className="price">
                  $24
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Fish Roe Rice (Albap).png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Fish Roe Rice (Albap)</h4>
                <p className="ingredients">
                  Rice topped with fish roe, kimchi, pickled radish, and crab meat.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Stone Pot Bibimbap.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stone Pot Bibimbap</h4>
                <p className="ingredients">
                  Sizzling rice with assorted vegetables and beef mince, mixed with gochujang.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Stone Pot Beef Rice Bowl.png" className="glightbox"><img src="/img/menu/Stone-Pot/Stone Pot Beef Rice Bowl.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stone Pot Beef Rice Bowl</h4>
                <p className="ingredients">
                  Rice topped with stir-fried beef marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Stone Pot Chicken Rice Bowl.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stone Pot Chicken Rice Bowl</h4>
                <p className="ingredients">
                  Rice topped with stir-fried chicken marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Stone Pot Squid Rice Bowl.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stone Pot Squid Rice Bowl</h4>
                <p className="ingredients">
                  Rice topped with stir-fried squid marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Stone Pot Pork Rice Bowl.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Stone Pot Pork Rice Bowl</h4>
                <p className="ingredients">
                  Rice topped with stir-fried pork marinated in a soy or spicy sauce.
                </p>
                <p className="price">
                  $25
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Stone-Pot/Kimchi Fried Rice.png" className="glightbox"><img src="/img/menu/Stone-Pot/Kimchi Fried Rice.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Kimchi Fried Rice</h4>
                <p className="ingredients">
                  Fried rice with kimchi, topped with a sunny-side-up egg and seaweed.<br/>(Add bacon $5 / sausage $5 / cheese $7)
                </p>
                <p className="price">
                  $24
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
                <a href="/img/menu/Fried/Fried Chicken.png" className="glightbox"><img src="/img/menu/Fried/Fried Chicken.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Fried Chicken</h4>
                <p className="ingredients">
                  Classic Korean-style crispy fried chicken.<br/>(+$1 extra crispy)
                </p>
                <p className="price">
                  $28
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Seasoned Chicken.png" className="glightbox"><img src="/img/menu/Fried/Seasoned Chicken.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Seasoned Chicken</h4>
                <p className="ingredients">
                  Fried chicken coated in sweet and spicy sauce.
                </p>
                <p className="price">
                  $29
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Green Onion Chicken.png" className="glightbox"><img src="/img/menu/Fried/Green Onion Chicken.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Green Onion Chicken</h4>
                <p className="ingredients">
                  Fried chicken topped with fresh green onions.
                </p>
                <p className="price">
                  $29
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Garlic Soy Chicken.png" className="glightbox"><img src="/img/menu/Dak-galbi/Original Dak-galbi.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Garlic Soy Chicken</h4>
                <p className="ingredients">
                  Fried chicken glazed in garlic soy sauce.
                </p>
                <p className="price">
                  $29
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Honey Butter Chicken.png" className="glightbox"><img src="/img/menu/Fried/Honey Butter Chicken.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Honey Butter Chicken</h4>
                <p className="ingredients">
                  Fried chicken coated in honey butter sauce.
                </p>
                <p className="price">
                  $30
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Donkatsu.png" className="glightbox"><img src="/img/menu/Fried/Donkatsu.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Donkatsu</h4>
                <p className="ingredients">
                  Breaded and deep-fried pork cutlet.
                </p>
                <p className="price">
                  $24
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/King Size Donkatsu.png" className="glightbox"><img src="/img/menu/Fried/King Size Donkatsu.png" className="menu-img img-fluid" alt=""/></a>
                <h4>King Size Donkatsu</h4>
                <p className="ingredients">
                  Extra-large breaded pork cutlet.
                </p>
                <p className="price">
                  $39
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Seafood Pancake.png" className="glightbox"><img src="/img/menu/Fried/Seafood Pancake.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Seafood Pancake</h4>
                <p className="ingredients">
                  Korean-style pancake with seafood and vegetables.
                </p>
                <p className="price">
                  $28
                </p>
              </div>
              <div className="col-lg-4 menu-item">
                <a href="/img/menu/Fried/Kimchi Pancake.png" className="glightbox"><img src="/img/menu/Fried/Kimchi Pancake.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Kimchi Pancake</h4>
                <p className="ingredients">
                  Korean-style pancake made with kimchi.
                </p>
                <p className="price">
                  $28
                </p>
              </div>
            </div>
          </div>
          {/* Appetizers */}
          <div className="tab-pane fade" id="menu-appetizers">
            <div className="tab-header text-center">
              <h3>Appetizers</h3>
              <p>Delicious starters to begin your meal.</p>
            </div>
            <div className="row gy-5">
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Gyoza.png" className="glightbox"><img src="/img/menu/Appetizers/Gyoza.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Gyoza</h4>
                <p className="ingredients">
                  Pan-fried dumplings.
                </p>
                <p className="price">
                  $9
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Seaweed Roll.png" className="glightbox"><img src="/img/menu/Appetizers/Seaweed Roll.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Seaweed Roll</h4>
                <p className="ingredients">
                  Deep-fried seaweed rolls.
                </p>
                <p className="price">
                  $9
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Fried Shrimp.png" className="glightbox"><img src="/img/menu/Appetizers/Fried Shrimp.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Fried Shrimp</h4>
                <p className="ingredients">
                  Crispy deep-fried shrimp.
                </p>
                <p className="price">
                  $13
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Steamed Egg.png" className="glightbox"><img src="/img/menu/Appetizers/Steamed Egg.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Steamed Egg</h4>
                <p className="ingredients">
                  Soft and fluffy Korean-style steamed egg.
                </p>
                <p className="price">
                  $13
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Fish Roe Rice Balls.png" className="glightbox"><img src="/img/menu/Appetizers/Fish Roe Rice Balls.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Fish Roe Rice Balls</h4>
                <p className="ingredients">
                  Rice balls mixed with fish roe and pickled radish.
                </p>
                <p className="price">
                  $13
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Chicken Skewers.png" className="glightbox"><img src="/img/menu/Appetizers/Chicken Skewers.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Chicken Skewers</h4>
                <p className="ingredients">
                  Grilled chicken skewers.
                </p>
                <p className="price">
                  $13
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Hot Dog.png" className="glightbox"><img src="/img/menu/Appetizers/Hot Dog.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Hot Dog</h4>
                <p className="ingredients">
                  Korean-style deep-fried hot dog.
                </p>
                <p className="price">
                  $7
                </p>
              </div>
              <div className="col-lg-3 menu-item">
                <a href="/img/menu/Appetizers/Rice Cake Skewers.png" className="glightbox"><img src="/img/menu/Appetizers/Rice Cake Skewers.png" className="menu-img img-fluid" alt=""/></a>
                <h4>Rice Cake Skewers</h4>
                <p className="ingredients">
                  Grilled Korean rice cake skewers with sauce.
                </p>
                <p className="price">
                  $9
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
