import { useAuth } from '../../store/AuthContext';
import { FiLogOut, FiUser, FiMail, FiShield } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Tableau de bord</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2">
            <FiLogOut /> Déconnexion
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiUser /> Bienvenue, {user?.prenom} {user?.nom}
          </h2>
          <p className="flex items-center gap-2 mb-2"><FiMail /> {user?.email}</p>
          <p className="flex items-center gap-2"><FiShield /> Rôle : {user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;