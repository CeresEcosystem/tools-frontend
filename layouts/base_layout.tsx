import Head from 'next/head';
import { useState } from 'react';
import SideBarTransition from './sidebar/sidebar_transition';
import SideBarDesktop from '@layouts/sidebar/sidebar_desktop';
import Header from '@layouts/header';

function SideBarLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SideBarTransition
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <SideBarDesktop />
      <Header setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-72">{children}</div>
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
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="" />
        <meta name="robots" content="index,follow" />
      </Head>
      <SideBarLayout>{children}</SideBarLayout>
    </>
  );
}
