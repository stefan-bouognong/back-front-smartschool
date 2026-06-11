import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiCheckCircle, FiDownload, FiHome, FiArrowRight } from "react-icons/fi";
import { downloadReceipt } from "../../api/finance";

export default function PaiementSuccess() {
  const location = useLocation();
  const matricule = location.state?.matricule || "";
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = async () => {
    if (!matricule) return;
    setDownloadError("");
    try {
      setDownloading(true);
      await downloadReceipt(matricule);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      setDownloadError("Erreur lors du téléchargement. Réessayez ou rendez-vous sur la page de téléchargement.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 8px 40px rgba(15,23,42,0.08)',
        border: '1px solid rgba(226,232,240,0.8)',
      }}>
        {/* Icône de succès animée */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 12px 32px rgba(16,185,129,0.3)',
          animation: 'scaleIn 0.5s ease-out',
        }}>
          <FiCheckCircle size={40} color="white" />
        </div>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          marginBottom: '0.5rem',
        }}>
          Paiement validé !
        </h1>
        
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}>
          Votre paiement a été enregistré avec succès. Vous pouvez maintenant télécharger votre reçu.
        </p>

        {downloadError && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '0.8125rem',
          }}>
            {downloadError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Bouton télécharger le reçu */}
          {matricule ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '12px',
                cursor: downloading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                color: 'white',
                background: downloading
                  ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)'
                  : 'linear-gradient(135deg, var(--primary), #6366f1)',
                boxShadow: downloading ? 'none' : '0 8px 24px rgba(99,102,241,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { if (!downloading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {downloading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Génération...
                </span>
              ) : (
                <><FiDownload size={18} /> Télécharger le Reçu PDF</>
              )}
            </button>
          ) : (
            <Link
              to="/recu"
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                color: 'white',
                background: 'linear-gradient(135deg, var(--primary), #6366f1)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <FiDownload size={18} /> Télécharger le Reçu PDF
            </Link>
          )}

          {/* Bouton retour accueil */}
          <Link
            to="/"
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '0.9375rem',
              fontWeight: 500,
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
              background: 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <FiHome size={16} /> Retour à l'accueil
          </Link>
        </div>

        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}