import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Nous from './pages/Nous';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminBannieres from './pages/admin/AdminBannieres';
import AdminArticles from './pages/admin/AdminArticles';
import AdminPartenaires from './pages/admin/AdminPartenaires';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* ── Site public ── */}
          <Route path="/" element={<Home />} />
          <Route path="/nous" element={<Nous />} />
          <Route path="/login" element={<Login />} />

          {/* ── Admin (routes imbriquées) ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="bannieres"    element={<AdminBannieres />} />
            <Route path="articles"     element={<AdminArticles />} />
            <Route path="partenaires"  element={<AdminPartenaires />} />
            {/* Toute route admin inconnue → tableau de bord */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
