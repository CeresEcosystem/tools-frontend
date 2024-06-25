/* eslint-disable no-unused-vars */
import VerticalSeparator from '@components/separator/vertical_separator';
import { ASSET_URL } from '@constants/index';
import Image from 'next/image';
import Lock from '@public/lock.svg';
import Clipboard from '@components/clipboard';
import { Token } from '@interfaces/index';
import Link from 'next/link';
import {
  ChartBarIcon,
  StarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarFavorite } from '@heroicons/react/24/solid';
import { formatToCurrency } from '@utils/helpers';
import { useFormatter } from 'next-intl';

export default function TokensList({
  tokens,
  showModal,
  showSupplyModal,
  showHoldersModal,
  addTokenToFavorites,
  removeTokenFromFavorites,
  favoriteTokens,
  showOnlyFavorites,
  priceFilter,
}: {
  tokens: Token[];
  showModal: (show: boolean, token: Token) => void;
  showSupplyModal: (show: boolean, token: Token) => void;
  showHoldersModal: (show: boolean, token: Token) => void;
  addTokenToFavorites: (token: Token) => void;
  removeTokenFromFavorites: (token: Token) => void;
  favoriteTokens: string[];
  showOnlyFavorites: boolean;
  priceFilter: string;
}) {
  const format = useFormatter();

  return (
    <ul role="list" className="space-y-2 mt-8">
      {tokens.map((token) => {
        const isFavorite = favoriteTokens.includes(token.assetId);

        if (showOnlyFavorites && !isFavorite) return null;

        return (
          <li
            key={`${token.assetId}+${token.fullName}`}
            className="flex-col bg-backgroundItem p-3 rounded-xl flex md:flex-row"
          >
            <div className="flex-col items-start w-full flex gap-x-2 justify-between xs:flex-row xs:items-center">
              <div className="flex justify-between w-full items-center">
                <div className="flex flex-1 items-center">
                  <div className="mr-4 flex-shrink-0 self-center">
                    <Link
                      href={{
                        pathname: '/charts',
                        query: { token: token.token },
                      }}
                    >
                      <img
                        className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
                        src={`${ASSET_URL}/${token.token}.svg`}
                        alt={token.fullName}
                      />
                    </Link>
                  </div>
                  <div className="w-full">
                    <Link
                      href={{
                        pathname: '/charts',
                        query: { token: token.token },
                      }}
                    >
                      <h4 className="text-base font-bold text-white line-clamp-1 sm:text-lg">
                        {token.fullName}
                      </h4>
                    </Link>
                    <Clipboard
                      textToCopy={token.assetId}
                      text={token.assetIdFormatted}
                    >
                      <span className="text-sm pb-1 block text-white text-opacity-50">
                        {'AssetID: '}
                        <span className="cursor-pointer hover:text-white hover:underline">
                          {token.assetIdFormatted}
                        </span>
                      </span>
                    </Clipboard>
                    <span className="text-sm pt-2 block text-white text-opacity-50">
                      {'Market Cap: '}
                      <span className="text-white">
                        {formatToCurrency(format, token.marketCap)}
                      </span>
                    </span>
                    <span className="text-lg text-pink font-bold xs:hidden">
                      {priceFilter === '$'
                        ? token.priceFormatted
                        : token.priceInXor}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 justify-end items-center xs:hidden">
                  {isFavorite ? (
                    <StarFavorite
                      className="h-6 w-6 cursor-pointer ml-3 mr-1 text-yellow"
                      onClick={() => removeTokenFromFavorites(token)}
                    />
                  ) : (
                    <StarIcon
                      className="h-6 w-6 cursor-pointer ml-3 mr-1 text-yellow"
                      onClick={() => addTokenToFavorites(token)}
                    />
                  )}
                </div>
              </div>
              <div className="hidden flex-shrink-0 justify-end items-center xs:flex">
                <span className="text-lg text-pink font-bold sm:text-xl">
                  {priceFilter === '$'
                    ? token.priceFormatted
                    : token.priceInXor}
                </span>
                {isFavorite ? (
                  <StarFavorite
                    className="h-6 w-6 cursor-pointer ml-3 mr-1 text-yellow"
                    onClick={() => removeTokenFromFavorites(token)}
                  />
                ) : (
                  <StarIcon
                    className="h-6 w-6 cursor-pointer ml-3 mr-1 text-yellow"
                    onClick={() => addTokenToFavorites(token)}
                  />
                )}
                <div className="hidden md:flex">
                  <VerticalSeparator />
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => showHoldersModal(true, token)}
                      className="rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center text-white text-sm gap-x-1 hover:bg-opacity-20"
                    >
                      <UserGroupIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-white"
                      />
                      View holders
                    </button>
                    <button
                      onClick={() => showSupplyModal(true, token)}
                      className="rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center text-white text-sm gap-x-1 hover:bg-opacity-20"
                    >
                      <ChartBarIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-white"
                      />
                      View supply
                    </button>
                    <button
                      onClick={() => showModal(true, token)}
                      className="rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center text-white text-sm gap-x-1.5 hover:bg-opacity-20"
                    >
                      <Image
                        className="h-5 w-auto shrink-0"
                        src={Lock}
                        alt=""
                      />
                      View locks
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <hr className="w-full my-4 border border-white border-opacity-5" />
              <div className="flex space-x-1">
                <button
                  onClick={() => showHoldersModal(true, token)}
                  className="w-full rounded-md bg-white bg-opacity-10 px-2 py-1.5 flex items-center justify-center text-white text-xs gap-x-1 hover:bg-opacity-20"
                >
                  <UserGroupIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-white"
                  />
                  Holders
                </button>
                <button
                  onClick={() => showSupplyModal(true, token)}
                  className="w-full rounded-md bg-white bg-opacity-10 px-2 py-1.5 flex items-center justify-center text-white text-xs gap-x-1 hover:bg-opacity-20"
                >
                  <ChartBarIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-white"
                  />
                  Supply
                </button>
                <button
                  onClick={() => showModal(true, token)}
                  className="w-full rounded-md bg-white bg-opacity-10 px-2 py-1.5 flex items-center justify-center text-white text-xs gap-x-1 hover:bg-opacity-20"
                >
                  <Image className="h-5 w-auto shrink-0" src={Lock} alt="" />
                  Locks
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
