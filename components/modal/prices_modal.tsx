import Input from '@components/input';
import Modal from '@components/modal';
import { ASSET_URL } from '@constants/index';
import { Token } from '@interfaces/index';
import { formatToCurrency } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import { StarIcon as StarFavorite } from '@heroicons/react/24/solid';

export default function PricesModal({
  showModal,
  closeModal,
  tokens,
  changeCurrentTokenFromModal,
}: {
  showModal: boolean;
  closeModal: () => void;
  tokens: Token[];
  // eslint-disable-next-line no-unused-vars
  changeCurrentTokenFromModal: (token: Token) => void;
}) {
  const format = useFormatter();

  const [tokenList, setTokenList] = useState<Token[]>(tokens);

  const handleTokenSearch = (search: ChangeEvent<HTMLInputElement>) => {
    if (search.target.value !== '') {
      const searchedTokens = tokens.filter(
        (token) =>
          token.assetId
            .toUpperCase()
            .includes(search.target.value.toUpperCase()) ||
          token.fullName
            .toUpperCase()
            .includes(search.target.value.toUpperCase())
      );
      setTokenList(searchedTokens);
    } else {
      setTokenList(tokens);
    }
  };

  const onCloseModal = () => {
    closeModal();
    setTokenList(tokens);
  };

  const onChangeCurrentTokenFromModal = (token: Token) => {
    changeCurrentTokenFromModal(token);
    setTokenList(tokens);
  };

  return (
    <Modal showModal={showModal} closeModal={onCloseModal}>
      <div className="w-full">
        <Input handleChange={handleTokenSearch} />
      </div>
      <span className="mt-3 pl-2 text-white text-opacity-50 text-xs">
        Your Favorites tokens from Tokens section are displayed first
      </span>
      <div className="mt-6 overflow-y-auto overscroll-contain h-full">
        <ul role="list" className="space-y-2">
          {tokenList.map((token) => (
            <li
              key={`${token.fullName}+${token.assetId}`}
              onClick={() => onChangeCurrentTokenFromModal(token)}
              className="bg-backgroundItem cursor-pointer p-3 rounded-xl overflow-hidden flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  className="rounded-full w-6 h-6 mr-2"
                  src={`${ASSET_URL}/${token.token}.svg`}
                  alt={token.fullName}
                />
                <span className="text-xs text-white font-bold sm:text-sm">
                  {token.fullName}
                </span>
                {token.isFavorite && (
                  <StarFavorite className="h-6 w-6 ml-3 mr-1 text-yellow" />
                )}
              </div>
              <span className="text-xs text-pink font-bold sm:text-sm">
                {formatToCurrency(format, token.price)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
