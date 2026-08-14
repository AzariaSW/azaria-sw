import { useMutation } from "@tanstack/react-query";

import { certificateService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useUpdateCertificate() {
  return useMutation({
    mutationFn: ({ id, data }) =>
      certificateService.updateCertificate(id, data),

    ...mutationOptions({
      successMessage: "Certificate updated.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.certificates,
        });
      },
    }),
  });
}