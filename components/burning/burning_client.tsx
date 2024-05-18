import dynamic from 'next/dynamic';

const BurningClient = dynamic(() => import('./index'), {
  ssr: false,
});

export default BurningClient;
