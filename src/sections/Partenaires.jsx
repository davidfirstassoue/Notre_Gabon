import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/sections/Partenaires.css';

/* Fallback logos si la DB est vide */
const PLACEHOLDER_LOGOS = [
  { id: 'p1', name: 'Partenaire 1', logo_url: 'https://dummyimage.com/160x60/e8e8e8/999999.png&text=LOGO+1' },
  { id: 'p2', name: 'Partenaire 2', logo_url: 'https://dummyimage.com/160x60/e8e8e8/999999.png&text=LOGO+2' },
  { id: 'p3', name: 'Partenaire 3', logo_url: 'https://dummyimage.com/160x60/e8e8e8/999999.png&text=LOGO+3' },
  { id: 'p4', name: 'Partenaire 4', logo_url: 'https://dummyimage.com/160x60/e8e8e8/999999.png&text=LOGO+4' },
  { id: 'p5', name: 'Partenaire 5', logo_url: 'https://dummyimage.com/160x60/e8e8e8/999999.png&text=LOGO+5' },
  { id: 'p6', name: 'Partenaire 6', logo_url: 'https://dummyimage.com/160x60/e8e8e8/999999.png&text=LOGO+6' },
];

function Partenaires() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchPartenaires = async () => {
      const { data, error } = await supabase
        .from('partenaires')
        .select('*')
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setLogos(data);
      } else {
        setLogos(PLACEHOLDER_LOGOS);
      }
    };
    fetchPartenaires();
  }, []);

  /* Require enough logos to fill the screen width for the marquee to work. 
     We duplicate the array until we have at least 6 logos before doing the marquee duplicate */
  let baseList = [...logos];
  if (baseList.length > 0) {
    while (baseList.length < 8) {
      baseList = [...baseList, ...logos];
    }
  }
  
  /* Duplicate the list to create a seamless infinite loop (two identical halves) */
  const duplicated = [...baseList, ...baseList];

  return (
    <section className="partenaires-section">
      <div className="partenaires-title-row">
        <span className="partenaires-title-line" />
        <p className="partenaires-title">Ils soutiennent notre action</p>
        <span className="partenaires-title-line" />
      </div>

      <div className="partenaires-marquee-wrapper">
        <div className="partenaires-marquee-track">
          {duplicated.map((logo, idx) => (
            <div key={`${logo.id}-${idx}`} className="partenaire-logo">
              <img src={logo.logo_url} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partenaires;
