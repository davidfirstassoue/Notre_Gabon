import Navbar from '../components/Navbar';
import Partenaires from '../sections/Partenaires';
import Footer from '../components/Footer';

function Offre() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
            Nos Offres & Partenariats
          </h1>
          <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Découvrez comment nous collaborons avec différentes organisations pour mener à bien nos missions sur le terrain.
          </p>
        </div>
        
        <div style={{ flex: 1 }}>
          <Partenaires />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Offre;
