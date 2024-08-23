import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';
import { AutoFormInputComponentProps } from '../types';

export default function AutoFormNumber({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;
  const params = {
    containerClassName: undefined,
    ...fieldPropsWithoutShowLabel,
  };
  return (
    <FormItem className={fieldProps.containerClassName}>
      {showLabel && <AutoFormLabel label={label} isRequired={isRequired} />}
      <FormControl>
        <Input type="number" {...params} />
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
