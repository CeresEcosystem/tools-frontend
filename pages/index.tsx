import Container from '@components/container';
import TokensFilter from '@components/filters/tokens_filter';
import Input from '@components/input';
import TokensList from '@components/list/tokens_list';
import TokenHolderModalClient from '@components/modal/token_holders_modal_client';
import TokenSupplyModal from '@components/modal/token_supply_modal';
import TokensModal from '@components/modal/tokens_modal';
import ListPagination from '@components/pagination/list_pagination';
import PriceConverter from '@components/price_converter';
import { NEW_API_URL } from '@constants/index';
import useLocks from '@hooks/use_locks';
import useSupply from '@hooks/use_supply';
import useTokens from '@hooks/use_tokens';
import {
  ModalSupply,
  ModalTokenHolders,
  ModalTokens,
  Token,
} from '@interfaces/index';
import { scrollToTop } from '@utils/helpers';
import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

export default function Tokens({ data }: { data?: Token[] }) {
  const {
    tokens,
    allTokens,
    totalPages,
    currentPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    handleTokenSearch,
    addTokenToFavorites,
    removeTokenFromFavorites,
    filters,
    filter,
    toggleFilter,
    favoriteTokens,
    showPriceConverter,
    setShowPriceConverter,
    priceFilter,
    togglePriceFilter,
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
  const [showHolders, setShowHolders] = useState<ModalTokenHolders>({
    show: false,
    item: null,
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
      <animated.div
        className={showPriceConverter ? 'hidden' : 'block'}
        style={useSpring({
          opacity: showPriceConverter ? 0 : 1,
          transform: `translateY(${showPriceConverter ? -10 : 0}px)`,
        })}
      >
        <div className="flex justify-between gap-4">
          <Input handleChange={handleTokenSearch} />
          <button
            onClick={() => setShowPriceConverter(true)}
            className="rounded-xl whitespace-nowrap bg-pink px-2 text-white text-sm"
          >
            Convert token prices
          </button>
        </div>
        <TokensFilter
          filters={filters}
          filter={filter}
          toggleFilter={toggleFilter}
          priceFilter={priceFilter}
          togglePriceFilter={togglePriceFilter}
        />
        <TokensList
          tokens={tokens}
          showModal={(show: boolean, token: Token) => fetchData(show, token)}
          showSupplyModal={(show: boolean, token: Token) =>
            fetchSupplyData(show, token)
          }
          showHoldersModal={(show: boolean, token: Token) =>
            setShowHolders({
              show,
              item: token,
            })
          }
          addTokenToFavorites={addTokenToFavorites}
          removeTokenFromFavorites={removeTokenFromFavorites}
          favoriteTokens={favoriteTokens}
          showOnlyFavorites={filter === 'Favorites'}
          priceFilter={priceFilter}
        />
        {filter !== 'Favorites' && totalPages > 1 && (
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
        <TokenHolderModalClient
          showModal={showHolders.show}
          closeModal={() => {
            setShowHolders((oldState) => ({
              ...oldState,
              show: false,
            }));
          }}
          token={showHolders.item}
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
      </animated.div>
      <animated.div
        className={showPriceConverter ? 'block' : 'hidden'}
        style={useSpring({
          opacity: showPriceConverter ? 1 : 0,
          transform: `translateY(${showPriceConverter ? 0 : -10}px)`,
        })}
      >
        <PriceConverter
          tokens={allTokens}
          closePriceConverter={() => setShowPriceConverter(false)}
        />
      </animated.div>
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
