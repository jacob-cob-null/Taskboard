import React from "react";
import Link from "next/link";
import { inter } from "@/app/fonts";

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: February 11, 2026
          </p>

          <section className="space-y-6 text-gray-800 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing Taskboard at taskboard.page, you agree to be bound
                by these Terms of Service and all applicable laws and
                regulations.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">2. Use License</h2>
              <p>
                Taskboard is provided as a tool for team management and
                announcement syncing. You agree not to use the service for any
                illegal or unauthorized purpose.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                3. Google Integration
              </h2>
              <p>
                Using Taskboard requires a Google Account and your consent to
                specific OAuth scopes. You are responsible for maintaining the
                security of your account credentials.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                4. User Responsibility (Member Privacy)
              </h2>
              <p>
                As a Leader, you are responsible for ensuring that you have the
                explicit consent of team members before providing their email
                addresses to TaskBoard for event sharing, in compliance with the
                Philippine Data Privacy Act.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                5. Limitation of Liability
              </h2>
              <p>
                Taskboard is provided &quot;as is&quot;. We make no warranties
                regarding the reliability or accuracy of the service. We shall
                not be liable for any damages arising from the use or inability
                to use the service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">6. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our
                service immediately, without prior notice, for any reason
                whatsoever.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">7. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Republic of the
                Philippines.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">8. Contact</h2>
              <p>
                Questions about these terms should be sent to:{" "}
                <strong>{contactEmail}</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
