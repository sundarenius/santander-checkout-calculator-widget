import {
  LocaleIds,
  Mode,
  MeasuresFixed,
  Countries,
  LabelPosition,
} from 'types/global-types';
import translations from 'utils/translations.json';
import type { PaymentDetailsState } from 'types/global-types';
import { getPaymentIntervals } from 'utils/payment-helpers';

const defaults = {
  // Sweden as default .. might change to other country
  LOCALE_ID: LocaleIds.SV_SE,
  COUNTRY: Countries.SE,
};

export const initialConfig = () => ({
  mode: Mode.MODERN,
  displayLogo: true,
  logoUrl: 'https://static.paymentiq.io/santander.svg',
  logoHeight: '25px',
  localeId: defaults.LOCALE_ID,
  defaultLocaleId: defaults.LOCALE_ID, // Need this for some initial re-render issues
  containerWidth: MeasuresFixed.WIDTH,
  containerHeight: MeasuresFixed.HEIGHT,
  country: defaults.COUNTRY,
  labelPosition: LabelPosition.LEFT,
  minAmount: 1990,
});

export const initialTheme = () => ({
  background: '#f8f8f8',
  border: '#cacaca',
  text: '#333333',
  footerFontSize: '10px',
  headerFontSize: '14px',
  borderRadius: '4px',
  font: 'arial',
  raised: 2,
});

export const initTranslations = () => ({
  ...translations[defaults.LOCALE_ID],
});

const defaultLoanAmount: number = 0;
export const paymentDetailsAcceptedAsParams = () => ({
  loanAmount: defaultLoanAmount,
  nomInterestRate: 21.00,
  termFee: 50,
  startupFee: 0,
  countrySpecifics: null,
});
export const initialPaymentDetails: () => PaymentDetailsState = () => ({
  amountOptions: getPaymentIntervals(defaultLoanAmount, defaults.COUNTRY),
  months: 0,
  selectedAmount: null,
  ...paymentDetailsAcceptedAsParams(),
});
