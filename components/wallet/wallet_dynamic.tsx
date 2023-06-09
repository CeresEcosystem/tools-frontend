import dynamic from 'next/dynamic';

const WalletClient = dynamic(() => import('./'), {
  ssr: false,
});

export default WalletClient;
