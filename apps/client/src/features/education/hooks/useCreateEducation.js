import { useMutation } from "@tanstack/react-query";

import { educationService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useCreateEducation() {
  return useMutation({
    mutationFn: educationService.createEducation,

    ...mutationOptions({
      successMessage: "Education created.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.educations,
        });
      },
    }),
  });
}