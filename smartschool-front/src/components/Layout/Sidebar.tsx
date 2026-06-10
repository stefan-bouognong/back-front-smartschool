import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { 
  FiHome, FiUsers, FiBook, FiBarChart2, 
  FiLogOut, FiMapPin, FiLayers, FiCalendar, 
  FiUserCheck, FiFileText, FiAward, FiChevronRight
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';

interface NavGroup {
  label: string;
  links: { to: string; icon: React.ElementType; label: string }[];
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const adminGroups: NavGroup[] = [
    {
      label: 'Général',
      links: [
        { to: '/dashboard', icon: FiHome, label: 'Tableau de bord' },
      ],
    },
    {
      label: 'Administration',
      links: [
        { to: '/admin/etablissements', icon: FiMapPin, label: 'Établissements' },
        { to: '/admin/departements', icon: FiLayers, label: 'Départements' },
        { to: '/admin/niveaux', icon: FiAward, label: 'Niveaux' },
        { to: '/admin/ues', icon: FiBook, label: 'Unités d\'Ens.' },
        { to: '/admin/annees', icon: FiCalendar, label: 'Années académiques' },
        { to: '/admin/enseignants', icon: FiUserCheck, label: 'Enseignants' },
      ],
    },
    {
      label: 'Scolarité',
      links: [
        { to: '/scolarite/etudiants', icon: FiUsers, label: 'Étudiants' },
        { to: '/scolarite/inscriptions', icon: FiFileText, label: 'Inscriptions' },
      ],
    },
    {
      label: 'Reporting',
      links: [
        { to: '/reporting/releve', icon: FiBarChart2, label: 'Relevé de notes' },
      ],
    },
  ];

  const enseignantGroups: NavGroup[] = [
    {
      label: 'Général',
      links: [
        { to: '/dashboard', icon: FiHome, label: 'Tableau de bord' },
      ],
    },
    {
      label: 'Académique',
      links: [
        { to: '/scolarite/etudiants', icon: FiUsers, label: 'Étudiants' },
        { to: '/academique/notes', icon: FiFileText, label: 'Saisie des notes' },
      ],
    },
  ];

  const groups = role === 'ADMIN' ? adminGroups : enseignantGroups;
  const initials = `${user?.prenom?.charAt(0) ?? ''}${user?.nom?.charAt(0) ?? ''}`.toUpperCase();

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
        ))}
      </nav>

      {/* User footer */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#e2e8f0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{user?.prenom} {user?.nom}</p>
            <p style={{
              fontSize: '0.6875rem',
              color: '#64748b',
              marginTop: '1px',
            }}>
              <span style={{
                background: role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)',
                color: role === 'ADMIN' ? '#a5b4fc' : '#6ee7b7',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '0.625rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>{role}</span>
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 py-2 mt-2 text-white transition bg-red-600 rounded hover:bg-red-700"
        >
          <FiLogOut size={15} /> Déconnexion
        </button>
      </div>
    </div>
  );
};


export default Sidebar;