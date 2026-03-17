import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

/* ─── Vue liste des partenaires ─────────────────────────── */
function PartenaireList({ partenaires, onEdit, onDelete, onNew }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
          {partenaires.length} partenaire{partenaires.length !== 1 ? 's' : ''}
        </h2>
        <button onClick={onNew} className="admin-btn admin-btn-primary" style={{ padding: '9px 18px' }}>
          + Nouveau partenaire
        </button>
      </div>

      {partenaires.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ marginBottom: '16px' }}>Aucun partenaire enregistré pour le moment.</p>
          <button onClick={onNew} className="admin-btn admin-btn-primary">Ajouter le premier partenaire</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {partenaires.map((partenaire) => (
            <PartenaireRow key={partenaire.id} partenaire={partenaire} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Ligne partenaire dans la liste ─────────────────── */
function PartenaireRow({ partenaire, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="admin-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
      {/* Miniature Logo */}
      {partenaire.logo_url ? (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={partenaire.logo_url} alt={partenaire.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '4px' }} />
        </div>
      ) : (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, background: '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="0"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {partenaire.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '2px 0 0' }}>
          Ajouté le {new Date(partenaire.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
        <button
          onClick={() => onEdit(partenaire)}
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
              onClick={() => onDelete(partenaire.id)}
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
const EMPTY_FORM = { name: '', logo_url: '' };

function PartenaireForm({ initial, onSave, onCancel, onUpload, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const isEditing = !!initial;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const url = await onUpload(e.target.files[0]);
    if (url) setForm((f) => ({ ...f, logo_url: url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logo_url.trim()) return;
    onSave(form);
  };

  return (
    <div>
      {/* Fil d'Ariane */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.85rem', color: '#666' }}>
        <button
          onClick={onCancel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', fontWeight: 600, padding: 0 }}
        >
          ← Partenaires
        </button>
        <span>/</span>
        <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{isEditing ? 'Modifier le partenaire' : 'Nouveau partenaire'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3 className="admin-card-title">{isEditing ? 'Modifier le partenaire' : 'Créer un nouveau partenaire'}</h3>

          {/* Nom */}
          <div className="admin-form-group">
            <label>Nom du partenaire <span style={{ color: '#f00' }}>*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Ex: Ministère de la Santé..."
              required
            />
          </div>

          {/* Logo */}
          <div className="admin-form-group">
            <label>Logo du partenaire <span style={{ color: '#f00' }}>*</span></label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {form.logo_url && (
                <div style={{ width: '150px', height: '100px', flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                  <img src={form.logo_url} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading || saving}
                  style={{ marginBottom: '10px', fontSize: '0.8rem', display: 'block' }}
                />
                {uploading && <p style={{ fontSize: '0.75rem', color: 'var(--navy)', margin: '0 0 8px' }}>Envoi de l'image…</p>}
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={set('logo_url')}
                  placeholder="Ou collez une URL d'image..."
                  style={{ fontSize: '0.85rem' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={saving || uploading || !form.name.trim() || !form.logo_url.trim()}
              className="admin-btn admin-btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? 'Enregistrement…' : isEditing ? 'Sauvegarder les modifications' : 'Ajouter le partenaire'}
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

/* ─── Composant principal AdminPartenaires ─────────────── */
function AdminPartenaires() {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');       // 'list' | 'new' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchPartenaires(); }, []);

  const fetchPartenaires = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('partenaires')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setPartenaires(data || []);
    setLoading(false);
  };

  const handleUpload = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `partenaires/logo-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('site-images').upload(path, file);
    if (error) { setMessage({ type: 'error', text: `Erreur upload: ${error.message}` }); return null; }
    return supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl;
  };

  const handleSave = async (form) => {
    setSaving(true);
    setMessage(null);
    let error;

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase
        .from('partenaires')
        .update({ name: form.name, logo_url: form.logo_url })
        .eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('partenaires').insert([{ name: form.name, logo_url: form.logo_url }]));
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Partenaire mis à jour !' : 'Partenaire ajouté !' });
      await fetchPartenaires();
      setView('list');
      setEditTarget(null);
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    const { error } = await supabase.from('partenaires').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Partenaire supprimé.' }); await fetchPartenaires(); }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginBottom: '8px' }}>Gestion des Partenaires</h2>
      <p className="admin-section-description" style={{ marginBottom: '24px' }}>Ajoutez et gérez les logos des organisations qui soutiennent Notre Gabon.</p>

      {/* Message flash */}
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
        <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement des partenaires…</div>
      ) : (
        <>
          {(view === 'list') && (
            <PartenaireList
              partenaires={partenaires}
              onEdit={(p) => { setEditTarget(p); setView('edit'); setMessage(null); }}
              onDelete={handleDelete}
              onNew={() => { setEditTarget(null); setView('new'); setMessage(null); }}
            />
          )}

          {(view === 'new' || view === 'edit') && (
            <PartenaireForm
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

export default AdminPartenaires;
