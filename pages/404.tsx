import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mt-16 px-6">
      <div className="mx-auto h-min max-w-max p-8 rounded-xl bg-backgroundItem">
        <div>
          <h1 className="text-4xl font-bold text-white text-center sm:text-5xl">
            Page not found
          </h1>
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className={
              'w-full py-3 text-center text-xl font-semibold text-pink sm:w-72'
            }
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
