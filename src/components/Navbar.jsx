import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import '../styles/components/Navbar.css';

const navItems = [
  {
    label: 'Actualités',
    color: '#3AA935',
    links: ['Événements', 'Bénévolat', 'Professionnel', 'Dialogue', 'Media', 'Sponsoring/Partenariats', 'Impact'],
  },
  {
    label: 'Projet',
    color: '#FCD116',
    links: ['Événements', 'Bénévolat', 'Professionnel', 'Dialogue', 'Media', 'Sponsoring/Partenariats', 'Impact'],
  },
  {
    label: 'Éducation',
    color: '#0072CE',
    links: ['Cours en Ligne', 'Certifications', 'Formations spécialisées', 'CV & Lettre de motivation', 'Multimédia'],
  },
  {
    label: 'Rapports & Recherches',
    color: '#3AA935',
    links: ['Événements', 'Bénévolat', 'Professionnel', 'Dialogue', 'Media', 'Sponsoring/Partenariats', 'Impact'],
  },
  {
    label: 'Nous',
    color: '#FCD116',
    href: '/nous',
    links: ['Événements', 'Bénévolat', 'Professionnel', 'Dialogue', 'Media', 'Sponsoring/Partenariats', 'Impact'],
  },
  {
    label: 'Nous rejoindre',
    color: '#0072CE',
    links: ['Événements', 'Bénévolat', 'Professionnel', 'Dialogue', 'Media', 'Sponsoring/Partenariats', 'Impact'],
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
    const heroSection = document.querySelector('.hero-section');
    const handleScroll = () => {
      const header = document.getElementById('main-header');
      if (!heroSection || !header) return;
      const heroHeight = heroSection.offsetHeight;
      setScrolled(window.scrollY > heroHeight - header.offsetHeight);
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
      <div className="logo-container">
        <img src="/logo1sansfond.png" alt="Notre Gabon Logo" className="logo logo-transparent" />
        <img src="/logo2sansfond.png" alt="Notre Gabon Logo" className="logo logo-scrolled" />
      </div>

      {/* ── DESKTOP : liens visibles directement ── */}
      <nav className="navbar desktop-nav">
        <ul className="nav-links">
          {navItems.map((item, i) => (
            <li key={i} className="dropdown" style={{ '--dropdown-color': dropdownColors[i % 3] }}>
              {item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <a href="#">{item.label}</a>
              )}
              <ul className="dropdown-content">
                {item.links.map((link, j) => (
                  <li key={j}><a href="#">{link}</a></li>
                ))}
              </ul>
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
                  <li key={j}><a href="#" onClick={closeMenu}>{link}</a></li>
                ))}
              </ul>
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
