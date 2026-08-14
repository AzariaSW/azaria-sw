import { useQuery } from "@tanstack/react-query";

import { contactService } from "../../../services";
import { queryKeys } from "../../../lib/queryKeys";

export default function useProjects() {
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: contactService.getMessages,
  });
}