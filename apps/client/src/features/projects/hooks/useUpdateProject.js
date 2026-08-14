import { useMutation } from "@tanstack/react-query";

import { projectService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useUpdateProject() {
  return useMutation({
    mutationFn: ({ id, data }) =>
      projectService.updateProject(id, data),

    ...mutationOptions({
      successMessage: "Project updated.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects,
        });
      },
    }),
  });
}