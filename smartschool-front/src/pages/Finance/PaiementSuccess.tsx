import { FaDiagramSuccessor } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function PaiementSuccess() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">

      <div className="bg-white p-10 rounded-xl shadow-lg text-center">

        <div className="text-6xl mb-4">
          <FaDiagramSuccessor className="text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-green-600">
          Paiement validé
        </h1>

        <p className="mt-4 text-gray-600">
          Votre paiement a été enregistré
          avec succès.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Retour à l'accueil
        </Link>

      </div>
    </div>
  );
}