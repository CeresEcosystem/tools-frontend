import PortfolioChart from '@components/charts/portfolio_chart';
import { useRouter } from 'next/router';

export default function PortfolioChartPage() {
  const { query } = useRouter();

  if (!query?.address) {
    return null;
  }

  return <PortfolioChart walletAddress={(query.address as string) ?? ''} />;
}
