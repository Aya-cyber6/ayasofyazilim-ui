'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AutoColumnGenerator, selectableColumns } from './types';
import { normalizeName } from './utils';

const createSortableHeader = (column: any, name: string) => (
  <Button
    className="p-0"
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {name}
    <CaretSortIcon className="ml-2 h-4 w-4" />
  </Button>
);
const readOnlyCheckbox = (row: any, value: string) => (
  <Checkbox checked={row.getValue(value)} disabled />
);

const sortColumns = (positions: string[], obj: Object) =>
  Object.assign(
    {},
    ...positions.map((position) => ({
      [position]: obj[position as keyof typeof obj],
    }))
  ) || obj;

function generateColumns({
  tableType,
  positions,
  excludeList = [],
}: Partial<AutoColumnGenerator>) {
  const generatedTableColumns: any = [];
  let tempProperties = tableType.properties;
  if (positions) {
    tempProperties = sortColumns(positions, tableType.properties);
  }
  Object.keys(tempProperties).forEach((key) => {
    const accessorKey = key;
    const header = normalizeName(key);
    const value = tempProperties[key];
    if (excludeList.includes(key)) {
      return;
    }
    if (value.type === 'boolean') {
      generatedTableColumns.push({
        accessorKey,
        header,
        cell: ({ row }: { row: any }) => readOnlyCheckbox(row, key),
      });
    }
    if (value.type === 'string') {
      generatedTableColumns.push({
        accessorKey,
        header: ({ column }: { column: any }) =>
          createSortableHeader(column, header),
      });
    }
    if (value.type === 'integer' || value.type === 'number') {
      generatedTableColumns.push({
        accessorKey,
        header,
      });
    }
  });
  return generatedTableColumns;
}

export function columnsGenerator(data: AutoColumnGenerator) {
  let onSelect: selectableColumns['onSelect'] | undefined;
  const { selectable, tableType, excludeList, positions } = data;
  if (selectable) {
    onSelect = data.onSelect;
  }

  const columns: ColumnDef<typeof data>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (typeof onSelect === 'function') {
              onSelect({
                row: table.getRowModel().rows.map((row) => row.original),
                value: Boolean(value),
                all: true,
              });
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (typeof onSelect === 'function') {
              onSelect({
                row: row.original,
                value: Boolean(value),
                all: false,
              });
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...generateColumns({ tableType, excludeList, positions }),
  ];
  if (!selectable) return columns.filter((column) => column.id !== 'select');
  return columns;
}
