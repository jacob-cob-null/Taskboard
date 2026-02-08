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

export interface ColumnDef<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchKey: keyof T;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  renderActions?: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  headerActions?: React.ReactNode;
  SearchComponent?: React.ComponentType<{
    value: string;
    onChange: (value: string) => void;
  }>;
  PaginationComponent?: React.ComponentType<{
    totalCount: number;
    canPrevious: boolean;
    canNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  emptyMessage = "No results found.",
  onRowClick,
  renderActions,
  itemsPerPage = 5,
  headerActions,
  SearchComponent,
  PaginationComponent,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchValue) return data;
    return data.filter((item) => {
      const value = item[searchKey];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchValue.toLowerCase());
      }
      return false;
    });
  }, [data, searchValue, searchKey]);

  // Paginate filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col gap-4 flex-shrink-0">
        {SearchComponent && (
          <div className="flex items-center justify-between gap-4">
            <SearchComponent value={searchValue} onChange={setSearchValue} />
            {headerActions && (
              <div className="flex items-center gap-2">{headerActions}</div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {column.header}
                    </span>
                  </TableHead>
                ))}
                {renderActions && (
                  <TableHead className="w-[70px] text-right">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length ? (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className={onRowClick ? "cursor-pointer" : ""}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {column.render
                          ? column.render(item)
                          : String(item[column.key] || "")}
                      </TableCell>
                    ))}
                    {renderActions && (
                      <TableCell className="text-right">
                        {renderActions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderActions ? 1 : 0)}
                    className="h-24 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {PaginationComponent && (
        <PaginationComponent
          totalCount={filteredData.length}
          canPrevious={currentPage > 1}
          canNext={currentPage < totalPages}
          onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  );
}
