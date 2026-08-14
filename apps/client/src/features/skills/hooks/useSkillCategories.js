import { useQuery } from "@tanstack/react-query";

import { skillService } from "../../../services";
import { queryKeys } from "../../../lib/queryKeys";

export default function useSkillCategories() {
  return useQuery({
    queryKey: queryKeys.skillCategories,
    queryFn: skillService.getSkillCategories,
  });
}