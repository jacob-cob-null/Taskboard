"use client";
import { addMember } from "@/actions/members";

export default function NewMember() {
  const runTest = async () => {
    const testEmail = `test-${Math.floor(Math.random() * 1000)}@example.com`;
    const result = await addMember(testEmail, "Test User");

    if (result.success) {
      alert(`It Works! Created Member ID: ${result.member?.id}`);
    } else {
      alert(`Failed: ${result.error}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Prisma Connectivity Test</h3>
      <button
        onClick={runTest}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Click to Create Test Member
      </button>
    </div>
  );
}
