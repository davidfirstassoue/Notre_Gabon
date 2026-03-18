import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/SimplePage.css';

function Benevolat() {
  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--yellow)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Bénévolat</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--yellow)'}}></div>
          </div>
          <div className="simple-page-content">
            <div className="simple-card" style={{borderLeftColor: 'var(--yellow)'}}>
              <h2>Devenir Bénévole</h2>
              <p>Les informations pour nous rejoindre en tant que bénévole seront bientôt disponibles ici.</p>
              <Link to="/" className="simple-btn" style={{backgroundColor: 'var(--yellow)', color: '#fff'}}>Retourner à l'accueil</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Benevolat;
