import dynamic from 'next/dynamic';

const TokenHolderModalClient = dynamic(() => import('./token_holders_modal'), {
  ssr: false,
});

export default TokenHolderModalClient;
