import { useMutation } from "@tanstack/react-query";

import { projectService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useCreateProject() {
  return useMutation({
    mutationFn: projectService.createProject,

    ...mutationOptions({
      successMessage: "Project created.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects,
        });
      },
    }),
  });
}