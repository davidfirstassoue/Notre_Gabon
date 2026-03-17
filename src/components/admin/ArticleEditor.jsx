import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

/* ─── Vue liste des articles ─────────────────────────── */
function ArticleList({ articles, onEdit, onDelete, onNew }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </h2>
        <button onClick={onNew} className="admin-btn admin-btn-primary" style={{ padding: '9px 18px' }}>
          + Nouvel article
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ marginBottom: '16px' }}>Aucun article publié pour le moment.</p>
          <button onClick={onNew} className="admin-btn admin-btn-primary">Créer le premier article</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {articles.map((article) => (
            <ArticleRow key={article.id} article={article} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Ligne d'article dans la liste ─────────────────── */
function ArticleRow({ article, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="admin-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
      {/* Miniature */}
      {article.image_url ? (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, overflow: 'hidden', background: '#eee' }}>
          <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ width: '80px', height: '56px', flexShrink: 0, background: '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="0"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--dark)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {article.title}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {article.category && <span style={{ background: 'var(--green)', color: '#fff', padding: '1px 6px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>{article.category}</span>}
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
        <button
          onClick={() => onEdit(article)}
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
              onClick={() => onDelete(article.id)}
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
const EMPTY_FORM = { title: '', excerpt: '', content: '', image_url: '', category: '', created_at: new Date().toISOString().split('T')[0] };
const CATEGORIES = ['Mission', 'Éducation', 'Santé', 'Environnement', 'Société', 'Soutien', 'Événement', 'Autre'];

function ArticleForm({ initial, onSave, onCancel, onUpload, saving }) {
  // Format the initial date to YYYY-MM-DD for the date input if it exists
  const parsedInitial = initial ? { ...initial, created_at: new Date(initial.created_at).toISOString().split('T')[0] } : EMPTY_FORM;
  const [form, setForm] = useState(parsedInitial);
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
    if (!form.title.trim()) return;
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
          ← Articles
        </button>
        <span>/</span>
        <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{isEditing ? 'Modifier l\'article' : 'Nouvel article'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3 className="admin-card-title">{isEditing ? 'Modifier l\'article' : 'Créer un nouvel article'}</h3>

          {/* Titre */}
          <div className="admin-form-group">
            <label>Titre <span style={{ color: '#f00' }}>*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="Titre de l'article..."
              required
            />
          </div>

          {/* Catégorie & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
            <div className="admin-form-group">
              <label>Catégorie</label>
              <select
                value={form.category || ''}
                onChange={set('category')}
              >
                <option value="">— Choisir —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Date de publication</label>
              <input
                type="date"
                value={form.created_at}
                onChange={set('created_at')}
                required
              />
            </div>
          </div>

          {/* Extrait */}
          <div className="admin-form-group">
            <label>Extrait / Résumé</label>
            <textarea
              rows="3"
              value={form.excerpt}
              onChange={set('excerpt')}
              placeholder="Court résumé visible sur la page d'accueil..."
            />
          </div>

          {/* Contenu complet */}
          <div className="admin-form-group">
            <label>Contenu complet</label>
            <textarea
              rows="8"
              value={form.content}
              onChange={set('content')}
              placeholder="Rédigez le contenu complet de l'article ici..."
            />
          </div>

          {/* Image */}
          <div className="admin-form-group">
            <label>Image de couverture</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {form.image_url && (
                <div style={{ width: '150px', height: '100px', flexShrink: 0, overflow: 'hidden', background: '#eee', border: '1px solid #ddd' }}>
                  <img src={form.image_url} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  value={form.image_url}
                  onChange={set('image_url')}
                  placeholder="Ou collez une URL d'image..."
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={saving || uploading}
              className="admin-btn admin-btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? 'Enregistrement…' : isEditing ? 'Sauvegarder les modifications' : 'Publier l\'article'}
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

/* ─── Composant principal ArticleEditor ─────────────── */
function ArticleEditor() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');       // 'list' | 'new' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setArticles(data || []);
    setLoading(false);
  };

  const handleUpload = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `articles/article-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('site-images').upload(path, file);
    if (error) { setMessage({ type: 'error', text: `Erreur upload: ${error.message}` }); return null; }
    return supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl;
  };

  const handleSave = async (form) => {
    setSaving(true);
    setMessage(null);
    let error;

    const dataToSave = {
      ...form,
      // Convert the input date (YYYY-MM-DD) back to an ISO string for Supabase
      created_at: new Date(form.created_at).toISOString(),
    };

    if (view === 'edit' && editTarget) {
      ({ error } = await supabase
        .from('articles')
        .update({ ...dataToSave, updated_at: new Date() })
        .eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('articles').insert([dataToSave]));
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: view === 'edit' ? 'Article mis à jour !' : 'Article publié !' });
      await fetchArticles();
      setView('list');
      setEditTarget(null);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Article supprimé.' }); await fetchArticles(); }
    setSaving(false);
  };

  if (loading) return (
    <div className="admin-card" style={{ textAlign: 'center', color: '#888' }}>Chargement des articles…</div>
  );

  return (
    <div>
      {/* Message flash */}
      {message && (
        <div className={`admin-alert ${message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`} style={{ marginBottom: '20px' }}>
          {message.type === 'success'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
          }
          {message.text}
        </div>
      )}

      {(view === 'list') && (
        <ArticleList
          articles={articles}
          onEdit={(a) => { setEditTarget(a); setView('edit'); setMessage(null); }}
          onDelete={handleDelete}
          onNew={() => { setEditTarget(null); setView('new'); setMessage(null); }}
        />
      )}

      {(view === 'new' || view === 'edit') && (
        <ArticleForm
          initial={view === 'edit' ? editTarget : null}
          onSave={handleSave}
          onCancel={() => { setView('list'); setEditTarget(null); setMessage(null); }}
          onUpload={handleUpload}
          saving={saving}
        />
      )}
    </div>
  );
}

export default ArticleEditor;
