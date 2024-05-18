import BurningClient from '@components/burning/burning_client';
import TableContainer from '@components/container/table_container';

export default function Burning() {
  return (
    <TableContainer>
      <BurningClient tokenFullName="kensetsu" tokenShortName="KEN" />
    </TableContainer>
  );
}
