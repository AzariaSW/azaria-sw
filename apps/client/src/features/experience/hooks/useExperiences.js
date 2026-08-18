import { useQuery } from "@tanstack/react-query";

import { experienceService } from "../../../services";
import { queryKeys } from "../../../lib/queryKeys";

export default function useExperiences(params = {}) {
  return useQuery({
    queryKey: queryKeys.experiences,
    queryFn: () => experienceService.getExperiences(params),
  });
}