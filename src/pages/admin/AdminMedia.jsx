import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

// ==========================================
// ONGLET 1 : COMMUNIQUÉS DE PRESSE
// ==========================================
function CommuniquesTab() {
  const [communiques, setCommuniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [message, setMessage] = useState(null);

  const [view, setView] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titre: '', resume: '', date_publication: '', url_document: '' });

  useEffect(() => { fetchCommuniques(); }, []);

  const fetchCommuniques = async () => {
    setLoading(true); setDbError(false);
    const { data, error } = await supabase.from('communiques_presse').select('*').order('date_publication', { ascending: false });
    if (error) {
      if (error.code === '42P01') setDbError(true);
      else setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } else { setCommuniques(data || []); }
    setLoading(false);
  };

  const handleCreateNew = () => {
    setForm({ titre: '', resume: '', date_publication: new Date().toISOString().split('T')[0], url_document: '' });
    setEditTarget(null); setView('new'); setMessage(null);
  };

  const handleEdit = (item) => {
    setForm({
      titre: item.titre, resume: item.resume || '',
      date_publication: item.date_publication ? new Date(item.date_publication).toISOString().split('T')[0] : '',
      url_document: item.url_document || ''
    });
    setEditTarget(item); setView('edit'); setMessage(null);
  };

  const setF = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    const payload = { ...form, date_publication: form.date_publication || null };
    let error;

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase.from('communiques_presse').update(payload).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('communiques_presse').insert([payload]));
    }

    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Communiqué mis à jour !' : 'Nouveau communiqué publié !' });
      await fetchCommuniques();
      setView('list');
    }
    setSaving(false); setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce communiqué ?")) return;
    const { error } = await supabase.from('communiques_presse').delete().eq('id', id);
    if (!error) { setMessage({ type: 'success', text: 'Communiqué supprimé.' }); fetchCommuniques(); }
    setTimeout(() => setMessage(null), 3000);
  };

  if (dbError) return <div className="admin-card" style={{borderColor:'red'}}>La table communiques_presse n'existe pas.</div>;

  return (
    <div>
      {message && <div className={`admin-alert ${message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`} style={{marginBottom:'20px'}}><span style={{marginLeft:'8px'}}>{message.text}</span></div>}
      {view === 'list' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={handleCreateNew} className="admin-btn admin-btn-primary">+ Publier un communiqué</button>
          </div>
          {loading ? <div className="admin-card text-center text-gray">Chargement...</div> : communiques.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <p style={{ marginBottom: '16px' }}>Aucun communiqué officiel publié pour le moment.</p>
              <button onClick={handleCreateNew} className="admin-btn admin-btn-primary">Publier le premier communiqué</button>
            </div>
          ) : (
            communiques.map((c) => (
              <div key={c.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'var(--navy)', color: '#fff', padding: '2px 8px', fontWeight: 'bold' }}>{c.date_publication ? new Date(c.date_publication).toLocaleDateString('fr-FR') : 'Sans date'}</span>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--dark)' }}>{c.titre}</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(c)} className="admin-btn" style={{ background: 'var(--navy)', color: '#fff', fontSize: '0.75rem', padding: '6px 12px' }}>Modifier</button>
                  <button onClick={() => handleDelete(c.id)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', fontSize: '0.75rem', padding: '6px 12px' }}>Supprimer</button>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <form onSubmit={handleSave} className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="admin-card-title" style={{ margin: 0 }}>{view === 'edit' ? 'Modifier' : 'Nouveau communiqué'}</h3>
            <button type="button" onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>
          <div className="admin-form-group"><label>Titre <span style={{color:'red'}}>*</span></label><input type="text" value={form.titre} onChange={setF('titre')} required /></div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="admin-form-group" style={{ flex: 1 }}><label>Date</label><input type="date" value={form.date_publication} onChange={setF('date_publication')} /></div>
            <div className="admin-form-group" style={{ flex: 2 }}><label>Lien du document <span style={{color:'red'}}>*</span></label><input type="text" value={form.url_document} onChange={setF('url_document')} required /></div>
          </div>
          <div className="admin-form-group"><label>Résumé</label><textarea value={form.resume} onChange={setF('resume')} rows="3"></textarea></div>
          <button type="submit" disabled={saving || !form.titre || !form.url_document} className="admin-btn admin-btn-primary" style={{marginTop:'10px'}}>{saving ? 'Sauvegarde...' : 'Publier'}</button>
        </form>
      )}
    </div>
  );
}

// ==========================================
// ONGLET 2 : PLATEFORMES & RÉSEAUX
// ==========================================
function PlateformesTab() {
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [message, setMessage] = useState(null);

  const [view, setView] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titre: '', description: '', lien_url: '', type_plateforme: 'YouTube', image_fond: '' });

  useEffect(() => { fetchPlates(); }, []);

  const fetchPlates = async () => {
    setLoading(true); setDbError(false);
    const { data, error } = await supabase.from('plateformes_media').select('*').order('created_at', { ascending: true });
    if (error) {
      if (error.code === '42P01') setDbError(true);
      else setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } else { setPlates(data || []); }
    setLoading(false);
  };

  const handleCreateNew = () => {
    setForm({ titre: '', description: '', lien_url: '', type_plateforme: 'YouTube', image_fond: '' });
    setEditTarget(null); setView('new'); setMessage(null);
  };

  const handleEdit = (item) => {
    setForm({ ...item, image_fond: item.image_fond || '' });
    setEditTarget(item); setView('edit'); setMessage(null);
  };

  const setF = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    let error;

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase.from('plateformes_media').update(form).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('plateformes_media').insert([form]));
    }

    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Plateforme mise à jour !' : 'Plateforme ajoutée !' });
      await fetchPlates();
      setView('list');
    }
    setSaving(false); setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette plateforme ?")) return;
    const { error } = await supabase.from('plateformes_media').delete().eq('id', id);
    if (!error) { setMessage({ type: 'success', text: 'Plateforme supprimée.' }); fetchPlates(); }
    setTimeout(() => setMessage(null), 3000);
  };

  if (dbError) return <div className="admin-card" style={{borderColor:'red'}}>La table plateformes_media n'existe pas.</div>;

  return (
    <div>
      {message && <div className={`admin-alert ${message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`} style={{marginBottom:'20px'}}><span style={{marginLeft:'8px'}}>{message.text}</span></div>}
      {view === 'list' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={handleCreateNew} className="admin-btn admin-btn-primary">+ Ajouter une Plateforme</button>
          </div>
          {loading ? <div className="admin-card text-center text-gray">Chargement...</div> : plates.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <p style={{ marginBottom: '16px' }}>Aucune plateforme Web TV ou réseau social configuré pour le moment.</p>
              <button onClick={handleCreateNew} className="admin-btn admin-btn-primary">Ajouter la première plateforme</button>
            </div>
          ) : (
            plates.map((p) => (
              <div key={p.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', color: 'var(--dark)' }}>
                    [{p.type_plateforme}] {p.titre}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{p.lien_url}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(p)} className="admin-btn" style={{ background: 'var(--navy)', color: '#fff', fontSize: '0.75rem', padding: '6px 12px' }}>Modifier</button>
                  <button onClick={() => handleDelete(p.id)} className="admin-btn" style={{ background: '#ff4d4f', color: '#fff', fontSize: '0.75rem', padding: '6px 12px' }}>Supprimer</button>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <form onSubmit={handleSave} className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="admin-card-title" style={{ margin: 0 }}>{view === 'edit' ? 'Modifier Plateforme' : 'Nouvelle Plateforme'}</h3>
            <button type="button" onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="admin-form-group" style={{ flex: 3 }}><label>Titre du bloc <span style={{color:'red'}}>*</span></label><input type="text" value={form.titre} onChange={setF('titre')} required /></div>
            <div className="admin-form-group" style={{ flex: 1 }}><label>Réseau <span style={{color:'red'}}>*</span></label>
              <select value={form.type_plateforme} onChange={setF('type_plateforme')} style={{width: '100%', padding:'12px', border: '1px solid #ccc'}}>
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group"><label>Lien URL de redirection <span style={{color:'red'}}>*</span></label><input type="url" value={form.lien_url} onChange={setF('lien_url')} required placeholder="ex: https://youtube.com/..." /></div>
          
          <div className="admin-form-group"><label>URL de l'image de fond (Optionnelle)</label><input type="url" value={form.image_fond} onChange={setF('image_fond')} placeholder="https://..." /></div>

          <div className="admin-form-group"><label>Description <span style={{color:'red'}}>*</span></label><textarea value={form.description} onChange={setF('description')} rows="3" required></textarea></div>
          
          <button type="submit" disabled={saving || !form.titre || !form.lien_url} className="admin-btn admin-btn-primary" style={{marginTop:'10px'}}>{saving ? 'Sauvegarde...' : 'Enregistrer'}</button>
        </form>
      )}
    </div>
  );
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
function AdminMedia() {
  const [activeTab, setActiveTab] = useState('communiques');

  return (
    <div>
      <h2 className="admin-section-title" style={{ marginBottom: '8px' }}>Espace Média</h2>
      <p className="admin-section-description" style={{ marginBottom: '24px' }}>Gérez les communiqués de presse et redéfinissez les teasers Youtube/Insta.</p>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #eaeaea', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('communiques')} 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'communiques' ? '3px solid var(--navy)' : '3px solid transparent', color: activeTab === 'communiques' ? 'var(--navy)' : '#666', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          Communiqués de Presse
        </button>
        <button 
          onClick={() => setActiveTab('plateformes')} 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'plateformes' ? '3px solid var(--red)' : '3px solid transparent', color: activeTab === 'plateformes' ? 'var(--red)' : '#666', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          Teasers Réseaux
        </button>
      </div>

      {activeTab === 'communiques' ? <CommuniquesTab /> : <PlateformesTab />}

    </div>
  );
}

export default AdminMedia;
