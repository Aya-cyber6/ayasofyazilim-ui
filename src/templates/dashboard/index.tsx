import CardList from '../../organisms/card-list';
import DataTable from '../../molecules/tables';
import { DashboardProps } from './types';

export default function Dashboard({
  cards,
  data,
  columnsData,
  filterBy,
  action,
}: DashboardProps) {
  let showColumns = true;
  if (!data || !columnsData) showColumns = false;

  return (
    <div className="flex flex-col items-center justify-start h-full w-full">
      {cards && (
        <div className="flex-row p-4 w-10/12">
          <CardList cards={cards} />
        </div>
      )}
      {showColumns && (
        <div className="w-10/12 flex-row p-4 m-4">
          <DataTable
            filterBy={filterBy}
            columnsData={columnsData}
            data={data}
            action={action}
          />
        </div>
      )}
    </div>
  );
}
