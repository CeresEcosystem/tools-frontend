import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Modal({
  showModal,
  closeModal,
  children,
}: {
  showModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) {
  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto lg:pl-72">
          <div className="px-2 my-12 max-w-xl mx-auto sm:px-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 scale-95"
            >
              <Dialog.Panel className="relative rounded-xl px-2 py-6 overflow-hidden bg-backgroundBody sm:px-6">
                {children}
                <button
                  onClick={closeModal}
                  className="w-full mt-8 block mx-auto rounded-xl bg-pink px-3 py-1.5 text-white text-sm"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
