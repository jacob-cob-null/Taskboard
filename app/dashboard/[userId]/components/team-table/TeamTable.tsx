"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Team, TeamTableProps } from "./types";
import { sampleData } from "./data";
import { SearchInput } from "./SearchInput";
import { Pagination } from "./Pagination";
import { createColumns } from "./columns";

export default function TeamTable({
  data = sampleData,
  onViewTeam,
  onEditTeam,
  onDeleteTeam,
  onCopyTeamId,
}: TeamTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const handleViewTeam = React.useCallback(
    (team: Team) => {
      console.log("View team:", team.name);
      onViewTeam?.(team);
    },
    [onViewTeam],
  );

  const handleEditTeam = React.useCallback(
    (team: Team) => {
      console.log("Edit team:", team.name);
      onEditTeam?.(team);
    },
    [onEditTeam],
  );

  const handleDeleteTeam = React.useCallback(
    (team: Team) => {
      console.log("Delete team:", team.name);
      onDeleteTeam?.(team);
    },
    [onDeleteTeam],
  );

  const handleCopyTeamId = React.useCallback(
    (team: Team) => {
      navigator.clipboard.writeText(team.id);
      console.log("Copied team ID:", team.id);
      onCopyTeamId?.(team);
    },
    [onCopyTeamId],
  );

  const columns = React.useMemo(
    () =>
      createColumns({
        onView: handleViewTeam,
        onEdit: handleEditTeam,
        onDelete: handleDeleteTeam,
        onCopyId: handleCopyTeamId,
      }),
    [handleViewTeam, handleEditTeam, handleDeleteTeam, handleCopyTeamId],
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

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center pb-4">
        <SearchInput
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={handleSearchChange}
        />
      </div>

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
                          header.getContext(),
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
                        cell.getContext(),
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
