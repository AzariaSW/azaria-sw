import { useMutation } from "@tanstack/react-query";

import { experienceService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteExperience() {
  return useMutation({
    mutationFn: experienceService.removeExperience,

    ...mutationOptions({
      successMessage: "Experience deleted.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.experiences,
        });
      },
    }),
  });
}