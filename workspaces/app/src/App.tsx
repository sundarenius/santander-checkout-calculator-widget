import type { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from 'components/AppRoutes';
import {
  getConfigFromUrl,
  getThemeFromUrl,
  getPaymentParamsFromUrl,
  setPaymentDetails,
} from 'utils/helpers';
import { useAppDispatch, useAppSelector } from 'redux/redux-hooks';
import { contextActions } from 'redux/actions';
import translations from 'utils/translations.json';
import type { AppDispatch } from 'redux/store';
import type {
  Config,
  Theme,
  LocaleIds,
  PaymentParams,
} from 'types/global-types';
import './styles/App.scss';

type ConfigParams = Partial<Config>
type ThemeParams = Partial<Theme>

const urlConfig: ConfigParams = getConfigFromUrl();
const urlTheme: ThemeParams = getThemeFromUrl();
const paymentParams: PaymentParams = getPaymentParamsFromUrl();

// If we have external font-familys we need to load them as early as possible
if (urlTheme.font && urlTheme.font.includes('http')) {
  const splittedFont = urlTheme.font.split(',');
  const fontUrl: string|undefined = splittedFont.find((val) => val.includes('http'));
  if (fontUrl) {
    const fontTrimmed = fontUrl.trim();
    const style = document.createElement('style');
    style.innerText = `
  @import url('${fontTrimmed}');
  `;
    window.self.document.body.appendChild(style);
  }
}

const App: FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const defaultLocaleId: LocaleIds = useAppSelector(({ context }) => context.config.defaultLocaleId);

  setStore(dispatch, defaultLocaleId);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

// App helpers
type SetStore = (d: AppDispatch, l: LocaleIds) => void
const setStore: SetStore = (dispatch, defaultLocaleId) => {
  setUrlConfigs(dispatch);
  setTranslations(dispatch, urlConfig.localeId, defaultLocaleId);
};

const setUrlConfigs = (dispatch: AppDispatch): void => {
  dispatch(contextActions.setConfig(urlConfig));
  dispatch(contextActions.setTheme(urlTheme));
  setPaymentDetails(dispatch, paymentParams);
};

type SetTranslations = (d: AppDispatch, u: undefined | LocaleIds, s: LocaleIds) => void
const setTranslations: SetTranslations = (dispatch, urlLocaleId, defaultLocaleId) => {
  const localeId: LocaleIds = urlLocaleId || defaultLocaleId;
  dispatch(contextActions.setTranslations(translations[localeId]));
};

export default App;
