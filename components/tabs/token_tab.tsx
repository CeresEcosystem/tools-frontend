import classNames from 'classnames';

const tokens = ['PSWAP', 'VAL', 'XOR'];

export default function TokenTab({
  selectedToken,
  changeToken,
}: {
  selectedToken: string;
  // eslint-disable-next-line no-unused-vars
  changeToken: (token: string) => void;
}) {
  return (
    <div className="max-w-sm mb-10 px-5 py-2 mx-auto w-full bg-backgroundItem flex rounded-xl">
      {tokens.map((token) => {
        const selected = token === selectedToken;

        return (
          <div
            key={token}
            onClick={() => changeToken(token)}
            className={classNames(
              'flex-1 flex justify-center items-center rounded-xl py-2 cursor-pointer group',
              selected && 'bg-white bg-opacity-10'
            )}
          >
            <span
              className={classNames(
                'text-base text-white capitalize font-medium',
                selected ? 'text-opacity-100' : 'text-opacity-50',
                'group-hover:text-opacity-100'
              )}
            >
              {token}
            </span>
          </div>
        );
      })}
    </div>
  );
}
