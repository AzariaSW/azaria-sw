import { useMutation } from "@tanstack/react-query";

import { educationService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useUpdateEducation() {
  return useMutation({
    mutationFn: ({ id, data }) =>
      educationService.updateEducation(id, data),

    ...mutationOptions({
      successMessage: "Education updated.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.educations,
        });
      },
    }),
  });
}