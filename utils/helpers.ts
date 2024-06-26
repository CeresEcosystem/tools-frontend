import { Token } from '@interfaces/index';
import { Keyring } from '@polkadot/api';
import moment from 'moment';

export function formatWalletAddress(
  address: string | undefined,
  formatDelimiter = 8
) {
  if (address && address.length > 20) {
    return `${address.substring(0, formatDelimiter)}-${address.substring(
      address.length - formatDelimiter,
      address.length
    )}`;
  }

  return '';
}

export function formatToCurrency(
  format: any,
  number: number,
  currency = 'USD'
): string {
  if (number !== null) {
    const numberString = number?.toString();

    if (numberString?.includes('e')) {
      return `$${numberString}`;
    }

    if (numberString?.includes('.')) {
      const numberSplit = numberString.split('.');
      const firstPart = format.number(parseInt(numberSplit[0]), {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      });
      return `${firstPart}.${numberSplit[1]}`;
    }

    return format.number(number, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
  }

  return `$0`;
}

export function formatCurrencyWithDecimals(
  format: any,
  number: number | string,
  decimal = 2,
  checkForEValue = false,
  currency = 'USD'
): string {
  if (checkForEValue) {
    const numberString = number?.toString();

    if (numberString?.includes('e')) {
      return `$${numberString}`;
    }
  }

  return format.number(number, {
    style: 'currency',
    currency,
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
    const numberString = number?.toString();

    if (numberString?.includes('e')) {
      return `$${numberString}`;
    }
  }

  return format.number(number, {
    style: 'decimal',
    maximumFractionDigits: decimal,
    trailingZeroDisplay: 'stripIfInteger',
  });
}

export function formatNumberExceptDecimal(
  format: any,
  number: number | string
) {
  const numberString = number?.toString();

  if (numberString?.includes('.')) {
    const numberSplit = numberString.split('.');
    const firstPart = format.number(parseInt(numberSplit[0]), {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return `${firstPart}.${numberSplit[1]}`;
  } else {
    return format.number(number, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}

export function scrollToTop() {
  const isBrowser = () => typeof window !== 'undefined';

  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function formatDateFromTimestamp(
  timestamp: number,
  format = 'MMMM DD, YYYY'
) {
  const date = moment(new Date(timestamp), 'YYYY-MM-DD HH:MM');
  return `${date.format(format)} ${date.format('HH:mm')}`;
}

export function formatDateAndTime(date: string) {
  const dateFormatted = moment(date);
  return `${dateFormatted.format('YYYY-MM-DD')} ${dateFormatted.format(
    'HH:mm'
  )}`;
}

export function formatDate(date: string) {
  const dateFormatted = moment(date);
  return dateFormatted.format('YYYY-MM-DD');
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

export function getEncodedAddress(address: string | undefined) {
  if (address) {
    const keyring = new Keyring();
    return keyring.encodeAddress(address, 69);
  }

  return '';
}

export function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function isAlphaNumeric(str: string) {
  let regex = /^[a-zA-Z0-9]+$/;
  return regex.test(str);
}

export function validWalletAddress(address: string): boolean {
  if (
    address !== '' &&
    address.length === 49 &&
    address.startsWith('cn') &&
    isAlphaNumeric(address)
  )
    return true;
  return false;
}

export function sortTokens(
  favoriteTokens: string[],
  tokenA: Token,
  tokenB: Token
) {
  const aIsFavorite = favoriteTokens.includes(tokenA.assetId);
  const bIsFavorite = favoriteTokens.includes(tokenB.assetId);

  if (aIsFavorite && !bIsFavorite) {
    return -1;
  } else if (!aIsFavorite && bIsFavorite) {
    return 1;
  } else {
    return 0;
  }
}
