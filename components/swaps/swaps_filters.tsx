import DateTimePicker from '@components/datepicker/date_picker';
import InputState from '@components/input/input_state';
import Select from '@components/input/select';
import Title from '@components/title';
import { SwapFilterData, Token } from '@interfaces/index';
import { ChangeEvent, useEffect, useState } from 'react';

export default function SwapsFilters({
  tokens,
  token,
  filterSwaps,
}: {
  tokens: Token[];
  token: Token | string;
  // eslint-disable-next-line no-unused-vars
  filterSwaps: (swapFilterData: SwapFilterData) => void;
}) {
  const [filterData, setFilterData] = useState<SwapFilterData>({
    dateFrom: null,
    dateTo: null,
    minAmount: null,
    maxAmount: null,
    token: '',
  });

  const clearFilters = (fetchNewSwaps = true) => {
    if (
      filterData.dateFrom ||
      filterData.dateTo ||
      filterData.minAmount ||
      filterData.maxAmount ||
      filterData.token !== ''
    ) {
      const emptyFilters: SwapFilterData = {
        dateFrom: null,
        dateTo: null,
        minAmount: null,
        maxAmount: null,
        token: '',
      };

      setFilterData(emptyFilters);

      if (fetchNewSwaps) {
        filterSwaps(emptyFilters);
      }
    }
  };

  useEffect(() => {
    clearFilters(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const allOptions = tokens.map((t) => {
    return { label: t.token, value: t.assetId };
  });
  const options =
    typeof token === 'string'
      ? allOptions
      : allOptions.filter((ao) => ao.value !== token.assetId);

  return (
    <div className="mb-6 px-8">
      <Title title="Swaps" titleStyle="text-start" />
      <div className="mt-6 flex flex-col gap-x-4 gap-y-8 items-center justify-between xl:flex-row">
        <div className="flex justify-center items-center flex-wrap gap-4 sm:justify-start">
          <div className="flex flex-col gap-2 xxs:flex-row xs:flex-shrink-0">
            <DateTimePicker
              name="dateFrom"
              id="dateFrom"
              value={filterData.dateFrom}
              onChangeDate={(date: Date) =>
                setFilterData((prevData) => ({
                  ...prevData,
                  dateFrom: date,
                }))
              }
              label={'Date from'}
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
            />
          </div>
          <div className="flex flex-col gap-2 xxs:flex-row xs:flex-shrink-0">
            <InputState
              id="minAmount"
              name="minAmount"
              value={filterData.minAmount ?? ''}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilterData((prevData) => ({
                  ...prevData,
                  minAmount: e.target.value,
                }))
              }
              showIcon={false}
              placeholder="Enter min amount"
              label="Min amount"
              type="number"
              labelStyle="text-xs text-opacity-50"
              inputStyle="text-xs !px-4 placeholder:text-opacity-80"
            />
            <InputState
              id="maxAmount"
              name="maxAmount"
              value={filterData.maxAmount ?? ''}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilterData((prevData) => ({
                  ...prevData,
                  maxAmount: e.target.value,
                }))
              }
              showIcon={false}
              placeholder="Enter max amount"
              label="Max amount"
              type="number"
              labelStyle="text-xs text-opacity-50"
              inputStyle="text-xs !px-4 placeholder:text-opacity-80"
            />
          </div>
          <div className="flex xs:flex-shrink-0">
            <Select
              id="token"
              name="token"
              selectedOption={filterData.token}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setFilterData((prevData) => ({
                  ...prevData,
                  token: {
                    label: e.target.options[e.target.selectedIndex].text,
                    value: e.target.value,
                  },
                }));
              }}
              label="Token"
              labelStyle="text-xs text-opacity-50"
              options={options}
              inputStyle="text-xs !px-4 !pr-16"
            />
          </div>
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={() => filterSwaps(filterData)}
            className="rounded-xl h-min py-2 whitespace-nowrap bg-pink px-3 text-white text-xs"
          >
            Filter swaps
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