import {
  useEffect,
  useRef,
} from "react";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  checkStatus,
  validatePayment,
} from "../../api/finance";

export default function PaiementWaiting() {
  const { reference } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const intervalRef = useRef<number>();

  useEffect(() => {

    const poll = async () => {
      try {

        const response = await checkStatus(
          reference!
        );

        const status =
          response.data.status;

        if (
          status === "SUCCESS" ||
          status === "SUCCESSFUL"
        ) {

          clearInterval(
            intervalRef.current
          );

          await validatePayment({
            reference: reference!,
            matricule:
              location.state.matricule,
            id_tranche:
              location.state.id_tranche,
            montant_verse:
              location.state.montant,
            mode_paiement:
              "Mobile Money",
          });

          navigate(
            "/paiement/succes"
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    poll();

    intervalRef.current =
      window.setInterval(
        poll,
        5000
      );

    return () => {
      clearInterval(
        intervalRef.current
      );
    };
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">

        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />

        <h2 className="text-2xl font-bold">
          Paiement en cours
        </h2>

        <p className="text-gray-600 mt-2">
          Nous vérifions votre paiement...
        </p>

        <p className="mt-4 text-sm">
          Référence : {reference}
        </p>

      </div>
    </div>
  );
}