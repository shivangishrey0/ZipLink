import { Navigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";

// RootLayout only renders pages after the login check finished, so a missing user here is final.
const RequireAuth = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;
