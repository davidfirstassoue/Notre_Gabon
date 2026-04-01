import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Calendar, MapPin } from 'lucide-react';
import '../styles/pages/Evenements.css';
import '../styles/sections/Actualites.css';
import '../styles/sections/HomeSections.css';

function HomeEvenements() {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvenements();
  }, []);

  const fetchEvenements = async () => {
    try {
      const { data, error } = await supabase
        .from('evenements')
        .select('*')
        .order('date_evenement', { ascending: true })
        .limit(3);
      if (!error && data) setEvenements(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const EventCard = ({ event }) => {
    const dateStr = new Date(event.date_evenement).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="event-card">
        <Link to={`/evenements/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="event-image">
            {event.image_url ? (
              <img src={event.image_url} alt={event.titre} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8eaf0', color: '#aaa' }}>
                <Calendar size={48} />
              </div>
            )}
            <div className={`event-badge ${event.est_passe ? 'passe' : ''}`}>
              {event.est_passe ? 'Passé' : 'À venir'}
            </div>
          </div>
        </Link>
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
          <Link to={`/evenements/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{event.titre}</h3>
          </Link>
          {event.description && <p>{event.description}</p>}
        </div>
      </div>
    );
  };

  return (
    <section className="home-section home-evenements-section">
      <div className="home-section-container">
        <div className="actualites-header">
          <div className="actualites-header-left">
            <span className="section-tag" style={{ color: 'var(--green)' }}>Agenda</span>
            <h2 className="section-title">Nos accomplissements</h2>
          </div>
          <Link to="/evenements" className="actualites-voir-plus">Voir tout →</Link>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Chargement des événements...</p>
        ) : evenements.length > 0 ? (
          <div className="evenements-grid">
            {evenements.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="events-empty">
            <h3>Aucun événement prévu pour l'instant</h3>
            <p>Restez connectés sur nos réseaux pour ne pas manquer nos prochaines annonces !</p>
          </div>
        )}


      </div>
    </section>
  );
}

export default HomeEvenements;
