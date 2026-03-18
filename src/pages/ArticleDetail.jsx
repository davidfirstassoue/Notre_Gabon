import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Facebook, Twitter, Linkedin, Clock, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/pages/ArticleDetail.css';

// Liste de secours (la même que dans ActualitesPage.jsx)
const FALLBACK_ARTICLES = [
  { id: '1', title: 'Notre Gabon : ensemble pour un avenir meilleur', excerpt: 'Découvrez comment notre ONG...', content: 'Contenu complet de l\'article 1. Voici les détails sur nos actions et notre mission...', image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80', category: 'Mission', created_at: new Date().toISOString() },
  { id: '2', title: 'Éducation et jeunesse', excerpt: 'Des ateliers pour donner aux jeunes...', content: 'Contenu complet de l\'article 2 sur l\'éducation...', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', category: 'Éducation', created_at: new Date().toISOString() },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Helper function to format content for dangerouslySetInnerHTML
function formatContent(content) {
  if (!content) return '<p>Aucun contenu détaillé n\'a été fourni pour cet article.</p>';
  // Replace double newlines with paragraph tags, single newlines with <br>
  // This is a basic conversion; for rich text, a proper markdown parser or HTML sanitizer would be needed.
  return content
    .split(/\n\s*\n/) // Split by two or more newlines (paragraph breaks)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`) // Replace single newlines with <br> within paragraphs
    .join('');
}

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top
    const fetchArticle = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setArticle(data);
        }

        // Fetch articles récents pour la sidebar (exclure l'actuel)
        const { data: recent } = await supabase
          .from('articles')
          .select('id, title, image_url, created_at')
          .neq('id', id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (recent && recent.length > 0) {
          setRecentArticles(recent);
        } else {
          setRecentArticles(FALLBACK_ARTICLES.filter(a => a.id !== id));
        }

      } catch (error) {
        console.warn('Article introuvable en DB, recherche dans le fallback...', error);
        // Fallback pour le dev ou si l'API échoue
        const fallbackMatch = FALLBACK_ARTICLES.find(a => a.id === id);
        if (fallbackMatch) {
          setArticle(fallbackMatch);
          setRecentArticles(FALLBACK_ARTICLES.filter(a => a.id !== id));
        } else {
          // Article non trouvé
          setArticle(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="article-detail-container">
          <div className="container loading-state">
            <div className="spinner"></div>
            <p>Chargement de l'article...</p>
          </div>
        </main>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="article-detail-container">
          <div className="container not-found-state">
            <h2>Article introuvable</h2>
            <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <button onClick={() => navigate('/actualites')} className="btn-back">
              <ArrowLeft size={18} /> Retour aux actualités
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="article-detail-container">
        {/* En-tête de l'article avec image complète */}
        <header className="article-header-new">
          <div className="container">
            <h1 className="article-title">{article.title}</h1>
          </div>
          
          <div className="article-main-image-container">
            <img 
              src={article.image_url || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600'} 
              alt={article.title} 
              className="article-full-img"
            />
          </div>

          <div className="container">
            <div className="article-meta-bottom">
              <span className="article-date">
                Publié le {formatDate(article.created_at)}
              </span>
              {article.category && (
                <span className="article-category-badge">
                  {article.category}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Corps de l'article en 3 colonnes */}
        <section className="article-body-section">
          <div className="container article-layout">
            
            {/* Colonne de Gauche : Partage et Stats */}
            <aside className="article-sidebar-left">
              <div className="sidebar-sticky-box">
                <div className="sidebar-meta-item">
                  <Clock size={16} />
                  <span>Lecture : ~3 min</span>
                </div>
                
                <h4 className="sidebar-title">Partager cet article</h4>
                <div className="social-share-links">
                  <a href="#" className="share-btn fb"><Facebook size={18} /></a>
                  <a href="#" className="share-btn tw"><Twitter size={18} /></a>
                  <a href="#" className="share-btn in"><Linkedin size={18} /></a>
                </div>
              </div>
            </aside>

            {/* Colonne Centrale : Contenu principal */}
            <article className="article-main-content">
              {article.excerpt && (
                <div className="article-excerpt">
                  {article.excerpt}
                </div>
              )}
              <div 
                className="article-text"
                dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
              />
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

                {/* Articles recommandés */}
                {recentArticles.length > 0 && (
                  <div className="sidebar-recent-articles">
                    <h4 className="sidebar-title">À lire aussi</h4>
                    <div className="recent-list">
                      {recentArticles.map(recent => (
                        <Link to={`/actualites/${recent.id}`} key={recent.id} className="recent-item">
                          <div className="recent-img-wrapper">
                            <img 
                              src={recent.image_url || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400'} 
                              alt={recent.title} 
                            />
                            <div className="recent-overlay"></div>
                          </div>
                          <div className="recent-info">
                            <h5>{recent.title}</h5>
                            <span className="recent-date">{formatDate(recent.created_at)}</span>
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

export default ArticleDetail;
