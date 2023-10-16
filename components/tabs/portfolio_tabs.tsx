import { PortfolioTab } from '@interfaces/index';
import classNames from 'classnames';

export default function PortfolioTabs({
  tabs,
  selectedTab,
  changeSelectedTab,
}: {
  tabs: PortfolioTab[];
  selectedTab: PortfolioTab;
  // eslint-disable-next-line no-unused-vars
  changeSelectedTab: (tab: PortfolioTab) => void;
}) {
  return (
    <div className="max-w-lg mb-10 px-2 py-2 mx-auto w-full bg-backgroundItem flex rounded-xl sm:px-5">
      {tabs.map((tab) => {
        const selected = tab.tab === selectedTab.tab;

        return (
          <div
            key={tab.tab}
            onClick={() => changeSelectedTab(tab)}
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
  );
}
