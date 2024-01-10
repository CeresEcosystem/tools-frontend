import PricesModal from '@components/modal/prices_modal';
import { ASSET_URL, FAVORITE_TOKENS } from '@constants/index';
import { Token } from '@interfaces/index';
import Link from 'next/link';
import { useState } from 'react';
import { BsArrowsFullscreen, BsArrowLeftRight } from 'react-icons/bs';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function Price({
  token,
  prices,
  changeCurrentTokenFromModal,
  scrollToSwaps,
}: {
  token: Token | string;
  prices: Token[];
  // eslint-disable-next-line no-unused-vars
  changeCurrentTokenFromModal: (token: Token | string) => void;
  scrollToSwaps: () => void;
}) {
  const [showPriceModal, setShowPriceModal] = useState(false);

  const favoriteOrAllTokens = () => {
    if (token === FAVORITE_TOKENS) {
      return (
        <div className="rounded-full p-2 flex items-center justify-center w-12 h-12 mr-4 bg-pink">
          <HeartIcon className="w-8 h-8 text-white" />
        </div>
      );
    }

    return (
      <div className="rounded-full p-2 flex items-center justify-center w-12 h-12 mr-4 bg-white bg-opacity-20">
        <i className="flaticon-token text-yellow text-2xl mt-2 w-4.5"></i>
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="bg-backgroundItem space-x-10 flex rounded-xl items-center mt-16 py-4 px-8">
          <div className="flex items-center">
            {typeof token === 'string' ? (
              favoriteOrAllTokens()
            ) : (
              <img
                className="rounded-full w-12 h-12 mr-4"
                src={`${ASSET_URL}/${token.token}.svg`}
                alt={token.fullName}
              />
            )}
            <div className="flex flex-col">
              <h4 className="text-base font-bold text-white sm:text-lg">
                {typeof token === 'string'
                  ? token === FAVORITE_TOKENS
                    ? 'Favorite tokens'
                    : 'All tokens'
                  : token.fullName}
              </h4>
              <span
                onClick={() => setShowPriceModal(true)}
                className="text-xs text-white cursor-pointer font-bold text-opacity-50 hover:text-opacity-100 hover:text-pink"
              >
                Show menu
              </span>
            </div>
          </div>
          {typeof token !== 'string' && (
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
          )}
        </div>
      </div>
      <PricesModal
        showModal={showPriceModal}
        closeModal={() => setShowPriceModal(false)}
        tokens={prices}
        changeCurrentTokenFromModal={(token: Token | string) => {
          changeCurrentTokenFromModal(token);
          setShowPriceModal(false);
        }}
        showFavoriteTokensOption
        showAllTokensOption
      />
    </>
  );
}
