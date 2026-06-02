import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};