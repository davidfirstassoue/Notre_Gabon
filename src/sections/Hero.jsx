import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/sections/Hero.css';

// Slides de secours affichées si Supabase ne retourne aucune donnée
const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    image_url: '/herobanner_ultra_hd.webp',
    title: 'Notre Gabon\nEnsemble pour un avenir meilleur',
    content: 'Agir pour le développement durable et le bien-être des communautés gabonaises.',
  },
  {
    id: 'fallback-2',
    image_url: '/banner2.png',
    title: 'Rejoignez notre cause',
    content: '',
  },
];
const INTERVAL_MS = 10000; // 10 secondes

const Hero = () => {
  const [currentDot, setCurrentDot] = useState(0);
  const [offset, setOffset]         = useState(0);
  const [animated, setAnimated]     = useState(true);
  const [slides, setSlides]         = useState([]);
  const [loading, setLoading]       = useState(true);

  // Refs pour éviter les stale closures dans setInterval
  const offsetRef     = useRef(0);
  const intervalRef   = useRef(null);
  const isJumping     = useRef(false);

  const slideCount = slides.length;
  // Toutes les slides + clone de la première à la fin (boucle infinie)
  const allSlides = slideCount > 0 ? [...slides, slides[0]] : [];

  const advance = useCallback(() => {
    if (isJumping.current || slideCount <= 1) return;
    const next = offsetRef.current + 1;
    offsetRef.current = next;
    setAnimated(true);
    setOffset(next);
    setCurrentDot(next % slideCount);
  }, [slideCount]);

  const startInterval = useCallback(() => {
    if (slideCount <= 1) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advance, INTERVAL_MS);
  }, [advance, slideCount]);

  useEffect(() => {
    const fetchHeroContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('section_key', 'hero')
          .order('id', { ascending: true });

        if (error) {
          console.warn('Hero: erreur Supabase, utilisation des slides de secours.', error);
          setSlides(FALLBACK_SLIDES);
        } else if (data && data.length > 0) {
          setSlides(data);
        } else {
          // Table vide → on utilise les slides statiques
          setSlides(FALLBACK_SLIDES);
        }
      } catch (err) {
        console.warn('Hero: fetch échoué, utilisation des slides de secours.', err);
        setSlides(FALLBACK_SLIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      startInterval();
    }
    return () => clearInterval(intervalRef.current);
  }, [startInterval, slides]);

  // Fix : quand l'onglet redevient visible, on remet le carousel dans un état propre.
  // Le navigateur suspend les timers et les animations CSS quand la page est cachée,
  // ce qui peut laisser isJumping.current=true et bloquer toute avance.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page cachée → on arrête l'interval pour éviter les dérèglements
        clearInterval(intervalRef.current);
      } else {
        // Page visible → on remet tout à zéro proprement
        isJumping.current = false;
        // On désactive l'animation le temps d'un frame pour repositionner sans glitch
        setAnimated(false);
        const safeOffset = offsetRef.current % (slideCount || 1);
        offsetRef.current = safeOffset;
        setOffset(safeOffset);
        setCurrentDot(safeOffset);
        requestAnimationFrame(() => {
          setAnimated(true);
          startInterval();
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [slideCount, startInterval]);

  // Quand on arrive sur le clone (position REAL_COUNT), on saute silencieusement à 0
  const handleTransitionEnd = () => {
    if (offsetRef.current === slideCount && slideCount > 0) {
      isJumping.current = true;
      setAnimated(false);
      setOffset(0);
      offsetRef.current = 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isJumping.current = false;
          setAnimated(true);
        });
      });
    }
  };

  const goToDot = (index) => {
    if (index === offsetRef.current % slideCount) return;
    clearInterval(intervalRef.current);
    offsetRef.current = index;
    setAnimated(true);
    setOffset(index);
    setCurrentDot(index);
    startInterval();
  };

  const formatTitle = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  // Pendant le chargement, on affiche déjà la première slide statique pour éviter le flash blanc
  const displaySlides = loading ? FALLBACK_SLIDES : slides;
  const displayLoading = loading;

  // Recalcule allSlides à partir de displaySlides
  const displaySlideCount = displaySlides.length;
  const displayAllSlides = displaySlideCount > 0 ? [...displaySlides, displaySlides[0]] : [];

  return (
    <section className="hero-section">
      <div className="hero-bg">
        <div
          className="slideshow-track"
          style={{
            width: `${displayAllSlides.length * 100}vw`,
            transform: `translateX(-${displayLoading ? 0 : offset * 100}vw)`,
            transition: animated && !displayLoading ? 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayAllSlides.map((slide, i) => (
            <div key={i} className="slide">
              <img src={slide.image_url || '/herobanner_ultra_hd.webp'} alt={slide.title || ''} />
              <div className="overlay"></div>
              {!displayLoading && (
                <div className="container hero-content">
                  <h1>{formatTitle(slide.title)}</h1>
                  {slide.content && <p>{slide.content}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!displayLoading && displaySlideCount > 1 && (
        <div className="carousel-indicators">
          {displaySlides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentDot ? 'active' : ''}`}
              onClick={() => goToDot(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
