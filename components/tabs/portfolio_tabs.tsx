import { PortfolioTab } from '@interfaces/index';
import { capitalizeFirstLetter } from '@utils/helpers';
import classNames from 'classnames';

export default function PortfolioTabs({
  tabs,
  selectedTab,
  changeSelectedTab,
  loading,
}: {
  tabs: PortfolioTab[];
  selectedTab: string;
  // eslint-disable-next-line no-unused-vars
  changeSelectedTab: (tab: PortfolioTab) => void;
  loading: boolean;
}) {
  return (
    <>
      <div className="hidden max-w-3xl mb-10 px-2 py-2 mx-auto w-full bg-backgroundItem rounded-xl sm:flex sm:px-5">
        {tabs.map((tab) => {
          const selected = tab.tab.toLowerCase() === selectedTab;

          return (
            <div
              key={tab.tab}
              onClick={() => {
                if (!loading) {
                  changeSelectedTab(tab);
                }
              }}
              className={classNames(
                'flex-1 flex justify-center items-center rounded-xl py-2 cursor-pointer group',
                selected && 'bg-white bg-opacity-10'
              )}
            >
              <span
                className={classNames(
                  'text-xs text-white capitalize font-medium sm:text-sm md:text-base',
                  selected ? 'text-opacity-100' : 'text-opacity-50',
                  'group-hover:text-opacity-100'
                )}
              >
                {tab.tab}
              </span>
            </div>
          );
        })}
      </div>
      <div className="block mb-10 relative after:content-['▼'] after:top-2.5 after:text-white after:text-opacity-50 after:text-xs after:right-4 after:absolute sm:hidden">
        <label htmlFor="portfolio-tab" className="sr-only">
          Select a tab
        </label>
        <select
          id="portfolio-tab"
          name="portfolio-tab"
          className="block relative w-full appearance-none bg-backgroundHeader border-backgroundHeader border-2 rounded-xl py-1 px-4 text-base text-white capitalize font-semibold focus:outline-none focus:border-pink focus:ring-0"
          defaultValue={capitalizeFirstLetter(selectedTab)}
          onChange={(event: React.FormEvent<HTMLSelectElement>) =>
            changeSelectedTab(
              tabs.find((t) => t.tab === event.currentTarget.value)!
            )
          }
        >
          {tabs.map((tab) => (
            <option key={tab.tab}>{tab.tab}</option>
          ))}
        </select>
      </div>
    </>
  );
}
