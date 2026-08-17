import { useQuery } from "@tanstack/react-query";

import { contactService } from "../../../services";
import { queryKeys } from "../../../lib/queryKeys";

export default function useMessage(params = {}) {
  return useQuery({
    queryKey: [queryKeys.messages, params],
    queryFn: () => contactService.getMessages(params),
  });
}