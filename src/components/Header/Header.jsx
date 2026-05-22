import { useState, useRef, useLayoutEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Button from '../Button/Button';
import './Header.css';

const NAV_ITEMS = ['Home', 'Work', 'About', 'Blog'];

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const itemRefs = useRef([]);

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
  }, [activeIndex]);

  return (
    <header className="site-header">
      <div className="announcement-bar">
        ⭐ Get a FREE Expert Audit of Your{' '}
        <span className="announcement-highlight">Website, App, or Product</span>
        {' '}⭐
      </div>

      <div className="header-nav">
        <img
          src={logo}
          alt="Aenima"
          className="header-logo"
          width={242}
          height={42}
        />

        <nav
          className="navbar"
          onMouseLeave={() => updateIndicator(activeIndex)}
        >
          <div className="navbar-indicator" style={indicatorStyle} />
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`nav-item${activeIndex === i ? ' nav-item--active' : ''}`}
              onMouseEnter={() => updateIndicator(i)}
              onClick={() => setActiveIndex(i)}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Button>Contact Us</Button>
        </div>
      </div>
    </header>
  );
}
