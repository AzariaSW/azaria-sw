import { useMutation } from "@tanstack/react-query";

import { skillService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useUpdateSkill() {
  return useMutation({
    mutationFn: ({ id, data }) =>
      skillService.updateSkill(id, data),

    ...mutationOptions({
      successMessage: "skill updated.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.skills,
        });
      },
    }),
  });
}