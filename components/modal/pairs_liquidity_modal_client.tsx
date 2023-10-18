import dynamic from 'next/dynamic';

const PairsLiquidityModalClient = dynamic(
  () => import('./pairs_liquidity_modal'),
  {
    ssr: false,
  }
);

export default PairsLiquidityModalClient;
