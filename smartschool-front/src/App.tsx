import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { PrivateRoute } from './router/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages protégées
import Dashboard from './pages/Dashboard/Dashboard';
import Etablissements from './pages/Admin/Etablissements';
import Departements from './pages/Admin/Departements';
import Niveaux from './pages/Admin/Niveaux';
import UEs from './pages/Admin/UEs';
import Annees from './pages/Admin/Annees';
import Enseignants from './pages/Admin/Enseignants';
import Etudiants from './pages/Scolarite/Etudiants';
import Inscriptions from './pages/Scolarite/Inscriptions';
import Notes from './pages/Academique/Notes';
import Releve from './pages/Reporting/Releve';
import PaiementPage from "./pages/Finance/PaiementPage";
import PaiementWaiting from "./pages/Finance/PaiementWaiting";
import PaiementSuccess from "./pages/Finance/PaiementSuccess";


// ... imports

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stefanmouope/register" element={<Register />} />
          <Route path="/paiement" element={<PaiementPage />} />
          <Route path="/paiement/attente/:reference" element={<PaiementWaiting />} />
          <Route path="/paiement/succes" element={<PaiementSuccess />} />

          {/* Routes protégées avec layout principal */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Module Admin */}
              <Route path="/admin/etablissements" element={<Etablissements />} />
              <Route path="/admin/departements" element={<Departements />} />
              <Route path="/admin/niveaux" element={<Niveaux />} />
              <Route path="/admin/ues" element={<UEs />} />
              <Route path="/admin/annees" element={<Annees />} />
              <Route path="/admin/enseignants" element={<Enseignants />} />
              
              {/* Module Scolarité */}
              <Route path="/scolarite/etudiants" element={<Etudiants />} />
              <Route path="/scolarite/inscriptions" element={<Inscriptions />} />
              
              {/* Module Académique */}
              <Route path="/academique/notes" element={<Notes />} />
              
              {/* Module Reporting */}
              <Route path="/reporting/releve" element={<Releve />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;