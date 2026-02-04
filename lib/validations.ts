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

// Calendar Event Object (base schema without transform)
const CalendarEventBaseSchema = z.object({
  id: z.string(),
  title: z.string().min(6, "Event title must be at least 6 characters long"),
  start: z.date(),
  end: z.date().optional(),
  googleEventId: z.string().nullish(),
  desc: z
    .string()
    .max(30, "Description should be 30 characters maximum")
    .optional(),
});

// Calendar Event with transform (for runtime validation)
export const CalendarEventSchema = CalendarEventBaseSchema.transform(
  (data) => ({
    ...data,
    end: data.end || data.start, // Default end to start if not provided
  }),
).refine((data) => data.end >= data.start, {
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

// Input schemas for mutations (use base schema for omit/partial)
export const CreateEventSchema = CalendarEventBaseSchema.omit({
  id: true,
  googleEventId: true,
})
  .transform((data) => ({
    ...data,
    end: data.end || data.start, // Default end to start if not provided
  }))
  .refine((data) => data.end >= data.start, {
    message: "End date cannot be earlier than start date",
    path: ["end"],
  });
export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CalendarEventBaseSchema.partial()
  .required({
    id: true,
    start: true, // Require start for the transform to work
  })
  .transform((data) => ({
    ...data,
    end: data.end || data.start, // Default end to start if not provided
  }))
  .refine((data) => data.end >= data.start, {
    message: "End date cannot be earlier than start date",
    path: ["end"],
  });
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;

// Member Object
export const MemberSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string().optional(),
  added_at: z.date().optional(),
});
export type Member = z.infer<typeof MemberSchema>;

// Add Member Input
export const AddMemberSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
});
export type AddMemberInput = z.infer<typeof AddMemberSchema>;

// Import Members Input
export const ImportMemberSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  full_name: z.string().optional(),
});
export const ImportMembersSchema = z.array(ImportMemberSchema);
export type ImportMembersInput = z.infer<typeof ImportMembersSchema>;
