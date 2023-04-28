import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Header({
  setSidebarOpen,
}: {
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (value: boolean) => void;
}) {
  return (
    <div className="lg:pl-72">
      <div className="sticky flex items-center px-4 top-0 z-40 h-24 shrink-0 bg-backgroundContainer">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-white lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
