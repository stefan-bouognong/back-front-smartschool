import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left decorative panel */}
      <div style={{
        display: 'none',
        flex: 1,
        background: 'var(--primary)',
        padding: '3rem',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-left-panel">
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '280px', height: '280px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HiAcademicCap size={24} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>SmartSchool UY1</span>
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Plateforme de gestion académique
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>
            Gérez vos inscriptions, notes, paiements et plus encore depuis une seule interface unifiée.
          </p>
          {[
            '✓ Gestion des étudiants & inscriptions',
            '✓ Saisie & consultation des notes',
            '✓ Paiement des droits universitaires',
            '✓ Génération des relevés de notes PDF',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo for small screens / standalone */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px', height: '56px',
              borderRadius: '16px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              <HiAcademicCap size={28} color="white" />
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
              Connexion
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              SmartSchool UY1 — Espace Administrateur
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 40px rgba(15,23,42,0.08)',
            border: '1px solid rgba(226,232,240,0.8)',
          }}>
            {error && (
              <div className="alert alert-error">
                <strong>⚠ Erreur :</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Adresse email</label>
                <div style={{ position: 'relative' }}>
                  <FiMail size={16} style={{
                    position: 'absolute', left: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                  }} />
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="prenom.nom@uy1.cm"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} style={{
                    position: 'absolute', left: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                  }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '0.875rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 0,
                    }}
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9375rem', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Connexion...
                  </span>
                ) : (
                  <><FiLogIn size={17} /> Se connecter</>
                )}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Pas encore de compte ?{' '}
            <Link to="/stefanmouope/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;