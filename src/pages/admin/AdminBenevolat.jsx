import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

/* ─── Liste des missions de bénévolat ─────────────────────────── */
function MissionRow({ mission, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const dateStr = mission.date_mission ? new Date(mission.date_mission).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date non définie';
  const isComplet = mission.statut === 'Complet';

  return (
    <div className="admin-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
      
      {/* Miniature Image */}
      {mission.image_url ? (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={mission.image_url} alt={mission.titre} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
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
            {mission.titre}
          </p>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: isComplet ? '#ffe6e6' : '#e6f7e6', color: isComplet ? '#d32f2f' : 'var(--green)', borderRadius: '4px', fontWeight: 600 }}>
            {isComplet ? 'Complet' : 'Ouvert'}
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '4px 0 0' }}>
          Date approx. : {dateStr} | Lieu : {mission.lieu || 'Non spécifié'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
        <button onClick={() => onEdit(mission)} className="admin-btn" style={{ background: 'var(--navy)', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>
          Modifier
        </button>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>
            Supprimer
          </button>
        ) : (
          <>
            <button onClick={() => onDelete(mission.id)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 'bold' }}>
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

const EMPTY_FORM = { titre: '', description: '', date_mission: '', lieu: '', image_url: '', lien_inscription: '', statut: 'Ouvert' };

function MissionForm({ initial, onSave, onCancel, onUpload, saving }) {
  const getInitialForm = () => {
    if (!initial) return EMPTY_FORM;
    let dateStr = '';
    if (initial.date_mission) {
      dateStr = new Date(initial.date_mission).toISOString().split('T')[0];
    }
    return { ...initial, date_mission: dateStr };
  };

  const [form, setForm] = useState(getInitialForm());
  const [uploading, setUploading] = useState(false);
  const isEditing = !!initial;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const url = await onUpload(e.target.files[0]);
    if (url) setForm((f) => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre.trim()) return;
    onSave(form);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.85rem', color: '#666' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', fontWeight: 600, padding: 0 }}>
          ← Bénévolat
        </button>
        <span>/</span>
        <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{isEditing ? 'Modifier la mission' : 'Nouvelle mission'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3 className="admin-card-title">{isEditing ? 'Modifier la mission' : 'Créer une nouvelle mission de bénévolat'}</h3>

          {/* Titre & Statut */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Titre de la mission <span style={{ color: '#f00' }}>*</span></label>
              <input type="text" value={form.titre} onChange={set('titre')} placeholder="Ex: Distribution de fournitures..." required />
            </div>
            <div className="admin-form-group" style={{ width: '200px', marginBottom: 0 }}>
              <label>Statut</label>
              <select value={form.statut} onChange={set('statut')} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="Ouvert">Ouvert</option>
                <option value="Complet">Complet</option>
              </select>
            </div>
          </div>

          {/* Date & Lieu */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Date approximative</label>
              <input type="date" value={form.date_mission} onChange={set('date_mission')} />
            </div>
            <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Lieu</label>
              <input type="text" value={form.lieu || ''} onChange={set('lieu')} placeholder="Ex: Akanda..." />
            </div>
          </div>

          {/* Lien Inscription */}
          <div className="admin-form-group">
            <label>Lien d'inscription spécifique (optionnel)</label>
            <input type="url" value={form.lien_inscription || ''} onChange={set('lien_inscription')} placeholder="Laissez vide pour utiliser le formulaire standard..." />
          </div>

          {/* Description */}
          <div className="admin-form-group">
            <label>Description (optionnelle mais recommandée)</label>
            <textarea value={form.description || ''} onChange={set('description')} rows="4" placeholder="Ce qu'on attend des bénévoles..."></textarea>
          </div>

          {/* Image */}
          <div className="admin-form-group">
            <label>Image d'illustration (optionnelle)</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {form.image_url && (
                <div style={{ width: '150px', height: '100px', flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={form.image_url} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading || saving} style={{ marginBottom: '10px', fontSize: '0.8rem', display: 'block' }} />
                {uploading && <p style={{ fontSize: '0.75rem', color: 'var(--navy)', margin: '0 0 8px' }}>Upload en cours…</p>}
                <input type="url" value={form.image_url || ''} onChange={set('image_url')} placeholder="Ou collez une URL d'image..." style={{ fontSize: '0.85rem' }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" disabled={saving || uploading || !form.titre.trim()} className="admin-btn admin-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? 'Enregistrement…' : isEditing ? 'Sauvegarder les modifications' : 'Créer la mission'}
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

function AdminBenevolat() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchMissions(); }, []);

  const fetchMissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('missions_benevolat')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      if (error.code === '42P01') {
        setMessage({ type: 'error', text: "La table 'missions_benevolat' n'existe pas dans Supabase. Veuillez exécuter le script SQL correspondant."});
      } else {
        setMessage({ type: 'error', text: `Erreur: ${error.message}` });
      }
    } else {
      setMissions(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `benevolat/img-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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
      date_mission: form.date_mission || null,
      lieu: form.lieu,
      image_url: form.image_url,
      lien_inscription: form.lien_inscription,
      statut: form.statut
    };

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase.from('missions_benevolat').update(payload).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('missions_benevolat').insert([payload]));
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Mission mise à jour !' : 'Mission ajoutée !' });
      await fetchMissions();
      setView('list');
      setEditTarget(null);
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    const { error } = await supabase.from('missions_benevolat').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Mission supprimée.' }); await fetchMissions(); }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginBottom: '8px' }}>Gestion du Bénévolat</h2>
      <p className="admin-section-description" style={{ marginBottom: '24px' }}>Proposez des offres et missions de bénévolat dynamiques ("événements à venir pour le bénévolat").</p>

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
        <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement des missions…</div>
      ) : (
        <>
          {(view === 'list') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
                  {missions.length} mission{missions.length !== 1 ? 's' : ''}
                </h2>
                <button onClick={() => { setEditTarget(null); setView('new'); setMessage(null); }} className="admin-btn admin-btn-primary" style={{ padding: '9px 18px' }}>
                  + Nouvelle mission
                </button>
              </div>

              {missions.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                  <p style={{ marginBottom: '16px' }}>Aucune mission de bénévolat enregistrée pour le moment.</p>
                  <button onClick={() => { setEditTarget(null); setView('new'); setMessage(null); }} className="admin-btn admin-btn-primary">Créer la première mission</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {missions.map((m) => (
                    <MissionRow 
                      key={m.id} 
                      mission={m} 
                      onEdit={(mis) => { setEditTarget(mis); setView('edit'); setMessage(null); }} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {(view === 'new' || view === 'edit') && (
             <MissionForm
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

export default AdminBenevolat;
