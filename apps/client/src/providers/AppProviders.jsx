import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AdminAuthProvider } from "../features/admin/auth/context/AdminAuthContext";
import queryClient from "../lib/queryClient";
import ToastProvider from "./ToastProvider";

function AppProviders({ children }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>{children}</AdminAuthProvider>{" "}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

      <ToastProvider />
    </>
  );
}

export default AppProviders;
