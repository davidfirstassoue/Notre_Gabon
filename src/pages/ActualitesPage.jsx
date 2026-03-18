import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/sections/Actualites.css'; // On importe le CSS original
import '../styles/pages/ActualitesPage.css'; // On garde que la mise en page (grid)

// Réutilisation du formatage de date
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Composant Carte
function NewsCard({ article }) {
  return (
    <article className="actu-card">
      <Link to={`/actualites/${article.id}`} className="actu-card-link">
        <div className="actu-card-img">
          <img src={article.image_url || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80'} alt={article.title} />
          {article.category && <span className="actu-tag">{article.category}</span>}
        </div>
        <div className="actu-card-body">
          {article.category && <span className="actu-tag-mobile">{article.category}</span>}
          <h3 className="actu-card-title">{article.title}</h3>
          <p className="actu-card-excerpt">{article.excerpt}</p>
          <time className="actu-card-date">{formatDate(article.created_at)}</time>
        </div>
      </Link>
    </article>
  );
}

function ActualitesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setArticles(data);
      } else {
        // Fallback local au cas où la base est vide (pour le développement)
        setArticles([
          { id: '1', title: 'Notre Gabon : ensemble pour un avenir meilleur', excerpt: 'Découvrez comment notre ONG œuvre pour le développement durable.', image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80', category: 'Mission', created_at: new Date().toISOString() },
          { id: '2', title: 'Éducation et jeunesse', excerpt: 'Des ateliers pour donner aux jeunes Gabonais les outils dont ils ont besoin.', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', category: 'Éducation', created_at: new Date().toISOString() },
        ]);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  return (
    <>
      <Navbar />
      <main className="actualites-page-container">
        {/* En-tête style SimplePage */}
        <div className="actu-page-hero">
          <div className="container">
            <span className="actu-page-tag">Nos nouvelles</span>
            <h1 className="actu-page-title">Actualités</h1>
            <div className="actu-page-divider"></div>
          </div>
        </div>

        <section className="actualites-page-content">
          <div className="container">
            {loading ? (
              <div className="loading-spinner">Chargement des articles...</div>
            ) : (
              <div className="news-grid">
                {articles.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default ActualitesPage;
