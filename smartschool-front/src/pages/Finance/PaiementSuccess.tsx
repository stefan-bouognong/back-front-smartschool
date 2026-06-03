import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function PaiementSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="p-10 text-center bg-white shadow-lg rounded-xl">
        <FaCheckCircle className="mx-auto mb-4 text-6xl text-green-600" />
        <h1 className="text-3xl font-bold text-green-600">Paiement validé</h1>
        <p className="mt-4 text-gray-600">Votre paiement a été enregistré avec succès.</p>
        <Link to="/" className="inline-block px-6 py-3 mt-6 text-white bg-green-600 rounded-lg">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}