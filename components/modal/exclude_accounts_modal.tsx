import InputState from '@components/input/input_state';
import Modal from '@components/modal';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatWalletAddress, validWalletAddress } from '@utils/helpers';
import { ChangeEvent, useState, KeyboardEvent } from 'react';

export default function ExcludeAccountsModal({
  showModal,
  closeModal,
  excludedAccounts,
  setExcludedAccounts,
}: {
  showModal: boolean;
  closeModal: () => void;
  excludedAccounts: string[];
  // eslint-disable-next-line no-unused-vars
  setExcludedAccounts: (excludedAccounts: string[]) => void;
}) {
  const [formData, setFormData] = useState({
    account: '',
    error: '',
  });

  const clearForm = () => {
    setFormData({
      account: '',
      error: '',
    });
  };

  const handleFormData = () => {
    if (validWalletAddress(formData.account)) {
      if (!excludedAccounts.includes(formData.account)) {
        setExcludedAccounts([...excludedAccounts, formData.account]);
        clearForm();
      } else {
        setFormData((prevData) => ({
          ...prevData,
          error: 'This account address is already added.',
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        error: 'Invalid account address.',
      }));
    }
  };

  return (
    <Modal showModal={showModal} closeModal={closeModal}>
      <span className="text-white font-medium text-lg">Exclude accounts</span>
      <div className="my-6">
        <div className="flex gap-x-8 items-center">
          <InputState
            id="account"
            name="account"
            value={formData.account}
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prevData) => ({
                ...prevData,
                account: e.target.value,
              }))
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                handleFormData();
              }
            }}
            showIcon={false}
            placeholder="Enter account address"
            containerClassName="flex-1"
            inputStyle="text-sm"
          />
          <button
            onClick={() => handleFormData()}
            className="rounded-xl bg-pink p-2 text-white text-sm focus:outline-none focus:ring-0"
          >
            <UserPlusIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        {formData.error !== '' && (
          <span className="text-xs text-red-500">{formData.error}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {excludedAccounts.map((acc, index) => (
          <div
            key={acc}
            className="bg-white bg-opacity-10 rounded-xl py-1 px-2 flex items-center gap-x-1"
          >
            <span className="text-xs text-white">
              {formatWalletAddress(acc, 5)}
            </span>
            <XMarkIcon
              className="w-5 h-5 text-white cursor-pointer"
              onClick={() =>
                setExcludedAccounts(
                  excludedAccounts.filter((_, i) => i !== index)
                )
              }
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
