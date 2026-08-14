import { useMutation } from "@tanstack/react-query";

import { certificateService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useCreateCertificate() {
  return useMutation({
    mutationFn: certificateService.createCertificate,

    ...mutationOptions({
      successMessage: "Certificate created.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.certificates,
        });
      },
    }),
  });
}