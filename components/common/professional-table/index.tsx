"use client";

import { useMemo, useRef, FC, JSX, memo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  GetQuickFilterTextParams,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import { useTranslations } from "next-intl";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ProfessionalTableProps<TData = any> {
  rowData: TData[];
  columnDefs: ColDef<TData>[];
  tableTitle?: string;
  className?: string;
  rowHeight?: number;
  headerHeight?: number;
  paginationPageSize?: number;
  onGridReady?: (event: GridReadyEvent<TData>) => void;
  loading?: boolean;
  domLayout?: "normal" | "autoHeight" | "print";
  HeaderActions?: JSX.Element;
}

// کامپراتور هوشمند (عدد + متن فارسی/انگلیسی + null safe)
const smartComparator = (valueA: any, valueB: any): number => {
  // اگر هر دو null یا undefined → برابر
  if (valueA == null && valueB == null) return 0;
  if (valueA == null) return 1;
  if (valueB == null) return -1;

  // تلاش برای تبدیل به عدد
  const numA = Number(valueA);
  const numB = Number(valueB);

  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }

  // سورت متنی با پشتیبانی کامل فارسی
  const strA = String(valueA).trim();
  const strB = String(valueB).trim();

  return strA.localeCompare(strB, "fa", { numeric: true, sensitivity: "base" });
};

const ProfessionalTable: FC<ProfessionalTableProps<any>> = ({
  rowData,
  columnDefs: userColumnDefs,
  className = "",
  rowHeight = 72,
  headerHeight = 56,
  paginationPageSize = 20,
  onGridReady,
  loading,
  domLayout = "normal",
  HeaderActions,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const t = useTranslations("common");
  const tableT = useTranslations("table");

  const columnDefs = useMemo(() => {
    return userColumnDefs.map((col): ColDef<any> => {
      const hasCustomComparator = col.comparator != null;
      const isUnsortable = col.sortable === false;

      if (hasCustomComparator || isUnsortable) {
        return col;
      }

      const valueGetter =
        col.valueGetter ??
        (col.field
          ? (params: any) => params.data?.[col.field as string]
          : undefined);

      return {
        ...col,
        sortable: true,
        comparator: smartComparator,
        valueGetter,
      };
    });
  }, [userColumnDefs]);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      getQuickFilterText: (params: GetQuickFilterTextParams) =>
        String(params.value ?? ""),
    }),
    []
  );

  const gridKey = useMemo(() => `${rowData.length}-${Date.now()}`, [rowData]);

  return (
    <div className={`min-h-[700px] rounded-2xl overflow-hidden ${className}`}>
      <div className="h-24 flex items-center justify-between bg-zinc-50 text-slate-700 rounded-t-2xl px-6 border-b border-zinc-200">
        <h2 className="md:text-xl text-base lg:text-2xl font-bold">
          {t("dataList")}
        </h2>
        <div className="*:rounded-lg!">{HeaderActions}</div>
      </div>

      <div className="ag-theme-alpine h-[calc(100vh-200px)]">
        <AgGridReact
          key={gridKey}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRtl
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          domLayout={domLayout}
          pagination
          paginationPageSize={paginationPageSize}
          suppressDragLeaveHidesColumns
          onGridReady={onGridReady}
          loading={loading}
          localeText={{
            contains: tableT("contains"),
            notContains: tableT("notContains"),
            equals: tableT("equals"),
            notEqual: tableT("notEqual"),
            startsWith: tableT("startsWith"),
            endsWith: tableT("endsWith"),
            filterOoo: tableT("filterOoo"),
            noRowsToShow: tableT("noRowsToShow"),
            page: tableT("page"),
            to: tableT("to"),
            of: tableT("of"),
            loadingOoo: tableT("loadingOoo"),
          }}
        />
      </div>
    </div>
  );
};

export default memo(ProfessionalTable);
