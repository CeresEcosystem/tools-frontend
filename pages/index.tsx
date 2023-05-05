import Container from '@components/container';
import Input from '@components/input';
import TokensList from '@components/list/tokens_list';
import TokensModal from '@components/modal/tokens_modal';
import ListPagination from '@components/pagination/list_pagination';
import { NEW_API_URL } from '@constants/index';
import useTokenLocks, { LockToken } from '@hooks/use_token_locks';
import useTokens, { Token } from '@hooks/use_tokens';
import { scrollToTop } from '@utils/helpers';
import { useEffect, useState } from 'react';

interface Modal {
  show: boolean;
  item: Token | null;
  locks: LockToken[];
}

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
  } = useTokens(data);

  const { getTokenLocks } = useTokenLocks();

  const [showLocks, setShowLocks] = useState<Modal>({
    show: false,
    item: null,
    locks: [],
  });

  useEffect(() => {
    scrollToTop();
  }, [tokens]);

  const fetchData = async (show: boolean, token: Token) => {
    const response = await getTokenLocks(token?.token);
    setShowLocks({
      show,
      item: token,
      locks: response,
    });
  };

  return (
    <Container>
      <Input handleChange={handleTokenSearch} />
      <TokensList
        tokens={tokens}
        showModal={(show: boolean, token: Token) => fetchData(show, token)}
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
