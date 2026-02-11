import React from "react";
import Link from "next/link";
import { inter } from "@/app/fonts";

export default function PrivacyPolicy() {
  const contactEmail = "silveriolance06@gmail.com";

  return (
    <div className="relative min-h-screen w-full bg-stone-50">
      {/* Dot Grid Background */}
      <div className="absolute h-full w-full bg-[radial-gradient(#93b4f5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className={`${inter.className} relative z-10 p-6 sm:p-12`}>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-12">
          <Link
            href="/login"
            className="text-blue-600 hover:underline mb-8 inline-block text-sm"
          >
            ← Back to Login
          </Link>
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: February 11, 2026
          </p>

          <section className="space-y-6 text-gray-800 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                1. Information We Collect
              </h2>
              <p>
                When you sign in using your Google Account, we collect your
                name, email address, and profile picture. If you grant
                permission, we also access your Google Calendar to facilitate
                team announcement syncing.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">2. How We Use Data</h2>
              <p>
                We use your data to authenticate your identity, provide the core
                features of Taskboard, and deliver announcement emails via
                Resend.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                3. Google API Limited Use
              </h2>
              <p>
                Taskboard&apos;s use and transfer to any other app of
                information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">4. Data Sharing</h2>
              <p>
                We do not sell your personal data. Data is shared only with
                necessary service providers: Supabase (database), Vercel
                (hosting), and Resend (email delivery).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                5. Data Retention &amp; Deletion
              </h2>
              <p>
                We retain your data while your account is active. You can
                request deletion of your account and all associated data at any
                time by contacting us at <strong>{contactEmail}</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
              <p>
                For any privacy inquiries, please reach out to:{" "}
                <strong>{contactEmail}</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
