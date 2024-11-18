import { Column, ColumnDef, Row } from '@tanstack/react-table';
import Link from 'next/link';
import { CSSProperties } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { TanstackTableColumnHeader } from '../fields/tanstack-table-column-header';
import {
  TanstackTableCellCondition,
  TanstackTableColumnBadge,
  TanstackTableColumnClassNames,
  TanstackTableColumnDate,
  TanstackTableColumnIcon,
  TanstackTableColumnLink,
  TanstackTableFacetedFilterType,
  TanstackTableLanguageDataType,
  TanstackTableLanguageDataTypeWithConstantKey,
} from '../types';
import { tanstackTableCreateTitleWithLanguageData } from './columnNames';

export * from './columnNames';
export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  /**
   * Show box shadow between pinned and scrollable columns.
   * @default false
   */
  withBorder?: boolean;
}): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');
  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px hsl(var(--border)) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px hsl(var(--border)) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    width: column.getSize(),
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    zIndex: isPinned ? 1 : 0,
  };
}

function testConditions<T>(
  conditions: TanstackTableCellCondition[] | undefined,
  row: Row<T>
) {
  if (!conditions) return true;

  return (
    conditions
      .map((condition) =>
        condition.when(row.getValue(condition.conditionAccessorKey))
      )
      .filter((i) => !i).length === 0
  );
}

export function tanstackTableCreateColumnsByRowData<T>(params: {
  badges?: Record<string, TanstackTableColumnBadge>;
  classNames?: Record<string, TanstackTableColumnClassNames[]>;
  dates?: Record<string, TanstackTableColumnDate>;
  excludeColumns?: Partial<keyof T>[];
  expandRowTrigger?: keyof T;
  faceted?: Record<string, { options: TanstackTableFacetedFilterType[] }>;
  icons?: Record<string, TanstackTableColumnIcon>;
  languageData?:
    | TanstackTableLanguageDataType
    | TanstackTableLanguageDataTypeWithConstantKey;
  links?: Record<string, TanstackTableColumnLink>;
  row: Record<string, string | number | boolean | Date | null | object>;
  selectableRows?: boolean;
}) {
  function createCell(
    accessorKey: string,
    row: Row<T>,
    link?: TanstackTableColumnLink,
    faceted?: TanstackTableFacetedFilterType[],
    badge?: TanstackTableColumnBadge,
    date?: TanstackTableColumnDate,
    icon?: TanstackTableColumnIcon,
    className?: TanstackTableColumnClassNames[],
    expandRowTrigger?: boolean
  ) {
    let content: JSX.Element | string =
      row.getValue(accessorKey)?.toString() || '';

    if (date) {
      content = new Date(content).toLocaleDateString(
        date.locale,
        date.options || {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );
    }
    if (icon) {
      const position = icon.position || 'before';
      content = (
        <>
          {icon.icon && position === 'before' && (
            <icon.icon className={cn('w-4 h-4', icon.iconClassName)} />
          )}
          {row.getValue(accessorKey)}
          {icon.icon && position === 'after' && (
            <icon.icon className={cn('w-4 h-4', icon.iconClassName)} />
          )}
        </>
      );
    }
    if (badge) {
      const badges = badge.values.map((item) =>
        item.conditions?.map((condition) => {
          if (condition.when(row.getValue(condition.conditionAccessorKey))) {
            return (
              <Badge variant="outline" className={item.badgeClassName}>
                {item.label}
              </Badge>
            );
          }
          return null;
        })
      );
      content = (
        <>
          {badges}
          {!badge.hideColumnValue && content}
        </>
      );
    }
    if (faceted) {
      const facetedItem = faceted.find(
        (item) => item.value === row.getValue(accessorKey)
      );

      if (facetedItem) {
        content = (
          <div className={cn('flex items-center', facetedItem.className)}>
            {facetedItem.icon && (
              <facetedItem.icon
                className={cn(
                  'text-muted-foreground mr-2 h-4 w-4',
                  facetedItem.iconClassName
                )}
              />
            )}
            <span>{facetedItem.label}</span>
          </div>
        );
      }
    }
    const containerClassName = className
      ?.map((item) => {
        if (testConditions(item.conditions, row)) {
          return item.className;
        }
        return null;
      })
      .join(' ');

    if (!link || !testConditions(link.conditions, row)) {
      if (expandRowTrigger) {
        return (
          <button
            type="button"
            onClick={row.getToggleExpandedHandler()}
            className={cn(
              'font-medium text-blue-700 flex items-center gap-2 cursor-pointer',
              containerClassName
            )}
          >
            {content}
          </button>
        );
      }
      return (
        <div className={cn(' flex items-center gap-2', containerClassName)}>
          {content}
        </div>
      );
    }
    let url = link.prefix;
    if (link.targetAccessorKey) {
      url +=
        `/${row
          ._getAllCellsByColumnId()
          ?.[link.targetAccessorKey || ''].getValue()
          ?.toString()}` || '';
    }
    if (link.suffix) {
      url += `/${link.suffix}`;
    }
    return (
      <Link
        href={url}
        className={cn(
          'font-medium text-blue-700 flex items-center gap-2',
          containerClassName
        )}
      >
        {content}
      </Link>
    );
  }

  const {
    excludeColumns,
    row,
    languageData,
    links,
    faceted,
    badges,
    classNames,
    dates,
    icons,
    expandRowTrigger,
  } = params;
  const columns: ColumnDef<T>[] = [];
  if (params.selectableRows) {
    columns.push({
      size: 64,
      id: 'select',
      header: ({ table }) => (
        <div className="w-14">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }
  Object.keys(row)
    .filter((key) => !excludeColumns?.includes(key as keyof T))
    .forEach((accessorKey) => {
      const title = tanstackTableCreateTitleWithLanguageData({
        languageData,
        accessorKey,
      });
      const link = links?.[accessorKey];

      const column: ColumnDef<T> = {
        id: accessorKey,
        accessorKey,
        meta: title,
        header: ({ column }) => (
          <TanstackTableColumnHeader column={column} title={title} />
        ),
        cell: ({ row }) =>
          createCell(
            accessorKey,
            row,
            link,
            faceted?.[accessorKey]?.options,
            badges?.[accessorKey],
            dates?.[accessorKey],
            icons?.[accessorKey],
            classNames?.[accessorKey],
            expandRowTrigger === accessorKey
          ),
      };
      if (faceted?.[accessorKey]) {
        column.filterFn = (row, id, value) => value.includes(row.getValue(id));
      }
      columns.push(column);
    });

  return columns;
}
