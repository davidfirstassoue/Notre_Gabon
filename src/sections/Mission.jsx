import '../styles/sections/Mission.css';

// TODO: These facts will eventually come from Supabase in the real app format
const STATS = [
  { value: '16,5 m', label: 'CONSULTATIONS EXTERNES' },
  { value: '3,9 M', label: 'CAS DE PALUDISME TRAITÉS' },
  { value: '1,7 m', label: 'PATIENTS ADMIS' },
  { value: '75', label: 'PAYS' },
];

function Mission() {
  return (
    <section className="mission-section">
      <div className="container">
        
        {/* ── Text Presentation ── */}
        <div className="mission-content">
          <h2 className="mission-title">
            Une organisation humanitaire médicale internationale et indépendante
          </h2>
          <p className="mission-description">
            Nous apportons une aide médicale aux populations touchées par les conflits, les épidémies, les catastrophes naturelles ou l'exclusion des soins de santé. Nos équipes sont composées de dizaines de milliers de professionnels de santé, de personnel logistique et administratif, recrutés pour la plupart localement. Nos actions sont guidées par l'éthique médicale et les <strong>principes d'impartialité, d'indépendance et de neutralité</strong>.
          </p>
          <a href="#" className="mission-btn">APPRENDRE ENCORE PLUS</a>
        </div>

        {/* ── Statistics Grid ── */}
        <div className="mission-stats-wrapper">
          <div className="mission-stats-grid">
            {STATS.map((stat, index) => (
              <div key={index} className="mission-stat-item">
                <span className="mission-stat-value">{stat.value}</span>
                <span className="mission-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* ── Download Footer ── */}
          <div className="mission-download-bar">
            <div className="mission-download-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>Rapport sur les activités internationales 2024</span>
            </div>
            <a href="#" className="mission-download-btn">
              LIRE LE RAPPORT
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Mission;
