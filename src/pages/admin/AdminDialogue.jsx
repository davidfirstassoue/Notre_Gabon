import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

// ==========================================
// ONGLET 1 : GESTION DES DÉBATS CITOYENS
// ==========================================
function DebatRow({ debat, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isPasse = debat.statut === 'Passé';
  const isAnnule = debat.statut === 'Annulé';
  const postDate = new Date(debat.date_debat).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  let statutColor = 'var(--green)'; // A venir
  if (isPasse) statutColor = '#888';
  if (isAnnule) statutColor = '#d32f2f';

  return (
    <div className="admin-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: statutColor, color: '#fff', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
            {debat.statut}
          </span>
          <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {debat.titre}
          </p>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>
          Date prếvue : {postDate || 'Non définie'} | Lieu : {debat.lieu || 'En ligne / Non spécifié'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
        <button onClick={() => onEdit(debat)} className="admin-btn" style={{ background: 'var(--navy)', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>Modifier</button>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>Supprimer</button>
        ) : (
          <>
            <button onClick={() => onDelete(debat.id)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 'bold' }}>Confirmer</button>
            <button onClick={() => setShowConfirm(false)} className="admin-btn" style={{ background: '#888', color: '#fff', padding: '5px 12px', fontSize: '0.78rem' }}>Annuler</button>
          </>
        )}
      </div>
    </div>
  );
}

function DebatForm({ initial, onSave, onCancel, saving }) {
  const getInitialForm = () => {
    if (!initial) return { titre: '', description: '', date_debat: '', lieu: '', statut: 'À venir' };
    return { ...initial, date_debat: initial.date_debat ? new Date(initial.date_debat).toISOString().split('T')[0] : '' };
  };

  const [form, setForm] = useState(getInitialForm());
  const isEditing = !!initial;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.description.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="admin-card-title" style={{ margin: 0 }}>{isEditing ? 'Modifier le débat' : 'Programmer un débat / rencontre'}</h3>
        <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
        <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Thème / Titre <span style={{ color: '#f00' }}>*</span></label>
          <input type="text" value={form.titre} onChange={set('titre')} placeholder="Ex: Rencontre avec les jeunes entrepreneurs..." required />
        </div>
        <div className="admin-form-group" style={{ width: '180px', marginBottom: 0 }}>
          <label>Statut</label>
          <select value={form.statut} onChange={set('statut')} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="À venir">À venir</option>
            <option value="Passé">Passé</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
        <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Date prévue</label>
          <input type="date" value={form.date_debat} onChange={set('date_debat')} />
        </div>
        <div className="admin-form-group" style={{ flex: 2, marginBottom: 0 }}>
          <label>Lieu</label>
          <input type="text" value={form.lieu || ''} onChange={set('lieu')} placeholder="Ex: Mairie de Libreville ou En ligne sur Zoom" />
        </div>
      </div>

      <div className="admin-form-group">
        <label>Description (Contexte, invités, objectifs) <span style={{ color: '#f00' }}>*</span></label>
        <textarea value={form.description || ''} onChange={set('description')} rows="5" required></textarea>
      </div>

      <button type="submit" disabled={saving || !form.titre.trim()} className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
        {saving ? 'Enregistrement…' : isEditing ? 'Sauvegarder' : 'Programmer la rencontre'}
      </button>
    </form>
  );
}

// ==========================================
// ONGLET 2 : LECTURE DE LA BOÎTE À IDÉES
// ==========================================
function IdeeRow({ idee, onDelete }) {
  const dateStr = new Date(idee.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="admin-card" style={{ marginBottom: '12px', padding: '0' }}>
      <div 
        onClick={() => setExpanded(!expanded)} 
        style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expanded ? '#f9fbff' : '#fff' }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>{dateStr}</span>
            <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>{idee.nom}</span>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>({idee.email || 'Sans email'})</span>
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>Objet : {idee.sujet}</p>
        </div>
        <div>{expanded ? '▲' : '▼'}</div>
      </div>
      
      {expanded && (
        <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid #eee', background: '#f9fbff' }}>
          <p style={{ whiteSpace: 'pre-wrap', color: '#444', lineHeight: '1.6', marginTop: '16px', fontSize: '0.95rem' }}>
            {idee.message}
          </p>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button onClick={(e) => { e.stopPropagation(); onDelete(idee.id); }} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', fontSize: '0.75rem', padding: '4px 10px' }}>
              Supprimer le message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPOSANT PRINCIPAL ADMIN DIALOGUE
// ==========================================
function AdminDialogue() {
  const [activeTab, setActiveTab] = useState('debats'); // 'debats' ou 'idees'
  const [message, setMessage] = useState(null);
  
  // States Débats
  const [debats, setDebats] = useState([]);
  const [loadingDebats, setLoadingDebats] = useState(true);
  const [viewDebat, setViewDebat] = useState('list');
  const [editTargetDebat, setEditTargetDebat] = useState(null);
  const [savingDebat, setSavingDebat] = useState(false);

  // States Idées
  const [idees, setIdees] = useState([]);
  const [loadingIdees, setLoadingIdees] = useState(true);

  useEffect(() => {
    if (activeTab === 'debats') fetchDebats();
    else fetchIdees();
  }, [activeTab]);

  const fetchDebats = async () => {
    setLoadingDebats(true);
    const { data, error } = await supabase.from('debats_citoyens').select('*').order('date_debat', { ascending: false });
    if (error) {
      if (error.code === '42P01') setMessage({ type: 'error', text: "Table 'debats_citoyens' inexistante. Lancez le script SQL."});
      else setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } else { setDebats(data || []); }
    setLoadingDebats(false);
  };

  const fetchIdees = async () => {
    setLoadingIdees(true);
    const { data, error } = await supabase.from('boite_idees').select('*').order('created_at', { ascending: false });
    if (error) {
      if (error.code === '42P01') setMessage({ type: 'error', text: "Table 'boite_idees' inexistante. Lancez le script SQL."});
      else setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } else { setIdees(data || []); }
    setLoadingIdees(false);
  };

  // Handlers Débats
  const handleSaveDebat = async (form) => {
    setSavingDebat(true);
    setMessage(null);
    const payload = { ...form, date_debat: form.date_debat || null };
    let error;

    if (viewDebat === 'edit' && editTargetDebat) {
      ({ error } = await supabase.from('debats_citoyens').update(payload).eq('id', editTargetDebat.id));
    } else {
      ({ error } = await supabase.from('debats_citoyens').insert([payload]));
    }

    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: viewDebat === 'edit' ? 'Débat mis à jour !' : 'Rencontre programmée !' });
      await fetchDebats();
      setViewDebat('list');
      setEditTargetDebat(null);
    }
    setSavingDebat(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteDebat = async (id) => {
    const { error } = await supabase.from('debats_citoyens').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Débat supprimé.' }); await fetchDebats(); }
    setTimeout(() => setMessage(null), 3000);
  };

  // Handlers Idées
  const handleDeleteIdee = async (id) => {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    const { error } = await supabase.from('boite_idees').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Idée supprimée.' }); await fetchIdees(); }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginBottom: '8px' }}>Dialogue & Démocratie</h2>
      <p className="admin-section-description" style={{ marginBottom: '24px' }}>Gérez les rencontres citoyennes et consultez la boîte à idées.</p>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #eaeaea', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('debats')} 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'debats' ? '3px solid var(--blue)' : '3px solid transparent', color: activeTab === 'debats' ? 'var(--blue)' : '#666', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          Débats & Rencontres
        </button>
        <button 
          onClick={() => setActiveTab('idees')} 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'idees' ? '3px solid var(--green)' : '3px solid transparent', color: activeTab === 'idees' ? 'var(--green)' : '#666', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          Boîte à idées ({idees.length || '?'})
        </button>
      </div>

      {message && (
        <div className={`admin-alert ${message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`} style={{ marginBottom: '20px' }}>
          <span style={{ marginLeft: '8px' }}>{message.text}</span>
        </div>
      )}

      {/* CONTENU : DÉBATS */}
      {activeTab === 'debats' && (
        loadingDebats ? <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement…</div> : (
          <>
            {(viewDebat === 'list') && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button onClick={() => { setEditTargetDebat(null); setViewDebat('new'); setMessage(null); }} className="admin-btn admin-btn-primary">
                    + Programmer un débat
                  </button>
                </div>
                {debats.length === 0 ? (
                  <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                    <p style={{ marginBottom: '16px' }}>Aucun débat n'est programmé pour le moment.</p>
                    <button onClick={() => { setEditTargetDebat(null); setViewDebat('new'); setMessage(null); }} className="admin-btn admin-btn-primary">Programmer le premier débat</button>
                  </div>
                ) : (
                  debats.map((d) => <DebatRow key={d.id} debat={d} onEdit={(deb) => { setEditTargetDebat(deb); setViewDebat('edit'); }} onDelete={handleDeleteDebat} />)
                )}
              </div>
            )}
            {(viewDebat === 'new' || viewDebat === 'edit') && (
              <DebatForm initial={viewDebat === 'edit' ? editTargetDebat : null} onSave={handleSaveDebat} onCancel={() => setViewDebat('list')} saving={savingDebat} />
            )}
          </>
        )
      )}

      {/* CONTENU : BOÎTE À IDÉES */}
      {activeTab === 'idees' && (
        loadingIdees ? <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement des messages…</div> : (
          <div>
            {idees.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" style={{ marginBottom: '16px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p>La boîte à idées est vide pour le moment.</p>
              </div>
            ) : (
              idees.map((i) => <IdeeRow key={i.id} idee={i} onDelete={handleDeleteIdee} />)
            )}
          </div>
        )
      )}

    </div>
  );
}

export default AdminDialogue;
