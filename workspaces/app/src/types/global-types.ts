/* eslint no-unused-vars: "off" */
import type { DropdownItemProps } from 'semantic-ui-react';
import sharedData from '@santander-calculator-widget/shared/shared-data.json';

const { measures } = sharedData;

/*
 * @const (bootstrapperScriptSrc)
 * This is the int-api script url for the config "sandbox page" at "/config" path.
 * Match this to where it's hosted. Will probably be hosted by santander soon.
*/
// eslint-disable-next-line max-len
export const bootstrapperScriptSrc = 'https://static.paymentiq.io/santander-calculator-widget-bootstrapper.js';

export interface Translations {
  header: string,
  footer: string
  months: string,
  monthsAlias: string,
  monthlyAmount: string,
  effectiveInterestRate: string,
  inTotal: string,
  cost: string,
  currencyCode: string,
  effectiveInterestRateAlias: string
}

export enum LocaleIds {
  SV_SE = 'sv_SE',
  NO_NO = 'no_NO',
  DA_DK = 'da_DK',
  EN_GB = 'en_GB'
}

export enum Countries {
  SE = 'SE',
  NO = 'NO',
  DK = 'DK',
  GB = 'GB'
}

export enum Mode {
  MODERN = 'modern',
  CLASSIC = 'classic'
}

export interface Config {
  mode: Mode,
  displayLogo: boolean,
  logoUrl: string,
  logoHeight: string,
  localeId: LocaleIds,
  defaultLocaleId: LocaleIds,
  containerWidth: Measures,
  containerHeight: Measures,
  country: Countries,
  labelPosition: LabelPosition,
  minAmount: number,
}

export interface Theme {
  background: string,
  border: string,
  text: string,
  footerFontSize: string,
  borderRadius: string,
  font: string,
  headerFontSize: string,
  raised: number
}

export enum Paths {
  CONFIG = '/config',
  CLASSIC = '/classic',
  MODERN = '/modern'
}

export const MeasuresFixed = {
  WIDTH: measures.width,
  HEIGHT: measures.height,
};

// Wanted to have MeasuresFixed inside a "Measures" enum,
// but enums can only have computed numbers as value, computed strings is not allowed,
// so the following ended up a string type instead.
export type Measures = string

export interface AmountOption extends DropdownItemProps {
  key: number,
  text: string,
  value: number
}

export interface FeeAndRate {
  nomInterestRate: number,
  termFee: number,
  startupFee: number,
}

/*
 * string will be a custom COUNTRY code.
 * ex: {
 *  NO: {
 *   nomInterestRate: 19,
 *   termFee: 10
 *   startupFee: 0
 *  }
 * }
 * All keys in object are partial.
 * Means one could only pass in only one of those keys and leave the rest as default.
 * Object keys, "top level" must be taken from Countries enum.
 */
export type CountrySpecifics = Partial<Record<Countries, Partial<FeeAndRate>>>

export interface PaymentDetailsState extends FeeAndRate {
  amountOptions: Array<AmountOption>,
  months: number,
  selectedAmount: null | number,
  loanAmount: number,
  countrySpecifics: null | CountrySpecifics
}

export enum LabelPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum PaymentParamsEnum {
  NOM_INTEREST_RATE = 'nomInterestRate',
  TERM_FEE = 'termFee',
  STARTUP_FEE = 'startupFee',
  LOAN_AMOUNT = 'loanAmount',
  COUNTRY_SPECIFICS = 'countrySpecifics'
}

export interface PaymentParams {
  nomInterestRate?: number,
  termFee?: number,
  startupFee?: number,
  loanAmount?: number
  countrySpecifics?: null | CountrySpecifics
}

export enum UrlPrefixes {
  THEME = 'theme',
  PAYMENT = 'payment'
}

export enum EventTypes {
  SANTANDER_CALCULATOR_ERROR = 'SANTANDER_CALCULATOR_ERROR'
}
