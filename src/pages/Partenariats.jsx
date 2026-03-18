import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/SimplePage.css';

function Partenariats() {
  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--blue)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Sponsoring & Partenariats</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--blue)'}}></div>
          </div>
          <div className="simple-page-content">
            <div className="simple-card" style={{borderLeftColor: 'var(--blue)'}}>
              <h2>Soutenez Notre Gabon</h2>
              <p>Découvrez comment votre entreprise peut devenir partenaire de nos événements et projets.</p>
              <Link to="/" className="simple-btn" style={{backgroundColor: 'var(--blue)'}}>Retourner à l'accueil</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Partenariats;
