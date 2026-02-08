import { v4 as uuidv4 } from "uuid";

export const createMockUser = (overrides = {}) => ({
  id: uuidv4(),
  email: "test@example.com",
  ...overrides,
});

export const createMockTeam = (overrides = {}) => ({
  id: uuidv4(),
  name: "Test Team",
  leader_id: uuidv4(),
  created_at: new Date(),
  google_calendar_id: null,
  _count: {
    teamMembers: 0,
  },
  ...overrides,
});

export const createMockMember = (overrides = {}) => ({
  id: uuidv4(),
  email: "member@example.com",
  full_name: "Test Member",
  created_at: new Date(),
  ...overrides,
});

export const createMockAnnouncement = (overrides = {}) => ({
  id: BigInt(1),
  title: "Test Announcement",
  content: "Test Content",
  team_id: uuidv4(),
  created_at: new Date(),
  sent_at: null,
  email_status: "PENDING",
  recipient_count: 0,
  delivered_count: 0,
  error_message: null,
  resend_batch_id: null,
  ...overrides,
});
