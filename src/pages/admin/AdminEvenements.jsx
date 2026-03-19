import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

/* ─── Vue liste des événements ─────────────────────────── */
function EvenementList({ evenements, onEdit, onDelete, onNew }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
          {evenements.length} événement{evenements.length !== 1 ? 's' : ''}
        </h2>
        <button onClick={onNew} className="admin-btn admin-btn-primary" style={{ padding: '9px 18px' }}>
          + Nouvel événement
        </button>
      </div>

      {evenements.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ marginBottom: '16px' }}>Aucun événement enregistré pour le moment.</p>
          <button onClick={onNew} className="admin-btn admin-btn-primary">Créer le premier événement</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {evenements.map((evenement) => (
            <EvenementRow key={evenement.id} evenement={evenement} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Ligne événement dans la liste ─────────────────── */
function EvenementRow({ evenement, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const dateStr = evenement.date_evenement ? new Date(evenement.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date non définie';

  return (
    <div className="admin-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
      {/* Miniature Image */}
      {evenement.image_url ? (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={evenement.image_url} alt={evenement.titre} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, background: '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {evenement.titre}
          </p>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: evenement.est_passe ? '#eee' : '#e6f7e6', color: evenement.est_passe ? '#666' : 'var(--green)', borderRadius: '4px', fontWeight: 600 }}>
            {evenement.est_passe ? 'Passé' : 'À venir'}
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '4px 0 0' }}>
          Prévu le : {dateStr} | Lieu : {evenement.lieu || 'Non spécifié'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
        <button
          onClick={() => onEdit(evenement)}
          className="admin-btn"
          style={{ background: 'var(--navy)', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}
        >
          Modifier
        </button>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="admin-btn"
            style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}
          >
            Supprimer
          </button>
        ) : (
          <>
            <button
              onClick={() => onDelete(evenement.id)}
              className="admin-btn"
              style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 'bold' }}
            >
              Confirmer ?
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="admin-btn"
              style={{ background: '#888', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Formulaire Ajout / Modification ───────────────── */
const EMPTY_FORM = { titre: '', description: '', date_evenement: '', lieu: '', image_url: '', lien_inscription: '', est_passe: false };

function EvenementForm({ initial, onSave, onCancel, onUpload, saving }) {
  // Gérer le format de la date pour l'input type="date"
  const getInitialForm = () => {
    if (!initial) return EMPTY_FORM;
    let dateStr = '';
    if (initial.date_evenement) {
      dateStr = new Date(initial.date_evenement).toISOString().split('T')[0];
    }
    return { ...initial, date_evenement: dateStr };
  };

  const [form, setForm] = useState(getInitialForm());
  const [uploading, setUploading] = useState(false);
  const isEditing = !!initial;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleFileChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const url = await onUpload(e.target.files[0]);
    if (url) setForm((f) => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.date_evenement) return;
    onSave(form);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.85rem', color: '#666' }}>
        <button
          onClick={onCancel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', fontWeight: 600, padding: 0 }}
        >
          ← Événements
        </button>
        <span>/</span>
        <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3 className="admin-card-title">{isEditing ? 'Modifier l\'événement' : 'Créer un nouvel événement'}</h3>

          {/* Titre & Statut */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Titre de l'événement <span style={{ color: '#f00' }}>*</span></label>
              <input type="text" value={form.titre} onChange={set('titre')} placeholder="Ex: Afterwork Premium..." required />
            </div>
            <div className="admin-form-group" style={{ width: '200px', marginBottom: 0 }}>
              <label>Statut</label>
              <div style={{ padding: '12px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={form.est_passe} onChange={set('est_passe')} style={{ width: '18px', height: '18px' }} />
                  Événement Passé
                </label>
              </div>
            </div>
          </div>

          {/* Date & Lieu */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Date <span style={{ color: '#f00' }}>*</span></label>
              <input type="date" value={form.date_evenement} onChange={set('date_evenement')} required />
            </div>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Lieu</label>
              <input type="text" value={form.lieu || ''} onChange={set('lieu')} placeholder="Ex: Libreville, Baie des rois..." />
            </div>
          </div>

          {/* Lien Inscription */}
          <div className="admin-form-group">
            <label>Lien d'inscription (optionnel)</label>
            <input type="url" value={form.lien_inscription || ''} onChange={set('lien_inscription')} placeholder="https://..." />
          </div>

          {/* Description */}
          <div className="admin-form-group">
            <label>Description (optionnelle)</label>
            <textarea value={form.description || ''} onChange={set('description')} rows="4" placeholder="Détails de l'événement..."></textarea>
          </div>

          {/* Image */}
          <div className="admin-form-group">
            <label>Image de couverture <span style={{ color: '#f00' }}>*</span></label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {form.image_url && (
                <div style={{ width: '150px', height: '100px', flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={form.image_url} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading || saving} style={{ marginBottom: '10px', fontSize: '0.8rem', display: 'block' }} />
                {uploading && <p style={{ fontSize: '0.75rem', color: 'var(--navy)', margin: '0 0 8px' }}>Upload en cours…</p>}
                <input type="url" value={form.image_url || ''} onChange={set('image_url')} placeholder="Ou collez une URL d'image..." style={{ fontSize: '0.85rem' }} required />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" disabled={saving || uploading || !form.titre.trim() || !form.date_evenement || !form.image_url.trim()} className="admin-btn admin-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? 'Enregistrement…' : isEditing ? 'Sauvegarder les modifications' : 'Créer l\'événement'}
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

/* ─── Composant principal AdminEvenements ─────────────── */
function AdminEvenements() {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchEvenements(); }, []);

  const fetchEvenements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('evenements')
      .select('*')
      .order('date_evenement', { ascending: false });
      
    if (error) {
      if (error.code === '42P01') {
        setMessage({ type: 'error', text: "La table 'evenements' n'existe pas dans Supabase. Veuillez la créer."});
      } else {
        setMessage({ type: 'error', text: `Erreur: ${error.message}` });
      }
    } else {
      setEvenements(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `evenements/img-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('site-images').upload(path, file);
    if (error) { setMessage({ type: 'error', text: `Erreur upload: ${error.message}` }); return null; }
    return supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl;
  };

  const handleSave = async (form) => {
    setSaving(true);
    setMessage(null);
    let error;

    const payload = {
      titre: form.titre,
      description: form.description,
      date_evenement: form.date_evenement,
      lieu: form.lieu,
      image_url: form.image_url,
      lien_inscription: form.lien_inscription,
      est_passe: form.est_passe
    };

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase.from('evenements').update(payload).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('evenements').insert([payload]));
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Événement mis à jour !' : 'Événement ajouté !' });
      await fetchEvenements();
      setView('list');
      setEditTarget(null);
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    const { error } = await supabase.from('evenements').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Événement supprimé.' }); await fetchEvenements(); }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginBottom: '8px' }}>Gestion des Événements</h2>
      <p className="admin-section-description" style={{ marginBottom: '24px' }}>Ajoutez, modifiez ou supprimez les événements futurs et passés de l'ONG.</p>

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
        <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement des événements…</div>
      ) : (
        <>
          {(view === 'list') && (
            <EvenementList
              evenements={evenements}
              onEdit={(e) => { setEditTarget(e); setView('edit'); setMessage(null); }}
              onDelete={handleDelete}
              onNew={() => { setEditTarget(null); setView('new'); setMessage(null); }}
            />
          )}

          {(view === 'new' || view === 'edit') && (
            <EvenementForm
              initial={view === 'edit' ? editTarget : null}
              onSave={handleSave}
              onCancel={() => { setView('list'); setEditTarget(null); setMessage(null); }}
              onUpload={handleUpload}
              saving={saving}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AdminEvenements;
