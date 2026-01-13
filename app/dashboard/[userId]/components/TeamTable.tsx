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
import { MoreHorizontal } from "lucide-react";

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

// Team type definition
export type Team = {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  color: string;
};

// Sample data - replace with actual data
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

// Column definitions
export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Team Name
      </span>
    ),
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg ${team.color} flex items-center justify-center text-base`}
          >
            {team.icon}
          </div>
          <span className="font-medium text-gray-900">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "memberCount",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Members
      </span>
    ),
    cell: ({ row }) => {
      const count = row.getValue("memberCount") as number;
      return <div className="text-gray-600 text-center">{count}</div>;
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Actions
      </span>
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const team = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(team.id)}
            >
              Copy team ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View team</DropdownMenuItem>
            <DropdownMenuItem>Edit team</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface TeamTableProps {
  data?: Team[];
}

export default function TeamTable({ data = sampleData }: TeamTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="flex items-center pb-4">
        <div className="relative w-full max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Filter teams..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-10 border-gray-200 focus:border-blue-500 rounded-lg"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-blue-600">
          Showing {table.getFilteredRowModel().rows.length} team(s) total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="neutral"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-gray-600 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
