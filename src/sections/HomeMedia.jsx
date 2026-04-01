import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ExternalLink, Newspaper } from 'lucide-react';
import '../styles/pages/Media.css';
import '../styles/sections/Actualites.css';
import '../styles/sections/HomeSections.css';

function HomeMedia() {
  const [communiques, setCommuniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommuniques();
  }, []);

  const fetchCommuniques = async () => {
    try {
      const { data, error } = await supabase
        .from('communiques_presse')
        .select('*')
        .order('date_publication', { ascending: false })
        .limit(4);
      if (!error && data) setCommuniques(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const CommuniqueRow = ({ item }) => (
    <div className="communique-row">
      <div className="cp-date">
        <span className="cp-day">
          {item.date_publication ? new Date(item.date_publication).toLocaleDateString('fr-FR', { day: '2-digit' }) : '--'}
        </span>
        <span className="cp-month">
          {item.date_publication ? new Date(item.date_publication).toLocaleDateString('fr-FR', { month: 'short' }) : ''}
        </span>
        <span className="cp-year">
          {item.date_publication ? new Date(item.date_publication).getFullYear() : ''}
        </span>
      </div>
      <div className="cp-content">
        <h3>{item.titre}</h3>
        {item.resume && <p>{item.resume}</p>}
      </div>
      <div className="cp-action">
        <a
          href={item.url_document}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-notre-gabon-square"
          style={{ background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', width: 'auto' }}
        >
          Lire <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );

  return (
    <section className="home-section home-media-section">
      <div className="home-section-container">
        <div className="actualites-header">
          <div className="actualites-header-left">
            <span className="section-tag" style={{ color: 'var(--navy)' }}>Espace Presse</span>
            <h2 className="section-title">Derniers Communiqués</h2>
          </div>
          <Link to="/media" className="actualites-voir-plus">Voir tout →</Link>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Chargement des archives...</p>
        ) : communiques.length > 0 ? (
          <div className="communiques-list">
            {communiques.map((c) => (
              <CommuniqueRow key={c.id} item={c} />
            ))}
          </div>
        ) : (
          <div className="media-empty">
            <Newspaper size={40} style={{ color: '#ccc', marginBottom: '15px' }} />
            <h3>Aucun communiqué officiel</h3>
            <p>Les prochains communiqués publiés par le bureau exécutif apparaîtront ici.</p>
          </div>
        )}


      </div>
    </section>
  );
}

export default HomeMedia;
