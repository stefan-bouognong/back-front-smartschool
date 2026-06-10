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
    <div style={{
      width: '256px',
      background: 'var(--sidebar-bg)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Logo / Brand */}
      <div style={{
        padding: '1.5rem 1.25rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
          }}>
            <HiAcademicCap size={20} color="white" />
          </div>
          <div>
            <span style={{
              fontWeight: 800,
              fontSize: '1rem',
              color: 'white',
              letterSpacing: '-0.02em',
            }}>SmartSchool</span>
            <p style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '1px' }}>UY1 Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0', scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: '0.25rem' }}>
            <p style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#475569',
              padding: '0.5rem 1.25rem 0.375rem',
            }}>{group.label}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {group.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/dashboard'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5625rem 1.25rem',
                      fontSize: '0.8125rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#a5b4fc' : '#94a3b8',
                      background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                      borderRight: isActive ? '3px solid #6366f1' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    })}
                    className="sidebar-link"
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon size={16} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{link.label}</span>
                        {isActive && <FiChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
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
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(239,68,68,0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.color = '#fca5a5';
          }}
        >
          <FiLogOut size={15} /> Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;