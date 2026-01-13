"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ============================================
// TYPES
// ============================================

export type Team = {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  color: string;
};

interface TeamTableProps {
  data?: Team[];
  onViewTeam?: (team: Team) => void;
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
  onCopyTeamId?: (team: Team) => void;
}

// ============================================
// SAMPLE DATA (Replace with API data)
// ============================================

const sampleData: Team[] = [
  { id: "1", name: "Design", memberCount: 8, icon: "🎨", color: "bg-pink-100" },
  {
    id: "2",
    name: "Engineering",
    memberCount: 12,
    icon: "⚡",
    color: "bg-blue-100",
  },
  {
    id: "3",
    name: "Marketing",
    memberCount: 5,
    icon: "📈",
    color: "bg-green-100",
  },
  {
    id: "4",
    name: "Sales",
    memberCount: 15,
    icon: "🎯",
    color: "bg-orange-100",
  },
  {
    id: "5",
    name: "Support",
    memberCount: 10,
    icon: "💜",
    color: "bg-purple-100",
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

/** Search input with icon */
function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Filter teams..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-gray-200 focus:border-blue-500 rounded-lg"
      />
    </div>
  );
}

/** Column header with consistent styling */
function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </span>
  );
}

/** Team name cell with icon */
function TeamNameCell({ team }: { team: Team }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg ${team.color} flex items-center justify-center text-base`}
      >
        {team.icon}
      </div>
      <span className="font-medium text-gray-900">{team.name}</span>
    </div>
  );
}

/** Actions dropdown menu */
function ActionsMenu({
  team,
  onView,
  onEdit,
  onDelete,
  onCopyId,
}: {
  team: Team;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyId: () => void;
}) {
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

/** Pagination controls */
function Pagination({
  totalCount,
  canPrevious,
  canNext,
  onPrevious,
  onNext,
}: {
  totalCount: number;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-blue-600">
        Showing {totalCount} team(s) total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="neutral"
          size="sm"
          onClick={onPrevious}
          disabled={!canPrevious}
          className="text-gray-600 disabled:opacity-50"
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          disabled={!canNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ============================================
// COLUMN DEFINITIONS FACTORY
// ============================================

function createColumns(handlers: {
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  onCopyId: (team: Team) => void;
}): ColumnDef<Team>[] {
  return [
    {
      accessorKey: "name",
      header: () => <ColumnHeader>Team Name</ColumnHeader>,
      cell: ({ row }) => <TeamNameCell team={row.original} />,
    },
    {
      accessorKey: "memberCount",
      header: () => <ColumnHeader>Members</ColumnHeader>,
      cell: ({ row }) => (
        <div className="text-gray-600 text-center">
          {row.getValue("memberCount")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <ColumnHeader>Actions</ColumnHeader>,
      enableHiding: false,
      cell: ({ row }) => {
        const team = row.original;
        return (
          <ActionsMenu
            team={team}
            onView={() => handlers.onView(team)}
            onEdit={() => handlers.onEdit(team)}
            onDelete={() => handlers.onDelete(team)}
            onCopyId={() => handlers.onCopyId(team)}
          />
        );
      },
    },
  ];
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function TeamTable({
  data = sampleData,
  onViewTeam,
  onEditTeam,
  onDeleteTeam,
  onCopyTeamId,
}: TeamTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------

  const handleViewTeam = React.useCallback(
    (team: Team) => {
      console.log("View team:", team.name);
      onViewTeam?.(team);
    },
    [onViewTeam]
  );

  const handleEditTeam = React.useCallback(
    (team: Team) => {
      console.log("Edit team:", team.name);
      onEditTeam?.(team);
    },
    [onEditTeam]
  );

  const handleDeleteTeam = React.useCallback(
    (team: Team) => {
      console.log("Delete team:", team.name);
      onDeleteTeam?.(team);
    },
    [onDeleteTeam]
  );

  const handleCopyTeamId = React.useCallback(
    (team: Team) => {
      navigator.clipboard.writeText(team.id);
      console.log("Copied team ID:", team.id);
      onCopyTeamId?.(team);
    },
    [onCopyTeamId]
  );

  // ----------------------------------------
  // Table Setup
  // ----------------------------------------

  const columns = React.useMemo(
    () =>
      createColumns({
        onView: handleViewTeam,
        onEdit: handleEditTeam,
        onDelete: handleDeleteTeam,
        onCopyId: handleCopyTeamId,
      }),
    [handleViewTeam, handleEditTeam, handleDeleteTeam, handleCopyTeamId]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleSearchChange = (value: string) => {
    table.getColumn("name")?.setFilterValue(value);
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <div className="w-full flex flex-col">
      {/* Search */}
      <div className="flex items-center pb-4">
        <SearchInput
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No teams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        totalCount={table.getFilteredRowModel().rows.length}
        canPrevious={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
      />
    </div>
  );
}
