import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Actualites from '../sections/Actualites';
import Mission from '../sections/Mission';
import HomeEvenements from '../sections/HomeEvenements';
import HomeBenevolat from '../sections/HomeBenevolat';
import HomeMentorat from '../sections/HomeMentorat';
import HomeMedia from '../sections/HomeMedia';

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Actualites />
        <HomeEvenements />
        <Mission />
        <HomeBenevolat />
        <HomeMentorat />
        <HomeMedia />
      </main>
    </>
  );
}

export default Home;
