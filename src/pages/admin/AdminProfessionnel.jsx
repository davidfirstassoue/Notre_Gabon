import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

/* ─── Liste des offres d'emploi / stages ─────────────────────────── */
function OffreRow({ offre, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isPourvu = offre.statut === 'Pourvu';
  const postDate = new Date(offre.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  // Couleur du type de contrat
  let typeColor = 'var(--blue)';
  if (offre.type_contrat === 'Stage') typeColor = 'var(--green)';
  if (offre.type_contrat === 'Bénévolat Pro') typeColor = 'var(--yellow)';

  return (
    <div className="admin-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
      
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: typeColor, color: '#fff', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
            {offre.type_contrat}
          </span>
          <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {offre.titre}
          </p>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: isPourvu ? '#ffe6e6' : '#e6f7e6', color: isPourvu ? '#d32f2f' : 'var(--green)', borderRadius: '4px', fontWeight: 600 }}>
            {isPourvu ? 'Pourvu' : 'Ouvert'}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>
          Publiée le : {postDate} | Lieu : {offre.lieu || 'Non spécifié'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
        <button onClick={() => onEdit(offre)} className="admin-btn" style={{ background: 'var(--navy)', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>
          Modifier
        </button>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>
            Supprimer
          </button>
        ) : (
          <>
            <button onClick={() => onDelete(offre.id)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 'bold' }}>
              Confirmer ?
            </button>
            <button onClick={() => setShowConfirm(false)} className="admin-btn" style={{ background: '#888', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const EMPTY_FORM = { titre: '', type_contrat: 'Emploi', description: '', lieu: '', lien_postuler: '', statut: 'Ouvert' };

function OffreForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const isEditing = !!initial;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.description.trim()) return;
    onSave(form);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.85rem', color: '#666' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', fontWeight: 600, padding: 0 }}>
          ← Opportunités
        </button>
        <span>/</span>
        <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{isEditing ? 'Modifier l\'offre' : 'Nouvelle offre'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3 className="admin-card-title">{isEditing ? 'Modifier l\'offre' : 'Créer une nouvelle offre'}</h3>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Intitulé du poste <span style={{ color: '#f00' }}>*</span></label>
              <input type="text" value={form.titre} onChange={set('titre')} placeholder="Ex: Chargé de communication..." required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ width: '200px', marginBottom: 0 }}>
              <label>Type de contrat <span style={{ color: '#f00' }}>*</span></label>
              <select value={form.type_contrat} onChange={set('type_contrat')} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="Emploi">Emploi</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
                <option value="Bénévolat Pro">Bénévolat Pro</option>
                <option value="Service Civique">Service Civique</option>
              </select>
            </div>
            
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Lieu</label>
              <input type="text" value={form.lieu || ''} onChange={set('lieu')} placeholder="Ex: Libreville (Télétravail possible)..." />
            </div>

            <div className="admin-form-group" style={{ width: '150px', marginBottom: 0 }}>
              <label>Statut</label>
              <select value={form.statut} onChange={set('statut')} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="Ouvert">Ouvert</option>
                <option value="Pourvu">Pourvu</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Lien pour postuler (Email ou URL externe)</label>
            <input type="text" value={form.lien_postuler || ''} onChange={set('lien_postuler')} placeholder="mailto:recrutement@notregabon.org ou https://..." />
          </div>

          <div className="admin-form-group">
            <label>Description du poste (Missions, Profil recherché) <span style={{ color: '#f00' }}>*</span></label>
            <textarea value={form.description || ''} onChange={set('description')} rows="8" placeholder="Détaillez les missions et les pré-requis ici..." required></textarea>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" disabled={saving || !form.titre.trim() || !form.description.trim()} className="admin-btn admin-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? 'Enregistrement…' : isEditing ? 'Sauvegarder les modifications' : 'Publier l\'offre'}
            </button>
            <button type="button" onClick={onCancel} className="admin-btn" style={{ background: '#eee', color: '#555', padding: '10px 18px' }}>
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function AdminProfessionnel() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchOffres(); }, []);

  const fetchOffres = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offres_emploi')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      if (error.code === '42P01') {
        setMessage({ type: 'error', text: "La table 'offres_emploi' n'existe pas dans Supabase. Veuillez exécuter le script SQL correspondant."});
      } else {
        setMessage({ type: 'error', text: `Erreur: ${error.message}` });
      }
    } else {
      setOffres(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (form) => {
    setSaving(true);
    setMessage(null);
    let error;

    const payload = { ...form };

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase.from('offres_emploi').update(payload).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('offres_emploi').insert([payload]));
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Offre mise à jour !' : 'Offre publiée !' });
      await fetchOffres();
      setView('list');
      setEditTarget(null);
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    const { error } = await supabase.from('offres_emploi').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Offre supprimée.' }); await fetchOffres(); }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginBottom: '8px' }}>Gestion Professionnelle (Carrières)</h2>
      <p className="admin-section-description" style={{ marginBottom: '24px' }}>Gérez les offres d'emploi, stages et missions pour l'ONG.</p>

      {message && (
        <div className={`admin-alert ${message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`} style={{ marginBottom: '20px' }}>
          {message.type === 'success'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
          }
          <span style={{ marginLeft: '8px' }}>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement des offres…</div>
      ) : (
        <>
          {(view === 'list') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
                  {offres.length} offre{offres.length !== 1 ? 's' : ''}
                </h2>
                <button onClick={() => { setEditTarget(null); setView('new'); setMessage(null); }} className="admin-btn admin-btn-primary" style={{ padding: '9px 18px' }}>
                  + Nouvelle opportunité
                </button>
              </div>

              {offres.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                  <p style={{ marginBottom: '16px' }}>Aucune offre d'emploi ou de stage publiée pour le moment.</p>
                  <button onClick={() => { setEditTarget(null); setView('new'); setMessage(null); }} className="admin-btn admin-btn-primary">Publier la première offre</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {offres.map((o) => (
                    <OffreRow 
                      key={o.id} 
                      offre={o} 
                      onEdit={(off) => { setEditTarget(off); setView('edit'); setMessage(null); }} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {(view === 'new' || view === 'edit') && (
             <OffreForm
               initial={view === 'edit' ? editTarget : null}
               onSave={handleSave}
               onCancel={() => { setView('list'); setEditTarget(null); setMessage(null); }}
               saving={saving}
             />
          )}
        </>
      )}
    </div>
  );
}

export default AdminProfessionnel;
