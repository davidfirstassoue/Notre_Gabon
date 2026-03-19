import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import '../styles/pages/SimplePage.css';
import '../styles/pages/Professionnel.css';
import { Briefcase, MapPin, ExternalLink, Download, Users, FileText } from 'lucide-react';
import logoMentorat from '../../images/logo1sansfond.png';

function Professionnel() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    setLoading(true);
    setDbError(false);
    try {
      const { data, error } = await supabase
        .from('offres_emploi')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') setDbError(true);
        else console.error('Erreur chargement pro:', error);
      } else if (data) {
        setOffres(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const OffreCard = ({ offre }) => {
    const isPourvu = offre.statut === 'Pourvu';
    let typeConfig = { bg: 'var(--blue)', color: '#fff' };
    if (offre.type_contrat === 'Stage') typeConfig = { bg: 'var(--green)', color: '#fff' };
    if (offre.type_contrat === 'Bénévolat Pro') typeConfig = { bg: 'var(--yellow)', color: '#fff' };
    if (offre.type_contrat === 'Freelance') typeConfig = { bg: 'var(--navy)', color: '#fff' };

    return (
      <div className={`pro-card ${isPourvu ? 'pourvu' : ''}`}>
        <div className="pro-card-header">
          <span className="pro-type-badge" style={{ backgroundColor: typeConfig.bg, color: typeConfig.color }}>
            {offre.type_contrat}
          </span>
          {isPourvu && <span className="pro-statut-badge">Pourvu</span>}
        </div>

        <h3>{offre.titre}</h3>

        <div className="pro-meta">
          {offre.lieu && (
            <span><MapPin size={16} /> {offre.lieu}</span>
          )}
        </div>

        <p className="pro-desc">{offre.description}</p>

        <div className="pro-footer">
          <span className="pro-date">
            Publiée le {new Date(offre.created_at).toLocaleDateString('fr-FR')}
          </span>
          <a
            href={offre.lien_postuler || "mailto:recrutement@notregabon.org?subject=Candidature pour: " + offre.titre}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-notre-gabon-square btn-pro ${isPourvu ? 'btn-disabled' : ''}`}
            style={{ background: isPourvu ? '' : 'var(--blue)', color: isPourvu ? '' : '#fff' }}
            onClick={(e) => isPourvu && e.preventDefault()}
          >
            Postuler <ExternalLink size={16} style={{ marginLeft: '6px', verticalAlign: 'text-bottom' }} />
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
            <span className="section-tag" style={{ color: 'var(--blue)' }}>Nous rejoindre</span>
            <h1 className="simple-page-title">Professionnel</h1>
            <div className="simple-page-divider" style={{ backgroundColor: 'var(--blue)' }}></div>
          </div>

          <div className="simple-page-content">

            {/* 1. Offres Internes */}
            <section className="pro-section">
              <h2 className="section-title">Nos Opportunités Internes</h2>
              <p className="pro-intro">
                Rejoindre le staff de Notre Gabon, c'est mettre votre talent au service d'un projet d'envergure nationale. Découvrez nos postes à pourvoir, nos offres de stage et nos missions spécifiques.
              </p>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>Recherche des offres en cours...</p>
                </div>
              ) : dbError ? (
                <div className="pro-empty error">
                  <h3>Configuration requise</h3>
                  <p>La base de données pour les offres est en cours de configuration.</p>
                </div>
              ) : offres.length > 0 ? (
                <div className="pro-grid">
                  {offres.map(o => <OffreCard key={o.id} offre={o} />)}
                </div>
              ) : (
                <div className="pro-empty">
                  <div className="pro-empty-icon"><Briefcase size={40} /></div>
                  <h3>Aucun recrutement en cours</h3>
                  <p>Nous n'avons pas d'offre ouverte actuellement, mais nous acceptons toujours les candidatures spontanées !</p>
                  <a href="mailto:recrutement@notregabon.org" className="btn-notre-gabon-square" style={{ background: 'var(--blue)', color: '#fff', display: 'inline-block', maxWidth: '300px', marginTop: '15px' }}>
                    Candidature Spontanée
                  </a>
                </div>
              )}
            </section>

            {/* 2. Réseau / Mentorat */}
            <section className="pro-section bg-light-gray" style={{ padding: '40px', marginTop: '60px', marginBottom: '60px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h2 className="section-title" style={{ borderBottomColor: 'var(--navy)' }}>Programme de Mentorat</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444' }}>
                    Le réseau Notre Gabon regroupe des professionnels établis qui partagent une même vision. Nous mettons en relation des étudiants et de jeunes diplômés avec des mentors expérimentés pour les guider dans leurs choix de carrière, les aider à affiner leur projet professionnel et leur ouvrir des portes.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444', fontWeight: 'bold' }}>
                    Vous souhaitez être mentoré ou devenir mentor ?
                  </p>
                  <a href="mailto:mentorat@notregabon.org" className="btn-notre-gabon-square" style={{ background: 'var(--blue)', color: '#fff', display: 'inline-block', width: 'auto', marginTop: '10px' }}>
                    Rejoindre le programme <Users size={16} style={{ marginLeft: '6px', verticalAlign: 'text-bottom' }} />
                  </a>
                </div>
                <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
                  <img src={logoMentorat} alt="Mentorat Notre Gabon" style={{ width: '100%', maxWidth: '300px', objectFit: 'contain' }} />
                </div>
              </div>
            </section>

            {/* 3. Boîte à outils */}
            <section className="pro-section">
              <h2 className="section-title" style={{ borderBottomColor: 'var(--blue)' }}>Boîte à outils Carrière</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#555' }}>
                Des ressources gratuites préparées par notre équipe RH pour vous aider à décrocher votre prochain contrat.
              </p>

              <div className="outils-grid">

                <div className="outil-card">
                  <div className="outil-icon" style={{ background: 'var(--green)', color: '#fff' }}><FileText size={32} /></div>
                  <div className="outil-content">
                    <h3>Modèles de CV performants</h3>
                    <p>Formats ATS-friendly adaptés au marché local et international.</p>
                  </div>
                  <a href="#" className="outil-dl-btn" onClick={(e) => { e.preventDefault(); alert("Document PDF à charger !"); }}>
                    <Download size={20} />
                  </a>
                </div>

                <div className="outil-card">
                  <div className="outil-icon" style={{ background: 'var(--yellow)', color: '#fff' }}><FileText size={32} /></div>
                  <div className="outil-content">
                    <h3>Guide d'Entretien</h3>
                    <p>Les 20 questions les plus posées et comment y répondre efficacement.</p>
                  </div>
                  <a href="#" className="outil-dl-btn" onClick={(e) => { e.preventDefault(); alert("Document PDF à charger !"); }}>
                    <Download size={20} />
                  </a>
                </div>

                <div className="outil-card">
                  <div className="outil-icon" style={{ background: 'var(--blue)', color: '#fff' }}><ExternalLink size={32} /></div>
                  <div className="outil-content">
                    <h3>Optimiser son LinkedIn</h3>
                    <p>Checklist pour rendre votre profil attractif pour les recruteurs.</p>
                  </div>
                  <a href="#" className="outil-dl-btn" onClick={(e) => { e.preventDefault(); alert("Document PDF à charger !"); }}>
                    <Download size={20} />
                  </a>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default Professionnel;
