import { useState } from "react";

import AdminChallengeListener from "./challenge/components/AdminChallengeListener";
import AdminLogin from "./auth/components/Adminlogin/AdminLogin";

export default function AdminEntry() {
  const [challengeToken, setChallengeToken] = useState(null);
  const [loginToken, setLoginToken] = useState(null);

  function handleChallengeSuccess(token) {
    setChallengeToken(token);
  }

  function handleLoginSuccess(token) {
    setLoginToken(token);
  }

  if (!challengeToken) {
    return (
      <AdminChallengeListener onChallengeSuccess={handleChallengeSuccess} />
    );
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
