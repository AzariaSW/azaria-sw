import { useMutation } from "@tanstack/react-query";

import { educationService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteEducation() {
  return useMutation({
    mutationFn: educationService.removeEducation,

    ...mutationOptions({
      successMessage: "Education deleted.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.educations,
        });
      },
    }),
  });
}