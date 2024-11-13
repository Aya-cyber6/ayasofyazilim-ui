import { Meta, StoryFn } from '@storybook/react';
import { Building2, Edit, LinkIcon, Trash2, User2 } from 'lucide-react';
import { createZodObject } from 'src/lib/create-zod-object';
import TanstackTable from '.';
import {
  $editMerchantDto,
  $merchantSchema,
  col,
  faceted,
  Merchant,
  merchants,
  rowActions,
  tableAction,
} from './tanstack-table.stories.data';
import { tanstackTableCreateColumnsByRowData } from './utils';

export default {
  component: TanstackTable,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof TanstackTable>;

const template: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={col}
      rowActions={rowActions}
      tableActions={tableAction}
      excludeColumns={['id']}
    />
  </div>
);

export const Default = template.bind({});
Default.args = {
  filters: {
    textFilters: ['name'],
    facetedFilters: faceted,
  },
  selectedRowAction: {
    icon: Trash2,
    actionLocation: 'table',
    cta: `Delete`,
    onClick: (selectedIds) => {
      alert(`deleted rows:\n${selectedIds}`);
    },
  },
};

const linkStory: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={linkCol}
      columnVisibility={{
        type: 'show',
        columns: ['name', 'entityInformationTypeCode'],
      }}
    />
  </div>
);
const linkCol = tanstackTableCreateColumnsByRowData<Merchant>({
  row: $merchantSchema.properties,
  links: {
    name: {
      targetAccessorKey: 'id',
      prefix: 'http://192.168.1.105:1453/tr/app/admin',
      suffix: '/edit',
    },
    entityInformationTypeCode: {
      prefix: 'http://192.168.1.105:1453/tr/app/',
    },
  },
});
export const LinkColumns = linkStory.bind({});

const badgeStory: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={badgeCol}
      columnVisibility={{
        type: 'show',
        columns: ['name', 'entityInformationTypeCode'],
      }}
    />
  </div>
);
const badgeCol = tanstackTableCreateColumnsByRowData<Merchant>({
  row: $merchantSchema.properties,
  badges: {
    entityInformationTypeCode: {
      targetAccessorKey: 'typeCode',
      values: [
        {
          label: 'Organizasyon',
          value: 'HEADQUARTER',
        },
        {
          label: 'Bireysel',
          value: 'STORE',
        },
      ],
    },
  },
});
export const BadgeColumns = badgeStory.bind({});

const iconStory: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={iconCol}
      columnVisibility={{
        type: 'show',
        columns: ['name', 'entityInformationTypeCode'],
      }}
    />
  </div>
);
const iconCol = tanstackTableCreateColumnsByRowData<Merchant>({
  row: $merchantSchema.properties,
  icons: {
    name: {
      icon: LinkIcon,
      iconClassName: 'text-blue-500',
    },
  },
});
export const IconColumns = iconStory.bind({});

const facetedStory: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={facetedCol}
      columnVisibility={{
        type: 'show',
        columns: ['name', 'entityInformationTypeCode'],
      }}
    />
  </div>
);
const facetedCol = tanstackTableCreateColumnsByRowData<Merchant>({
  row: $merchantSchema.properties,
  faceted: {
    entityInformationTypeCode: [
      {
        value: 'INDIVIDUAL',
        label: 'Bireysel',
        icon: User2,
      },
      {
        value: 'ORGANIZATION',
        label: 'Organizasyon',
        icon: Building2,
      },
    ],
  },
});
export const FacetedColumns = facetedStory.bind({});
const translatedStory: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={translatedCol}
      columnVisibility={{
        type: 'show',
        columns: ['name', 'entityInformationTypeCode'],
      }}
    />
  </div>
);
const translatedCol = tanstackTableCreateColumnsByRowData<Merchant>({
  row: $merchantSchema.properties,
  languageData: {
    name: 'Ad',
    entityInformationTypeCode: 'Tip',
  },
});
export const TranslatedColumns = translatedStory.bind({});

const editRowStory: StoryFn<typeof TanstackTable> = (args) => (
  <div className="max-w-[1400px]">
    <TanstackTable
      {...args}
      data={merchants}
      columns={editRowCol}
      columnVisibility={{
        type: 'show',
        columns: ['name', 'entityInformationTypeCode'],
      }}
      rowActions={[
        {
          type: 'autoform-dialog',
          actionLocation: 'row',
          icon: Edit,
          schema: createZodObject($editMerchantDto),
          cta: 'Düzenle',
          title: (row) => `${row.name}'i güncelle`,
          onSubmit(row, values) {
            alert(JSON.stringify(row));
            alert(JSON.stringify(values));
          },
          values: (row) => row,
          submitText: 'Güncelle',
        },
      ]}
    />
  </div>
);
const editRowCol = tanstackTableCreateColumnsByRowData<Merchant>({
  row: $merchantSchema.properties,
  languageData: {
    name: 'Ad',
    entityInformationTypeCode: 'Tip',
  },
});
export const EditRow = editRowStory.bind({});
