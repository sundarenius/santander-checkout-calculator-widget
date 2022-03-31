/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {
  Config,
  FeeAndRate as FeeAndRateType,
  Countries,
} from '@santander-calculator-widget/app/src/types/global-types';

export enum hostedUrls {
  DEVELOPMENT = 'http://localhost:3000/',
  PRODUCTION = 'https://gallant-bhabha-93a576.netlify.app/', // Change this later to santander endpoint
}

export enum environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production' // default
}

export interface ApiConfig extends Config {
  iframeHeight?: string,
  environment: environment
}

export interface FeeAndRate extends Partial<FeeAndRateType> {}

export type CountrySpecifics = Partial<Record<Countries, FeeAndRate>>

export interface PaymentDetails extends FeeAndRate {
  loanAmount: number,
  countrySpecifics: CountrySpecifics
}

export const iframeId: string = '_CHECKOUT_WIDGET_IFRAME_';

export enum eventTypes {
  UPDATE_THEME = 'UPDATE_THEME',
  UPDATE_CONFIG = 'UPDATE_CONFIG',
  UPDATE_PAYMENT_DETAILS = 'UPDATE_PAYMENT_DETAILS',
}
