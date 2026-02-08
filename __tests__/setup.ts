// Mock process.env variables if needed/global
process.env.RESEND_API_KEY = "re_mock_key_123";
process.env.DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/taskboard_test";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co";

// This will use the manual mock in utils/prisma/__mocks__/prisma.ts
jest.mock("@/utils/prisma/prisma");
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "mock-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-service-role-key";

// Global console mock to reduce noise during tests if desired
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
