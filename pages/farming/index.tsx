import { NEW_API_URL } from '@constants/index';
import Container from '@components/container';

interface Reward {
  apr: string;
  rewards: number;
  aprDouble: string;
  rewardsDouble: string;
}

const textStyle = 'text-base text-white text-center max-w-2xl block sm:text-xl';
const rewardStyle = 'font-bold text-pink';

export default function Farming({ reward }: { reward?: Reward }) {
  return (
    <Container>
      <div className="bg-backgroundHeader bg-opacity-20 px-4 py-8 rounded-xl flex flex-col items-center sm:py-12">
        <span className={textStyle}>
          Every 1 XOR in PSWAP/VAL/ETH/DAI/XST pool yields about{' '}
          <span className={rewardStyle}>{reward?.rewardsDouble}</span> PSWAP per
          day or about{' '}
          <span className={rewardStyle}>{`${reward?.aprDouble}% `}</span>
          APR
        </span>
        <br />
        <span className={textStyle}>
          Every 1 XOR in other pool yields about{' '}
          <span className={rewardStyle}>{reward?.rewards}</span> PSWAP per day
          or about <span className={rewardStyle}>{`${reward?.apr}% `}</span> APR
        </span>
      </div>
    </Container>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${NEW_API_URL}/rewards`);
  let data;

  if (res.ok) {
    data = (await res.json()) as Reward;
  }

  return { props: { reward: data } };
}
