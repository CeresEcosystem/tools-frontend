/* eslint-disable @next/next/no-img-element */
import Clipboard from '@components/clipboard';
import Spinner from '@components/spinner';
import { POLKADOT_EXTENSION } from '@constants/index';
import { usePolkadot } from '@context/polkadot_context';
import { Popover, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import {
  firstName,
  formatWalletAddress,
  getAvatarTitle,
  getEncodedAddress,
} from '@utils/helpers';
import Link from 'next/link';
import { Fragment } from 'react';

function PolkadotMenu() {
  const polkadot = usePolkadot();

  if (polkadot?.loading) {
    return (
      <div className="overflow-hidden shadow-lg rounded-lg">
        <div className="relative grid divide-y-2 divide-grayDivider divide-opacity-10 bg-grayLight px-5">
          <Spinner />
        </div>
      </div>
    );
  }

  if (polkadot?.accounts?.length && polkadot?.accounts?.length > 0) {
    if (polkadot?.selectedAccount) {
      const address = getEncodedAddress(polkadot?.selectedAccount?.address);

      return (
        <div className="overflow-hidden shadow-lg rounded-xl bg-backgroundHeader pt-5">
          <div className="px-5 flex flex-col">
            <div className="inline-flex items-center">
              <UserCircleIcon
                className={'h-8 w-auto mr-2'}
                aria-hidden="true"
                color="#f0398c"
              />
              <h1 className="text-white font-bold text-base w-full truncate">
                {polkadot?.selectedAccount?.meta?.name}
              </h1>
            </div>
            <span className="text-white font-semibold text-base mt-4">
              Your address
            </span>
            <div className="flex items-center">
              <Clipboard text={address}>
                <span className="text-white cursor-pointer font-medium text-sm text-opacity-50 hover:underline hover:text-opacity-100">
                  {formatWalletAddress(address, 10)}
                </span>
              </Clipboard>
            </div>
          </div>
          <div className="flex justify-center mt-10 mb-5">
            <button
              className="py-2 px-5 rounded-md bg-white bg-opacity-10 text-white font-bold text-base"
              onClick={() => polkadot?.disconnect()}
            >
              Disconnect
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="shadow-lg rounded-xl bg-backgroundHeader max-h-96 overflow-x-hidden overflow-y-auto">
        <div className="grid divide-y-2 divide-white divide-opacity-10 px-5">
          {polkadot.accounts?.map((account) => {
            return (
              <div
                key={account?.address}
                className="cursor-pointer flex items-center py-4 overflow-hidden group"
                onClick={() => polkadot?.saveSelectedAccount(account)}
              >
                <div className="h-10 w-10 flex justify-center items-center bg-white bg-opacity-10 rounded-full group-hover:bg-pink group-hover:bg-opacity-100">
                  <span className="font-semibold text-lg text-white">
                    {getAvatarTitle(account?.meta?.name)}
                  </span>
                </div>
                <div className="px-3 flex-1 overflow-hidden">
                  <p className={'text-base truncate font-bold text-white'}>
                    {account?.meta?.name}
                  </p>
                  <p className="text-xs text-white text-opacity-50 font-medium truncate">
                    {formatWalletAddress(account?.address)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-xl bg-backgroundHeader p-5">
      <p className="text-sm text-white font-medium">
        Please add wallet using Polkadot JS extension. If you don&apos;t have
        Polkadot JS extension installed, please click on this
        <Link href={POLKADOT_EXTENSION} className="text-pink" target={'_blank'}>
          {' '}
          Link
        </Link>
        .
      </p>
    </div>
  );
}

export default function Wallet() {
  const polkadot = usePolkadot();

  return (
    <Popover className="relative">
      <div className="flex cursor-pointer h-[84px] py-4 ml-2 md:ml-5 lg:ml-10">
        <div className="bg-backgroundSidebar bg-opacity-60 h-full flex items-center justify-center rounded-xl md:w-48">
          {polkadot?.selectedAccount ? (
            <Popover.Button className="flex px-4 h-full items-center focus:outline-none">
              <img src={'/sora.svg'} alt="" className="w-8 h-auto" />
              <span className="hidden text-white font-bold px-3 text-ellipsis truncate xs:block">
                {firstName(
                  (polkadot?.selectedAccount as InjectedAccountWithMeta)?.meta
                    ?.name
                )}
              </span>
            </Popover.Button>
          ) : (
            <Popover.Button className="px-4 h-full focus:outline-none">
              <div className="flex items-center">
                <span className="hidden text-white font-bold text-lg md:block">
                  Connect wallet
                </span>
                <img
                  src={'/wallet.svg'}
                  alt=""
                  className="h-auto w-8 md:hidden"
                />
              </div>
            </Popover.Button>
          )}
        </div>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute shadow-xl -right-1 z-10 w-72 max-w-xs transform">
          <div className="h-4" />
          <PolkadotMenu />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
