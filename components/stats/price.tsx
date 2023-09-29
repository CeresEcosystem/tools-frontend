import PricesModal from '@components/modal/prices_modal';
import { ASSET_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import Link from 'next/link';
import { useState } from 'react';
import { BsArrowsFullscreen, BsArrowLeftRight } from 'react-icons/bs';

export default function Price({
  token,
  prices,
  changeCurrentTokenFromModal,
  scrollToSwaps,
}: {
  token: Token;
  prices: Token[];
  // eslint-disable-next-line no-unused-vars
  changeCurrentTokenFromModal: (token: Token) => void;
  scrollToSwaps: () => void;
}) {
  const [showPriceModal, setShowPriceModal] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="bg-backgroundItem space-x-10 flex rounded-xl items-center mt-16 py-4 px-8">
          <div className="flex items-center">
            <img
              className="rounded-full w-12 h-12 mr-4"
              src={`${ASSET_URL}/${token.token}.svg`}
              alt={token.fullName}
            />
            <div className="flex flex-col">
              <h4 className="text-base font-bold text-white sm:text-lg">
                {token.fullName}
              </h4>
              <span
                onClick={() => setShowPriceModal(true)}
                className="text-xs text-white cursor-pointer font-bold text-opacity-50 hover:text-opacity-100 hover:text-pink"
              >
                Show all tokens
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => scrollToSwaps()}
              title="Scroll to swaps"
              className="rounded-md bg-white bg-opacity-10 p-2 hover:bg-opacity-20"
            >
              <BsArrowLeftRight size={20} color="#ffffff" />
            </button>
            <Link
              href={{ pathname: '/trading', query: { token: token.token } }}
              target="tv_chart"
              className="rounded-md bg-white bg-opacity-10 p-2 hover:bg-opacity-20"
            >
              <BsArrowsFullscreen size={20} color="#ffffff" />
            </Link>
          </div>
        </div>
      </div>
      <PricesModal
        showModal={showPriceModal}
        closeModal={() => setShowPriceModal(false)}
        tokens={prices}
        changeCurrentTokenFromModal={(token: Token) => {
          changeCurrentTokenFromModal(token);
          setShowPriceModal(false);
        }}
      />
    </>
  );
}
