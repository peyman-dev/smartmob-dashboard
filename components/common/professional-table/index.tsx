// components/common/ProfessionalTable.tsx
"use client";

import { useMemo, useRef, useState, FC } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  GetQuickFilterTextParams,
  ModuleRegistry,
  AllCommunityModule, // تغییر کرد
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ProfessionalTableProps<TData = any> {
  rowData: TData[];
  columnDefs: ColDef<TData>[];
  tableTitle?: string;
  searchPlaceholder?: string;
  className?: string;
  rowHeight?: number;
  headerHeight?: number;
  paginationPageSize?: number;
  onGridReady?: (event: GridReadyEvent<TData>) => void;
  loading?: boolean;
  domLayout?: "normal" | "autoHeight" | "print";
}

const ProfessionalTable: FC<ProfessionalTableProps<any>> = ({
  rowData,
  columnDefs,
  tableTitle = "لیست داده‌ها",
  searchPlaceholder = "جستجوی سراسری...",
  className = "",
  rowHeight = 72,
  headerHeight = 56,
  paginationPageSize = 20,
  onGridReady,
  loading,
  domLayout = "normal",
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [globalSearch, setGlobalSearch] = useState("");

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      getQuickFilterText: (params: GetQuickFilterTextParams) => {
        // همه مقادیر رو به string تبدیل می‌کنه تا سرچ عددی هم کار کنه
        return String(params.value ?? "");
      },
    }),
    []
  );

  return (
    <div className={`min-h-[700px] rounded-2xl overflow-hidden ${className}`}>
      <div className="h-24 flex items-center justify-between bg-zinc-50 text-slate-700 rounded-t-2xl px-6 border-b border-zinc-200">
        <h2 className="text-2xl font-bold">{tableTitle}</h2>
        <input
          className="h-10 rounded-md border border-zinc-200 px-4 w-80 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          type="text"
          placeholder={searchPlaceholder}
          value={globalSearch}
          onChange={(e) => {
            const val = e.target.value;
            setGlobalSearch(val);
            // @ts-ignore
            gridRef.current?.api?.setQuickFilter(val);
          }}
        />
      </div>

      <div
        dir="rtl"
        className="ag-theme-alpine h-[calc(100vh-200px)] **:font-estedad! **:rounded-t-none!"
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRtl
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          rowClass="flex! **:flex! **:gap-1.5 **:items-center!"
          domLayout={domLayout}
          pagination
          paginationPageSize={paginationPageSize}
          suppressDragLeaveHidesColumns
          quickFilterText={globalSearch}
          onGridReady={onGridReady}
          loading={loading}
          localeText={{
            contains: "شامل",
            notContains: "شامل نشود",
            equals: "مساوی",
            notEqual: "نامساوی",
            startsWith: "شروع با",
            endsWith: "پایان با",
            filterOoo: "فیلتر...",
            noRowsToShow: "داده‌ای یافت نشد",
            page: "صفحه",
            to: "تا",
            of: "از",
            loadingOoo: "در حال بارگذاری...",
          }}
        />
      </div>
    </div>
  );
};

export default ProfessionalTable;