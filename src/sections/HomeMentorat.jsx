import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import logoMentorat from '../../images/logo1sansfond.png';
import '../styles/pages/Professionnel.css';
import '../styles/sections/Actualites.css';
import '../styles/sections/HomeSections.css';

function HomeMentorat() {
  return (
    <section className="home-section home-mentorat-section">
      <div className="home-section-container">
        <div className="actualites-header">
          <div className="actualites-header-left">
            <span className="section-tag" style={{ color: 'var(--blue)' }}>Développement</span>
            <h2 className="section-title">Programme de Mentorat</h2>
          </div>
          <Link to="/professionnel" className="actualites-voir-plus">Voir tout →</Link>
        </div>

        <div className="home-mentorat-body">
          <div className="home-mentorat-text">
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>
              Le réseau Notre Gabon regroupe des professionnels établis qui partagent une même vision. Nous mettons en relation des étudiants et de jeunes diplômés avec des mentors expérimentés pour les guider dans leurs choix de carrière, les aider à affiner leur projet professionnel et leur ouvrir des portes.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', fontWeight: 700, marginBottom: '30px' }}>
              Vous souhaitez être mentoré ou devenir mentor ?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
              <a
                href="mailto:mentorat@notregabon.org"
                className="btn-notre-gabon-square"
                style={{ background: 'var(--blue)', color: '#fff', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Rejoindre le programme <Users size={16} />
              </a>
            </div>
          </div>

          <div className="home-mentorat-logo">
            <img src={logoMentorat} alt="Mentorat Notre Gabon" />
          </div>
        </div>


      </div>
    </section>
  );
}

export default HomeMentorat;
