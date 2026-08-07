import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUser";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { profile: user } = useCurrentUser();

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Owner can access everything
  if (user.role === "owner") {
    return children;
  }

  // Role-based access
  if (!allowedRoles.includes(user.role) && user.role === "super_admin") {
    return <Navigate to="/admin/admins-list" replace />;
  }

  if (!allowedRoles.includes(user.role) && user.role === "super_admin") {
    return <Navigate to="/admin/coin-seller" replace />;
  }

  if (!allowedRoles.includes(user.role) && user.role === "super_coin") {
    return <Navigate to="/seller/sub-coin-seller" replace />;
  }

  if (
    !allowedRoles.includes(user.role) &&
    (user.role === "super_coin" || user.role === "sub_coin_seller")
  ) {
    return <Navigate to="/seller/user" replace />;
  }
  if (!allowedRoles.includes(user.role) && user.role === "admin") {
    return <Navigate to="/admin/agency" replace />;
  }
  if (!allowedRoles.includes(user.role) && user.role === "management") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
