import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Nous from './pages/Nous';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminBannieres from './pages/admin/AdminBannieres';
import AdminArticles from './pages/admin/AdminArticles';
import AdminEvenements from './pages/admin/AdminEvenements';
import AdminBenevolat from './pages/admin/AdminBenevolat';
import AdminProfessionnel from './pages/admin/AdminProfessionnel';
import AdminDialogue from './pages/admin/AdminDialogue';
import AdminMedia from './pages/admin/AdminMedia';
import AdminPartenaires from './pages/admin/AdminPartenaires';
import AdminMission from './pages/admin/AdminMission';
import ActualitesPage from './pages/ActualitesPage';
import ArticleDetail from './pages/ArticleDetail';
import Evenements from './pages/Evenements';
import EvenementDetail from './pages/EvenementDetail';
import Benevolat from './pages/Benevolat';
import Professionnel from './pages/Professionnel';
import Dialogue from './pages/Dialogue';
import Media from './pages/Media';
import Partenariats from './pages/Partenariats';
import Impact from './pages/Impact';
import Footer from './components/Footer';
import './styles/App.css';

// Composant pour afficher le footer conditionnellement
function FooterWithCondition() {
  const location = useLocation();
  // Ne pas afficher sur les pages admin
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null;
  }
  return <Footer />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* ── Site public ── */}
          <Route path="/" element={<Home />} />
          <Route path="/nous" element={<Nous />} />
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/actualites/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/evenements/:id" element={<EvenementDetail />} />
          <Route path="/benevolat" element={<Benevolat />} />
          <Route path="/professionnel" element={<Professionnel />} />
          <Route path="/dialogue" element={<Dialogue />} />
          <Route path="/media" element={<Media />} />
          <Route path="/partenariats" element={<Partenariats />} />
          <Route path="/impact" element={<Impact />} />

          {/* ── Admin (routes imbriquées) ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="bannieres"    element={<AdminBannieres />} />
            <Route path="mission"      element={<AdminMission />} />
            <Route path="articles"     element={<AdminArticles />} />
            <Route path="evenements"   element={<AdminEvenements />} />
            <Route path="benevolat"    element={<AdminBenevolat />} />
            <Route path="professionnel" element={<AdminProfessionnel />} />
            <Route path="dialogue"     element={<AdminDialogue />} />
            <Route path="media"        element={<AdminMedia />} />
            <Route path="partenaires"  element={<AdminPartenaires />} />
            {/* Toute route admin inconnue → tableau de bord */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
        <FooterWithCondition />
      </div>
    </Router>
  );
}

export default App;
