import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo-container">
            <span className="logo-text">NOTRE GABON</span>
          </div>
          <p>Une ONG engagée pour le développement durable et le bien-être des populations gabonaises.</p>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Liens Rapides</h4>
          <ul>
            <li><a href="#home">Accueil</a></li>
            <li><a href="#about">Notre Vision</a></li>
            <li><a href="#missions">Nos Actions</a></li>
            <li><a href="#contact">Actualités</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contactez-nous</h4>
          <ul>
            <li><MapPin size={18} /> Libreville, Gabon</li>
            <li><Phone size={18} /> +241 01 23 45 67</li>
            <li><Mail size={18} /> contact@notregabon.org</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Notre Gabon ONG. Made with ❤️ for Gabon.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
