import fs from 'fs';
import path from 'path';

export default async function MenuSection() {
  // SSR을 위해 직접 JSON 파일 읽기
  const filePath = path.join(process.cwd(), 'src/data/menuData.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const menuData = JSON.parse(fileContents);
  return (
    <section id="menu" className="menu section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Our Menu</h2>
        <p><span>Check Our</span> <span className="description-title">Menu</span></p>
      </div>
      <div className="container">
        <ul className="nav nav-tabs d-flex justify-content-center" data-aos="fade-up" data-aos-delay="100">
          {menuData.categories.map((category, index) => (
            <li key={category.id} className="nav-item">
              <a className={`nav-link ${index === 0 ? 'active show' : ''}`} data-bs-toggle="tab" data-bs-target={`#${category.id}`}>
                <h4>{category.name}</h4>
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
          {menuData.categories.map((category, index) => (
            <div key={category.id} className={`tab-pane fade ${index === 0 ? 'active show' : ''}`} id={category.id}>
              <div className="tab-header text-center">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="row gy-5">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={`col-lg-4 menu-item`}>
                    {item.image ? (
                      <a href={item.image} className="glightbox">
                        <img src={item.image} className="menu-img img-fluid" alt={item.title} />
                      </a>
                    ) : (
                      <div className="menu-img-placeholder" style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        <span>이미지 준비중</span>
                      </div>
                    )}
                    <h4>{item.title}</h4>
                    <p className="ingredients">{item.ingredients}</p>
                    <p className="price">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <a href="#menu" className="scroll-top-menu d-flex align-items-center justify-content-center">MENU</a>
    </section>
  );
}
