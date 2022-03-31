import type { FC } from 'react';
import type { Config, Theme, PaymentParams } from 'types/global-types';
import { useUpdateWidget } from 'utils/custom-hooks';
import { stripOutDefaults } from './configUtils';
import {
  initialConfig,
  initialTheme,
  paymentDetailsAcceptedAsParams,
} from 'redux/initialStates';

interface Props {
  setHasRendered: (boo: boolean) => void,
  reload: number,
  config: Config
  theme: Theme,
  paymentDetails: PaymentParams
}

const appPreviewId = 'app-preview';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    checkoutWidget: any;
    SANTANDER_CHECKOUT_WIDGET: any;
  }
}

const LivePreview:FC<Props> = ({
  setHasRendered,
  reload,
  config,
  theme,
  paymentDetails,
}): JSX.Element => {
  useUpdateWidget({
    callBootstrapper,
    setHasRendered,
    reload,
    config,
    theme,
    paymentDetails,
  });

  const txt = 'LivePreview page';
  return (
    <div id={appPreviewId}>
      {txt}
    </div>
  );
};

interface CallBootstrapper {
  setHasRendered: (boo: boolean) => void,
  config: Config,
  theme: Theme,
  paymentDetails: PaymentParams
}
// Wanna use non-arrow function to simplify the use of arguments, we wanna use arguments[0]
// Named function are preffered instead of non-named functions
const callBootstrapper = function callBootstrapper(...args: CallBootstrapper[]) {
  const elContent: HTMLElement | null = document.querySelector(`#${appPreviewId}`);
  if (elContent) elContent.innerHTML = '';

  if (window.SANTANDER_CHECKOUT_WIDGET) {
    window.checkoutWidget = new window.SANTANDER_CHECKOUT_WIDGET(
      appPreviewId,
      {
        environment: 'production',
        iframeHeight: '225px',
        ...stripOutDefaults<Config>({ ...args[0].config }, initialConfig),
        theme: {
          ...stripOutDefaults<Theme>({ ...args[0].theme }, initialTheme),
        },
        paymentDetails: {
          ...stripOutDefaults<PaymentParams>(
            { ...args[0].paymentDetails },
            paymentDetailsAcceptedAsParams,
          ),
        },
      },
    );
    args[0].setHasRendered(true);
  } else {
    setTimeout(() => {
      callBootstrapper(args[0]);
    }, 150);
  }
};

export default LivePreview;
