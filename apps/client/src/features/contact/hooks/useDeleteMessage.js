import { useMutation } from "@tanstack/react-query";

import { contactService } from "../../../services";
import queryClient from "../../../lib/queryClient";
import { queryKeys } from "../../../lib/queryKeys";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteMessage(options = {}) {
  return useMutation({
    mutationFn: contactService.deleteMessage,

    ...mutationOptions({
      successMessage: "Message deleted successfully.",

      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages,
        });

        options.onSuccess?.();
      },

      ...options,
    }),
  });
}