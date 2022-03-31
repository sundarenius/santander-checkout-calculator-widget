import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  Config,
  Theme,
  Translations,
} from 'types/global-types';
import { initialConfig, initialTheme, initTranslations } from '../initialStates';

export interface InitialState {
  config: Config,
  theme: Theme,
  translations: Translations
  error: string|null,
}

const initialState: InitialState = {
  config: initialConfig(),
  theme: initialTheme(),
  translations: initTranslations(),
  error: null,
};

export const contextSlice = createSlice({
  name: 'Context',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<Config>>) => {
      state.config = {
        ...state.config,
        ...action.payload,
      };
    },
    setTheme: (state, action: PayloadAction<Partial<Theme>>) => {
      state.theme = {
        ...state.theme,
        ...action.payload,
      };
    },
    setTranslations: (state, action: PayloadAction<Translations>) => {
      state.translations = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const contextActions = { ...contextSlice.actions };

export default contextSlice.reducer;
