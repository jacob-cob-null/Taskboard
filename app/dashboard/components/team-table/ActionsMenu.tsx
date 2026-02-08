import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Team } from "./types";

interface ActionsMenuProps {
  team: Team;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ActionsMenu({ team, onEdit, onDelete }: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="h-8 w-8 p-0"
          aria-label="Open actions menu"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit(team.id);
          }}
        >
          Edit team
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete(team.id);
          }}
          className="text-red-600"
        >
          Delete team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
