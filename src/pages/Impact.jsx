import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/SimplePage.css';

function Impact() {
  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--dark)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Impact</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--dark)'}}></div>
          </div>
          <div className="simple-page-content">
            <div className="simple-card" style={{borderLeftColor: 'var(--dark)'}}>
              <h2>Mesure de Notre Impact</h2>
              <p>Rapports annuels, statistiques directes et projets réalisés seront exposés ici.</p>
              <Link to="/" className="simple-btn" style={{backgroundColor: 'var(--dark)'}}>Retourner à l'accueil</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Impact;
