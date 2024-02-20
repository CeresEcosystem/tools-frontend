import dynamic from 'next/dynamic';

const KensetsuClient = dynamic(() => import('./index'), {
  ssr: false,
});

export default KensetsuClient;
