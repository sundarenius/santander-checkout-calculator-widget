import type {
  Theme,
} from '@santander-calculator-widget/app/src/types/global-types';
import {
  Countries,
  UrlPrefixes,
  EventTypes,
} from '@santander-calculator-widget/app/src/types/global-types';
import type {
  ApiConfig,
  PaymentDetails,
  FeeAndRate,
} from './types';

export const x = {};

export const serialize = (
  obj: Record<string, string | boolean | number>,
  prefix?: string | undefined,
) => {
  const str: string[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const KEY = prefix ? `${prefix}.${key}` : key;
      str.push(`${encodeURIComponent(KEY)}=${encodeURIComponent(obj[key])}`);
    }
  }
  return str.join('&');
};

/*
 * @returns { string } Takes countrySpecifics object and makes it a string as url params
 * prefixed like 'payment.[COUNTRY]=value&payment.[COUNTRY]=value'
 */
type SerializeCountrySpecific = (countrySpecifics: PaymentDetails['countrySpecifics']) => string
const serializeCountrySpecific: SerializeCountrySpecific = (countrySpecifics) => Object
  .entries(countrySpecifics)
  .map((
    obj: [ keyof typeof Countries | string, Partial<FeeAndRate> ],
  ) => {
    const feeAndRatesObj = obj[1];
    const country = obj[0];
    const prefix = `${UrlPrefixes.PAYMENT}.${country}`;
    return serialize(feeAndRatesObj, prefix);
  }).reduce((acc, str) => `${acc}&${str}`, '');

const getPaymentParams = (
  countrySpecifics: PaymentDetails['countrySpecifics'],
  paymentDetails: Partial<PaymentDetails>,
) => {
  const paymentDetailsStripped: Partial<Omit<PaymentDetails, 'countrySpecifics'>> = {
    ...paymentDetails,
  };
  const countrySpecificParams: string = serializeCountrySpecific(countrySpecifics);

  const paymentSerialized = serialize(paymentDetailsStripped, UrlPrefixes.PAYMENT);
  return `${paymentSerialized}${countrySpecificParams ? `&${countrySpecificParams}` : ''}`;
};

export const buildUrl = (
  origin: string,
  config: Partial<ApiConfig>,
  theme: Partial<Theme>,
  paymentDetails: Partial<PaymentDetails>,
) => {
  const configParams = serialize(config);
  const themeParams = serialize(theme, UrlPrefixes.THEME);
  const countrySpecifics: PaymentDetails['countrySpecifics'] = {
    ...paymentDetails
      && paymentDetails.countrySpecifics,
  };
  // eslint-disable-next-line no-param-reassign
  delete paymentDetails.countrySpecifics;
  const paymentParams: string = getPaymentParams(countrySpecifics, paymentDetails);
  // console.log(paymentParams);
  const url = `${origin}?${configParams}${themeParams ? `&${themeParams}` : ''}${paymentParams ? `&${paymentParams}` : ''}`;
  return url;
};

const registerOnCallbacks = (callbacks: any) => {
  window.addEventListener('message', (e) => {
    switch (e.data.eventType) {
      case EventTypes.SANTANDER_CALCULATOR_ERROR:
        if (callbacks.error) {
          callbacks.error(e.data.payload);
        }
        break;
      default:
        break;
    }
  });
};

export const initApiCallbacks = (api: any) => {
  const callbacks = {
    on: (onCallbacks: any) => registerOnCallbacks(onCallbacks),
  };
  api(callbacks);
};
