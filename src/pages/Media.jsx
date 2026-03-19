import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import '../styles/pages/SimplePage.css';
import '../styles/pages/Media.css';
import { Mail, Phone, ExternalLink, Download, PlayCircle, Instagram } from 'lucide-react';

function Media() {
  const [communiques, setCommuniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  // Teasers
  const [plateformes, setPlateformes] = useState([]);
  const [loadingPlates, setLoadingPlates] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCommuniques();
    fetchPlateformes();
  }, []);

  const fetchCommuniques = async () => {
    setLoading(true);
    setDbError(false);
    try {
      const { data, error } = await supabase
        .from('communiques_presse')
        .select('*')
        .order('date_publication', { ascending: false });

      if (error) {
        if (error.code === '42P01') setDbError(true);
        else console.error(error);
      } else if (data) {
        setCommuniques(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchPlateformes = async () => {
    setLoadingPlates(true);
    try {
      const { data, error } = await supabase.from('plateformes_media').select('*');
      if (!error && data) {
        setPlateformes(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingPlates(false);
  };

  const CommuniqueRow = ({ item }) => {
    return (
      <div className="communique-row">
        <div className="cp-date">
          <span className="cp-day">{item.date_publication ? new Date(item.date_publication).toLocaleDateString('fr-FR', { day: '2-digit' }) : '--'}</span>
          <span className="cp-month">{item.date_publication ? new Date(item.date_publication).toLocaleDateString('fr-FR', { month: 'short' }) : ''}</span>
          <span className="cp-year">{item.date_publication ? new Date(item.date_publication).getFullYear() : ''}</span>
        </div>
        <div className="cp-content">
          <h3>{item.titre}</h3>
          {item.resume && <p>{item.resume}</p>}
        </div>
        <div className="cp-action">
          <a href={item.url_document} target="_blank" rel="noopener noreferrer" className="btn-notre-gabon-square" style={{ background: 'var(--yellow)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', width: 'auto' }}>
            Lire <ExternalLink size={16} />
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
          
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--yellow)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Espace Média</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--yellow)'}}></div>
          </div>
          
          <div className="simple-page-content">
            
            <p className="media-intro">
              Bienvenue dans l'espace presse de Notre Gabon. Journalistes, créateurs de contenus et partenaires, retrouvez ici nos déclarations officielles, communiqués de presse et nos plateformes de diffusion de contenus vidéos et photos.
            </p>

            {/* 1. CONTACTS PRESSE (Statique) */}
            <section className="media-section" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '60px' }}>
              <div className="contact-presse-card" style={{ flex: 1, minWidth: '300px', borderLeftColor: 'var(--yellow)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={24} color="var(--yellow)" /> Contact Presse</h3>
                <p>Pour toute demande d'interview, accréditation ou reportage.</p>
                <a href="mailto:presse@notregabon.org" className="cp-link">presse@notregabon.org</a>
              </div>
              <div className="contact-presse-card" style={{ flex: 1, minWidth: '300px', borderLeftColor: 'var(--green)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={24} color="var(--green)" /> Relations Publiques</h3>
                <p>Cellule de communication et porte-parolat.</p>
                <a href="tel:+2410000000" className="cp-link">+241 XX XX XX XX</a>
              </div>
            </section>

            {/* 2. COMMUNIQUÉS DE PRESSE (Dynamique) */}
            <section className="media-section" style={{ marginBottom: '80px' }}>
              <h2 className="section-title" style={{ borderBottomColor: 'var(--navy)' }}>Derniers Communiqués</h2>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: '#666' }}>Chargement des archives...</p></div>
              ) : dbError ? (
                <div className="media-empty error">
                  <h3>Installation requise</h3>
                  <p>La base de données des communiqués de presse n'est pas encore configurée.</p>
                </div>
              ) : communiques.length > 0 ? (
                <div className="communiques-list">
                  {communiques.map(c => <CommuniqueRow key={c.id} item={c} />)}
                </div>
              ) : (
                <div className="media-empty">
                  <h3>Aucun communiqué officiel</h3>
                  <p>Les prochains communiqués de presse publiés par le bureau exécutif apparaîtront ici.</p>
                </div>
              )}
            </section>

            {/* 3. NOS PLATEFORMES (Teasers YouTube & Insta) */}
            <section className="media-section bg-light-gray" style={{ padding: '50px 0' }}>
               <div style={{ padding: '0 30px' }}>
                <h2 className="section-title" style={{ borderBottomColor: 'var(--red, #e52d27)' }}>Nos autres plateformes</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#555' }}>
                  Abonnez-vous à nos chaînes pour revivre nos événements de l'intérieur et suivre nos reportages.
                </p>

                <div className="teasers-grid">
                  
                  {loadingPlates ? (
                     <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Chargement des plateformes...</p>
                  ) : plateformes.length === 0 ? (
                     <p style={{ textAlign: 'center', width: '100%', color: '#999', fontStyle: 'italic' }}>Aucune plateforme configurée.</p>
                  ) : (
                    plateformes.map((pf) => {
                      const isIg = pf.type_plateforme === 'Instagram';
                      const defaultImg = isIg ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      const bgImg = pf.image_fond ? pf.image_fond : defaultImg;

                      return (
                        <div className="teaser-card" key={pf.id}>
                          <a href={pf.lien_url} target="_blank" rel="noopener noreferrer" className="teaser-thumb-wrapper">
                            <div className="teaser-thumb" style={{ backgroundImage: `url(${bgImg})` }}>
                              <div className={`play-overlay ${isIg ? 'ig-overlay' : ''}`}>
                                {isIg ? <Instagram size={50} color="#fff" strokeWidth={1.5} /> : <PlayCircle size={60} color="#fff" strokeWidth={1.5} />}
                              </div>
                            </div>
                          </a>
                          <div className="teaser-content">
                            <h3 style={{ borderLeft: `4px solid ${isIg ? '#E1306C' : '#FF0000'}`, paddingLeft: '10px' }}>{pf.titre}</h3>
                            <p>{pf.description}</p>
                            <a href={pf.lien_url} target="_blank" rel="noopener noreferrer" className={`teaser-link ${isIg ? 'instagram-link' : 'youtube-link'}`}>
                              {isIg ? "Rejoindre sur Instagram" : "Visiter la plateforme"} <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}

                </div>
               </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default Media;
