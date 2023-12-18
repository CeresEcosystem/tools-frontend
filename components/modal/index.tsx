import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';

export default function Modal({
  showModal,
  closeModal,
  children,
  showCloseButton = true,
  fullScreen = false,
}: {
  showModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  fullScreen?: boolean;
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
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-x-0 inset-y-12 lg:pl-72">
          <div
            className={classNames(
              'px-2 h-full mx-auto sm:px-6',
              fullScreen ? 'max-w-6xl' : 'max-w-xl'
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="relative flex flex-col rounded-xl px-2 py-6 overflow-x-hidden overflow-y-auto bg-backgroundBody max-h-full sm:px-6">
                {children}
                {showCloseButton && (
                  <button
                    onClick={closeModal}
                    className="w-full max-w-md mt-8 block mx-auto rounded-xl bg-pink px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-0"
                  >
                    Close
                  </button>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
