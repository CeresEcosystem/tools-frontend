import Container from '@components/container';
import TokensList from '@components/list/tokens_list';
import ListPagination from '@components/pagination/list_pagination';
import { NEW_API_URL } from '@constants/index';
import useTokens, { Token } from '@hooks/use_tokens';
import { scrollToTop } from '@utils/helpers';
import { useEffect } from 'react';

export default function Tokens({ data }: { data?: Token[] }) {
  const {
    tokens,
    totalPages,
    currentPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
  } = useTokens(data);

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  return (
    <Container>
      <TokensList tokens={tokens} />
      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToFirstPage={goToFirstPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        goToLastPage={goToLastPage}
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
