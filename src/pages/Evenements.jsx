import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/SimplePage.css';

function Evenements() {
  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--green)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Événements</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--green)'}}></div>
          </div>
          <div className="simple-page-content">
            <div className="simple-card" style={{borderLeftColor: 'var(--green)'}}>
              <h2>Page en construction</h2>
              <p>Cette rubrique sera complétée très prochainement avec nos futurs événements et rendez-vous importants.</p>
              <Link to="/" className="simple-btn" style={{backgroundColor: 'var(--green)'}}>Retourner à l'accueil</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Evenements;
