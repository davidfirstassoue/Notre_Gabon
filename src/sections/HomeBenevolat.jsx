import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Calendar, MapPin, Heart } from 'lucide-react';
import '../styles/pages/Benevolat.css';
import '../styles/sections/Actualites.css';
import '../styles/sections/HomeSections.css';

function HomeBenevolat() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMission();
  }, []);

  const fetchMission = async () => {
    try {
      const { data, error } = await supabase
        .from('missions_benevolat')
        .select('*')
        .eq('statut', 'Ouvert')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) setMission(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <section className="home-benevolat-wrapper">
      <div className="home-benevolat-inner">

        {/* Partie gauche : incitation */}
        <div className="home-benevolat-left">
          <div className="home-benevolat-icon">
            <Heart size={40} color="#FCD116" />
          </div>
          <span className="home-benevolat-tag">Bénévolat</span>
          <h2 className="home-benevolat-title">
            Agis pour ton pays. Le Gabon a besoin de toi.
          </h2>
          <p className="home-benevolat-text">
            Chaque acte de bénévolat est une brique posée pour l'avenir de notre nation. Rejoins des centaines de jeunes Gabonais qui donnent de leur temps, de leur énergie et de leur talent pour bâtir un pays plus fort, plus juste et plus solidaire.
          </p>
          <p className="home-benevolat-text" style={{ fontWeight: 700 }}>
            Ensemble, nous sommes Notre Gabon.
          </p>
          <a
            href="mailto:benevolat@notregabon.org?subject=Candidature Bénévolat"
            className="home-benevolat-cta-btn"
          >
            Je veux m'engager
          </a>
        </div>

        {/* Partie droite : teaser mission */}
        <div className="home-benevolat-right">
          {loading ? (
            <div className="home-benevolat-card-placeholder">
              <p>Chargement des missions...</p>
            </div>
          ) : mission ? (
            <div className="home-benevolat-card">
              {mission.image_url && (
                <div className="benevolat-card-image">
                  <img src={mission.image_url} alt={mission.titre} />
                </div>
              )}
              <div className="benevolat-card-content">
                <div className="benevolat-card-header">
                  <h3>{mission.titre}</h3>
                  <span className={`benevolat-badge ${mission.statut === 'Complet' ? 'badge-complet' : 'badge-ouvert'}`}>
                    {mission.statut}
                  </span>
                </div>
                <div className="benevolat-meta">
                  {mission.date_mission && (
                    <span><Calendar size={14} /> {new Date(mission.date_mission).toLocaleDateString('fr-FR')}</span>
                  )}
                  {mission.lieu && (
                    <span><MapPin size={14} /> {mission.lieu}</span>
                  )}
                </div>
                <p className="benevolat-desc">{mission.description}</p>
                <a
                  href={mission.lien_inscription || `mailto:contact@notregabon.org?subject=Candidature pour: ${mission.titre}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-mission-partant ${mission.statut === 'Complet' ? 'btn-disabled' : ''}`}
                  onClick={(e) => mission.statut === 'Complet' && e.preventDefault()}
                >
                  🤝 Je suis partant
                </a>
              </div>
            </div>
          ) : (
            <div className="home-benevolat-card-placeholder">
              <Heart size={40} />
              <p>Reviens bientôt pour découvrir nos prochaines missions terrain !</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default HomeBenevolat;
