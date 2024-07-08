import Input from '@components/input';
import Modal from '@components/modal';
import { ALL_TOKENS, ASSET_URL, FAVORITE_TOKENS } from '@constants/index';
import { Token } from '@interfaces/index';
import { formatToCurrency, sortTokens } from '@utils/helpers';
import { useFormatter } from 'next-intl';
import { ChangeEvent, useEffect, useState } from 'react';
import { HeartIcon, StarIcon as StarFavorite } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import FallbackImage from '@components/image/fallback_image';

export default function PricesModal({
  showModal,
  closeModal,
  tokens,
  filterOutToken,
  changeCurrentTokenFromModal,
  showFavoriteTokensOption,
  showAllTokensOption,
}: {
  showModal: boolean;
  closeModal: () => void;
  tokens: Token[];
  filterOutToken?: Token | undefined;
  // eslint-disable-next-line no-unused-vars
  changeCurrentTokenFromModal: (token: Token | string) => void;
  showFavoriteTokensOption?: boolean;
  showAllTokensOption?: boolean;
}) {
  const format = useFormatter();

  const favoriteTokens = useSelector(
    (state: RootState) => state.tokens.favoriteTokens
  );

  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [searchedTokens, setSearchedTokens] = useState<Token[] | null>(null);

  const handleTokenSearch = (search: ChangeEvent<HTMLInputElement>) => {
    if (search.target.value !== '') {
      const searched = tokenList.filter(
        (token) =>
          token.assetId
            .toUpperCase()
            .includes(search.target.value.toUpperCase()) ||
          token.fullName
            .toUpperCase()
            .includes(search.target.value.toUpperCase())
      );
      setSearchedTokens(searched);
    } else {
      setSearchedTokens(null);
    }
  };

  const onCloseModal = () => {
    closeModal();
    setSearchedTokens(null);
  };

  const onChangeCurrentTokenFromModal = (token: Token | string) => {
    changeCurrentTokenFromModal(token);
    setSearchedTokens(null);
  };

  useEffect(() => {
    function filterAndSortTokens() {
      let tkns = tokens.map((t) => ({ ...t, isFavorite: false }));

      tkns = tkns.sort((tokenA, tokenB) =>
        sortTokens(favoriteTokens, tokenA, tokenB)
      );

      for (let i = 0; i < favoriteTokens.length; i++) {
        tkns[i].isFavorite = true;
      }

      if (filterOutToken) {
        tkns = tkns.filter((t) => t.token !== filterOutToken.token);
      }

      setTokenList(tkns);
    }

    filterAndSortTokens();
  }, [favoriteTokens, filterOutToken, tokens]);

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
          {showFavoriteTokensOption && favoriteTokens.length > 0 && (
            <li
              onClick={() => onChangeCurrentTokenFromModal(FAVORITE_TOKENS)}
              className="bg-backgroundItem cursor-pointer p-3 rounded-xl overflow-hidden flex items-center"
            >
              <div className="rounded-full flex items-center justify-center w-6 h-6 mr-2 bg-pink">
                <HeartIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-white font-bold sm:text-sm">
                Favorite tokens
              </span>
            </li>
          )}
          {showAllTokensOption && (
            <li
              onClick={() => onChangeCurrentTokenFromModal(ALL_TOKENS)}
              className="bg-backgroundItem cursor-pointer p-3 rounded-xl overflow-hidden flex items-center"
            >
              <div className="rounded-full flex items-center justify-center w-6 h-6 mr-2 bg-white bg-opacity-20">
                <i className="flaticon-token text-yellow text-base mt-1.5 w-4.5"></i>
              </div>
              <span className="text-xs text-white font-bold sm:text-sm">
                All tokens
              </span>
            </li>
          )}
          {(searchedTokens ?? tokenList).map((token) => (
            <li
              key={`${token.fullName}+${token.assetId}`}
              onClick={() => onChangeCurrentTokenFromModal(token)}
              className="bg-backgroundItem cursor-pointer p-3 rounded-xl overflow-hidden flex items-center justify-between"
            >
              <div className="flex items-center">
                <FallbackImage
                  className="rounded-full w-6 h-6 mr-2"
                  src={`${ASSET_URL}/${token.token}.svg`}
                  fallback={`${ASSET_URL}/${token.token}.png`}
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
