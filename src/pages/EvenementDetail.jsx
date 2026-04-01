import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Facebook, Twitter, Linkedin, Calendar, MapPin, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/EvenementDetail.css';

const FALLBACK_EVENTS = [
  { id: '1', titre: 'Marche pour l\'environnement', description: 'Une grande marche de sensibilisation...', lieu: 'Libreville', date_evenement: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200', est_passe: false, lien_inscription: '#' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatContent(content) {
  if (!content) return '';
  return content
    .split(/\n\s*\n/)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function EvenementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evenement, setEvenement] = useState(null);
  const [recentEvenements, setRecentEvenements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvent = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('evenements')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setEvenement(data);
        }

        const { data: recent } = await supabase
          .from('evenements')
          .select('id, titre, image_url, date_evenement, est_passe')
          .neq('id', id)
          .order('date_evenement', { ascending: false })
          .limit(3);
          
        if (recent && recent.length > 0) {
          setRecentEvenements(recent);
        } else {
          setRecentEvenements(FALLBACK_EVENTS.filter(e => e.id !== id));
        }

      } catch (error) {
        console.warn('Evénement introuvable en DB, recherche dans le fallback...', error);
        const fallbackMatch = FALLBACK_EVENTS.find(e => e.id === id);
        if (fallbackMatch) {
          setEvenement(fallbackMatch);
          setRecentEvenements(FALLBACK_EVENTS.filter(e => e.id !== id));
        } else {
          setEvenement(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="evenement-detail-container">
          <div className="container loading-state">
            <div className="spinner"></div>
            <p>Chargement de l'événement...</p>
          </div>
        </main>
      </>
    );
  }

  if (!evenement) {
    return (
      <>
        <Navbar />
        <main className="evenement-detail-container">
          <div className="container not-found-state">
            <h2>Événement introuvable</h2>
            <p>L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
            <button onClick={() => navigate('/evenements')} className="btn-back">
              <ArrowLeft size={18} /> Retour aux événements
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="evenement-detail-container">
        {/* En-tête de l'événement avec image complète */}
        <header className="evenement-header-new">
          <div className="container">
            <h1 className="evenement-title">{evenement.titre}</h1>
          </div>
          
          <div className="evenement-main-image-container">
            <img 
              src={evenement.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600'} 
              alt={evenement.titre} 
              className="evenement-full-img"
            />
          </div>

          <div className="container">
            <div className="evenement-meta-bottom">
              <span className="evenement-category-badge" style={{ background: evenement.est_passe ? '#333' : 'var(--green)' }}>
                {evenement.est_passe ? 'Passé' : 'À venir'}
              </span>
              
              <div className="evenement-info-item">
                <Calendar size={18} />
                <span style={{ textTransform: 'capitalize' }}>{formatDate(evenement.date_evenement)}</span>
              </div>

              {evenement.lieu && (
                <div className="evenement-info-item">
                  <MapPin size={18} />
                  <span>{evenement.lieu}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Corps de l'événement en 3 colonnes */}
        <section className="evenement-body-section">
          <div className="container evenement-layout">
            
            {/* Colonne de Gauche : Partage et Stats */}
            <aside className="article-sidebar-left">
              <div className="sidebar-sticky-box">
                <h4 className="sidebar-title">Partager</h4>
                <div className="social-share-links">
                  <a href="#" className="share-btn fb"><Facebook size={18} /></a>
                  <a href="#" className="share-btn tw"><Twitter size={18} /></a>
                  <a href="#" className="share-btn in"><Linkedin size={18} /></a>
                </div>
              </div>
            </aside>

            {/* Colonne Centrale : Contenu principal */}
            <article className="evenement-main-content">
              {/* Le contenu de l'événement utilise la clé 'description' ou un contenu enrichi */}
              {evenement.description && (
                <div className="evenement-text" dangerouslySetInnerHTML={{ __html: formatContent(evenement.description) }} />
              )}
              
              {(!evenement.description) && (
                 <div className="evenement-text"><p>Aucun détail supplémentaire n'a été fourni pour cet événement.</p></div>
              )}
              
              {!evenement.est_passe && evenement.lien_inscription && (
                <div style={{ marginTop: '40px' }}>
                  <a href={evenement.lien_inscription} target="_blank" rel="noopener noreferrer" className="btn-evenement-register">
                    S'inscrire à cet événement <ExternalLink size={18} style={{ marginLeft: '8px', verticalAlign: 'text-bottom' }} />
                  </a>
                </div>
              )}

            </article>

            {/* Colonne de Droite : Call to action & À lire aussi */}
            <aside className="article-sidebar-right">
              <div className="sidebar-sticky-box">
                
                {/* Boîte d'action (Soutien/Bénévolat) */}
                <div className="sidebar-action-box">
                  <h4 className="action-title">Agir avec nous</h4>
                  <p className="action-text">Votre engagement fait la différence sur le terrain au Gabon.</p>
                  <Link to="/benevolat" className="action-btn">Devenir Bénévole</Link>
                </div>

                {/* Événements recommandés */}
                {recentEvenements.length > 0 && (
                  <div className="sidebar-recent-articles">
                    <h4 className="sidebar-title">Autres événements</h4>
                    <div className="recent-list">
                      {recentEvenements.map(recent => (
                        <Link to={`/evenements/${recent.id}`} key={recent.id} className="recent-item">
                          <div className="recent-img-wrapper">
                            <img 
                              src={recent.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'} 
                              alt={recent.titre} 
                            />
                            <div className="recent-overlay"></div>
                          </div>
                          <div className="recent-info">
                            <h5>{recent.titre}</h5>
                            <span className="recent-date" style={{ textTransform: 'capitalize' }}>
                              {new Date(recent.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </aside>

          </div>
        </section>
      </main>
    </>
  );
}

export default EvenementDetail;
