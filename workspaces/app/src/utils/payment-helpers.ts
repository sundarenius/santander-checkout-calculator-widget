/* eslint-disable import/prefer-default-export */
import type { AmountOption } from 'types/global-types';
import { Countries, LocaleIds } from 'types/global-types';
import translations from 'utils/translations.json';

const generateAmountOptions = (arr: Array<any>) => {
  const amountOptions:Array<AmountOption> = [];
  arr.forEach((val) => {
    const amount = Number(val.toFixed(0));
    amountOptions.push({
      key: amount,
      text: amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(',', ' '),
      value: amount,
    });
  });
  return amountOptions;
};

export const getCurrencyCodeByCountry = (country: Countries) => {
  switch (country) {
    case Countries.NO:
      return translations[LocaleIds.NO_NO].currencyCode;
    case Countries.DK:
      return translations[LocaleIds.DA_DK].currencyCode;
    case Countries.GB:
      return translations[LocaleIds.EN_GB].currencyCode;
    case Countries.SE:
    default:
      return translations[LocaleIds.SV_SE].currencyCode;
  }
};

/*
 * @function { convertToNOK() }
 * We recived "from - to" values in the matrix from santander that was based on NOK currency.
 * (As shown in the matrixvalues below)
 * We need to convert those to other currencies we support as well.
 * At moment we're just hardcoding the corresponding exchange rate with whatever it was at 5th july 2021.
 * There are libraries (API's) to get live exchange rates,
 * might wanna refactor this and use ext. libraries later
 */
export const convertToNOK = (nokAmount: number, country: Countries): number => {
  switch (country) {
    case Countries.NO:
    default:
      return nokAmount;
    case Countries.SE:
      return nokAmount / 1;
    case Countries.DK:
      return nokAmount * 0.73;
    case Countries.GB:
      return nokAmount * 0.084;
  }
};

interface MatrixValues {
  interval: [number, number]
  options: [number, number, number]
}
const matrixValues: Array<MatrixValues> = [
  {
    interval: [1990, 4999],
    options: [199, 399, 499],
  },
  {
    interval: [5000, 9965],
    options: [299, 499, 699],
  },
  {
    interval: [9966, 15000],
    options: [499, 799, 999],
  },
  {
    interval: [15001, 25000],
    options: [799, 1499, 2599],
  },
  {
    interval: [25001, 35000],
    options: [1099, 1499, 2599],
  },
  {
    interval: [35001, 45000],
    options: [1399, 1999, 2599],
  },
  {
    interval: [45001, 55000],
    options: [1699, 2199, 2999],
  },
  {
    interval: [55001, 75000],
    options: [2299, 3299, 4299],
  },
  {
    interval: [75001, 100000],
    options: [3299, 4299, 5299],
  },
  {
    interval: [100001, 150000],
    options: [4599, 5299, 6299],
  },
];

export const getPaymentIntervals = (totalAmount: number, country: Countries): Array<AmountOption> => {
  const convert:(nr: number) => number = (nr) => convertToNOK(nr, country);
  const matrix: MatrixValues | undefined = matrixValues.find((val: MatrixValues) =>
    totalAmount >= convert(val.interval[0]) && totalAmount <= convert(val.interval[1]));
  const matrixOptions = matrix ? matrix.options.map((val:number) => convert(val)) : [0];
  return generateAmountOptions(matrixOptions);
};
