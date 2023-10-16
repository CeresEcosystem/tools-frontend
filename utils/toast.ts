import { Id, Slide, toast, TypeOptions } from 'react-toastify';

export const showSuccessNotify = (msg: string, toastId = undefined) =>
  toast.success(msg, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 4000,
    toastId,
    hideProgressBar: true,
  });

export const showErrorNotify = (
  msg: string,
  autoClose = false,
  toastId = undefined
) =>
  toast.error(msg, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: autoClose ? 4000 : autoClose,
    toastId,
    hideProgressBar: true,
  });

export const showLoadingNotify = () =>
  toast.info('Transaction in progress...', {
    position: toast.POSITION.BOTTOM_RIGHT,
    closeOnClick: false,
    closeButton: false,
    autoClose: false,
    hideProgressBar: true,
  });

export const updateNotify = (toastId: Id, msg: string, type: TypeOptions) =>
  toast.update(toastId, {
    render: msg,
    type: type,
    position: toast.POSITION.BOTTOM_RIGHT,
    closeOnClick: true,
    closeButton: true,
    autoClose: 4000,
    transition: Slide,
    hideProgressBar: true,
  });
