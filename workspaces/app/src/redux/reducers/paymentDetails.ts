import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PaymentDetailsState } from 'types/global-types';
import { initialPaymentDetails } from 'redux/initialStates';

export const paymentSlice = createSlice({
  name: 'PaymentDetails',
  initialState: initialPaymentDetails(),
  reducers: {
    setMonths: (state, action: PayloadAction<PaymentDetailsState['months']>) => {
      state.months = action.payload;
    },
    setAmountOptions: (state, action: PayloadAction<PaymentDetailsState['amountOptions']>) => {
      state.amountOptions = action.payload;
    },
    setSelectedAmount: (state, action: PayloadAction<PaymentDetailsState['selectedAmount']>) => {
      state.selectedAmount = action.payload;
    },
    setLoanAmount: (state, action: PayloadAction<PaymentDetailsState['loanAmount']>) => {
      state.loanAmount = action.payload;
    },
    setCountrySpecifics: (state, action: PayloadAction<PaymentDetailsState['countrySpecifics']>) => {
      state.countrySpecifics = action.payload;
    },
    setNomInterestRate: (state, action: PayloadAction<PaymentDetailsState['nomInterestRate']>) => {
      state.nomInterestRate = action.payload;
    },
    setTermFee: (state, action: PayloadAction<PaymentDetailsState['termFee']>) => {
      state.termFee = action.payload;
    },
    setStartupFee: (state, action: PayloadAction<PaymentDetailsState['startupFee']>) => {
      state.startupFee = action.payload;
    },
  },
});

export const paymentActions = { ...paymentSlice.actions };

export default paymentSlice.reducer;
