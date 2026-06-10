import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { checkStatus, validatePayment } from "../../api/finance";

const POLL_INTERVAL_MS = 5000;
const TIMEOUT_MS = 180_000; // 3 minutes max d'attente

export default function PaiementWaiting() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef<number>();
  const validatedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const [timedOut, setTimedOut] = useState(false);
  const [lastStatus, setLastStatus] = useState("PENDING");
  const [countdown, setCountdown] = useState(Math.ceil(TIMEOUT_MS / 1000));

  useEffect(() => {
    const { matricule, montant, id_tranche } = location.state || {};

    const poll = async () => {
      // Vérifier le timeout
      if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
        clearInterval(intervalRef.current);
        setTimedOut(true);
        return;
      }

      try {
        const response = await checkStatus(reference!);
        console.log("[PaiementWaiting] CamPay status response:", response);

        // Normaliser le statut (CamPay peut retourner "SUCCESSFUL", "SUCCESS", "successful", etc.)
        const rawStatus = response?.status || "";
        const status = String(rawStatus).trim().toUpperCase();
        setLastStatus(status);

        if (status === "SUCCESSFUL" || status === "SUCCESS") {
          clearInterval(intervalRef.current);

          if (!validatedRef.current && matricule && id_tranche && montant) {
            validatedRef.current = true;
            try {
              await validatePayment({
                reference: reference!,
                matricule,
                id_tranche: Number(id_tranche),
                montant_verse: Number(montant),
                mode_paiement: "CamPay Mobile"
              });
              navigate("/paiement/succes");
            } catch (validationError: unknown) {
              const err = validationError as { response?: { data?: { error?: string } } };
              const msg = err.response?.data?.error || "Erreur lors de l'enregistrement du paiement";
              alert(`Le paiement a été reçu mais n'a pas pu être enregistré : ${msg}. Contactez l'administration.`);
              navigate("/paiement");
            }
            return;
          }

          navigate("/paiement/succes");
        } else if (status === "FAILED" || status === "CANCELLED") {
          clearInterval(intervalRef.current);
          alert("Le paiement a échoué. Veuillez réessayer.");
          navigate("/paiement");
        }
        // Si PENDING → on continue le polling
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
      }
    };

    poll();
    intervalRef.current = window.setInterval(poll, POLL_INTERVAL_MS);

    // Countdown timer pour l'affichage
    const countdownInterval = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, Math.ceil((TIMEOUT_MS - elapsed) / 1000));
      setCountdown(remaining);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownInterval);
    };
  }, [reference, location.state, navigate]);

  const handleRetry = () => {
    // Relancer le polling
    setTimedOut(false);
    startTimeRef.current = Date.now();
    setCountdown(Math.ceil(TIMEOUT_MS / 1000));
    validatedRef.current = false;

    const { matricule, montant, id_tranche } = location.state || {};

    const poll = async () => {
      if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
        clearInterval(intervalRef.current);
        setTimedOut(true);
        return;
      }

      try {
        const response = await checkStatus(reference!);
        const rawStatus = response?.status || "";
        const status = String(rawStatus).trim().toUpperCase();
        setLastStatus(status);

        if (status === "SUCCESSFUL" || status === "SUCCESS") {
          clearInterval(intervalRef.current);
          if (!validatedRef.current && matricule && id_tranche && montant) {
            validatedRef.current = true;
            try {
              await validatePayment({
                reference: reference!,
                matricule,
                id_tranche: Number(id_tranche),
                montant_verse: Number(montant),
                mode_paiement: "CamPay Mobile"
              });
              navigate("/paiement/succes");
            } catch {
              alert("Le paiement a été reçu mais n'a pas pu être enregistré. Contactez l'administration.");
              navigate("/paiement");
            }
            return;
          }
          navigate("/paiement/succes");
        } else if (status === "FAILED" || status === "CANCELLED") {
          clearInterval(intervalRef.current);
          alert("Le paiement a échoué. Veuillez réessayer.");
          navigate("/paiement");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
      }
    };

    poll();
    intervalRef.current = window.setInterval(poll, POLL_INTERVAL_MS);
  };

  // Écran de timeout
  if (timedOut) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', maxWidth: '480px', boxShadow: '0 8px 40px rgba(15,23,42,0.08)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
            ⏱️
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Délai dépassé</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.6' }}>
            Nous n'avons pas encore reçu la confirmation de votre paiement. Cela peut arriver avec Orange Money si la notification n'a pas été reçue.
          </p>

          <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '12px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#c2410c', marginBottom: '0.5rem' }}>Orange Money — Validez manuellement</h3>
            <p style={{ fontSize: '0.875rem', color: '#ea580c', margin: 0, lineHeight: '1.5' }}>
              Composez <strong>#150*50#</strong> sur votre téléphone puis appuyez sur <strong>Appel</strong> pour voir les transactions en attente et valider le paiement.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            <button
              onClick={handleRetry}
              style={{
                padding: '0.875rem', fontSize: '1rem', fontWeight: 600,
                background: 'var(--primary)', color: 'white', border: 'none',
                borderRadius: '12px', cursor: 'pointer',
              }}
            >
              🔄 Revérifier le statut
            </button>
            <button
              onClick={() => navigate("/paiement")}
              style={{
                padding: '0.875rem', fontSize: '0.9rem', fontWeight: 500,
                background: 'transparent', color: 'var(--text-muted)', border: '1px solid #e2e8f0',
                borderRadius: '12px', cursor: 'pointer',
              }}
            >
              Retour au formulaire
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>
            Dernier statut CamPay : <strong>{lastStatus}</strong> — Réf : {reference}
          </p>
        </div>
      </div>
    );
  }

  // Écran de polling normal
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', maxWidth: '480px', boxShadow: '0 8px 40px rgba(15,23,42,0.08)' }}>
        <div style={{ width: '64px', height: '64px', border: '4px solid rgba(226,232,240,0.8)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Paiement en cours...</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Veuillez consulter votre téléphone et entrer votre code secret pour valider la transaction.
        </p>
        
        <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '12px', padding: '1.25rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#c2410c', marginBottom: '0.5rem' }}>Vous utilisez Orange Money ?</h3>
          <p style={{ fontSize: '0.875rem', color: '#ea580c', margin: 0, lineHeight: '1.5' }}>
            Si la notification ne s'affiche pas automatiquement sur votre écran, composez le <strong>#150*50#</strong> sur votre téléphone pour valider le paiement.
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Statut : <strong>{lastStatus}</strong> · Temps restant : <strong>{minutes}:{seconds.toString().padStart(2, '0')}</strong>
          </p>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>Référence : {reference}</p>
      </div>
    </div>
  );
}
