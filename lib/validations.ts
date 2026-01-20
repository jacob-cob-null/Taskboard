import * as z from "zod";

export const Team = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  leader_id: z.string().uuid(),
});
