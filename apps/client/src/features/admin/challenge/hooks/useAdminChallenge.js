import { useMutation } from "@tanstack/react-query";

import { authService } from "../../../../services";

export default function useAdminChallenge(options = {}) {
  return useMutation({
    mutationFn: authService.submitChallenge,
    ...options,
  });
}
