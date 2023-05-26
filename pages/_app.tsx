import '@styles/globals.css';
import BaseLayout from '@layouts/base_layout';
import type { AppProps } from 'next/app';
import { Sora } from 'next/font/google';
import AppProvider from '@context/app_context';
import { NextIntlProvider } from 'next-intl';
import { GoogleAnalytics } from 'nextjs-google-analytics';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${sora.style.fontFamily};
        }
        .Toastify__toast {
          font-family: ${sora.style.fontFamily};
        }
      `}</style>
      <GoogleAnalytics
        gaMeasurementId="G-D8EK0MZG5F"
        trackPageViews
        debugMode={false}
      />
      <NextIntlProvider locale="en">
        <AppProvider>
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </AppProvider>
      </NextIntlProvider>
    </>
  );
}
