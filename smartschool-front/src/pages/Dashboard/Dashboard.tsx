import { useAuth } from '../../store/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue, {user?.prenom} {user?.nom}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Rôle</h3>
          <p>{user?.role === 'ADMIN' ? 'Administrateur' : 'Enseignant'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Email</h3>
          <p>{user?.email}</p>
        </div>
        {/* Autres widgets selon le rôle */}
      </div>
    </div>
  );
};

export default Dashboard;