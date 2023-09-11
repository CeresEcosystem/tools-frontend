import Container from '@components/container';
import TokensFavoriteFilter from '@components/filters/tokens_favorite_filter';
import Input from '@components/input';
import TokensList from '@components/list/tokens_list';
import TokenSupplyModal from '@components/modal/token_supply_modal';
import TokensModal from '@components/modal/tokens_modal';
import ListPagination from '@components/pagination/list_pagination';
import { NEW_API_URL } from '@constants/index';
import useLocks from '@hooks/use_locks';
import useSupply from '@hooks/use_supply';
import useTokens from '@hooks/use_tokens';
import { ModalSupply, ModalTokens, Token } from '@interfaces/index';
import { scrollToTop } from '@utils/helpers';
import { useEffect, useState } from 'react';

export default function Tokens({ data }: { data?: Token[] }) {
  const {
    tokens,
    totalPages,
    currentPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    handleTokenSearch,
    addTokenToFavorites,
    removeTokenFromFavorites,
    showOnlyFavorites,
    toggleFavorites,
    favoriteTokens,
  } = useTokens(data);

  const { getLocks } = useLocks();
  const { getSupply } = useSupply();

  const [showLocks, setShowLocks] = useState<ModalTokens>({
    show: false,
    item: null,
    locks: [],
  });
  const [showSupply, setShowSupply] = useState<ModalSupply>({
    show: false,
    item: null,
    supply: [],
  });

  useEffect(() => {
    scrollToTop();
  }, [tokens]);

  const fetchData = async (show: boolean, token: Token) => {
    const response = await getLocks(undefined, token?.token);
    setShowLocks({
      show,
      item: token,
      locks: response,
    });
  };

  const fetchSupplyData = async (show: boolean, token: Token) => {
    const response = await getSupply(token?.token);

    setShowSupply({
      show,
      item: token,
      supply: response,
    });
  };

  return (
    <Container>
      <Input handleChange={handleTokenSearch} />
      <TokensFavoriteFilter
        showOnlyFavorites={showOnlyFavorites}
        toggleFavorites={toggleFavorites}
      />
      <TokensList
        tokens={tokens}
        showModal={(show: boolean, token: Token) => fetchData(show, token)}
        showSupplyModal={(show: boolean, token: Token) =>
          fetchSupplyData(show, token)
        }
        addTokenToFavorites={addTokenToFavorites}
        removeTokenFromFavorites={removeTokenFromFavorites}
        favoriteTokens={favoriteTokens}
      />
      {totalPages > 1 && (
        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToFirstPage={goToFirstPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToLastPage={goToLastPage}
        />
      )}
      <TokensModal
        showModal={showLocks.show}
        closeModal={() =>
          setShowLocks((oldState) => ({
            ...oldState,
            show: false,
          }))
        }
        token={showLocks.item}
        locks={showLocks.locks}
      />
      <TokenSupplyModal
        showModal={showSupply.show}
        closeModal={() =>
          setShowSupply((oldState) => ({
            ...oldState,
            show: false,
          }))
        }
        token={showSupply.item}
        supply={showSupply.supply}
      />
    </Container>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${NEW_API_URL}/prices`);
  let data;

  if (res.ok) {
    data = (await res.json()) as Token[];
  }

  return { props: { data } };
}
