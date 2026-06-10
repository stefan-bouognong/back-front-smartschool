import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiLogOut,
  FiMapPin,
  FiLayers,
  FiCalendar,
  FiUserCheck,
  FiFileText,
  FiAward,
} from 'react-icons/fi';

interface NavGroup {
  label: string;
  links: {
    to: string;
    icon: React.ElementType;
    label: string;
  }[];
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const adminGroups: NavGroup[] = [
    {
      label: 'Général',
      links: [
        {
          to: '/dashboard',
          icon: FiHome,
          label: 'Tableau de bord',
        },
      ],
    },
    {
      label: 'Administration',
      links: [
        {
          to: '/admin/etablissements',
          icon: FiMapPin,
          label: 'Établissements',
        },
        {
          to: '/admin/departements',
          icon: FiLayers,
          label: 'Départements',
        },
        {
          to: '/admin/niveaux',
          icon: FiAward,
          label: 'Niveaux',
        },
        {
          to: '/admin/ues',
          icon: FiBook,
          label: "Unités d'enseignement",
        },
        {
          to: '/admin/annees',
          icon: FiCalendar,
          label: 'Années académiques',
        },
        {
          to: '/admin/enseignants',
          icon: FiUserCheck,
          label: 'Enseignants',
        },
      ],
    },
    {
      label: 'Scolarité',
      links: [
        {
          to: '/scolarite/etudiants',
          icon: FiUsers,
          label: 'Étudiants',
        },
        {
          to: '/scolarite/inscriptions',
          icon: FiFileText,
          label: 'Inscriptions',
        },
      ],
    },
    {
      label: 'Reporting',
      links: [
        {
          to: '/reporting/releve',
          icon: FiBarChart2,
          label: 'Relevé de notes',
        },
      ],
    },
  ];

  const enseignantGroups: NavGroup[] = [
    {
      label: 'Général',
      links: [
        {
          to: '/dashboard',
          icon: FiHome,
          label: 'Tableau de bord',
        },
      ],
    },
    {
      label: 'Académique',
      links: [
        {
          to: '/scolarite/etudiants',
          icon: FiUsers,
          label: 'Étudiants',
        },
        {
          to: '/academique/notes',
          icon: FiFileText,
          label: 'Saisie des notes',
        },
      ],
    },
  ];

  const groups =
    role === 'ADMIN' ? adminGroups : enseignantGroups;

  const initials = `${user?.prenom?.charAt(0) ?? ''}${
    user?.nom?.charAt(0) ?? ''
  }`.toUpperCase();

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-64 h-screen text-white bg-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
          <FiBook size={20} />
        </div>

        <div>
          <h1 className="text-lg font-bold">SmartSchool</h1>
          <p className="text-xs text-gray-400">
            Gestion académique
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {group.label}
            </h3>

            <ul className="space-y-1">
              {group.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white border-r-4 border-blue-300'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer utilisateur */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-blue-600 rounded-lg">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.prenom} {user?.nom}
            </p>

            <span
              className={`inline-block px-2 py-1 mt-1 text-xs font-semibold rounded-md ${
                role === 'ADMIN'
                  ? 'bg-indigo-900 text-indigo-300'
                  : 'bg-green-900 text-green-300'
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          <FiLogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;