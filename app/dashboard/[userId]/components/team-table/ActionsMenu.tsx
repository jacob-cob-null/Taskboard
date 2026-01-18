import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Team } from "./types";

interface ActionsMenuProps {
  team: Team;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyId: () => void;
}

export function ActionsMenu({
  team,
  onView,
  onEdit,
  onDelete,
  onCopyId,
}: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopyId}>Copy team ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onView}>View team</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit team</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          Delete team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
