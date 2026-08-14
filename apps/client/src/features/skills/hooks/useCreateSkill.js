import { useMutation } from "@tanstack/react-query";

import { skillService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useCreateSkill() {
  return useMutation({
    mutationFn: skillService.createSkill,

    ...mutationOptions({
      successMessage: "Skill created.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.skills,
        });
      },
    }),
  });
}