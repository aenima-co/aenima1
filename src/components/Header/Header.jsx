import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import localLogo from '../../assets/img/logo.svg';
import Button from '../Button/Button';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import { getBannerTopo, getMenuItens, getNavbar } from '../../api';
import { useLang } from '../../contexts/LanguageContext';
import { resolveMediaUrl } from '../../config';
import { t } from '../../i18n/messages';
import './Header.css';

export default function Header() {
  const { locale, lang } = useLang();
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const itemRefs = useRef([]);

  const [bannerTopo, setBannerTopo] = useState(null);
  const [menuItens, setMenuItens] = useState([]);
  const [navbar, setNavbar] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const activeIndex = menuItens.findIndex((item) => item.link === location.pathname);
  const logoObj = Array.isArray(navbar?.logo) ? navbar.logo[0] : navbar?.logo;
  const logoSrc = logoObj?.url ? resolveMediaUrl(logoObj.url) : localLogo;

  useEffect(() => {
    getBannerTopo(locale).then(setBannerTopo);
    getMenuItens(locale).then(setMenuItens);
    getNavbar(locale).then(setNavbar);
  }, [locale]);

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

  useEffect(() => {
    const handleResize = () => updateIndicator(activeIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <header className="site-header">
      {bannerTopo?.texto && bannerTopo?.ativo !== false && (
        <div className="announcement-bar">
          {bannerTopo.link?.startsWith('/') ? (
            <Link to={bannerTopo.link} className="announcement-bar__text">{bannerTopo.texto}</Link>
          ) : (
            <a href={bannerTopo.link} className="announcement-bar__text" target="_blank" rel="noreferrer">
              {bannerTopo.texto}
            </a>
          )}
        </div>
      )}

      <div className="header-nav">
        <Link to="/">
          <img
            src={logoSrc}
            alt="Aenima"
            className="header-logo"
            width={242}
            height={42}
          />
        </Link>

        <div className="header-mobile-actions">
          <LanguageToggle />
          <button
            className={`header-menu-toggle${menuAberto ? ' header-menu-toggle--open' : ''}`}
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label={menuAberto ? t(lang, 'header.closeMenu') : t(lang, 'header.openMenu')}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

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
          <LanguageToggle />
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
          <Button
            variant="light"
            href={navbar?.contact_us?.link}
            onClick={() => setMenuAberto(false)}
          >
            {navbar?.contact_us?.texto || 'Contact Us'}
          </Button>
        </div>
      </div>
    </header>
  );
}
