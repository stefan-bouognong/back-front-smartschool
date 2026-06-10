import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';
import type { RegisterData } from '../../api/auth';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'ENSEIGNANT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(formData);
      setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, name, type = 'text', required = false, extra }: {
    icon: React.ElementType; label: string; name: keyof RegisterData; type?: string; required?: boolean; extra?: React.ReactNode;
  }) => (
    <div className="form-group">
      <label className="form-label">{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type={type}
          name={name}
          className="form-control"
          style={{ paddingLeft: '2.5rem', paddingRight: extra ? '2.75rem' : undefined }}
          placeholder={
            name === 'nom' ? 'Dupont' :
            name === 'prenom' ? 'Jean' :
            name === 'email' ? 'jean.dupont@uy1.cm' : '••••••••'
          }
          value={formData[name] as string}
          onChange={handleChange}
          required={required}
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            background: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <HiAcademicCap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            SmartSchool UY1 — Accès réservé
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 40px rgba(15,23,42,0.08)',
          border: '1px solid rgba(226,232,240,0.8)',
        }}>
          {error && <div className="alert alert-error"><strong>⚠</strong> {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <InputField icon={FiUser} label="Nom" name="nom" required />
              <InputField icon={FiUser} label="Prénom" name="prenom" required />
            </div>
            <InputField icon={FiMail} label="Email" name="email" type="email" required />

            <div className="form-group">
              <label className="form-label">Mot de passe <span style={{ color: 'var(--danger)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="mot_de_passe"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  placeholder="••••••••"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
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
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rôle</label>
              <div style={{ position: 'relative' }}>
                <FiShield size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                <select
                  name="role"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="ENSEIGNANT">Enseignant</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9375rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Création...
                </span>
              ) : (
                <><FiUserPlus size={17} /> Créer mon compte</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;