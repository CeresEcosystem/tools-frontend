import { Keyring } from '@polkadot/api';
import moment from 'moment';

export function formatWalletAddress(
  address: string | undefined,
  formatDelimiter = 7
) {
  if (address && address.length > 20) {
    return `${address.substring(0, formatDelimiter)}-${address.substring(
      address.length - formatDelimiter,
      address.length
    )}`;
  }

  return '';
}

export function formatToCurrency(format: any, number: number): string {
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

export function formatCurrencyWithDecimals(
  format: any,
  number: number | string,
  decimal = 2,
  checkForEValue = false
): string {
  if (checkForEValue) {
    const numberString = number.toString();

    if (numberString.includes('e')) {
      return `$${numberString}`;
    }
  }

  return format.number(number, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
}

export function formatNumber(
  format: any,
  number: number | string,
  decimal = 2,
  checkForEValue = false
): string {
  if (checkForEValue) {
    const numberString = number.toString();

    if (numberString.includes('e')) {
      return `$${numberString}`;
    }
  }

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

export function formatDateFromTimestamp(timestamp: number) {
  const date = moment(new Date(timestamp), 'YYYY-MM-DD HH:MM');
  return `${date.format('MMMM DD, YYYY')} ${date.format('HH:mm')}`;
}

export function formatTimeFrame(time: string): string {
  switch (time) {
    case '24':
      return '24h';
    case '7':
      return '7d';
    case '30':
      return '30d';
    case '-1':
      return 'all';
    default:
      return '';
  }
}

export function getBlockLimiter(timeFrame: string, last?: number): number {
  if (last != null) {
    switch (timeFrame) {
      case '24':
        return last - 14400;
      case '7':
        return last - 100800;
      case '30':
        return last - 432000;
      default:
        return -1;
    }
  }

  return -1;
}

export function checkNumberValue(number: any) {
  if (number && number !== 0 && number !== undefined && number !== Infinity) {
    return true;
  }

  return false;
}

export function firstName(accountName: string | undefined) {
  if (accountName) {
    const nameSplit = accountName.split(' ');

    if (nameSplit.length > 1) {
      return nameSplit[0];
    }

    return accountName;
  }

  return '';
}

export function getAvatarTitle(accountName: string | undefined) {
  if (accountName) {
    const nameSplit = accountName.split(' ');

    if (nameSplit.length > 1) {
      return (
        nameSplit[0].charAt(0).toUpperCase() +
        nameSplit[1].charAt(0).toUpperCase()
      );
    }

    return accountName.charAt(0);
  }

  return '';
}

export const getEncodedAddress = (address: string | undefined) => {
  if (address) {
    const keyring = new Keyring();
    return keyring.encodeAddress(address, 69);
  }

  return '';
};
