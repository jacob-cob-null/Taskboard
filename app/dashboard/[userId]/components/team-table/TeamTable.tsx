"use client";

import * as React from "react";
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
import { ActionsMenu } from "./ActionsMenu";

export default function TeamTable({
  data = sampleData,
  // Edit Handler
  onEditTeam = (team: Team) => {
    console.log(team.id);
  },
  // Delete Handler
  onDeleteTeam = (team: Team) => {
    console.log(team.id);
  },
}: TeamTableProps) {
  // Search and pagination
  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    return data.filter((team) =>
      team.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [data, searchValue]);

  // Paginate filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center pb-4">
        <SearchInput value={searchValue} onChange={setSearchValue} />
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Team Name
                </span>
              </TableHead>
              <TableHead className="text-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Members
                </span>
              </TableHead>
              <TableHead className="w-[70px] text-right">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${team.color} flex items-center justify-center text-base`}
                      >
                        {team.icon}
                      </div>
                      <span className="font-medium text-gray-900">
                        {team.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-gray-600">{team.memberCount}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionsMenu
                      team={team}
                      onEdit={() => onEditTeam?.(team)}
                      onDelete={() => onDeleteTeam?.(team)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No teams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        totalCount={filteredData.length}
        canPrevious={currentPage > 1}
        canNext={currentPage < totalPages}
        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}
