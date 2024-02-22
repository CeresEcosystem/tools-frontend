import ExcludeAccountsModal from '@components/modal/exclude_accounts_modal';
import classNames from 'classnames';
import { useState } from 'react';

const ExcludeAccounts = ({
  label = 'Exclude accounts',
  excludedAccounts,
  containerClassName,
  className,
  setExcludedAccounts,
}: {
  label?: string;
  excludedAccounts: string[];
  containerClassName?: string;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  setExcludedAccounts: (excludedAccounts: string[]) => void;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={classNames('flex-shrink-0', containerClassName)}>
        {label !== '' && (
          <label className="block mb-2 text-xs font-medium text-white text-opacity-50">
            {label}
          </label>
        )}
        <div
          onClick={() => setShowModal(true)}
          className={classNames(
            "relative cursor-pointer text-xs w-full rounded-xl py-2 pl-4 pr-8 bg-backgroundItem text-white after:content-['▼'] after:top-2 after:text-white after:text-opacity-50 after:text-xs after:right-2 after:absolute",
            className
          )}
        >
          {`${excludedAccounts.length} accounts excluded`}
        </div>
      </div>
      <ExcludeAccountsModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        excludedAccounts={excludedAccounts}
        setExcludedAccounts={setExcludedAccounts}
      />
    </>
  );
};

export default ExcludeAccounts;
