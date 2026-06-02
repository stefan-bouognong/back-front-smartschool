import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Utilise Outlet pour afficher les routes enfants
  return <Outlet />;
};