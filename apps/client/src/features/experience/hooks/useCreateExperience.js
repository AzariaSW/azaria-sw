import { useMutation } from "@tanstack/react-query";

import { experienceService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useCreateExperience() {
  return useMutation({
    mutationFn: experienceService.createExperience,

    ...mutationOptions({
      successMessage: "Experience created.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.experiences,
        });
      },
    }),
  });
}