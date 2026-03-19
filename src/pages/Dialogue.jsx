import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import '../styles/pages/SimplePage.css';
import '../styles/pages/Dialogue.css';
import { MessageSquare, Calendar, MapPin, Download, Users, Lightbulb } from 'lucide-react';

function Dialogue() {
  const [debats, setDebats] = useState([]);
  const [loadingDebats, setLoadingDebats] = useState(true);
  const [dbError, setDbError] = useState(false);

  // Formulaire Boite à Idées
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDebats();
  }, []);

  const fetchDebats = async () => {
    setLoadingDebats(true);
    setDbError(false);
    try {
      const { data, error } = await supabase
        .from('debats_citoyens')
        .select('*')
        .order('date_debat', { ascending: true }); // Plus proche au plus loin

      if (error) {
        if (error.code === '42P01') setDbError(true);
        else console.error(error);
      } else if (data) {
        // Optionnel: filtrer ou trier, ici on affiche tout
        setDebats(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingDebats(false);
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.sujet || !form.message) return;
    
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const { error } = await supabase.from('boite_idees').insert([{
        nom: form.nom,
        email: form.email,
        sujet: form.sujet,
        message: form.message
      }]);

      if (error) {
        if (error.code === '42P01') setSubmitStatus({ type: 'error', text: "La boîte à idées est en cours de configuration." });
        else setSubmitStatus({ type: 'error', text: "Une erreur est survenue lors de l'envoi." });
      } else {
        setSubmitStatus({ type: 'success', text: "Votre idée a bien été transmise à notre équipe ! Merci de votre contribution." });
        setForm({ nom: '', email: '', sujet: '', message: '' }); // Reset
      }
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  };

  const DebatCard = ({ debat }) => {
    const isPasse = debat.statut === 'Passé';
    const isAnnule = debat.statut === 'Annulé';
    
    return (
      <div className={`debat-card ${isPasse || isAnnule ? 'debat-inactif' : ''}`}>
        <div className="debat-header">
          <span className={`debat-badge debat-${debat.statut === 'À venir' ? 'avenir' : (isPasse ? 'passe' : 'annule')}`}>
            {debat.statut}
          </span>
        </div>
        <h3>{debat.titre}</h3>
        <div className="debat-meta">
          {debat.date_debat && (
            <span><Calendar size={15} /> {new Date(debat.date_debat).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year:'numeric'})}</span>
          )}
          {debat.lieu && (
            <span><MapPin size={15} /> {debat.lieu}</span>
          )}
        </div>
        <p className="debat-desc">{debat.description}</p>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          
          {/* HEADER STRICTEMENT CONSERVÉ */}
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--green)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Dialogue & Débats</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--green)'}}></div>
          </div>
          
          <div className="simple-page-content">
            
            {/* INTRO */}
            <p className="dialogue-intro">
              Le développement du Gabon passe par l'intelligence collective. Cette plateforme physique et numérique a pour vocation de donner la parole à la jeunesse. Exprimez vos idées, participez à nos rencontres, et challengeons ensemble nos décideurs dans une démarche constructive et républicaine.
            </p>

            {/* 1. Débats Citoyens (Dynamique) */}
            <section className="dialogue-section">
              <h2 className="section-title" style={{ borderBottomColor: 'var(--navy)' }}>Prochaines Rencontres Citoyennes</h2>
              
              {loadingDebats ? (
                 <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: '#666' }}>Chargement du calendrier...</p></div>
              ) : dbError ? (
                <div className="dialogue-empty error">
                  <h3>Installation requise</h3>
                  <p>La base de données pour les événements de dialogue n'est pas encore configurée.</p>
                </div>
              ) : debats.length > 0 ? (
                <div className="debats-grid">
                  {debats.map(d => <DebatCard key={d.id} debat={d} />)}
                </div>
              ) : (
                <div className="dialogue-empty">
                  <div className="dialogue-empty-icon"><Users size={40} /></div>
                  <h3>Aucune rencontre programmée</h3>
                  <p>Restez à l'écoute, nous annoncerons très prochainement les dates de nos prochains débats publics.</p>
                </div>
              )}
            </section>

            {/* 2. Boîte à Idées (Dynamique par insertion) */}
            <section className="dialogue-section bg-light-green" style={{ padding: '40px', marginTop: '60px', marginBottom: '60px' }}>
              <div className="idees-container">
                <div className="idees-info">
                  <h2 className="section-title" style={{ borderBottomColor: 'var(--green)' }}>Boîte à Idées</h2>
                  <p>Vous avez une solution concrète pour améliorer le quotidien dans votre quartier ou à l'échelle nationale ? Vous souhaitez proposer un thème pour notre prochain débat public ?</p>
                  <p><strong>C'est ici que ça se passe !</strong></p>
                  <ul className="idees-list">
                    <li><Lightbulb size={20} color="var(--green)" /> Anonymat respecté (si désiré)</li>
                    <li><MessageSquare size={20} color="var(--blue)" /> Lu directement par le bureau</li>
                    <li><Users size={20} color="var(--yellow)" /> Les meilleures idées seront portées lors des débats</li>
                  </ul>
                </div>
                
                <div className="idees-form-wrapper">
                  <form className="idees-form" onSubmit={handleIdeaSubmit}>
                    
                    {submitStatus && (
                      <div className={`idee-alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {submitStatus.text}
                      </div>
                    )}

                    <div className="form-group">
                      <label>Votre Nom (ou Pseudonyme) <span style={{ color: 'red' }}>*</span></label>
                      <input type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder="Comment vous appeler ?" />
                    </div>
                    
                    <div className="form-group">
                      <label>Votre Adresse Email (Optionnelle)</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Pour qu'on puisse vous recontacter..." />
                    </div>
                    
                    <div className="form-group">
                      <label>Sujet principal <span style={{ color: 'red' }}>*</span></label>
                      <input type="text" value={form.sujet} onChange={e => setForm({...form, sujet: e.target.value})} required placeholder="Ex: Problème d'éclairage public, Proposition de loi..." />
                    </div>

                    <div className="form-group">
                      <label>Votre Idée / Message <span style={{ color: 'red' }}>*</span></label>
                      <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows="5" required placeholder="Détaillez votre pensée ici..."></textarea>
                    </div>

                    <button type="submit" disabled={submitting} className="btn-notre-gabon-square" style={{ width: '100%', background: 'var(--green)', color: '#fff' }}>
                      {submitting ? 'Envoi en cours...' : 'Soumettre mon idée'}
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* 3. Synthèses (Statique) */}
            <section className="dialogue-section">
              <h2 className="section-title" style={{ borderBottomColor: 'var(--yellow)' }}>Synthèses & Comptes-Rendus</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#555' }}>
                Parce que les paroles s'envolent mais les écrits restent, retrouvez ici les propositions concrètes issues de nos derniers débats.
              </p>
              
              <div className="syntheses-grid">
                
                <div className="synthese-card" style={{ borderLeft: '4px solid var(--green)' }}>
                  <div className="synthese-content">
                    <h3>Bilan Jeunesse 2024</h3>
                    <p>Synthèse des 10 propositions phares remises au Ministère de l'Éducation.</p>
                  </div>
                  <a href="#" className="synthese-dl-btn" onClick={(e) => { e.preventDefault(); alert("PDF en cours d'édition !"); }}>
                    <Download size={24} />
                  </a>
                </div>

                <div className="synthese-card" style={{ borderLeft: '4px solid var(--yellow)' }}>
                  <div className="synthese-content">
                    <h3>Entrepreneuriat Local</h3>
                    <p>Les freins à la création d'entreprise au Gabon (Rapport d'enquête).</p>
                  </div>
                  <a href="#" className="synthese-dl-btn" onClick={(e) => { e.preventDefault(); alert("PDF en cours d'édition !"); }}>
                    <Download size={24} />
                  </a>
                </div>

                <div className="synthese-card" style={{ borderLeft: '4px solid var(--blue)' }}>
                  <div className="synthese-content">
                    <h3>Dialogue Intergénérationnel</h3>
                    <p>Verbatim de notre rencontre avec les anciens de la sphère associative.</p>
                  </div>
                  <a href="#" className="synthese-dl-btn" onClick={(e) => { e.preventDefault(); alert("PDF en cours d'édition !"); }}>
                    <Download size={24} />
                  </a>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default Dialogue;
