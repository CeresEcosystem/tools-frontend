import dynamic from 'next/dynamic';

const PairsLiquidityProvidersModalClient = dynamic(
  () => import('./pairs_liquidity_providers_modal'),
  {
    ssr: false,
  }
);

export default PairsLiquidityProvidersModalClient;
