import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo.svg';
import Button from '../Button/Button';
import { getBannerTopo, getMenuItens, getNavbar } from '../../api';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const itemRefs = useRef([]);

  const [bannerTopo, setBannerTopo] = useState(null);
  const [menuItens, setMenuItens] = useState([]);
  const [navbar, setNavbar] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const activeIndex = menuItens.findIndex((item) => item.link === location.pathname);

  useEffect(() => {
    getBannerTopo().then(setBannerTopo);
    getMenuItens().then(setMenuItens);
    getNavbar().then(setNavbar);
  }, []);

  const updateIndicator = (index) => {
    const el = itemRefs.current[index];
    if (!el) {
      setIndicatorStyle({ opacity: 0 });
      return;
    }
    setIndicatorStyle({
      left: el.offsetLeft + 'px',
      width: el.offsetWidth + 'px',
      opacity: 1,
    });
  };

  useLayoutEffect(() => {
    updateIndicator(activeIndex);
  }, [activeIndex, menuItens]);

  return (
    <header className="site-header">
      {bannerTopo?.ativo && (
        <div className="announcement-bar">
          <a href={bannerTopo.link}>{bannerTopo.texto}</a>
        </div>
      )}

      <div className="header-nav">
        <Link to="/">
          <img src={logo} alt="Aenima" className="header-logo" width={242} height={42} />
        </Link>

        <button
          className={`header-menu-toggle${menuAberto ? ' header-menu-toggle--open' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="navbar" onMouseLeave={() => updateIndicator(activeIndex)}>
          <div className="navbar-indicator" style={indicatorStyle} />
          {menuItens.map((item, i) => (
            <Link
              key={item.id}
              ref={(el) => (itemRefs.current[i] = el)}
              to={item.link}
              className={`nav-item${activeIndex === i ? ' nav-item--active' : ''}`}
              onMouseEnter={() => updateIndicator(i)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Button href={navbar?.contact_us?.link}>
            {navbar?.contact_us?.texto || 'Contact Us'}
          </Button>
        </div>
      </div>

      <div className={`mobile-menu${menuAberto ? ' mobile-menu--open' : ''}`}>
        <nav className="mobile-menu__nav">
          {menuItens.map((item, i) => (
            <Link
              key={item.id}
              to={item.link}
              className={`mobile-menu__item${activeIndex === i ? ' mobile-menu__item--active' : ''}`}
              onClick={() => setMenuAberto(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu__actions">
          <Button variant="light" href={navbar?.contact_us?.link}>
            {navbar?.contact_us?.texto || 'Contact Us'}
          </Button>
        </div>
      </div>
    </header>
  );
}
