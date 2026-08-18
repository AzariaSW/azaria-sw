import { useQuery } from "@tanstack/react-query";

import { certificateService } from "../../../services";
import { queryKeys } from "../../../lib/queryKeys";

export default function useCertificates(params = {}) {
  return useQuery({
    queryKey: queryKeys.certificates,
    queryFn: () => certificateService.getCertificates(params),
  });
}
