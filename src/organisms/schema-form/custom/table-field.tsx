import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';
import TanstackTable from '../../../molecules/tanstack-table';
import { TanstackTableProps } from '../../../molecules/tanstack-table/types';
import { ErrorSchemaTemplate } from '../fields';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type TableFieldProps<TData> = Omit<
  TanstackTableProps<TData, TData>,
  'onTableDataChange'
>;

export function TableField<TData>({ ...tableProps }: TableFieldProps<TData>) {
  const Field = (props: FieldProps) => {
    const { uiSchema, disabled } = props;
    const title = uiSchema?.['ui:title'];
    const memory = useMemo(
      () => (
        <div
          className={cn(
            'flex flex-col border rounded-md p-4',
            disabled && 'opacity-50 [&>div]:pointer-events-none select-none'
          )}
        >
          {title && <Label>{title}</Label>}
          <TanstackTable
            {...tableProps}
            onTableDataChange={(data) => {
              props.onChange(data);
            }}
          />
          <ErrorSchemaTemplate errorSchema={props.errorSchema} />
        </div>
      ),
      [props.errorSchema, props.disabled]
    );
    return memory;
  };
  return Field;
}
