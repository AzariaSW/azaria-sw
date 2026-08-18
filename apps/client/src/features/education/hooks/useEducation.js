import { useQuery } from "@tanstack/react-query";

import { educationService } from "../../../services";
import { queryKeys } from "../../../lib/queryKeys";

export default function useEducation(params = {}) {
  return useQuery({
    queryKey: queryKeys.educations,
    queryFn: () => educationService.getEducations(params),
  });
}
