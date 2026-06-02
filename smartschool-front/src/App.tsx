import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { PrivateRoute } from './router/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages protégées (seront rendues dans le layout)
import Dashboard from './pages/Dashboard/Dashboard';
import Etablissements from './pages/Admin/Etablissements';
import Departements from './pages/Admin/Departements';
import Niveaux from './pages/Admin/Niveaux';
import UEs from './pages/Admin/UEs';
import Annees from './pages/Admin/Annees';
import Enseignants from './pages/Admin/Enseignants';

// À ajouter plus tard (scolarite, finance, reporting...)
// import Etudiants from './pages/Scolarite/Etudiants';
// ...

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stefanmouope/register" element={<Register />} />

          {/* Routes protégées avec le layout principal */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/etablissements" element={<Etablissements />} />
              <Route path="/admin/departements" element={<Departements />} />
              <Route path="/admin/niveaux" element={<Niveaux />} />
              <Route path="/admin/ues" element={<UEs />} />
              <Route path="/admin/annees" element={<Annees />} />
              <Route path="/admin/enseignants" element={<Enseignants />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;