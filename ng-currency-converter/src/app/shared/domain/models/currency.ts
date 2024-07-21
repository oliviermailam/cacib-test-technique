export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const EURO: Currency = {
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  flag: '🇪🇺',
};

export const USD: Currency = {
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
  flag: '🇺🇸',
};
