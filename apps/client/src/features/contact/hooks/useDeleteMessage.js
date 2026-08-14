import { useMutation } from "@tanstack/react-query";

import { contactService } from "../../../services";
import mutationOptions from "../../../lib/mutationOptions";

export default function useDeleteMessage(options = {}) {
  return useMutation({
    mutationFn: contactService.deleteMessage,
    ...mutationOptions({
      successMessage: "Message deleted successfully.",

      ...options,
    }),
  });
}
