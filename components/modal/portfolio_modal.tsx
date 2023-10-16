import InputState from '@components/input/input_state';
import Modal from '@components/modal';
import { WalletAddress } from '@interfaces/index';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function PortfolioModal({
  showModal,
  closeModal,
  wallet,
  addEditWallet,
  removeWallet,
}: {
  showModal: boolean;
  closeModal: () => void;
  wallet: WalletAddress | null;
  addEditWallet: (
    // eslint-disable-next-line no-unused-vars
    wallet: WalletAddress,
    // eslint-disable-next-line no-unused-vars
    previousWallet: WalletAddress | null
  ) => void;
  // eslint-disable-next-line no-unused-vars
  removeWallet: (wallet: WalletAddress) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  useEffect(() => {
    if (showModal) {
      setFormData({
        name: wallet?.name || '',
        address: wallet?.address || '',
      });
    }
  }, [wallet, showModal]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newWallet: WalletAddress = {
      name: formData.name,
      address: formData.address,
      fromPolkadotExtension: false,
      temporaryAddress: formData.name === '',
    };

    addEditWallet(newWallet, wallet);
  };

  return (
    <Modal
      showModal={showModal}
      closeModal={closeModal}
      showCloseButton={false}
    >
      <div className="flex px-2 items-center justify-between">
        <h4 className="font-bold text-white line-clamp-1 text-lg">
          {wallet ? 'Edit wallet' : 'Add new wallet'}
        </h4>
        <button
          type="button"
          onClick={closeModal}
          className="text-gray-200 bg-transparent hover:bg-pink hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <InputState
                name="name"
                id="name"
                label="Wallet name"
                value={formData.name}
                handleChange={handleChange}
                showIcon={false}
                required={wallet !== null}
                placeholder="Enter wallet name"
              />
            </div>
            <div className="col-span-6">
              <InputState
                name="address"
                id="address"
                label="Wallet address"
                value={formData.address}
                required
                handleChange={handleChange}
                showIcon={false}
                placeholder="Enter wallet address"
              />
            </div>
          </div>
        </div>
        {wallet && !wallet.fromPolkadotExtension && (
          <button
            type="button"
            onClick={() => removeWallet(wallet)}
            className="mx-2 text-pink"
          >
            Remove this wallet
          </button>
        )}
        <button
          type="submit"
          className="w-full mt-4 block mx-auto rounded-xl bg-pink px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-0"
        >
          Save
        </button>
      </form>
    </Modal>
  );
}
