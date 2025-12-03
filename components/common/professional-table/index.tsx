// components/common/professional-table.tsx
"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
  const isEN = useIsEnglish()
  const t = useTranslations("table");

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

  const table = useReactTable({
    data: rowData,
    columns,
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
    // صفحه‌بندی داخلی کاملاً حذف شد!
  });

  // هندلر اسکرول برای Infinite Scroll
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore) return;

    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasMore &&
        !isFetchingMore
      ) {
        onLoadMore();
      }
    };

    const container = tableContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [enableInfiniteScroll, onLoadMore, hasMore, isFetchingMore]);

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
    <div  className={`w-full space-y-4 border rounded-lg border-neutral-200 ${className}`}>
      {/* عنوان و اکشن‌ها */}
      {(tableTitle || HeaderActions) && (
        <div className="flex justify-between py-3 px-4 items-center flex-wrap gap-4">
          <i></i>
          {HeaderActions && <div>{HeaderActions}</div>}
        </div>
      )}

      {/* جدول با اسکرول و Infinite Scroll */}
      <div
        ref={tableContainerRef}
        className="overflow-auto border border-gray-200 rounded-lg"
        style={{ height: scrollHeight }}
        dir={!isEN ? "rtl" : "ltr"}
      >
        <table className="w-full min-w-max table-auto text-sm">
          <thead className=" border-b border-gray-200 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                      {{
                        asc: " (صعودی)",
                        desc: " (نزولی)",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={crypto.randomUUID()}
                className="hover: transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 *:flex *:items-center *:gap-1 text-gray-800"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {/* ردیف لودینگ یا پایان */}
          </tbody>
        {enableInfiniteScroll && (
          <tr className="grow flex items-center mx-auto!  text-sm! select-none justify-center w-full!">
            <td
              colSpan={columns.length}
              className="py-8 text-center flex items-center justify-center w-full! text-gray-500"
            >
              {isFetchingMore ? (
                <div>{t("loadingOoo")}</div>
              ) : hasMore ? (
                <div>{t("scrollToLoadMore")}</div>
              ) : (
                <div>{t("endOfList")}</div>
              )}
            </td>
          </tr>
        )}
        </table>
      </div>
    </div>
  );
}

export default ProfessionalTable;
