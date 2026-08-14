import { useMutation } from "@tanstack/react-query";

import { experienceService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useUpdateExperience() {
  return useMutation({
    mutationFn: ({ id, data }) =>
      experienceService.updateExperience(id, data),

    ...mutationOptions({
      successMessage: "Experience updated.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.experiences,
        });
      },
    }),
  });
}