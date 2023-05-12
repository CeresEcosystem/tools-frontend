import VerticalSeparator from '@components/separator/vertical_separator';
import { ASSET_URL } from '@constants/index';
import { Token } from '@hooks/use_tokens';
import Image from 'next/image';
import Lock from '@public/lock.svg';
import Clipboard from '@components/clipboard';

export default function TokensList({
  tokens,
  showModal,
}: {
  tokens: Token[];
  // eslint-disable-next-line no-unused-vars
  showModal: (show: boolean, token: Token) => void;
}) {
  return (
    <ul role="list" className="space-y-2 mt-8">
      {tokens.map((token) => (
        <li
          key={`${token.assetId}+${token.fullName}`}
          className="flex-col bg-backgroundItem bg-opacity-20 backdrop-blur-lg p-3 rounded-xl flex md:flex-row"
        >
          <div className="flex-col items-start w-full flex gap-x-2 justify-between xs:flex-row xs:items-center">
            <div className="flex flex-1">
              <div className="mr-4 flex-shrink-0 self-center">
                <img
                  className="rounded-full w-12 h-12"
                  src={`${ASSET_URL}/${token.token}.svg`}
                  alt={token.fullName}
                />
              </div>
              <div className="w-full">
                <h4 className="text-base font-bold text-white line-clamp-1 sm:text-lg">
                  {token.fullName}
                </h4>
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
                <button
                  onClick={() => showModal(true, token)}
                  className="rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center text-white text-sm gap-x-1 hover:bg-opacity-20"
                >
                  <Image className="h-5 w-auto shrink-0" src={Lock} alt="" />
                  View locks
                </button>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <hr className="w-full my-4 border border-white border-opacity-5" />
            <button
              onClick={() => showModal(true, token)}
              className="w-full max-w-md mx-auto rounded-md bg-white bg-opacity-10 px-3 py-1.5 flex items-center justify-center text-white text-sm gap-x-1 hover:bg-opacity-20"
            >
              <Image className="h-5 w-auto shrink-0" src={Lock} alt="" />
              View locks
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
