import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function AboutBtn() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <h1 className="hover:underline">Terms</h1>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Terms of Service</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-xs leading-relaxed max-h-[50vh] overflow-y-auto space-y-3 pr-4">
          <div className="border-2 w-full rounded-2xl border-zinc-900"></div>
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-lg">1. Service Scope</div>
              <div>
                TaskBoard is a management tool that syncs with your Google
                Calendar. You grant the App permission to create and manage
                events on your behalf via the Google Calendar API.
              </div>
            </div>

            <div>
              <div className="font-semibold text-lg">2. Google Data Usage</div>
              <div>
                Our use of information received from Google APIs adheres to the
                Google API Service User Data Policy, including the Limited Use
                requirements. We do not sell your calendar data or use it for
                advertising.
              </div>
            </div>

            <div>
              <div className="font-semibold text-lg">
                3. User Responsibility (Member Privacy)
              </div>
              <div>
                As a Leader, you are responsible for ensuring that you have the
                explicit consent of team members before providing their email
                addresses to TaskBoard for event sharing, in compliance with the
                Philippine Data Privacy Act.
              </div>
            </div>

            <div>
              <div className="font-semibold text-lg">4. Data Storage</div>
              <div>
                We use Supabase to securely store project metadata and user IDs.
                While we prioritize security, you use this service at your own
                risk. TaskBoard is provided as is without warranties of any
                kind.
              </div>
            </div>

            <div>
              <div className="font-semibold text-lg">5. Termination</div>
              <div>
                We reserve the right to revoke access if the service is used for
                spamming or unauthorized data collection.
              </div>
            </div>

            <div>
              <div className="font-semibold text-lg">6. Governing Law</div>
              <div>
                These terms are governed by the laws of the Republic of the
                Philippines.
              </div>
            </div>
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction>I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AboutBtn;
