import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/SimplePage.css';

function Dialogue() {
  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--green)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Dialogue</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--green)'}}></div>
          </div>
          <div className="simple-page-content">
            <div className="simple-card" style={{borderLeftColor: 'var(--green)'}}>
              <h2>Espace de Dialogue</h2>
              <p>Cet espace dédié aux échanges et au dialogue sera bientôt ouvert au public.</p>
              <Link to="/" className="simple-btn" style={{backgroundColor: 'var(--green)'}}>Retourner à l'accueil</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Dialogue;
