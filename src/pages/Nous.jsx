import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, Link as LinkIcon, Instagram, Youtube, Linkedin, MoveRight } from 'lucide-react';
import '../styles/pages/Nous.css';

const Nous = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    type_participation: 'bénévole',
    message: '',
    cv: null
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('envoi');
    
    // Simulation d'envoi API
    setTimeout(() => {
      setStatus('success');
      setFormData({ nom: '', email: '', type_participation: 'bénévole', message: '', cv: null });
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setFormData(prev => ({ ...prev, cv: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="nous-page-wrapper" itemscope itemtype="http://schema.org/Organization">
      <Navbar />
      
      {/* 1 -- Hero style SimplePage */}
      <div className="nous-page-hero">
        <div className="container">
          <span className="nous-page-tag">Notre association</span>
          <h1 className="nous-page-title">Nous</h1>
          <div className="nous-page-divider"></div>
        </div>
      </div>

      {/* 2 — Mission */}
      <section id="mission" className="nous-section" role="region" aria-labelledby="mission-title">
        <div className="nous-container">
          <h2 id="mission-title" className="nous-section-title">Notre Mission</h2>
          <div className="mission-grid">
            <div className="mission-left">
              <p className="mission-text-short">
                Donner aux jeunes Gabonais les moyens d’agir : information, formation et mise en réseau.
              </p>
            </div>
            <div className="mission-right">
              <p className="mission-text-long">
                Notre mission est d’offrir aux jeunes du Gabon des outils et des opportunités pour développer leurs compétences, 
                valoriser leurs initiatives et s’engager dans la vie civile et professionnelle. À travers des actions éducatives, 
                des événements, des productions média et des concours, nous créons des espaces d’apprentissage, de visibilité et d’échange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Vision & Valeurs */}
      <section id="vision-values" className="nous-section nous-section-grey" role="region" aria-labelledby="vision-title">
        <div className="nous-container">
          <div className="vision-box">
            <h2 id="vision-title" className="nous-section-title" style={{ color: '#fff' }}>Notre Vision</h2>
            <p>
              "Nous imaginons un Gabon où la jeunesse est actrice du changement — social, culturel et économique — 
              grâce à l’accès à l’information, à la formation et à des réseaux de soutien solides."
            </p>
          </div>
          
          <h3 className="nous-section-title centered">Nos Valeurs</h3>
          <div className="values-grid">
            <div className="value-card">
              <h3>Jeunesse</h3>
              <p>Toutes nos actions sont conçues par et pour les jeunes.</p>
            </div>
            <div className="value-card">
              <h3>Inclusion</h3>
              <p>Nous veillons à ce que chacun·e puisse participer, quel que soit son milieu.</p>
            </div>
            <div className="value-card">
              <h3>Créativité</h3>
              <p>Nous encourageons l’innovation culturelle et entrepreneuriale.</p>
            </div>
            <div className="value-card">
              <h3>Engagement</h3>
              <p>Nous agissons concrètement pour l’impact local.</p>
            </div>
            <div className="value-card">
              <h3>Transparence</h3>
              <p>Communication claire sur nos activités, partenaires et financements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Histoire */}
      <section id="history" className="nous-section" role="region" aria-labelledby="history-title">
        <div className="nous-container">
          <h2 id="history-title" className="nous-section-title centered">Notre Histoire</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-year">2024</div>
              <div className="timeline-content">Fondation de l’association à Libreville.</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-year">2025 – 2026</div>
              <div className="timeline-content">Lancement d’actions locales (ateliers scolaires, événements culturels, installations citoyennes).</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-year">2026</div>
              <div className="timeline-content">
                Mise en place de projets phares : Arbre à livres — Baie des Rois, ateliers langue maternelle, 
                Afterwork Premium, et le Concours « Créativité & Innovation ».
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Nos Actions */}
      <section id="actions" className="nous-section nous-section-grey" role="region" aria-labelledby="actions-title">
        <div className="nous-container">
          <h2 id="actions-title" className="nous-section-title">Nos Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-img">
                <img src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=1935&auto=format&fit=crop" alt="Arbre à livres" />
              </div>
              <div className="action-body">
                <span className="date">21/02/2026</span>
                <h3>Arbre à livres — Baie des Rois</h3>
                <p>Installation d’une boîte/abri pour l’échange de livres destiné aux habitants et aux écoles locales.</p>
                <a href="#" className="btn-link">En savoir plus <MoveRight size={16} /></a>
              </div>
            </div>
            <div className="action-card">
              <div className="action-img">
                <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop" alt="Langue maternelle" />
              </div>
              <div className="action-body">
                <span className="date">20/02/2026</span>
                <h3>Journée de la langue maternelle</h3>
                <p>Ateliers et animations en milieu scolaire pour la valorisation des langues locales.</p>
                <a href="#" className="btn-link">En savoir plus <MoveRight size={16} /></a>
              </div>
            </div>
            <div className="action-card">
              <div className="action-img">
                <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop" alt="Afterwork" />
              </div>
              <div className="action-body">
                <span className="date">06/03/2026</span>
                <h3>Afterwork Premium</h3>
                <p>Networking, animations ludiques (Roue Quiz) et échanges entre jeunes professionnels.</p>
                <a href="#" className="btn-link">En savoir plus <MoveRight size={16} /></a>
              </div>
            </div>
            <div className="action-card">
              <div className="action-img">
                <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop" alt="Concours Innovation" />
              </div>
              <div className="action-body">
                <span className="date">Clôture 12/04/2026</span>
                <h3>Concours Créativité & Innovation</h3>
                <p>Concours pour les 10–30 ans — prix : 50 000 FCFA. Inscriptions ouvertes.</p>
                <a href="#" className="btn-link">En savoir plus <MoveRight size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Équipe */}
      <section id="team" className="nous-section" role="region" aria-labelledby="team-title">
        <div className="nous-container">
          <h2 id="team-title" className="nous-section-title centered">L'Équipe</h2>
          <p style={{ textAlign: 'center', marginBottom: '50px', color: '#666' }}>
            Notre force : une équipe jeune, motivée et multidisciplinaire basée à Libreville.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-info">
                <h3>Ruth Alexia N.</h3>
                <span className="role">Coordination générale</span>
                <p className="bio">[Bio courte à compléter]</p>
              </div>
            </div>
            <div className="team-member">
              <div className="member-info">
                <h3>Loane Jeremie Ibinga</h3>
                <span className="role">Chargé·e de projets</span>
                <p className="bio">[Bio courte à compléter]</p>
              </div>
            </div>
            <div className="team-member">
              <div className="member-info">
                <h3>Mahendra Daniella A.</h3>
                <span className="role">Communication & médias</span>
                <p className="bio">[Bio courte à compléter]</p>
              </div>
            </div>
            <div className="team-member">
              <div className="member-info">
                <h3>Grâce Karla WANGA</h3>
                <span className="role">Partenariats & événements</span>
                <p className="bio">[Bio courte à compléter]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Partenaires */}
      <section id="partners" className="nous-section nous-section-grey" role="region" aria-labelledby="partners-title">
        <div className="nous-container">
          <h2 id="partners-title" className="nous-section-title centered">Soutiens & Partenaires</h2>
          <div className="contact-quick" style={{ opacity: 0.6, filter: 'grayscale(1)' }}>
             {/* Placeholders pour logos */}
             <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>OKANI ADVISORY</span>
             <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>DESIGN CONCEPT PLUS</span>
             <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>FMCT</span>
          </div>
        </div>
      </section>

      {/* 8 — Comment Participer & Formulaire */}
      <section id="participate" className="nous-section" role="region" aria-labelledby="participate-title">
        <div className="nous-container">
          <div className="participation-grid">
            <div className="participation-content">
              <h2 id="participate-title" className="nous-section-title">Comment Participer ?</h2>
              <div className="participation-cards">
                <div className="p-card">
                  <h3>Devenir bénévole</h3>
                  <p>Rejoignez nos équipes pour agir concrètement sur le terrain à Libreville.</p>
                </div>
                <div className="p-card">
                  <h3>Proposer un projet</h3>
                  <p>Vous avez une idée innovante ? Partagez votre pitch PDF avec nous.</p>
                </div>
                <div className="p-card">
                  <h3>Devenir partenaire</h3>
                  <p>Co-organisez des événements ou soutenez nos actions phares.</p>
                </div>
              </div>
            </div>
            
            <div className="participation-form-container">
              <form onSubmit={handleSubmit} className="p-form">
                <div className="form-group">
                  <label htmlFor="nom">Nom complet</label>
                  <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Votre nom" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@exemple.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="type_participation">Objet de votre demande</label>
                  <select id="type_participation" name="type_participation" value={formData.type_participation} onChange={handleChange}>
                    <option value="bénévole">Devenir bénévole</option>
                    <option value="proposer projet">Proposer un projet</option>
                    <option value="partenaire">Devenir partenaire</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" required placeholder="Comment souhaitez-vous nous aider ?"></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="cv">CV (optionnel, max 10MB)</label>
                  <input type="file" id="cv" name="cv" onChange={handleChange} accept=".pdf,.doc,.docx" />
                </div>
                <button type="submit" className="btn-notre-gabon" disabled={status === 'envoi'}>
                  {status === 'envoi' ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
                {status === 'success' && <p style={{ color: 'var(--green, #3AA935)', fontWeight: '700', marginTop: '10px' }}>Merci, nous avons bien reçu votre demande.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 9 — Stats & Contact */}
      <aside id="stats-contact" className="nous-section nous-section-grey">
        <div className="nous-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="number">~1 000</span>
              <span className="label">Abonnés LinkedIn</span>
            </div>
            <div className="stat-item">
              <span className="number">~5 000</span>
              <span className="label">Abonnés Instagram</span>
            </div>
            <div className="stat-item">
              <span className="number">~6 000</span>
              <span className="label">Abonnés TikTok</span>
            </div>
            <div className="stat-item">
              <span className="number">~4 000</span>
              <span className="label">Abonnés YouTube</span>
            </div>
          </div>
          
          <div className="contact-quick">
            <a href="mailto:notregabon@gmail.com" className="contact-link"><Mail size={24} color="var(--blue, #0072CE)" /> notregabon@gmail.com</a>
            <a href="tel:074599460" className="contact-link"><Phone size={24} color="var(--green, #3AA935)" /> 074599460</a>
            <a href="https://linktr.ee/Notregabon" target="_blank" rel="noopener noreferrer" className="contact-link"><LinkIcon size={24} color="var(--yellow, #FCD116)" /> Linktree</a>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Nous;
