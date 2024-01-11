import PricesModal from '@components/modal/prices_modal';
import { ASSET_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import useTokenPriceConverter from '@hooks/use_token_price_converter';
import { formatCurrencyWithDecimals } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { NumericFormat, OnValueChange } from 'react-number-format';

function TokenSelect({
  id,
  tokens,
  value,
  handleChange,
  token,
  filterOutToken,
  setToken,
}: {
  id: string;
  tokens: Token[];
  value: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: OnValueChange;
  token: Token | undefined;
  filterOutToken: Token | undefined;
  // eslint-disable-next-line no-unused-vars
  setToken: (t: Token) => void;
}) {
  const [showPriceModal, setShowPriceModal] = useState(false);

  return (
    <>
      <div className="bg-backgroundSidebar flex-col p-2 w-full rounded-xl flex gap-x-1 gap-y-2 xs:flex-row">
        <div className="flex w-full xs:min-w-[150px] xs:w-auto">
          <div
            onClick={() => setShowPriceModal(true)}
            className="flex py-1 h-full bg-white bg-opacity-10 rounded-xl cursor-pointer gap-x-2 items-center px-2"
          >
            {token ? (
              <>
                <img
                  className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
                  src={`${ASSET_URL}/${token.token}.svg`}
                  alt={token.token}
                />
                <span className="flex gap-x-1 items-center text-white text-sm font-semibold">
                  {token.token}
                  <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </>
            ) : (
              <span className="flex gap-x-1 items-center text-white text-sm font-semibold">
                Choose token
                <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <NumericFormat
            id={id}
            name={id}
            disabled={!token}
            allowNegative={false}
            allowLeadingZeros={false}
            thousandSeparator=","
            value={value}
            placeholder="0.0"
            onValueChange={handleChange}
            className="block bg-backgroundItem w-full rounded-xl border-0 py-2 px-6 text-white placeholder:text-white placeholder:text-opacity-50 focus:ring-2 focus:ring-inset focus:ring-pink focus:outline-none"
          />
        </div>
      </div>
      <PricesModal
        showModal={showPriceModal}
        closeModal={() => setShowPriceModal(false)}
        tokens={tokens}
        filterOutToken={filterOutToken}
        changeCurrentTokenFromModal={(token: Token | string) => {
          setToken(token as Token);
          setShowPriceModal(false);
        }}
      />
    </>
  );
}

export default function PriceConverter({
  tokens,
  closePriceConverter,
}: {
  tokens: Token[];
  closePriceConverter: () => void;
}) {
  const {
    formData,
    handleFormDataChange,
    firstToken,
    changeFirstToken,
    secondToken,
    changeSecondToken,
    result,
  } = useTokenPriceConverter();

  const format = useFormatter();

  return (
    <div className="bg-backgroundItem max-w-md mx-auto rounded-xl p-6 flex flex-col gap-y-6">
      <h2 className="text-white font-semibold lg:text-lg">
        Convert token prices
      </h2>
      <div className="flex flex-col gap-y-4">
        <TokenSelect
          id="firstValue"
          tokens={tokens}
          value={formData.firstValue}
          handleChange={handleFormDataChange}
          token={firstToken}
          filterOutToken={secondToken}
          setToken={changeFirstToken}
        />
        <TokenSelect
          id="secondValue"
          tokens={tokens}
          value={formData.secondValue}
          handleChange={handleFormDataChange}
          token={secondToken}
          filterOutToken={firstToken}
          setToken={changeSecondToken}
        />
        <span className="text-pink w-full truncate font-bold text-xl mt-2">
          {formatCurrencyWithDecimals(format, result, 3, false, 'USD')}
        </span>
      </div>
      <button
        onClick={closePriceConverter}
        className="w-full mx-auto rounded-xl bg-pink px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-0"
      >
        Return to token list
      </button>
    </div>
  );
}
