import dynamic from 'next/dynamic';

const PortfolioTableClient = dynamic(() => import('./portfolio_table'), {
  ssr: false,
});

export default PortfolioTableClient;
