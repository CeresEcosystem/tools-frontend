import ExcludeAccounts from '@components/account/exclude_accounts';
import DateTimePicker from '@components/datepicker/date_picker';
import InputState from '@components/input/input_state';
import Select from '@components/input/select';
import Title from '@components/title';
import { ALL_TOKENS, FAVORITE_TOKENS } from '@constants/index';
import { SwapFilterData, Token } from '@interfaces/index';
import { RootState } from '@store/index';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const [filterData, setFilterData] = useState<SwapFilterData>({
    dateFrom: null,
    dateTo: null,
    minAmount: null,
    maxAmount: null,
    token: '',
    excludedAccounts: [],
  });

  const clearFilters = (fetchNewSwaps = true) => {
    if (
      filterData.dateFrom ||
      filterData.dateTo ||
      filterData.minAmount ||
      filterData.maxAmount ||
      filterData.token !== '' ||
      filterData.excludedAccounts.length > 0
    ) {
      const emptyFilters: SwapFilterData = {
        dateFrom: null,
        dateTo: null,
        minAmount: null,
        maxAmount: null,
        token: '',
        excludedAccounts: [],
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
    token === ALL_TOKENS
      ? allOptions
      : token === FAVORITE_TOKENS
      ? allOptions.filter((ao) => !favoriteTokens.includes(ao.value))
      : allOptions.filter((ao) => ao.value !== (token as Token).assetId);

  return (
    <div className="mb-6 px-8">
      <Title title="Swaps" titleStyle="text-start" />
      <div className="mt-6 flex flex-col gap-x-4 gap-y-8 items-center justify-between xl:flex-row">
        <div className="flex justify-center items-center flex-wrap gap-4 xl:justify-start">
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
          <ExcludeAccounts
            excludedAccounts={filterData.excludedAccounts}
            setExcludedAccounts={(excludedAccounts: string[]) =>
              setFilterData((prevData) => ({
                ...prevData,
                excludedAccounts,
              }))
            }
          />
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
