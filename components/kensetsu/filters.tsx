import DateTimePicker from '@components/datepicker/date_picker';
import InputState from '@components/input/input_state';
import Title from '@components/title';
import {
  KensetsuFilterData,
  KensetsuSummaryFormatted,
} from '@interfaces/index';
import { ChangeEvent, useCallback, useState } from 'react';

export default function KensetsuFilters({
  filterKensetsuBurns,
  summary,
}: {
  // eslint-disable-next-line no-unused-vars
  filterKensetsuBurns: (kensetsuFilterData: KensetsuFilterData) => void;
  summary: KensetsuSummaryFormatted | undefined;
}) {
  const [filterData, setFilterData] = useState<KensetsuFilterData>({
    dateFrom: null,
    dateTo: null,
    accountId: '',
  });

  const clearFilters = useCallback(
    (fetchNewSwaps = true) => {
      if (
        filterData.dateFrom ||
        filterData.dateTo ||
        filterData.accountId !== ''
      ) {
        const emptyFilters: KensetsuFilterData = {
          dateFrom: null,
          dateTo: null,
          accountId: '',
        };

        setFilterData(emptyFilters);

        if (fetchNewSwaps) {
          filterKensetsuBurns(emptyFilters);
        }
      }
    },
    [filterData, filterKensetsuBurns]
  );

  return (
    <div className="mb-12">
      <Title title="Kensetsu Burning" titleStyle="text-start" />
      {summary && (
        <div className="flex mt-2 items-center flex-wrap gap-y-2 gap-x-4 text-white text-opacity-50">
          <span>
            Total XOR Burned:{' '}
            <span className="text-white">{summary.xorBurned}</span>
          </span>
          <span>
            Total KEN Allocated:{' '}
            <span className="text-white">{summary.kenAllocated}</span>
          </span>
        </div>
      )}
      <div className="mt-8 flex flex-wrap gap-8 items-center justify-center xl:justify-between">
        <div className="flex flex-wrap gap-y-2 gap-x-4 justify-center items-center">
          <DateTimePicker
            name="dateFrom"
            id="dateFrom"
            minDate={new Date(2024, 1, 16)}
            value={filterData.dateFrom}
            onChangeDate={(date: Date) =>
              setFilterData((prevData) => ({
                ...prevData,
                dateFrom: date,
              }))
            }
            label={'Date from'}
            containerClassName="!w-auto"
          />
          <DateTimePicker
            name="dateTo"
            id="dateTo"
            value={filterData.dateTo}
            onChangeDate={(date: Date) =>
              setFilterData((prevData) => ({
                ...prevData,
                dateTo: date,
              }))
            }
            label={'Date to'}
            containerClassName="!w-auto"
          />
          <InputState
            id="accountId"
            name="accountId"
            value={filterData.accountId ?? ''}
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFilterData((prevData) => ({
                ...prevData,
                accountId: e.target.value,
              }))
            }
            showIcon={false}
            placeholder="Enter Account Id"
            label="Account Id"
            labelStyle="text-xs text-opacity-50"
            inputStyle="text-xs !px-4 placeholder:text-opacity-80"
          />
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={() => filterKensetsuBurns(filterData)}
            className="rounded-xl h-min py-2 whitespace-nowrap bg-pink px-3 text-white text-xs"
          >
            Filter burns
          </button>
          <button
            onClick={() => clearFilters()}
            className="rounded-xl h-min py-2 whitespace-nowrap bg-white bg-opacity-10 px-3 text-white text-xs hover:bg-opacity-20"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
