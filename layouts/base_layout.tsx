import Head from 'next/head';
import { useState } from 'react';
import SideBarTransition from './sidebar/sidebar_transition';
import SideBarDesktop from '@layouts/sidebar/sidebar_desktop';
import Header from '@layouts/header';
import { useRouter } from 'next/router';

function SideBarLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pathname } = useRouter();

  if (pathname.includes('trading')) {
    return <div className="backgroundContent">{children}</div>;
  }

  return (
    <>
      <SideBarTransition
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <SideBarDesktop />
      <div className="lg:pl-72">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="backgroundContent">{children}</div>
      </div>
    </>
  );
}

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Ceres Tools</title>
        <meta
          name="description"
          content="Track prices of tokens on Polkaswap decentralized exchange"
        />
        <meta
          name="keywords"
          content="track prices, tokens, polkaswap, decentralized exchange, cerestoken, cerestoken.io, tools.cerestoken.io"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicon/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/favicon/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/favicon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/favicon/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/favicon/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/favicon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#2d093e" />

        <meta
          property="og:image"
          content="https://tools.cerestoken.io/thumbnail.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="960" />
        <meta property="og:url" content="https://tools.cerestoken.io" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ceres Tools" />
        <meta
          property="og:description"
          content="Track prices of tokens on Polkaswap decentralized exchange"
        />
        <meta property="og:site_name" content="tools.cerestoken.io" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Track prices of tokens on Polkaswap decentralized exchange"
        />
        <meta name="twitter:title" content="tools.cerestoken.io" />
        <meta
          name="twitter:image"
          content="https://tools.cerestoken.io/thumbnail.png"
        />
      </Head>
      <SideBarLayout>{children}</SideBarLayout>
    </>
  );
}
