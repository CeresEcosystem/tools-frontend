/* eslint-disable no-unused-vars */
import VerticalSeparator from '@components/separator/vertical_separator';
import { ASSET_URL } from '@constants/index';
import Image from 'next/image';
import Lock from '@public/lock.svg';
import Clipboard from '@components/clipboard';
import { Token } from '@interfaces/index';
import Link from 'next/link';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function TokensList({
  tokens,
  showModal,
  showSupplyModal,
}: {
  tokens: Token[];
  showModal: (show: boolean, token: Token) => void;
  showSupplyModal: (show: boolean, token: Token) => void;
}) {
  return (
    <ul role="list" className="space-y-2 mt-8">
      {tokens.map((token) => (
        <li
          key={`${token.assetId}+${token.fullName}`}
          className="flex-col bg-backgroundItem p-3 rounded-xl flex md:flex-row"
        >
          <div className="flex-col items-start w-full flex gap-x-2 justify-between xs:flex-row xs:items-center">
            <div className="flex flex-1">
              <div className="mr-4 flex-shrink-0 self-center">
                <Link
                  href={{ pathname: '/charts', query: { token: token.token } }}
                >
                  <img
                    className="rounded-full w-12 h-12"
                    src={`${ASSET_URL}/${token.token}.svg`}
                    alt={token.fullName}
                  />
                </Link>
              </div>
              <div className="w-full">
                <Link
                  href={{ pathname: '/charts', query: { token: token.token } }}
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
                <span className="text-lg text-pink font-bold xs:hidden">
                  {token.priceFormatted}
                </span>
              </div>
            </div>
            <div className="hidden flex-shrink-0 justify-end items-center xs:flex">
              <span className="text-lg text-pink font-bold sm:text-xl">
                {token.priceFormatted}
              </span>
              <div className="hidden md:flex">
                <VerticalSeparator />
                <div className="flex flex-col space-y-2">
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
                    <Image className="h-5 w-auto shrink-0" src={Lock} alt="" />
                    View locks
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <hr className="w-full my-4 border border-white border-opacity-5" />
            <div className="flex space-x-2">
              <button
                onClick={() => showSupplyModal(true, token)}
                className="w-full rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center justify-center text-white text-sm gap-x-1 hover:bg-opacity-20"
              >
                <ChartBarIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                />
                View supply
              </button>
              <button
                onClick={() => showModal(true, token)}
                className="w-full rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center justify-center text-white text-sm gap-x-1 hover:bg-opacity-20"
              >
                <Image className="h-5 w-auto shrink-0" src={Lock} alt="" />
                View locks
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
