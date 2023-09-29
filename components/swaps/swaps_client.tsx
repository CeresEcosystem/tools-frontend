import dynamic from 'next/dynamic';

const SwapsClient = dynamic(() => import('./index'), {
  ssr: false,
});

export default SwapsClient;
