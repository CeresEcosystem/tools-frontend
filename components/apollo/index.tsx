import Spinner from '@components/spinner';
import useApolloDashboard from '@hooks/use_apollo_dashboard';
import { WalletAddress } from '@interfaces/index';
import ApolloStats from './stats';
import ApolloLending from './lending';
import ApolloBorrowing from './borrowing';

export default function ApolloDashboard({
  selectedWallet,
}: {
  selectedWallet: WalletAddress;
}) {
  const { loading, data } = useApolloDashboard(selectedWallet);

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <>
      {data.userData && <ApolloStats userData={data.userData} />}
      <ApolloLending lendingInfo={data.lendingInfo} />
      <ApolloBorrowing borrowingInfo={data.borrowingInfo} />
    </>
  );
}
