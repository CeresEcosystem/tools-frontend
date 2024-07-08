import FallbackImage from '@components/image/fallback_image';
import Modal from '@components/modal';
import SupplyChart from '@components/tracker/supply_chart';
import { ASSET_URL } from '@constants/index';
import { Supply, Token } from '@interfaces/index';
import { formatNumber } from '@utils/helpers';
import { useFormatter } from 'next-intl';

export default function TokenSupplyModal({
  showModal,
  closeModal,
  token,
  supply,
}: {
  showModal: boolean;
  closeModal: () => void;
  token: Token | null;
  supply: Supply[];
}) {
  const format = useFormatter();

  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <div className="flex items-center">
        <FallbackImage
          className="rounded-full w-12 h-12"
          src={`${ASSET_URL}/${token?.token}.svg`}
          fallback={`${ASSET_URL}/${token?.token}.png`}
          alt={token?.token ?? ''}
        />
        <h4 className="pl-4 text-base font-bold text-white line-clamp-1 sm:text-lg">
          {token?.token}
        </h4>
      </div>
      <h4 className="mt-4 text-center text-sm font-bold text-white line-clamp-1 sm:text-base">
        {`Current supply: ${formatNumber(
          format,
          supply[supply.length - 1]?.y,
          2
        )}`}
      </h4>
      {token && (
        <SupplyChart
          supply={supply}
          selectedToken={token?.token}
          showTitle={false}
        />
      )}
    </Modal>
  );
}
