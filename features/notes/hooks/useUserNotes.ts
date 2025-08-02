import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { queryKeys } from "@/lib/query/keys";
import { UserNotesService } from "../services/user-notes.service";

export function useUserNotes(page: number = 1, limit: number = 10) {
  return useApiQuery({
    queryKey: queryKeys.userNotesPaginated(page, limit),
    queryFn: () => UserNotesService.getUserNotes(page, limit),
    options: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}
