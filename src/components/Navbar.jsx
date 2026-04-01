import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import '../styles/components/Navbar.css';

const navItems = [
  { label: 'Actualités', color: '#3AA935', href: '/actualites' },
  { label: 'Événements', color: '#FCD116', href: '/evenements' },
  { label: 'Bénévolat', color: '#0072CE', href: '/benevolat' },
  { label: 'Professionnel', color: '#3AA935', href: '/professionnel' },
  { label: 'Dialogue', color: '#FCD116', href: '/dialogue' },
  { label: 'Media', color: '#0072CE', href: '/media' },
  { 
    label: 'Nous', 
    color: '#3AA935', 
    href: '/nous', 
    links: [
      { label: 'Partenariats', href: '/partenariats' },
      { label: 'Impact', href: '/impact' }
    ]
  },
];

// Couleurs des dropdowns desktop (cycle : vert, jaune, bleu)
const dropdownColors = ['#3AA935', '#FCD116', '#0072CE'];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('main-header');
      if (!header) return;
      
      const heroSection = document.querySelector('.hero-section');
      const threshold = heroSection ? heroSection.offsetHeight - header.offsetHeight : 50;
      
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOpenCategory(null);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleCategory = (i) => setOpenCategory(openCategory === i ? null : i);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenCategory(null);
  };

  return (
    <header id="main-header" className={`header ${scrolled ? 'scrolled' : ''}`} ref={menuRef}>
      {/* Logo */}
      <Link to="/" className="logo-container">
        <img src="/logo1sansfond.png" alt="Notre Gabon Logo" className="logo logo-transparent" />
        <img src="/logo2sansfond.png" alt="Notre Gabon Logo" className="logo logo-scrolled" />
      </Link>

      {/* ── DESKTOP : liens visibles directement ── */}
      <nav className="navbar desktop-nav">
        <ul className="nav-links">
          {navItems.map((item, i) => (
            <li key={i} className={item.links ? "dropdown" : ""} style={{ '--dropdown-color': item.color }}>
              {item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <a href="#">{item.label}</a>
              )}
              {item.links && (
                <ul className="dropdown-content">
                  {item.links.map((link, j) => (
                    <li key={j}>
                      {typeof link === 'object' ? (
                        <Link to={link.href}>{link.label}</Link>
                      ) : (
                        <a href="#">{link}</a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ── MOBILE : bouton MENU ── */}
      <button
        className={`menu-btn ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu de navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen
          ? <><X size={20} className="menu-icon" /><span>FERMER</span></>
          : <><Menu size={20} className="menu-icon" /><span>MENU</span></>
        }
      </button>

      {/* ── MOBILE : panneau déroulant ── */}
      <div className={`menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="menu-panel-inner">
          {navItems.map((item, i) => (
            <div key={i} className="menu-category">
              {item.links ? (
                <>
                  <button
                    className="menu-category-title"
                    style={{ '--cat-color': item.color }}
                    onClick={() => toggleCategory(i)}
                    aria-expanded={openCategory === i}
                  >
                    <span className="cat-dot" style={{ background: item.color }} />
                    {item.label}
                    <ChevronDown size={18} className={`chevron ${openCategory === i ? 'rotated' : ''}`} />
                  </button>
                  <ul className={`menu-links ${openCategory === i ? 'expanded' : ''}`}>
                    {item.href && (
                      <li><Link to={item.href} onClick={closeMenu} style={{ fontWeight: '700', color: 'var(--navy)' }}>→ Voir la page {item.label}</Link></li>
                    )}
                    {item.links.map((link, j) => (
                      <li key={j}>
                        {typeof link === 'object' ? (
                          <Link to={link.href} onClick={closeMenu}>{link.label}</Link>
                        ) : (
                          <a href="#" onClick={closeMenu}>{link}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={item.href}
                  className="menu-category-title no-links"
                  style={{ '--cat-color': item.color }}
                  onClick={closeMenu}
                >
                  <span className="cat-dot" style={{ background: item.color }} />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay sombre derrière le panel mobile */}
      {menuOpen && <div className="menu-overlay" onClick={closeMenu} />}
    </header>
  );
};

export default Navbar;
