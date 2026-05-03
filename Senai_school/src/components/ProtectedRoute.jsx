import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, token } = useAuth();
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function FirstTimeGate({ children }) {
  const { user } = useAuth();
  if (user?.firstTime) {
    return <Navigate to="/first-login" replace />;
  }
  return children;
}

export function FirstLoginRoute({ children }) {
  const { user, token } = useAuth();
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  if (!user.firstTime) {
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/admin"
            : user.role === "professor"
              ? "/homeProfessor"
              : "/homeStudent"
        }
        replace
      />
    );
  }
  return children;
}
