import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Actualites from '../sections/Actualites';
import Mission from '../sections/Mission';

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Actualites />
        <Mission />
      </main>
    </>
  );
}

export default Home;
