import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { FaDownload } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <img src="/uy1-logo.png" alt="UY1" className="h-12 w-12" />
            <span className="text-xl font-bold text-gray-800">Université de Yaoundé I</span>
          </div>
          <div className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Accueil</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Aide</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">English</a>
            {!user ? (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Connexion Administrateur
              </Link>
            ) : (
              <span className="text-green-600 font-semibold">Bonjour, {user.prenom}</span>
            )}
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center mt-20">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Bienvenue sur la plateforme d'inscriptions
          </h1>
          <p className="text-xl text-gray-600 mb-8">de l'Université de Yaoundé 1</p>
          <div className="flex justify-center gap-4">
            <Link
            to="/paiement"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
            Payer ses DU
            </Link>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <FaDownload /> Télécharger son Reçu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;