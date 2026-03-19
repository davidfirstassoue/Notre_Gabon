import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import '../styles/pages/SimplePage.css';
import '../styles/pages/Benevolat.css';
import { Heart, Activity, Target, Shield, MapPin, Calendar } from 'lucide-react';

function Benevolat() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    setLoading(true);
    setDbError(false);
    try {
      const { data, error } = await supabase
        .from('missions_benevolat')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') setDbError(true);
        else console.error('Erreur chargement benevolat:', error);
      } else if (data) {
        setMissions(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const MissionCard = ({ mission }) => {
    const isComplet = mission.statut === 'Complet';
    
    return (
      <div className="benevolat-card">
        {mission.image_url && (
          <div className="benevolat-card-image">
            <img src={mission.image_url} alt={mission.titre} />
          </div>
        )}
        <div className="benevolat-card-content">
          <div className="benevolat-card-header">
            <h3>{mission.titre}</h3>
            <span className={`benevolat-badge ${isComplet ? 'badge-complet' : 'badge-ouvert'}`}>
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
            href={mission.lien_inscription || "mailto:contact@notregabon.org?subject=Candidature pour: " + mission.titre} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`btn-notre-gabon-square ${isComplet ? 'btn-disabled' : ''}`}
            onClick={(e) => isComplet && e.preventDefault()}
          >
            Je suis partant
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          
          {/* HEADER STRICTEMENT CONSERVÉ */}
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--yellow)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Bénévolat</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--yellow)'}}></div>
          </div>
          
          <div className="simple-page-content">
            
            {/* 1. Pourquoi nous rejoindre */}
            <section className="benevolat-section benevolat-intro">
              <h2 className="section-title">Pourquoi s'engager avec nous ?</h2>
              <div className="intro-text">
                <p>
                  Rejoindre Notre Gabon, c'est bien plus que donner de son temps. C'est intégrer une famille dynamique dédiée à la construction matérielle et intellectuelle de notre pays. C'est une occasion unique de développer de nouvelles compétences, de tisser un réseau solide avec d'autres jeunes ambitieux et d'avoir un impact direct et immédiat sur la vie des Gabonais.
                </p>
                <p>
                  En devenant bénévole, vous participez activement sur le terrain, vous gagnez en expérience et vous obtenez une véritable reconnaissance (attestation de bénévolat, recommandations) qui valorisera votre parcours professionnel.
                </p>
              </div>
            </section>

            {/* 2. Missions à venir (Dynamique) */}
            <section className="benevolat-section">
              <h2 className="section-title">Missions et événements à venir</h2>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>Recherche des missions en cours...</p>
                </div>
              ) : dbError ? (
                <div className="benevolat-empty error">
                  <h3>Configuration requise</h3>
                  <p>La base de données pour les missions de bénévolat est en cours de configuration.</p>
                </div>
              ) : missions.length > 0 ? (
                <div className="benevolat-grid">
                  {missions.map(m => <MissionCard key={m.id} mission={m} />)}
                </div>
              ) : (
                <div className="benevolat-empty">
                  <h3>Aucune mission ouverte pour le moment</h3>
                  <p>Revenez très vite pour découvrir nos prochains besoins sur le terrain !</p>
                </div>
              )}
            </section>

            {/* 3. Domaines où on a besoin d'aide (Statique) */}
            <section className="benevolat-section">
              <h2 className="section-title">Nos domaines de besoin en continu</h2>
              <div className="domaines-grid">
                
                <div className="domaine-card">
                  <div className="domaine-icon"><Activity size={32} /></div>
                  <h3>Logistique & Terrain</h3>
                  <p>Aidez-nous à préparer nos événements physiques, gérer le matériel et encadrer le public lors de nos grandes actions (distributions, rencontres).</p>
                </div>

                <div className="domaine-card">
                  <div className="domaine-icon"><Target size={32} /></div>
                  <h3>Communication & Digital</h3>
                  <p>Nous recherchons des créatifs (photographes, community managers, rédacteurs) pour amplifier la voix de la jeunesse sur les réseaux sociaux.</p>
                </div>

                <div className="domaine-card">
                  <div className="domaine-icon"><Heart size={32} /></div>
                  <h3>Santé & Prévention</h3>
                  <p>Vous avez une formation médicale ou para-médicale ? Votre expertise est primordiale pour nos campagnes de sensibilisation et soins d'urgence.</p>
                </div>

                <div className="domaine-card">
                  <div className="domaine-icon"><Shield size={32} /></div>
                  <h3>Stratégie & Partenariats</h3>
                  <p>Des profils à l'aise avec la rédaction de dossiers, la recherche de financements et le démarchage d'acteurs institutionnels ou privés.</p>
                </div>

              </div>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <a href="mailto:contact@notregabon.org?subject=Candidature Spontanée Bénévolat" className="btn-notre-gabon-square" style={{ background: 'var(--yellow)', color: '#fff' }}>
                  Candidature Libre
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default Benevolat;
