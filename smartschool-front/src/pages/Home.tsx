import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { FiDownload, FiCreditCard, FiLogIn, FiArrowRight, FiShield, FiFileText, FiClock } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Navbar */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '10px',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HiAcademicCap size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            SmartSchool UY1
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>Accueil</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>Aide</a>
          
          {!user ? (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <FiLogIn size={16} /> Espace Admin / Enseignant
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Aller au Dashboard <FiArrowRight size={16} />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{
        padding: '6rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'var(--primary-bg)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'var(--primary-bg)',
          filter: 'blur(80px)',
        }} />

        <div style={{
          background: 'var(--primary-bg)',
          color: 'var(--primary)',
          padding: '0.5rem 1rem',
          borderRadius: '100px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          position: 'relative', zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <HiAcademicCap size={16} /> Rentrée Académique 2024-2025
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#0f172a',
          maxWidth: '800px',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          position: 'relative', zIndex: 1,
        }}>
          Bienvenue sur la plateforme d'inscriptions de l'UY1
        </h1>
        
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          lineHeight: 1.6,
          marginBottom: '3rem',
          position: 'relative', zIndex: 1,
        }}>
          Gérez facilement vos paiements de droits universitaires et accédez à vos documents académiques en quelques clics.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          position: 'relative', zIndex: 1,
          flexWrap: 'wrap',
        }}>
          <Link
            to="/paiement"
            style={{
              background: 'var(--success)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.0625rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FiCreditCard size={20} /> Payer ses DU
          </Link>
          
          <button
            style={{
              background: 'white',
              color: '#0f172a',
              border: '1px solid var(--border)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.0625rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = '#0f172a';
            }}
          >
            <FiDownload size={20} /> Télécharger son Reçu
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section style={{
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}>
        {[
          { icon: <FiShield size={32} color="var(--primary)" />, title: 'Paiement Sécurisé', desc: 'Réglez vos droits universitaires en toute sécurité via nos partenaires Orange Money, MTN Mobile Money et cartes bancaires.' },
          { icon: <FiFileText size={32} color="var(--primary)" />, title: 'Documents Accessibles', desc: 'Téléchargez vos reçus de paiement et attestations d\'inscription directement depuis votre espace étudiant.' },
          { icon: <FiClock size={32} color="var(--primary)" />, title: 'Processus Rapide', desc: 'Une procédure d\'inscription entièrement digitalisée pour vous faire gagner un temps précieux à la rentrée.' }
        ].map((feat, i) => (
          <div key={i} style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--primary-bg)', padding: '1rem', borderRadius: '50%' }}>
                {feat.icon}
              </div>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid var(--border)',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        © {new Date().getFullYear()} Université de Yaoundé I. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Home;