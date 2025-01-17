import { ColumnDef } from '@tanstack/react-table';
import { ComponentType } from 'react';
import { z } from 'zod';
import { ZodObjectOrWrapped } from '../../../organisms/auto-form/utils';

export type TanstackTableProps<TData, TValue> = {
  columnOrder?: (keyof TData)[];
  columnVisibility?: {
    columns: (keyof TData | 'select')[];
    type: 'show' | 'hide';
  };
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  editable?: boolean;
  excludeColumns?: (keyof TData)[];
  expandedRowComponent?: (
    row: TData,
    toggleExpanded: () => void
  ) => JSX.Element;
  fillerColumn: keyof TData;
  filters?: TanstackTableFiltersType;
  onTableDataChange?: (data: TData[]) => void;
  pinColumns?: (keyof TData)[];
  rowActions?: TanstackTableRowActionsType<TData>[];
  rowCount?: number;
  selectedRowAction?: TanstackTableSelectedRowActionType<TData>;
  showPagination?: boolean;
  tableActions?: TanstackTableTableActionsType[];
};
export type TanstackTableConfig = {
  dateOptions?: Intl.LocaleOptions;
  locale?: Intl.LocalesArgument;
};
export type TanstackTableCellCondition = {
  conditionAccessorKey: string;
  when: (value: string | boolean | number | Date) => boolean;
};
export type TanstackTableColumnClassNames = {
  className?: string;
  conditions: TanstackTableCellCondition[];
};
export type TanstackTableFacetedFilterType = {
  className?: string;
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  label: string;
  value: string;
};
export type TanstackTableDateFilterType = {
  endAccessorKey?: string;
  label: string;
  startAccessorKey: string;
};

export type TanstackTableFiltersType = {
  dateFilters?: TanstackTableDateFilterType[];
  facetedFilters?: Record<
    string,
    {
      options: TanstackTableFacetedFilterType[];
      title: string;
    }
  >;
  textFilters?: string[];
};

export type TanstackTableColumnLink = {
  conditions?: TanstackTableCellCondition[];
  prefix: string;
  suffix?: string;
  targetAccessorKey?: string;
};
export type TanstackTableColumnBadge = {
  className?: string;
  hideColumnValue?: boolean;
  values: {
    badgeClassName?: string;
    conditions?: TanstackTableCellCondition[];
    label: string;
  }[];
};
export type TanstackTableColumnIcon = {
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  position?: 'before' | 'after';
};
export type TanstackTableColumCell<TData> = {
  conditions?: TanstackTableCellCondition[];
  content: (row: TData) => JSX.Element;
  showHeader?: boolean;
};
export type TanstackTableRowActionsDeleteRow = {
  type: 'delete-row';
};
export type TanstackTableRowActionsSimple<TData> = {
  onClick: (row: TData) => void;
  type: 'simple';
};

export type TanstackTableRowDialog<TData> = {
  cancelText?: string;
  confirmationText?: string;
  onCancel?: (row: TData) => void;
  onConfirm?: (row: TData) => void;
  title: string | ((row: TData) => string);
};
export type TanstackTableRowActionsCustomDialog<TData> =
  TanstackTableRowDialog<TData> & {
    cancelText?: string;
    confirmationText?: string;
    content: JSX.Element | ((row: TData) => JSX.Element);
    type: 'custom-dialog';
  };
export type TanstackTableRowActionsConfirmationDialog<TData> =
  TanstackTableRowDialog<TData> & {
    cancelText: string;
    confirmationText: string;
    description: string;
    onCancel?: (row: TData) => void;
    onConfirm: (row: TData) => void;
    type: 'confirmation-dialog';
  };
export type TanstackTableRowActionsAutoformDialog<TData> = Omit<
  TanstackTableRowDialog<TData>,
  'cancelText' | 'onCancel' | 'confirmationText' | 'onConfirm'
> & {
  className?: { autoform: string; submit: string };
  onSubmit: (row: TData, values: Partial<z.infer<ZodObjectOrWrapped>>) => void;
  schema: ZodObjectOrWrapped;
  submitText: string;
  type: 'autoform-dialog';
  values?: (row: TData) => Partial<z.infer<ZodObjectOrWrapped>>;
};
export type TanstackTableRowActionsType<TData> = {
  actionLocation: 'row';
  cta: string;
  icon?: ComponentType<{ className?: string }>;
} & (
  | TanstackTableRowActionsConfirmationDialog<TData>
  | TanstackTableRowActionsSimple<TData>
  | TanstackTableRowActionsDeleteRow
  | TanstackTableRowActionsCustomDialog<TData>
  | TanstackTableRowActionsAutoformDialog<TData>
);

export type TanstackTableActionsSimple = {
  actionLocation: 'table';
  onClick: () => void;
  type: 'simple';
};
export type TanstackTableCreateRowAction = {
  actionLocation: 'table';
  onClick?: () => void;
  type: 'create-row';
};
export type TanstackTableActionsDialog = {
  cancelText?: string;
  confirmationText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  title: string;
};
export type TanstackTableActionsAutoformDialog = Omit<
  TanstackTableActionsDialog,
  'cancelText' | 'onCancel' | 'confirmationText' | 'onConfirm'
> & {
  className?: { autoform: string; submit: string };
  onSubmit: (values: Partial<z.infer<ZodObjectOrWrapped>>) => void;
  schema: ZodObjectOrWrapped;
  submitText: string;
  type: 'autoform-dialog';
  values?: Partial<z.infer<ZodObjectOrWrapped>>;
};
export type TanstackTableActionsCustomDialog = TanstackTableActionsDialog & {
  content: JSX.Element;
  type: 'custom-dialog';
};
export type TanstackTableTableActionsType = {
  actionLocation: 'table';
  cta: string;
  icon?: ComponentType<{ className?: string }>;
} & (
  | TanstackTableActionsSimple
  | TanstackTableActionsCustomDialog
  | TanstackTableActionsAutoformDialog
  | TanstackTableCreateRowAction
);
export type TanstackTableSelectedRowActionType<TData> = {
  actionLocation: 'table';
  cta: string;
  icon?: ComponentType<{ className?: string }>;
  onClick: (selectedIds: string[], selectedRows: TData[]) => void;
};

export type TanstackTableLanguageDataTypeWithConstantKey = {
  constantKey: string;
  languageData: Record<string, string>;
};
export type TanstackTableLanguageDataType =
  | Record<string, string>
  | TanstackTableLanguageDataTypeWithConstantKey;

export type TanstackTableCreateColumnsByRowId<T> = {
  badges?: Partial<Record<keyof T, TanstackTableColumnBadge>>;
  classNames?: Partial<Record<keyof T, TanstackTableColumnClassNames[]>>;
  config?: TanstackTableConfig;
  custom?: Partial<Record<keyof T, TanstackTableColumCell<T>>>;
  excludeColumns?: Partial<keyof T>[];
  expandRowTrigger?: keyof T;
  faceted?: Partial<
    Record<keyof T, { options: TanstackTableFacetedFilterType[] }>
  >;
  icons?: Partial<Record<keyof T, TanstackTableColumnIcon>>;
  languageData?: TanstackTableLanguageDataType;
  links?: Partial<Record<keyof T, TanstackTableColumnLink>>;
  rows: Record<
    keyof T,
    {
      format?: string;
      type: string;
    }
  >;
  selectableRows?: boolean;
};

export type TanstacktableEditableColumnsByRowId<T> = {
  excludeColumns?: Partial<keyof T>[];
  languageData?: TanstackTableLanguageDataType;
  rows: Record<
    string,
    {
      enum?: readonly string[];
      format?: string;
      type: string;
    }
  >;
};

export type TanstackTableCreationProps<T> = Omit<
  TanstackTableProps<T, string>,
  'columns' | 'data' | 'rowCount'
>;
