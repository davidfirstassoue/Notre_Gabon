import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/sections/Mission.css';

const DEFAULT_MAIN = {
  title: "Une organisation humanitaire médicale internationale et indépendante",
  content: "Nous apportons une aide médicale aux populations touchées par les conflits, les épidémies, les catastrophes naturelles ou l'exclusion des soins de santé. Nos équipes sont composées de dizaines de milliers de professionnels de santé, de personnel logistique et administratif, recrutés pour la plupart localement. Nos actions sont guidées par l'éthique médicale et les <strong>principes d'impartialité, d'indépendance et de neutralité</strong>.",
  button_text: "APPRENDRE ENCORE PLUS",
  button_link: "#"
};

const DEFAULT_REPORT = {
  title: "Rapport sur les activités internationales 2024",
  button_text: "LIRE LE RAPPORT",
  button_link: "#"
};

const DEFAULT_STATS = [
  { value: '16,5 m', label: 'CONSULTATIONS EXTERNES' },
  { value: '3,9 M', label: 'CAS DE PALUDISME TRAITÉS' },
  { value: '1,7 m', label: 'PATIENTS ADMIS' },
  { value: '75', label: 'PAYS' },
];

function Mission() {
  const [mainContent, setMainContent] = useState(DEFAULT_MAIN);
  const [reportData, setReportData] = useState(DEFAULT_REPORT);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .in('section_key', ['mission_main', 'mission_report', 'mission_stats']);

        if (error) {
          console.warn('Erreur de récupération Mission:', error);
        } else if (data && data.length > 0) {
          const main = data.find(item => item.section_key === 'mission_main');
          const report = data.find(item => item.section_key === 'mission_report');
          const statsRow = data.find(item => item.section_key === 'mission_stats');

          if (main) {
            setMainContent({
              title: main.title || DEFAULT_MAIN.title,
              content: main.content || DEFAULT_MAIN.content,
              button_text: main.button_text || DEFAULT_MAIN.button_text,
              button_link: main.button_link || DEFAULT_MAIN.button_link
            });
          }
          if (report) {
            setReportData({
              title: report.title || DEFAULT_REPORT.title,
              button_text: report.button_text || DEFAULT_REPORT.button_text,
              button_link: report.button_link || DEFAULT_REPORT.button_link
            });
          }
          if (statsRow && statsRow.content) {
            try {
              const parsedStats = JSON.parse(statsRow.content);
              if (Array.isArray(parsedStats) && parsedStats.length > 0) {
                setStats(parsedStats);
              }
            } catch (e) {
              console.error("Format JSON invalide dans mission_stats:", e);
            }
          }
        }
      } catch (err) {
        console.warn('Mission: chargement échoué, utilisation du fallback.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, []);

  return (
    <section className="mission-section">
      <div className="container">
        
        {/* ── Text Presentation ── */}
        <div className="mission-content" style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s' }}>
          <h2 className="mission-title">
            {mainContent.title}
          </h2>
          <p 
            className="mission-description" 
            dangerouslySetInnerHTML={{ __html: mainContent.content.replace(/\ng/g, '<br/>') }} 
          />
          {mainContent.button_text && (
            <a href={mainContent.button_link || '#'} className="mission-btn">
              {mainContent.button_text}
            </a>
          )}
        </div>

        {/* ── Statistics Grid ── */}
        <div className="mission-stats-wrapper">
          <div className="mission-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="mission-stat-item">
                <span className="mission-stat-value">{stat.value}</span>
                <span className="mission-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* ── Download Footer ── */}
          <div className="mission-download-bar">
            <div className="mission-download-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>{reportData.title}</span>
            </div>
            {reportData.button_text && (
              <a href={reportData.button_link || '#'} className="mission-download-btn">
                {reportData.button_text}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Mission;
