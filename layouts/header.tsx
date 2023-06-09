import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAppContext } from '@context/app_context';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import FadeInImage from '@components/image/fade_in_image';
import WalletClient from '@components/wallet/wallet_dynamic';

export default function Header({
  setSidebarOpen,
}: {
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (value: boolean) => void;
}) {
  const appContext = useAppContext();

  return (
    <>
      <div className="top-0 z-40 h-[84px] bg-backgroundHeader">
        <div className="flex pr-5 lg:pr-10">
          {appContext?.banners && appContext.banners.length > 0 && (
            <div className="w-full h-full overflow-hidden">
              <Carousel
                autoPlay
                interval={5000}
                infiniteLoop
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                showArrows={false}
                emulateTouch={false}
              >
                {appContext?.banners?.map((banner, index) => (
                  <Link
                    key={index.toString()}
                    href={banner.link}
                    target="_blank"
                  >
                    <div className="h-[84px] relative">
                      <FadeInImage
                        src={banner.sm}
                        alt={banner.title}
                        className="mx-auto h-[84px] md:!hidden"
                      />
                      <FadeInImage
                        src={banner.md}
                        alt={banner.title}
                        className="!hidden mx-auto h-[84px] md:!inline-block lg:!hidden"
                      />
                      <FadeInImage
                        src={banner.lg}
                        alt={banner.title}
                        className="!hidden mx-auto h-[84px] lg:!inline-block xl:object-contain"
                      />
                    </div>
                  </Link>
                ))}
              </Carousel>
            </div>
          )}
          <div className="h-[84px]">
            <WalletClient />
          </div>
        </div>
      </div>
      <div className="flex justify-between max-w-4xl mx-auto pt-8 px-4 md:px-8 lg:hidden">
        <Link
          href="/"
          onClick={() => {
            if (setSidebarOpen) {
              setSidebarOpen(false);
            }
          }}
        >
          <img
            className="h-14 w-auto"
            src={'/ceres-horisontal-white.svg'}
            alt="Ceres"
          />
        </Link>
        <button
          type="button"
          className="-m-2.5 p-2.5 text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
