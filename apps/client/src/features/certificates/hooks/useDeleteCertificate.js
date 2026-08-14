import { useMutation } from "@tanstack/react-query";

import { certificateService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteCertificate() {
  return useMutation({
    mutationFn: certificateService.removeCertificate,

    ...mutationOptions({
      successMessage: "Certificate deleted.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.certificate,
        });
      },
    }),
  });
}