import { useState } from "react";
import { Link } from "react-router-dom";
import { downloadReceipt } from "../../api/finance";
import { FiDownload, FiUser, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi2";

export default function ReceiptDownload() {
  const [matricule, setMatricule] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!matricule.trim()) {
      setError("Veuillez entrer votre matricule.");
      return;
    }

    try {
      setLoading(true);
      await downloadReceipt(matricule.trim());
      setSuccess(true);
    } catch (err: any) {
      console.error("Erreur téléchargement reçu:", err);

      if (err.response?.status === 400) {
        // Le blob d'erreur doit être converti en texte
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          setError(parsed.error || "Erreur lors du téléchargement");
        } catch {
          setError("Aucun paiement trouvé pour ce matricule.");
        }
      } else {
        setError("Erreur lors du téléchargement du reçu. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Bouton retour */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
            marginBottom: "2rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <FiArrowLeft size={16} /> Retour à l'accueil
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, var(--primary), #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 24px rgba(99,102,241,0.25)",
            }}
          >
            <FiDownload size={26} color="white" />
          </div>
          <h1
            style={{
              fontSize: "1.625rem",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              marginBottom: "0.375rem",
            }}
          >
            Télécharger votre Reçu
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Entrez votre matricule pour obtenir votre reçu de paiement en
            PDF
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 8px 40px rgba(15,23,42,0.08)",
            border: "1px solid rgba(226,232,240,0.8)",
          }}
        >
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                color: "#dc2626",
                fontSize: "0.875rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                color: "#16a34a",
                fontSize: "0.875rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiCheckCircle size={16} /> Reçu téléchargé avec succès !
            </div>
          )}

          <form onSubmit={handleDownload}>
            <div className="form-group">
              <label className="form-label">Matricule Étudiant</label>
              <div style={{ position: "relative" }}>
                <FiUser
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Ex: 18J1234"
                  className="form-control"
                  style={{ paddingLeft: "2.5rem" }}
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                fontSize: "1rem",
                fontWeight: 600,
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                color: "white",
                background: loading
                  ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                  : "linear-gradient(135deg, var(--primary), #6366f1)",
                boxShadow: loading
                  ? "none"
                  : "0 8px 24px rgba(99,102,241,0.3)",
                transition: "all 0.3s ease",
                marginTop: "1rem",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Génération du reçu...
                </span>
              ) : (
                <>
                  <FiDownload size={18} /> Télécharger le Reçu PDF
                </>
              )}
            </button>
          </form>

          {/* Info box */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "12px",
              padding: "1rem",
              marginTop: "1.5rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
              }}
            >
              <HiAcademicCap
                size={18}
                style={{ color: "var(--primary)", marginTop: "2px", flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "0.25rem",
                  }}
                >
                  Comment obtenir votre reçu ?
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Entrez votre matricule étudiant (ex: 18J1234). Le reçu
                  sera généré en PDF avec le détail de tous vos paiements
                  enregistrés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
