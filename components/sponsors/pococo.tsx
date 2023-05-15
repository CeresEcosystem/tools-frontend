import Title from '@components/title';
import Link from 'next/link';

export default function SponsoredByPococo() {
  return (
    <>
      <Title title="Sponsored by" topMargin />
      <div className="mt-8 flex justify-center">
        <Link href="https://twitter.com/PSWAPCommunity" target="_blank">
          <img
            src={'/pococo.png'}
            alt="Pococo"
            className="max-w-[200px] h-auto"
          />
        </Link>
      </div>
    </>
  );
}
