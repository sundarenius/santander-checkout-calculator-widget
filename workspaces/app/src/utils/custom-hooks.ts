/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import calulator from 'utils/calculator';
import { getFixedAmount } from 'utils/helpers';
import { paymentActions, contextActions } from 'redux/actions';
import { store } from 'redux/store';
import type { Config, Theme, PaymentParams } from 'types/global-types';
import { bootstrapperScriptSrc } from 'types/global-types';
import { convertToNOK } from 'utils/payment-helpers';
import { errorCallback } from 'utils/jsApi';

interface UseCalculate {
  selectedAmount: null | number,
  loanAmount: number,
  nomInterestRate: number,
  startupFee: number,
  termFee: number
}
export const useCalculate = ({
  selectedAmount,
  loanAmount,
  nomInterestRate,
  startupFee,
  termFee,
}: UseCalculate) => {
  const initialState = {
    fixedTotalAmount: '0',
    fixedTotalCost: '0',
    effectiveInterestRate: '0',
  };
  const [state, setState] = useState(initialState);
  const { context } = store.getState();

  useEffect(() => {
    if (selectedAmount) {
      // We want to update this whenever selectedAmount is changed
      const result = calulator.Calculate(
        loanAmount,
        nomInterestRate,
        selectedAmount,
        startupFee,
        termFee,
        convertToNOK(context.config.minAmount, context.config.country),
        (s: string) => {
          store.dispatch(contextActions.setError(s));
          errorCallback(s);
        },
      );
      const totalPurchaseCost = Number(result.totalPurchaseCost.replace(' ', ''));
      setState({
        fixedTotalAmount: getFixedAmount(totalPurchaseCost, 1),
        fixedTotalCost: getFixedAmount((totalPurchaseCost - loanAmount), 1),
        effectiveInterestRate: result.effectiveRate,
      });
      store.dispatch(paymentActions.setMonths(result.months));
    }
  }, [
    selectedAmount,
    loanAmount,
    nomInterestRate,
    startupFee,
    termFee,
    context.config.minAmount,
    context.config.country,
  ]);

  return state;
};

export const useOffsetWidth = (id: string) => {
  // Initialize state with width/height
  const [offsetWidth, setOffsetWidth] = useState('normal');

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      const containerEl: HTMLElement | null = document.querySelector(`#${id}`);
      const width: number = (containerEl
        && containerEl.offsetWidth) || 0;

      setOffsetWidth(width < 360 && width > 0 ? 'small' : 'normal');
    };
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial width
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);
  return offsetWidth;
};

interface UseUpdateWidget {
  callBootstrapper: any,
  setHasRendered: (boo: boolean) => void,
  reload: number,
  config: Config,
  theme: Theme,
  paymentDetails: PaymentParams,
}
export const useUpdateWidget = ({
  callBootstrapper,
  setHasRendered,
  reload,
  config,
  theme,
  paymentDetails,
}: UseUpdateWidget) => {
  const [hasAddedScript, setHasAddedScript] = useState(false);

  useEffect(() => {
    const scriptEl = document.createElement('script');
    // eslint-disable-next-line max-len
    scriptEl.src = bootstrapperScriptSrc;
    scriptEl.id = 'app-preview-bootstrapper';
    document.body.appendChild(scriptEl);
    setHasAddedScript(true);
  }, []);

  useEffect(() => {
    if (hasAddedScript) {
      callBootstrapper({
        setHasRendered,
        config,
        theme,
        paymentDetails,
      });
    }
  }, [
    reload,
    hasAddedScript,
    setHasRendered,
    callBootstrapper,
    config,
    theme,
    paymentDetails,
  ]);
};
