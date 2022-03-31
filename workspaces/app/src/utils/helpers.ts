import { initialConfig, initialTheme, paymentDetailsAcceptedAsParams } from 'redux/initialStates';
import {
  Countries,
  UrlPrefixes,
  PaymentParamsEnum,
} from 'types/global-types';
import type {
  AmountOption,
  PaymentParams,
} from 'types/global-types';
import { store } from 'redux/store';
import type { AppDispatch } from 'redux/store';
import { paymentActions } from 'redux/actions';
import { getCurrencyCodeByCountry } from 'utils/payment-helpers';

export const parseQueryString = (key: string): string | null =>
  new URL(window.location.href).searchParams.get(key);

const setAllowedKeys = (keys: string[], addKey: (key: string, value: string) => void) => {
  keys.forEach((key: any) => {
    const val: any = parseQueryString(key);
    if (val) {
      let value = val;
      if (val === 'false') value = false;
      if (val === 'true') value = true;
      addKey(decodeURIComponent(key), typeof value === 'string' ? decodeURIComponent(value) : value);
    }
  });
};

const verifiedKeys = (configType: () => any, prefix: null | string) => {
  const options: any = configType(); // Setting any because of the algorithms below
  const allowedKeys = [
    ...Object.keys(options).map((key) => `${prefix ? `${prefix}.` : ''}${key}`),
  ];
  return allowedKeys;
};

export const getConfigFromUrl = () => {
  const allowedConfigs = verifiedKeys(initialConfig, null);
  const urlConfigs:any = {};

  const addKey = (key: string, value: string) => { urlConfigs[key] = value; };
  setAllowedKeys(allowedConfigs, addKey);

  return urlConfigs;
};

export const getThemeFromUrl = () => {
  const allowedKeys = verifiedKeys(initialTheme, UrlPrefixes.THEME);
  const urlTheme:any = {};

  const addKey = (key: string, value: string) => {
    const themeProp = key.split('.')[1]; // theme.${themeProps} need to be splitted
    urlTheme[themeProp] = value;
  };
  setAllowedKeys(allowedKeys, addKey);

  return urlTheme;
};

export const getPaymentParamsFromUrl: () => PaymentParams = () => {
  const allowedKeys = verifiedKeys(paymentDetailsAcceptedAsParams, UrlPrefixes.PAYMENT);
  const urlPaymentDetails: any = {};

  // This will add all url params prefixed with payment.[country].key=value as allowedKeys
  const allowedCopy = [...allowedKeys];
  Object.values(Countries).forEach((country) => {
    allowedCopy.forEach((key) => {
      allowedKeys.push(`${UrlPrefixes.PAYMENT}.${country}${key.replace(UrlPrefixes.PAYMENT, '')}`);
    });
  });

  const addKey = (key: string, value: string) => {
    const splitted = key.split('.');
    const prop = splitted[1];
    if (splitted.length === 3) {
      const subKey = splitted[2];
      if (!urlPaymentDetails.countrySpecifics) {
        urlPaymentDetails.countrySpecifics = {};
      }
      urlPaymentDetails.countrySpecifics[prop] = {
        ...urlPaymentDetails.countrySpecifics[prop],
        [subKey]: Number(value),
      };
    } else {
      urlPaymentDetails[prop] = Number(value);
    }
  };
  setAllowedKeys(allowedKeys, addKey);
  return urlPaymentDetails;
};

export const isIframed = () => {
  try {
    return window.self.window === window.top.window;
  } catch (e) {
    return false;
  }
};

export const amountWithCode = (localeId: string, currencyCode: string, amount: number) =>
  new Intl.NumberFormat(
    localeId.replace('_', '-'),
    { style: 'currency', currency: currencyCode, minimumFractionDigits: 0 },
  )
    .format(amount);

// Effective interest calculation function
interface GetCostArgs {
  amount: number,
  months: number
  nomInterestRate: number
}
type GetCostFromInterestRate = ({ amount, months, nomInterestRate }: GetCostArgs) => number
export const getCostFromInterestRate: GetCostFromInterestRate = ({
  amount,
  months,
  nomInterestRate,
}) => {
  const interestRate = ((nomInterestRate / 100) + 1);
  const years = months / 12;
  // eslint-disable-next-line no-restricted-properties
  return Number(((amount || 0) * Math.pow(interestRate, years)).toFixed(0));
};

type AmountOptionsFixed = (amountOptions: Array<AmountOption>) => Array<AmountOption>
export const amountOptionsFixed: AmountOptionsFixed = (amountOptions) => {
  const { context } = store.getState();
  return amountOptions.map((option) => ({
    ...option,
    text: amountWithCode(
      context.config.localeId,
      getCurrencyCodeByCountry(context.config.country),
      option.value,
    ),
  }));
};

export const toPascalCase = (str: string) => {
  const split = str.split('');
  const toPascal = split[0].toUpperCase() + split.splice(1).join('');
  return toPascal;
};

export const getTotalAmount = (selectedAmount: number, months: number) => (selectedAmount || 0) * months;

export const getFixedAmount = (selectedAmount: number, months: number): string => {
  const { context } = store.getState();
  return amountWithCode(
    context.config.localeId,
    getCurrencyCodeByCountry(context.config.country),
    getTotalAmount(selectedAmount, months),
  );
};

export const setPaymentDetails = (
  dispatch: AppDispatch,
  paymentParams: PaymentParams,
): void => {
  const acceptedKeys = Object.keys(paymentDetailsAcceptedAsParams());
  const paymentEntries = Object.entries(paymentParams);
  paymentEntries.forEach((entrie) => {
    const key: string = entrie[0];
    const value: any = entrie[1];
    if (acceptedKeys.includes(key)) {
      switch (key) {
        case PaymentParamsEnum.NOM_INTEREST_RATE:
          dispatch(paymentActions.setNomInterestRate(Number(value)));
          break;
        case PaymentParamsEnum.TERM_FEE:
          dispatch(paymentActions.setTermFee(Number(value)));
          break;
        case PaymentParamsEnum.STARTUP_FEE:
          dispatch(paymentActions.setStartupFee(Number(value)));
          break;
        case PaymentParamsEnum.LOAN_AMOUNT:
          dispatch(paymentActions.setLoanAmount(Number(value)));
          break;
        case PaymentParamsEnum.COUNTRY_SPECIFICS:
          dispatch(paymentActions.setCountrySpecifics(value));
          break;
        default:
          break;
      }
    }
  });
};

const setMeasures = (
  containerEl: HTMLElement,
  modernContainer: null | HTMLElement,
  containerElPx: string,
  modernContainerPx: string,
) => {
  if (containerEl) {
    containerEl.style.minHeight = containerElPx;
    if (modernContainer) {
      modernContainer.style.padding = modernContainerPx;
    }
  }
};

export const setContainerHeight = (width: string, id: string) => {
  const containerEl: null | HTMLElement = document.querySelector(`#${id}`);
  const modernContainer: null | HTMLElement = document.querySelector('#modern-container');
  if (width === 'small' && containerEl) {
    setMeasures(containerEl, modernContainer, '190px', '0px');
  } else if (containerEl) {
    setMeasures(containerEl, modernContainer, '150px', '10px');
  }
};
