import type { FC } from 'react';
import Prism from 'prismjs';
import { bootstrapperScriptSrc } from 'types/global-types';
import type { Config, Theme, PaymentParams } from 'types/global-types';
import {
  initialConfig,
  initialTheme,
  paymentDetailsAcceptedAsParams,
} from 'redux/initialStates';
import { stripOutDefaults } from './configUtils';

interface Props {
  config: Config,
  theme: Theme
  paymentDetails: PaymentParams
}

function stringify <T>(obj: T): string {
  return JSON.stringify(obj, null, 4);
}

const CodeSnippet:FC<Props> = ({
  config,
  theme,
  paymentDetails,
}): JSX.Element => {
  const strippedConfig = stripOutDefaults<Config>(
    config,
    initialConfig,
  );
  const strippedTheme = stripOutDefaults<Theme>(
    theme,
    initialTheme,
  );
  const strippedPD = stripOutDefaults<PaymentParams>(
    paymentDetails,
    paymentDetailsAcceptedAsParams,
  );

  interface AllStringified extends Partial<Config> {
    iframeHeight: string,
    theme: Partial<Theme>,
    paymentDetails: Partial<PaymentParams>
  }
  const allStringified = stringify<AllStringified>({
    ...strippedConfig,
    iframeHeight: '225px',
    theme: {
      ...strippedTheme,
    },
    paymentDetails: {
      ...strippedPD,
    },
  });

  const code = `
<!DOCTYPE html>
<html>
<head>
<script
  type=text/javascript
  src='${bootstrapperScriptSrc}'
></script>
<body>

  <div id="checkout-widget-container"></div>

<script>
const checkoutWidget = new window.SANTANDER_CHECKOUT_WIDGET(
  'checkout-widget-container',
  ${allStringified.slice(0, -1)}  }, (api) => {
    api.on({
      error: (data) => console.log(\`Error callback: \${data}\`),
    })
  }
);

// Api examples: (optional)
// You can add as many key=values as you like in each payload(object)
// Update config:
checkoutWidget.api.updateConfig({
  mode: 'classic',
});
// Update theme:
checkoutWidget.api.updateTheme({
  background: '#333333',
});
// Update payment details:
checkoutWidget.api.updatePaymentDetails({
  loanAmount: '45000',
});
</script>

</body>
</html>
`;

  // Returns a highlighted HTML string
  const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');
  return (
    <pre style={{ width: '855px' }}>
      <code>
        <div
          id="code-container"
          style={{
            padding: '10px',
            background: '#ffffff',
            textAlign: 'left',
            borderRadius: '5px',
            minHeight: '350px',
            border: '1px solid grey',
            marginBottom: '30px',
          }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </code>
    </pre>
  );
};

export default CodeSnippet;
