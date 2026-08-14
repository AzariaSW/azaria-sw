import { useMutation } from "@tanstack/react-query";

import { skillService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteSkill() {
  return useMutation({
    mutationFn: skillService.removeSkill,

    ...mutationOptions({
      successMessage: "Skill deleted.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.skills,
        });
      },
    }),
  });
}