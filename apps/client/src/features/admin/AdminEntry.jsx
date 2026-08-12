import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import AdminLogin from "./auth/components/Adminlogin/AdminLogin";

export default function AdminEntry() {
  const location = useLocation();
  const challengeToken = location.state?.challengeToken;

  const [loginToken, setLoginToken] = useState(null);

  function handleLoginSuccess(token) {
    setLoginToken(token);
  }

  if (!challengeToken) {
    return <Navigate to="/" replace />;
  }

  if (!loginToken) {
    return (
      <AdminLogin
        challengeToken={challengeToken}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return <p>logged in</p>;
}
