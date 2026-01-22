import * as z from "zod";

// Team Object
export const Team = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  leader_id: z.string().uuid(),
});
// Validate UUID
export function validateUUID(...uuids: string[]): boolean {
  return uuids.every((uuid) => z.string().uuid().safeParse(uuid).success);
}
