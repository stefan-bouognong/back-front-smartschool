import { useEffect, useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiBook, FiMapPin, FiCalendar,
  FiLayers, FiUserCheck, FiFileText, FiTrendingUp,
  FiArrowRight, FiBarChart2, FiAward, FiDollarSign,
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import { getAllEtudiants } from '../../api/scolarite';
import { getAllInscriptions } from '../../api/scolarite';
import { getAllEtablissements, getAllEnseignants, getAllNiveaux, getAllDepartements } from '../../api/admin';

interface Stats {
  etudiants: number;
  inscriptions: number;
  etablissements: number;
  enseignants: number;
  niveaux: number;
  departements: number;
  paiementsOk: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  bg,
  to,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  to?: string;
  loading?: boolean;
}) => (
  <div
    className="stat-card"
    style={{ borderTop: `3px solid ${color}` }}
  >
    <div className="stat-card-icon" style={{ background: bg, color: color }}>
      <Icon size={22} />
    </div>
    {loading ? (
      <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '0.25rem' }} />
    ) : (
      <div className="stat-card-value" style={{ color: '#0f172a' }}>{value}</div>
    )}
    <div className="stat-card-label">{label}</div>
    {to && (
      <Link
        to={to}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: color,
          marginTop: '0.75rem',
          textDecoration: 'none',
          opacity: 0.8,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
      >
        Voir tout <FiArrowRight size={12} />
      </Link>
    )}
  </div>
);

const QuickAction = ({ icon: Icon, label, to, color }: {
  icon: React.ElementType; label: string; to: string; color: string;
}) => (
  <Link
    to={to}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      padding: '0.875rem 1rem',
      borderRadius: '10px',
      border: '1px solid var(--border)',
      background: 'white',
      textDecoration: 'none',
      color: 'var(--text)',
      transition: 'all 0.2s ease',
      fontWeight: 500,
      fontSize: '0.875rem',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 4px 16px ${color}25`;
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      background: `${color}15`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={17} />
    </div>
    {label}
    <FiArrowRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const [stats, setStats] = useState<Stats>({
    etudiants: 0,
    inscriptions: 0,
    etablissements: 0,
    enseignants: 0,
    niveaux: 0,
    departements: 0,
    paiementsOk: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (role === 'ADMIN') {
          const [etudRes, insRes, etabRes, ensRes, nivRes, depRes] = await Promise.all([
            getAllEtudiants().catch(() => ({ data: [] })),
            getAllInscriptions({}).catch(() => ({ data: { data: [] } })),
            getAllEtablissements().catch(() => ({ data: [] })),
            getAllEnseignants().catch(() => ({ data: [] })),
            getAllNiveaux().catch(() => ({ data: [] })),
            getAllDepartements().catch(() => ({ data: [] })),
          ]);
          const inscriptions = insRes.data?.data ?? [];
          const payees = inscriptions.filter((i: any) => i.statut_paiement).length;
          setStats({
            etudiants: etudRes.data?.length ?? 0,
            inscriptions: inscriptions.length,
            etablissements: etabRes.data?.length ?? 0,
            enseignants: ensRes.data?.length ?? 0,
            niveaux: nivRes.data?.length ?? 0,
            departements: depRes.data?.length ?? 0,
            paiementsOk: payees,
          });
        } else {
          const etudRes = await getAllEtudiants().catch(() => ({ data: [] }));
          setStats(s => ({ ...s, etudiants: etudRes.data?.length ?? 0 }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [role]);

  const pctPaie = stats.inscriptions > 0
    ? Math.round((stats.paiementsOk / stats.inscriptions) * 100)
    : 0;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{
        background: 'var(--primary)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '1.75rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px',
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', right: '80px', bottom: '-60px',
          width: '140px', height: '140px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HiAcademicCap size={26} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.75, fontWeight: 400 }}>
                {greeting},
              </p>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
                {user?.prenom} {user?.nom}
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}>
              {role === 'ADMIN' ? 'Administrateur' : 'Enseignant'}
            </span>
            <span style={{ fontSize: '0.8125rem', opacity: 0.7 }}>
              {now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {role === 'ADMIN' ? (
        <>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Vue d'ensemble
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}>
            <StatCard icon={FiUsers} label="Étudiants" value={stats.etudiants} color="#6366f1" bg="rgba(99,102,241,0.1)" to="/scolarite/etudiants" loading={loading} />
            <StatCard icon={FiFileText} label="Inscriptions" value={stats.inscriptions} color="#0ea5e9" bg="rgba(14,165,233,0.1)" to="/scolarite/inscriptions" loading={loading} />
            <StatCard icon={FiDollarSign} label="Paiements OK" value={`${pctPaie}%`} color="#10b981" bg="rgba(16,185,129,0.1)" loading={loading} />
            <StatCard icon={FiUserCheck} label="Enseignants" value={stats.enseignants} color="#f59e0b" bg="rgba(245,158,11,0.1)" to="/admin/enseignants" loading={loading} />
            <StatCard icon={FiMapPin} label="Établissements" value={stats.etablissements} color="#ec4899" bg="rgba(236,72,153,0.1)" to="/admin/etablissements" loading={loading} />
            <StatCard icon={FiAward} label="Niveaux" value={stats.niveaux} color="#8b5cf6" bg="rgba(139,92,246,0.1)" to="/admin/niveaux" loading={loading} />
          </div>

          {/* Paiements progress */}
          <div className="card" style={{ marginBottom: '1.75rem' }}>
            <div className="card-header">
              <span className="card-title">Taux de paiement des inscriptions</span>
              <span className={`badge ${pctPaie >= 80 ? 'badge-success' : pctPaie >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                {pctPaie}%
              </span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
                <span>{stats.paiementsOk} paiements validés</span>
                <span>{stats.inscriptions - stats.paiementsOk} en attente</span>
              </div>
              <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pctPaie}%`,
                  background: pctPaie >= 80 ? 'var(--success)' : pctPaie >= 50 ? 'var(--warning)' : 'var(--danger)',
                  borderRadius: '100px',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Accès rapide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            <QuickAction icon={FiFileText} label="Gérer les inscriptions" to="/scolarite/inscriptions" color="#6366f1" />
            <QuickAction icon={FiUsers} label="Voir les étudiants" to="/scolarite/etudiants" color="#0ea5e9" />
            <QuickAction icon={FiBarChart2} label="Relevés de notes" to="/reporting/releve" color="#10b981" />
            <QuickAction icon={FiBook} label="Unités d'enseignement" to="/admin/ues" color="#f59e0b" />
            <QuickAction icon={FiMapPin} label="Établissements" to="/admin/etablissements" color="#ec4899" />
            <QuickAction icon={FiCalendar} label="Années académiques" to="/admin/annees" color="#8b5cf6" />
          </div>
        </>
      ) : (
        // Enseignant view
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <StatCard icon={FiUsers} label="Étudiants" value={stats.etudiants} color="#6366f1" bg="rgba(99,102,241,0.1)" to="/scolarite/etudiants" loading={loading} />
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <span className="card-title">Informations du compte</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Nom complet', value: `${user?.prenom} ${user?.nom}` },
                  { label: 'Email', value: user?.email },
                  { label: 'Rôle', value: 'Enseignant' },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>{item.label}</p>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Accès rapide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            <QuickAction icon={FiUsers} label="Voir les étudiants" to="/scolarite/etudiants" color="#6366f1" />
            <QuickAction icon={FiFileText} label="Saisir des notes" to="/academique/notes" color="#10b981" />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;