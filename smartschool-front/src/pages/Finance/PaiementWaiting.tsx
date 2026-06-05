import { useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { checkStatus, validatePayment } from "../../api/finance";

export default function PaiementWaiting() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef<number>();
  const validatedRef = useRef(false);

  useEffect(() => {
    const { matricule, montant, id_tranche } = location.state || {};

    const poll = async () => {
      try {
        const response = await checkStatus(reference!);
        const status = response?.status;

        if (status === "SUCCESS" || status === "SUCCESSFUL") {
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
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
      }
    };

    poll();
    intervalRef.current = window.setInterval(poll, 5000);
    return () => clearInterval(intervalRef.current);
  }, [reference, location.state, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="p-10 text-center bg-white shadow-xl rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 border-b-4 border-blue-600 rounded-full animate-spin" />
        <h2 className="text-2xl font-bold">Paiement en cours</h2>
        <p className="mt-2 text-gray-600">Nous vérifions votre paiement...</p>
        <p className="mt-4 text-sm">Référence : {reference}</p>
      </div>
    </div>
  );
}
