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

// Calendar Event Object
export const CalendarEventSchema = z
  .object({
    id: z.string(),
    title: z.string().min(6, "Event title must be at least 6 characters long"),
    start: z.date(),
    end: z.date(),
    googleEventId: z.string().nullish(),
    desc: z
      .string()
      .max(30, "Description should be 30 characters maximum")
      .optional(),
  })
  .refine((data) => data.end >= data.start, {
    message: "End date cannot be earlier than start date",
    path: ["end"],
  });

// Calendar Object
export const CalendarSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  summary: z.string().optional(),
  timeZone: z.string().optional(),
  location: z.string().optional(),
  backgroundColor: z.string().optional(),
  foregroundColor: z.string().optional(),
  accessRole: z.string().optional(),
  defaultReminders: z.array(z.any()).optional(),
  conferenceProperties: z
    .object({
      allowedConferenceTypes: z.array(z.string()).optional(),
    })
    .optional(),
});

// Infer TypeScript type from schema
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

// Input schemas for mutations
export const CreateEventSchema = CalendarEventSchema.omit({
  id: true,
  googleEventId: true,
});
export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CalendarEventSchema.partial().required({
  id: true,
});
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
