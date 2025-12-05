// components/common/professional-table.tsx
"use client";

import React, { memo, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import useIsEnglish from "@/core/hooks/use-is-english";

interface ProfessionalTableProps<T> {
  columnDefs: {
    headerName: string;
    field?: keyof T | string;
    valueGetter?: (params: { data: T }) => any;
    cellRenderer?: (params: { data: T }) => React.ReactNode;
    sortable?: boolean;
    filter?: boolean;
    width?: number;
    fixed?: "left" | "right";
  }[];
  rowData: T[];
  HeaderActions?: React.ReactNode;
  loading?: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  enableInfiniteScroll?: boolean;
  noDataMessage?: string;
  endMessage?: string;
  tableTitle?: string;
  error?: Error | null;
  onRetry?: () => void;
  enableRtl?: boolean;
  scrollHeight?: string;
  rowKey?: string | ((row: T) => string);
  className?: string;
}

const TableRow = memo(
  <T extends object>({ row, cells }: { row: any; cells: any[] }) => {
    return (
      <tr className="hover:bg-gray-50 transition">
        {cells.map((cell) => (
          <td
            key={cell.id}
            className="px-4 py-3 *:flex *:items-center *:gap-1 text-gray-800"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    );
  },
  (prev, next) => prev.row.id === next.row.id
);

TableRow.displayName = "TableRow";

function ProfessionalTable<T extends object>({
  columnDefs,
  rowData = [],
  HeaderActions,
  loading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  enableInfiniteScroll = false,
  noDataMessage = "داده‌ای برای نمایش وجود ندارد",
  endMessage = "همه موارد بارگذاری شدند",
  tableTitle,
  error,
  onRetry,
  scrollHeight = "600px",
  rowKey = "_id",
  className = "",
}: ProfessionalTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [showOverlay, setShowOverlay] = React.useState(false);
  const isEN = useIsEnglish();
  const t = useTranslations("table");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  const columns: ColumnDef<T>[] = React.useMemo(
    () =>
      columnDefs.map((col) => ({
        accessorKey: col.field as string,
        header: col.headerName,
        enableSorting: col.sortable ?? true,
        enableColumnFilter: col.filter ?? true,
        cell: ({ row }) => {
          const value = col.valueGetter
            ? col.valueGetter({ data: row.original })
            : col.field
            ? row.getValue(col.field as string)
            : null;

          if (col.cellRenderer) {
            return col.cellRenderer({ data: row.original });
          }

          return <span>{String(value ?? "-")}</span>;
        },
      })),
    [columnDefs]
  );

  const getRowId = useCallback(
    (row: T, index: number) => {
      if (typeof rowKey === "function") {
        return rowKey(row);
      }
      return (row as any)[rowKey] ?? `row-${index}`;
    },
    [rowKey]
  );

  const table = useReactTable({
    data: rowData,
    columns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleScroll = useCallback(() => {
    if (!enableInfiniteScroll || !onLoadMore || isLoadingRef.current) return;

    const container = tableContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      hasMore &&
      !isFetchingMore
    ) {
      isLoadingRef.current = true;
      onLoadMore();
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 500);
    }
  }, [enableInfiniteScroll, onLoadMore, hasMore, isFetchingMore]);

  React.useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore) return;

    const container = tableContainerRef.current;
    if (!container) return;

    const throttledScroll = () => {
      if (scrollTimeoutRef.current) return;

      scrollTimeoutRef.current = setTimeout(() => {
        handleScroll();
        scrollTimeoutRef.current = null;
      }, 150);
    };

    container.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, enableInfiniteScroll, onLoadMore]);

  React.useEffect(() => {
    if (isFetchingMore) {
      // Clear any pending hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setShowOverlay(true);
    } else if (showOverlay && !hasMore) {
      // When finished and no more data, hide after delay
      hideTimeoutRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 800);
    } else if (!hasMore) {
      setShowOverlay(false);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isFetchingMore, hasMore, showOverlay]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">خطا در بارگذاری داده‌ها</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!rowData || rowData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{noDataMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full space-y-4 border rounded-lg py-4 border-neutral-200 ${className}`}
    >
      {/* عنوان و اکشن‌ها */}
      {(tableTitle || HeaderActions) && (
        <div className="flex justify-between py-3 px-4 items-center flex-wrap gap-4">
          <i></i>
          {HeaderActions && <div>{HeaderActions}</div>}
        </div>
      )}

      <div
        ref={tableContainerRef}
        className="overflow-auto rounded-lg relative"
        style={{
          height: scrollHeight,
          willChange: "scroll-position",
          transform: "translateZ(0)",
        }}
        dir={!isEN ? "rtl" : "ltr"}
      >
        <table className="w-full min-w-max table-auto text-sm">
          <thead className="border-b sticky top-0 left-0 right-0 w-full bg-white border-gray-200 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} row={row} cells={row.getVisibleCells()} />
            ))}
          </tbody>
        </table>

        {enableInfiniteScroll &&
          (isFetchingMore || (!hasMore && showOverlay)) && (
            <div className="sticky bottom-0 left-0 right-0 w-full py-6 bg-white border-t border-gray-200">
              <div className="flex flex-col items-center gap-3">
                {isFetchingMore ? (
                  <>
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <div className="text-gray-600 text-sm font-medium">
                      {t("loadingOoo")}
                    </div>
                  </>
                ) : !hasMore ? (
                  <div className="text-green-600 text-sm font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t("endOfList")}
                  </div>
                ) : null}
              </div>
            </div>
          )}  
      </div>
    </div>
  );
}

export default memo(ProfessionalTable);
