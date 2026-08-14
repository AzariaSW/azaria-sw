import { useMutation } from "@tanstack/react-query";

import { projectService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteProject() {
  return useMutation({
    mutationFn: projectService.removeProject,

    ...mutationOptions({
      successMessage: "Project deleted.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects,
        });
      },
    }),
  });
}