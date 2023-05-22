import usePSWAPFarming from '@hooks/use_pswap_farming';

const textStyle = 'text-base text-white text-center max-w-2xl block sm:text-xl';
const rewardStyle = 'font-bold text-pink';

export default function PSWAPFarming() {
  const { reward } = usePSWAPFarming();

  if (reward) {
    return (
      <div className="bg-backgroundItem bg-opacity-20 backdrop-blur-lg px-4 py-8 rounded-xl flex flex-col items-center sm:py-12">
        <span className={textStyle}>
          Every 1 XOR in PSWAP/VAL/ETH/DAI/XST pool yields about{' '}
          <span className={rewardStyle}>{reward.rewardsDouble}</span> PSWAP per
          day or about{' '}
          <span className={rewardStyle}>{`${reward.aprDouble}% `}</span>
          APR
        </span>
        <br />
        <span className={textStyle}>
          Every 1 XOR in other pool yields about{' '}
          <span className={rewardStyle}>{reward.rewards}</span> PSWAP per day or
          about <span className={rewardStyle}>{`${reward.apr}% `}</span> APR
        </span>
      </div>
    );
  }

  return null;
}
