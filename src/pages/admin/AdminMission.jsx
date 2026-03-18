import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/admin.css';

function AdminMission() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [mainContent, setMainContent] = useState({
    title: '', content: '', button_text: '', button_link: ''
  });
  const [reportData, setReportData] = useState({
    title: '', button_text: '', button_link: ''
  });
  // 4 statistiques par défaut du thème
  const [stats, setStats] = useState([
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .in('section_key', ['mission_main', 'mission_report', 'mission_stats']);

      if (error) throw error;

      if (data) {
        const main = data.find(d => d.section_key === 'mission_main');
        if (main) {
          setMainContent({
            title: main.title || '',
            content: main.content || '',
            button_text: main.button_text || '',
            button_link: main.button_link || ''
          });
        }

        const report = data.find(d => d.section_key === 'mission_report');
        if (report) {
          setReportData({
            title: report.title || '',
            button_text: report.button_text || '',
            button_link: report.button_link || ''
          });
        }

        const statsRow = data.find(d => d.section_key === 'mission_stats');
        if (statsRow && statsRow.content) {
          try {
            const parsed = JSON.parse(statsRow.content);
            if (Array.isArray(parsed) && parsed.length >= 4) {
              setStats(parsed.slice(0, 4));
            }
          } catch (e) {
             console.error("Format JSON invalide", e);
          }
        }
      }
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors du chargement des données. Assurez-vous d\'avoir injecté les données SQL par défaut.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upsert: Le paramètre id ou les constraints onConflict doivent correspondre pour que Supabase fasse un Update sinon c'est un Insert
      // Puisque section_key est unique dans notre logique, mettons à jour si ça existe déjà.
      const payloadMain = {
        section_key: 'mission_main',
        title: mainContent.title,
        content: mainContent.content,
        button_text: mainContent.button_text,
        button_link: mainContent.button_link,
        updated_at: new Date()
      };
      
      const payloadReport = {
        section_key: 'mission_report',
        title: reportData.title,
        button_text: reportData.button_text,
        button_link: reportData.button_link,
        updated_at: new Date()
      };
      
      const payloadStats = {
        section_key: 'mission_stats',
        content: JSON.stringify(stats),
        updated_at: new Date()
      };

      // Si la table de base n'a pas de primary key, .upsert sans paramètre id pourrait générer plusieurs records.
      // Une autre approche est de Delete puis Insert si onConflict ne marche pas.
      
      // On tente l'upsert par section_key (si ce n'est pas contraint unique en DB, ça insère en doublon).
      // Dans le doute, on supprime toujours puis on insère :
      await supabase.from('site_content').delete().in('section_key', ['mission_main', 'mission_report', 'mission_stats']);
      
      const { error } = await supabase.from('site_content').insert([payloadMain, payloadReport, payloadStats]);
      
      if (error) throw error;

      showMessage('Modifications enregistrées avec succès', 'success');
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Section Mission & Chiffres Clés</h1>
        <p className="admin-page-subtitle">Gérez le texte central et les statistiques affichées sur la page d'accueil sous la bannière.</p>
      </div>

      {message.text && (
        <div className={`admin-alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="admin-form">
        
        {/* --- Text Principal --- */}
        <div className="admin-card">
          <h2 className="admin-card-title">Texte Principal</h2>
          <div className="admin-form-group">
            <label>Titre principal</label>
            <input 
              type="text" 
              className="admin-input" 
              value={mainContent.title}
              onChange={(e) => setMainContent({...mainContent, title: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Description détaillée (HTML autorisé, par exemple &lt;strong&gt;pour le gras&lt;/strong&gt;)</label>
            <textarea 
              className="admin-input" 
              rows="6"
              value={mainContent.content}
              onChange={(e) => setMainContent({...mainContent, content: e.target.value})}
              required
            ></textarea>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Texte du bouton</label>
              <input type="text" className="admin-input" value={mainContent.button_text} onChange={(e) => setMainContent({...mainContent, button_text: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Lien du bouton</label>
              <input type="text" className="admin-input" value={mainContent.button_link} onChange={(e) => setMainContent({...mainContent, button_link: e.target.value})} />
            </div>
          </div>
        </div>

        {/* --- Statistiques --- */}
        <div className="admin-card">
          <h2 className="admin-card-title">Chiffres Clés (Statistiques)</h2>
          <div className="admin-stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="admin-stat-card">
                <div style={{fontWeight: 700, marginBottom: '10px', color: 'var(--blue)'}}>Statistique N°{idx + 1}</div>
                <div className="admin-form-group">
                  <label>Valeur (ex: 16,5 m)</label>
                  <input type="text" className="admin-input" value={stat.value} onChange={(e) => handleStatChange(idx, 'value', e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Libellé (ex: PAYS)</label>
                  <input type="text" className="admin-input" value={stat.label} onChange={(e) => handleStatChange(idx, 'label', e.target.value)} required />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Rapport --- */}
        <div className="admin-card">
          <h2 className="admin-card-title">Bannière Rapport Annuel</h2>
          <div className="admin-form-group">
            <label>Titre du rapport</label>
            <input type="text" className="admin-input" value={reportData.title} onChange={(e) => setReportData({...reportData, title: e.target.value})} />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
               <label>Texte du bouton</label>
               <input type="text" className="admin-input" value={reportData.button_text} onChange={(e) => setReportData({...reportData, button_text: e.target.value})} />
            </div>
            <div className="admin-form-group">
               <label>Lien du bouton (ex: /rapport.pdf)</label>
               <input type="text" className="admin-input" value={reportData.button_link} onChange={(e) => setReportData({...reportData, button_link: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminMission;
