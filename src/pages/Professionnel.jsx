import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/SimplePage.css';

function Professionnel() {
  return (
    <>
      <Navbar />
      <main className="simple-page">
        <div className="container">
          <div className="simple-page-header">
            <span className="section-tag" style={{color: 'var(--blue)'}}>Nous rejoindre</span>
            <h1 className="simple-page-title">Professionnel</h1>
            <div className="simple-page-divider" style={{backgroundColor: 'var(--blue)'}}></div>
          </div>
          <div className="simple-page-content">
            <div className="simple-card" style={{borderLeftColor: 'var(--blue)'}}>
              <h2>Opportunités Professionnelles</h2>
              <p>Les offres d'emploi et les opportunités professionnelles seront publiées sur cette page.</p>
              <Link to="/" className="simple-btn" style={{backgroundColor: 'var(--blue)'}}>Retourner à l'accueil</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Professionnel;
