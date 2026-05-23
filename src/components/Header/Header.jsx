import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Button from '../Button/Button';
import { getBannerTopo, getMenuItens, getNavbar } from '../../api';
import './Header.css';

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const itemRefs = useRef([]);

  // Estados para os dados do Strapi
  const [bannerTopo, setBannerTopo] = useState(null);
  const [menuItens, setMenuItens] = useState([]);
  const [navbar, setNavbar] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  // Busca os dados do Strapi ao carregar
  useEffect(() => {
    getBannerTopo().then(setBannerTopo);
    getMenuItens().then(setMenuItens);
    getNavbar().then(setNavbar);
  }, []);

  const updateIndicator = (index) => {
    const el = itemRefs.current[index];
    if (!el) return;
    setIndicatorStyle({
      left: el.offsetLeft + 'px',
      width: el.offsetWidth + 'px',
    });
  };

  useLayoutEffect(() => {
    updateIndicator(activeIndex);
  }, [activeIndex, menuItens]);

  return (
    <header className="site-header">
      {/* Banner topo — só aparece se ativo = true */}
      {bannerTopo?.ativo && (
        <div className="announcement-bar">
          <a href={bannerTopo.link}>
            {bannerTopo.texto}
          </a>
        </div>
      )}

      <div className="header-nav">
        <img
          src={logo}
          alt="Aenima"
          className="header-logo"
          width={242}
          height={42}
        />
        <button
          className="header-menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          {menuAberto ? '✕' : (
            <>
          <span />
          <span />
          <span />
        </>
      )}
        </button>
        <nav
          className={`navbar ${menuAberto ? 'navbar--aberto' : ''}`}
          onMouseLeave={() => updateIndicator(activeIndex)}
        >
          <div className="navbar-indicator" style={indicatorStyle} />
          {menuItens.map((item, i) => (
            <a
              key={item.id}
              ref={(el) => (itemRefs.current[i] = el)}
              href={item.link}
              className={`nav-item${activeIndex === i ? ' nav-item--active' : ''}`}
              onMouseEnter={() => updateIndicator(i)}
              onClick={() => setActiveIndex(i)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Button href={navbar?.contact_us?.link}>
            {navbar?.contact_us?.texto || 'Contact Us'}
          </Button>
        </div>
      </div>
    </header>
  );
}