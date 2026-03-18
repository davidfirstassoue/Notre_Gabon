import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

function AdminDashboardHome() {
  const [counts, setCounts] = useState({ 
    slides: 0, 
    articles: 0, 
    visitors: 0, 
    donors: 0, 
    volunteers: 0 
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [slidesRes, articlesRes, visitorsRes, donorsRes, volunteersRes] = await Promise.all([
          supabase.from('site_content').select('id', { count: 'exact', head: true }).eq('section_key', 'hero'),
          supabase.from('articles').select('id', { count: 'exact', head: true }),
          supabase.from('visitors').select('id', { count: 'exact', head: true }),
          supabase.from('donations').select('id', { count: 'exact', head: true }),
          supabase.from('volunteers').select('id', { count: 'exact', head: true }),
        ]);

        setCounts({
          slides: slidesRes.count || 0,
          articles: articlesRes.count || 0,
          visitors: visitorsRes.count || 0,
          donors: donorsRes.count || 0,
          volunteers: volunteersRes.count || 0,
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <>
      {/* En-tête de bienvenue */}
      <div className="admin-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--navy) 0%, #2a2880 100%)', color: '#fff', padding: '28px 32px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 800 }}>Bienvenue dans l'administration</h3>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
          Gérez le contenu de votre site Notre Gabon depuis ce tableau de bord.
        </p>
      </div>

      {/* Statistiques - Ligne 1 */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{counts.slides}</div>
          <div className="admin-stat-label">Bannières Hero</div>
        </div>
        <div className="admin-stat-card yellow">
          <div className="admin-stat-value">{counts.articles}</div>
          <div className="admin-stat-label">Articles publiés</div>
        </div>
        <div className="admin-stat-card blue">
          <div className="admin-stat-value">1</div>
          <div className="admin-stat-label">Administrateur actif</div>
        </div>
      </div>

      {/* Statistiques - Ligne 2 (Nouvelles) */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{counts.visitors}</div>
          <div className="admin-stat-label">Visiteurs du site</div>
        </div>
        <div className="admin-stat-card yellow">
          <div className="admin-stat-value">{counts.donors}</div>
          <div className="admin-stat-label">Donneurs</div>
        </div>
        <div className="admin-stat-card blue">
          <div className="admin-stat-value">{counts.volunteers}</div>
          <div className="admin-stat-label">Bénévoles</div>
        </div>
      </div>

      {/* Raccourcis */}
      <div className="admin-card">
        <h3 className="admin-card-title">Accès rapide</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
          <NavLink to="/admin/bannieres" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
            Gérer les bannières
          </NavLink>
          <NavLink to="/admin/articles" className="admin-btn" style={{ background: 'var(--navy)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
            Gérer les articles
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardHome;
