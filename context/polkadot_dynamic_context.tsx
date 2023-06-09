import dynamic from 'next/dynamic';

const PolkadotClientContext = dynamic(() => import('./polkadot_context'), {
  ssr: false,
});

export default PolkadotClientContext;
