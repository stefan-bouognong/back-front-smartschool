import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { 
  FiHome, FiUsers, FiBook, FiDollarSign, FiBarChart2, 
  FiLogOut, FiMapPin, FiLayers, FiCalendar, 
  FiUserCheck, FiFileText 
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const adminLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/etablissements', icon: FiMapPin, label: 'Établissements' },
    { to: '/admin/departements', icon: FiLayers, label: 'Départements' },
    { to: '/admin/niveaux', icon: FiLayers, label: 'Niveaux' },
    { to: '/admin/ues', icon: FiBook, label: 'UE' },
    { to: '/admin/annees', icon: FiCalendar, label: 'Années académiques' },
    { to: '/admin/enseignants', icon: FiUserCheck, label: 'Enseignants' },
    { to: '/scolarite/etudiants', icon: FiUsers, label: 'Étudiants' },
    { to: '/scolarite/inscriptions', icon: FiFileText, label: 'Inscriptions' },
    // ADMIN n'a pas accès à la saisie des notes (c'est pour les enseignants)
    { to: '/reporting/releve', icon: FiBarChart2, label: 'Relevé de notes' }, // ADMIN peut télécharger
  ];

  const enseignantLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/scolarite/etudiants', icon: FiUsers, label: 'Étudiants' },
    { to: '/academique/notes', icon: FiFileText, label: 'Saisie notes' },
    // ENSEIGNANT n'a pas accès au relevé de notes (seul ADMIN)
  ];

  const links = role === 'ADMIN' ? adminLinks : enseignantLinks;

  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen text-white bg-gray-800">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        SmartSchool
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition ${
                    isActive ? 'bg-gray-900 text-white border-r-4 border-blue-500' : ''
                  }`
                }
              >
                <link.icon size={20} />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 py-2 mt-2 text-white transition bg-red-600 rounded hover:bg-red-700"
        >
          <FiLogOut /> Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;