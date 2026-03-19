import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import '../styles/pages/SimplePage.css';
import '../styles/pages/Evenements.css';

function Evenements() {
  const [evenementsFuturs, setEvenementsFuturs] = useState([]);
  const [evenementsPasses, setEvenementsPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvenements();
  }, []);

  const fetchEvenements = async () => {
    setLoading(true);
    setDbError(false);
    
    try {
      // Pour éviter les erreurs si la table n'existe pas encore
      const { data, error } = await supabase
        .from('evenements')
        .select('*')
        .order('date_evenement', { ascending: true }); // Du plus proche au plus lointain par défaut

      if (error) {
        if (error.code === '42P01') setDbError(true); // Table does not exist
        else console.error('Erreur chargement événements:', error);
      } else if (data) {
        // Séparer les événements
        const futurs = data.filter(e => !e.est_passe);
        const passes = data.filter(e => e.est_passe).reverse(); // Pour les passés, on veut du plus récent au plus ancien
        
        setEvenementsFuturs(futurs);
        setEvenementsPasses(passes);
      }
    } catch (err) {
      console.error('Erreur catchée:', err);
    }
    
    setLoading(false);
  };

  // Composant Carte Événement
  const EventCard = ({ event }) => {
    const dateStr = new Date(event.date_evenement).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    return (
      <div className="event-card">
        <div className="event-image">
          {event.image_url ? (
            <img src={event.image_url} alt={event.titre} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0', color: '#888' }}>
              <Calendar size={48} />
            </div>
          )}
          <div className={`event-badge ${event.est_passe ? 'passe' : ''}`}>
            {event.est_passe ? 'Passé' : 'À venir'}
          </div>
        </div>
        
        <div className="event-content">
          <div className="event-date-lieu">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> <span style={{ textTransform: 'capitalize' }}>{dateStr}</span>
            </span>
            {event.lieu && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555' }}>
                <MapPin size={16} /> {event.lieu}
              </span>
            )}
          </div>
          
          <h3>{event.titre}</h3>
          
          {event.description && (
            <p>{event.description}</p>
          )}

          {(!event.est_passe && event.lien_inscription) && (
            <a href={event.lien_inscription} target="_blank" rel="noopener noreferrer" className="btn-notre-gabon-event" style={{ marginTop: 'auto' }}>
              S'inscrire <ExternalLink size={16} style={{ marginLeft: '6px', verticalAlign: 'text-bottom' }} />
            </a>
          )}
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
            <span className="section-tag" style={{color: 'var(--green)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Événements</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--green)'}}></div>
          </div>
          
          <div className="simple-page-content">
            {/* Affichage des erreurs / chargement */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Chargement des événements...</p>
              </div>
            ) : dbError ? (
              <div className="events-empty" style={{ borderTopColor: '#ff4d4f' }}>
                <h3>Configuration requise</h3>
                <p>La base de données pour les événements est en cours de configuration par l'administrateur.</p>
              </div>
            ) : (
              <>
                {/* Section À Venir */}
                <section style={{ marginBottom: '60px' }}>
                  <h2 className="section-title">Prochainement</h2>
                  
                  {evenementsFuturs.length > 0 ? (
                    <div className="evenements-grid">
                      {evenementsFuturs.map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="events-empty">
                      <h3>Aucun événement prévu pour l'instant</h3>
                      <p>Restez connectés sur nos réseaux sociaux pour ne pas manquer nos prochaines annonces !</p>
                    </div>
                  )}
                </section>

                {/* Section Passés */}
                {evenementsPasses.length > 0 && (
                  <section>
                    <h2 className="section-title" style={{ borderColor: 'var(--blue)' }}>Nos actions passées</h2>
                    <div className="evenements-grid">
                      {evenementsPasses.map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Evenements;
