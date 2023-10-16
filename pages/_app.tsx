import '@styles/globals.css';
import BaseLayout from '@layouts/base_layout';
import type { AppProps } from 'next/app';
import { Sora } from 'next/font/google';
import AppProvider from '@context/app_context';
import { NextIntlProvider } from 'next-intl';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import PolkadotClientContext from '@context/polkadot_dynamic_context';
import { Provider } from 'react-redux';
import { store, persistor } from '@store/index';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

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
        <PolkadotClientContext>
          <AppProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <BaseLayout>
                  <Component {...pageProps} />
                </BaseLayout>
                <ToastContainer
                  limit={3}
                  pauseOnFocusLoss={false}
                  pauseOnHover={false}
                  theme="dark"
                  draggable={false}
                  transition={Zoom}
                />
              </PersistGate>
            </Provider>
          </AppProvider>
        </PolkadotClientContext>
      </NextIntlProvider>
    </>
  );
}
