import classNames from 'classnames';
import Image from 'next/image';
import CeresHorizontalWhite from '@public/ceres-horisontal-white.svg';
import Polkaswap from '@public/polkaswap_logo.png';
import Link from 'next/link';
import {
  docs,
  navigation,
  socials,
  websites,
} from '@layouts/sidebar/sidebar.helper';
import { useRouter } from 'next/router';

export default function SideBar({
  setSidebarOpen,
}: {
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen?: (value: boolean) => void;
}) {
  const router = useRouter();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-backgroundSidebar px-6 pb-4">
      <div className="flex h-24 shrink-0 items-center">
        <Link
          href="/"
          onClick={() => {
            if (setSidebarOpen) {
              setSidebarOpen(false);
            }
          }}
        >
          <Image
            className="h-14 w-auto"
            src={CeresHorizontalWhite}
            alt=""
            priority
          />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const active = router.pathname === item.href;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (setSidebarOpen) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        active
                          ? 'bg-backgroundHeader opacity-100'
                          : 'opacity-70 hover:bg-backgroundHeader hover:opacity-100',
                        'text-white block text-base rounded-md p-2 font-medium'
                      )}
                    >
                      <i
                        className={`flaticon-${item.icon} float-left text-2xl w-10`}
                      ></i>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li>
            <div className="text-sm font-semibold text-pink">Our websites</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {websites.map((website) => (
                <li key={website.name}>
                  <Link
                    href={website.href}
                    target="_blank"
                    className={
                      'text-white opacity-70 hover:opacity-100 hover:bg-backgroundHeader flex gap-x-4 rounded-md p-2 font-medium'
                    }
                  >
                    <Image
                      className="h-6 w-6 shrink-0"
                      src={website.icon}
                      alt=""
                    />
                    {website.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto mb-6 flex flex-col gap-y-4 items-center">
            <div className="w-2/3">
              <Link href="https://polkaswap.io/#/swap" target="_blank">
                <Image src={Polkaswap} alt="" />
              </Link>
            </div>
            <hr className="w-full border border-white border-opacity-10" />
            <div className="flex gap-x-3">
              {socials.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  className="h-9 w-9 rounded-md bg-white bg-opacity-10 flex items-end justify-center"
                >
                  <i
                    className={`flaticon-${social.icon} text-xl text-white text-center`}
                  ></i>
                </Link>
              ))}
            </div>
            <div className="flex gap-x-3">
              {docs.map((doc) => (
                <Link key={doc.href} href={doc.href} target="_blank">
                  <Image src={doc.icon} alt="" className="h-9 w-9" />
                </Link>
              ))}
            </div>
            <span className="text-sm text-white text-opacity-50 font-medium">
              Powered by{' '}
              <Link href="https://cerestoken.io" target="_blank">
                CBS LLC
              </Link>
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
