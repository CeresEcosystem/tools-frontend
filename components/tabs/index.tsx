/* eslint-disable no-unused-vars */
import { Tab } from '@interfaces/index';
import classNames from 'classnames';

export default function Tabs({
  tabs,
  selectedTab,
  onChange,
  setSelectedTab,
  tvl,
  loading,
}: {
  tabs: Tab[];
  selectedTab: string;
  onChange: (event: React.FormEvent<HTMLSelectElement>) => void;
  setSelectedTab: (name: string) => void;
  tvl: string;
  loading: boolean;
}) {
  return (
    <div className="mb-8 px-5 py-5 space-y-5 rounded-xl bg-backgroundItem bg-opacity-20 backdrop-blur-lg flex flex-col sm:items-center sm:justify-between sm:flex-row sm:py-0 sm:space-y-0 sm:mb-16">
      <div>
        <div className="relative after:content-['▼'] after:top-3.5 after:text-white after:text-opacity-50 after:text-xs after:right-4 after:absolute sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block relative w-full appearance-none bg-backgroundHeader border-backgroundHeader border-2 rounded-xl py-2 px-4 text-base text-white capitalize font-semibold focus:outline-none focus:border-pink focus:ring-0"
            defaultValue={selectedTab}
            onChange={onChange}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-1 md:space-x-4">
            {tabs.map((tab: Tab) => {
              const current = tab.name === selectedTab;

              return (
                <div
                  key={tab.name}
                  onClick={() => setSelectedTab(tab.name)}
                  className={classNames(
                    current
                      ? 'border-pink text-pink'
                      : 'border-transparent text-white text-opacity-50 hover:text-white',
                    'text-base capitalize font-medium whitespace-nowrap border-b-2 py-4 px-8 md:text-lg cursor-pointer'
                  )}
                  aria-current={current ? 'page' : undefined}
                >
                  {tab.name}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex mx-auto sm:mx-0">
        <span className="text-white text-center text-opacity-50 font-bold text-base">
          {`TVL ${selectedTab}:`}
          <span className="block text-pink">
            {loading ? 'Loading...' : tvl}
          </span>
        </span>
      </div>
    </div>
  );
}
