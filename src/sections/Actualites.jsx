import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/sections/Actualites.css';

/* ─── Placeholder articles pour quand la DB est vide ─ */
const PLACEHOLDER_ARTICLES = [
  {
    id: 'p1',
    title: 'Notre Gabon : ensemble pour un avenir meilleur',
    excerpt: 'Découvrez comment notre ONG œuvre pour le développement durable et le bien-être des communautés gabonaises.',
    image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80',
    category: 'Mission',
    created_at: new Date().toISOString(),
    featured: true,
  },
  {
    id: 'p2',
    title: 'Éducation et jeunesse : nos programmes de formation',
    excerpt: 'Des ateliers pour donner aux jeunes Gabonais les outils dont ils ont besoin.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    category: 'Éducation',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    title: 'Santé communautaire : nos actions de terrain',
    excerpt: 'Accès aux soins et sensibilisation dans les zones rurales du Gabon.',
    image_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80',
    category: 'Santé',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p4',
    title: 'Environnement et biodiversité au Gabon',
    excerpt: 'Protection de la forêt gabonaise et sensibilisation climatique.',
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    category: 'Environnement',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p5',
    title: 'Autonomisation des femmes : témoignages',
    excerpt: 'Des initiatives concrètes pour renforcer le rôle des femmes dans la société.',
    image_url: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=600&q=80',
    category: 'Société',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p6',
    title: 'Collecte de fonds : rejoignez notre cause',
    excerpt: 'Votre don peut changer des vies. Soutenez les projets de Notre Gabon.',
    image_url: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80',
    category: 'Soutien',
    created_at: new Date().toISOString(),
  },
];

/* ─── Utilitaire : formater la date en français ─── */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ─── Composant carte article standard ─── */
function ArticleCard({ article, variant = 'small' }) {
  return (
    <article className={`actu-card actu-card--${variant}`}>
      <div className="actu-card-img">
        <img src={article.image_url || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80'} alt={article.title} />
        {article.category && <span className="actu-tag">{article.category}</span>}
      </div>
      <div className="actu-card-body">
        {article.category && <span className="actu-tag-mobile">{article.category}</span>}
        <h3 className="actu-card-title">{article.title}</h3>
        {variant !== 'stacked' && article.excerpt && (
          <p className="actu-card-excerpt">{article.excerpt}</p>
        )}
        <time className="actu-card-date">{formatDate(article.created_at)}</time>
      </div>
    </article>
  );
}

/* ─── Composant article en vedette (grand) ─── */
function FeaturedArticle({ article }) {
  return (
    <article className="actu-featured">
      <div className="actu-featured-img">
        <img src={article.image_url || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&q=80'} alt={article.title} />
        {article.category && <span className="actu-tag">{article.category}</span>}
        <div className="actu-featured-overlay" />
      </div>
      <div className="actu-featured-content">
        {article.category && <span className="actu-tag-mobile">{article.category}</span>}
        <h2 className="actu-featured-title">{article.title}</h2>
        <time className="actu-card-date">{formatDate(article.created_at)}</time>
      </div>
    </article>
  );
}

/* ─── Composant article empilé (droite du featured) ─── */
function StackedArticle({ article }) {
  return (
    <article className="actu-stacked">
      <div className="actu-stacked-img">
        <img src={article.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80'} alt={article.title} />
        {article.category && <span className="actu-tag actu-tag--small">{article.category}</span>}
        <div className="actu-stacked-overlay" />
      </div>
      <div className="actu-stacked-content">
        {article.category && <span className="actu-tag-mobile actu-tag-mobile--small">{article.category}</span>}
        <h3 className="actu-stacked-title">{article.title}</h3>
        <time className="actu-card-date">{formatDate(article.created_at)}</time>
      </div>
    </article>
  );
}

/* ─── Section principale ─── */
function Actualites() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (data && data.length > 0) {
        setArticles(data);
      } else {
        // Utilise les placeholders si aucun article en DB
        setArticles(PLACEHOLDER_ARTICLES);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) return (
    <section className="actualites-section">
      <div className="container">
        <div className="actualites-loading">Chargement des actualités…</div>
      </div>
    </section>
  );

  const [featured, ...rest] = articles;
  const stacked = rest.slice(0, 2);
  const cards = rest.slice(2, 5);

  return (
    <section className="actualites-section">
      <div className="container">

        {/* ── En-tête de section ── */}
        <div className="actualites-header">
          <div className="actualites-header-left">
            <span className="section-tag">Actualités</span>
            <h2 className="section-title">Dernières nouvelles</h2>
          </div>
          <a href="#" className="actualites-voir-plus">Voir tout →</a>
        </div>

        {/* ── Grille principale : featured + empilés ── */}
        {featured && (
          <div className="actualites-top-grid">
            <FeaturedArticle article={featured} />
            <div className="actualites-stacked-col">
              {stacked.map((a) => (
                <StackedArticle key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}

        {/* ── Rangée de 3 cartes ── */}
        {cards.length > 0 && (
          <div className="actualites-cards-row">
            {cards.map((a) => (
              <ArticleCard key={a.id} article={a} variant="small" />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Actualites;
