import moment from "moment";

export const formatWalletAddress = (
  address: string | undefined,
  formatDelimiter = 7
) => {
  if (address && address.length > 20) {
    return `${address.substring(0, formatDelimiter)}-${address.substring(
      address.length - formatDelimiter,
      address.length
    )}`;
  }

  return '';
};

export function formatToCurrency(format: any, number: number) {
  if (number !== null) {
    const numberString = number.toString();

    if (numberString.includes('e')) {
      return `$${numberString}`;
    }

    if (numberString.includes('.')) {
      const numberSplit = numberString.split('.');
      const firstPart = format.number(parseInt(numberSplit[0]), {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });
      return `${firstPart}.${numberSplit[1]}`;
    }
    
    return format.number(number, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }

  return `$0`;
}

export function formatNumber(format: any, number: number, decimal = 2) {
  return format.number(number, {
    style: 'decimal',
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
}

export function scrollToTop() {
  const isBrowser = () => typeof window !== 'undefined';

  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export const formatDateFromTimestamp = (timestamp: number) => {
  const date = moment(new Date(timestamp), 'YYYY-MM-DD HH:MM');
  return `${date.format('MMMM DD, YYYY')} ${date.format('HH:mm')}`;
};
