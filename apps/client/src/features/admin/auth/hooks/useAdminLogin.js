import { useMutation } from "@tanstack/react-query";

import { authService } from "../../../../services";

export default function useAdminLogin( options = {}) {
  return useMutation({
    mutationFn: ({ data, token }) => authService.login(data, token),
    ...options,
  });
}