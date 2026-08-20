import { useState } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("adminToken"),
  );

  function login(newToken) {
    sessionStorage.setItem("adminToken", newToken);
    setToken(newToken);
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    setToken(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
