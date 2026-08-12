import { useContext } from "react";

import { AdminAuthContext } from "./AdminAuthContext";

export default function useAdminAuth() {
  return useContext(AdminAuthContext);
}