import { Navigate, useLocation } from "react-router-dom";

import AdminLogin from "./auth/components/Adminlogin/AdminLogin";

export default function AdminEntry() {
  const location = useLocation();
  const challengeToken = location.state?.challengeToken;

  if (!challengeToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLogin
      challengeToken={challengeToken}
    />
  );
}
