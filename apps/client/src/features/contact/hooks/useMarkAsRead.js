import { useMutation } from "@tanstack/react-query";

import { contactService } from "../../../services";

export default function useMarkAsRead() {
  return useMutation({
    mutationFn: contactService.markAsRead,
  });
}
