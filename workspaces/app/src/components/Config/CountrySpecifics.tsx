import type { FC } from 'react';
import { useState } from 'react';
import type { PaymentParams } from 'types/global-types';
import Editor from 'react-simple-code-editor';
import prismjs from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import {
  Divider,
  Button,
} from 'semantic-ui-react';

interface Props {
  paymentDetails: PaymentParams,
  setPaymentDetails: (pm: Partial<PaymentParams>) => void
}

const CountrySpecifics:FC<Props> = ({
  paymentDetails,
  setPaymentDetails,
}): JSX.Element => {
  const [countrySpecificCode, updateCountrySpecificCode] = useState(paymentDetails.countrySpecifics
    ? JSON.stringify(paymentDetails.countrySpecifics, null, 2)
    : '');

  const setCountrySpecificCode = (code: string) => {
    updateCountrySpecificCode(code);
    setPaymentDetails({
      countrySpecifics: JSON.parse(code),
    });
  };

  const addDefaultCountrySpecifics = () => {
    const code = {
      countrySpecifics: {
        SE: {
          nomInterestRate: 25,
          termFee: 50,
          startupFee: 99,
        },
        DK: {
          nomInterestRate: 11,
          termFee: 13,
        },
        NO: {},
        GB: {},
      },
    };
    setPaymentDetails(code);
    setCountrySpecificCode(JSON.stringify(code.countrySpecifics, null, 2));
  };

  return (
    <>
      <Divider />
      <div
        style={{
          marginLeft: '2%',
          marginBottom: '-25%',
        }}
      >
        <div style={{
          textAlign: 'left',
          marginBottom: '20px',
        }}
        >
          <p>You can add country specific payment details if you wish.</p>
          <p>
            The countrySpecific needs to have a key of a valid and supported
            country code found in Config-&gt;country.
            If no countrySpecifics is found,
            it fallbacks to default values or the ones set in payment details (above).
          </p>
          <p>
            All keys in countrySpecifics are optional.
            Means one could pass in only one of those keys and leave the rest as default.
          </p>
          <p>Available keys for each country are: nomInterestRate, termFee, and startupFee.</p>
          <p>The below editor accepts JSON input with no dangling commas,
            you might wanna adjust/or add data manually from the generated codesnippet instead.
            Click &quot;Add example countrySpecifics&quot; and see &quot;Codesnippets&quot; page.
          </p>
        </div>
        <Editor
          value={countrySpecificCode}
          onValueChange={(code) => setCountrySpecificCode(code)}
          highlight={(code) => prismjs.highlight(code, prismjs.languages.js, '')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            background: '#ffffff',
            borderRadius: '4px',
            border: '1px solid #21ba45',
            minHeight: '250px',
          }}
          placeholder={countrySpecificsPlaceholder}
        />
        <Button
          onClick={addDefaultCountrySpecifics}
          style={{
            marginLeft: '2.5%',
            position: 'absolute',
            left: '2%',
            marginTop: '20px',
          }}
          primary
        >
          Add example countrySpecifics
        </Button>
      </div>
    </>
  );
};

const countrySpecificsPlaceholder = `Example of countrySpecifics key=value:
{
  SE: {
    nomInterestRate: 26,
    termFee: 100,
    startupFee: 99,
  },
  NO: {
    nomInterestRate: 11,
    termFee: 13,
  },
}
`;

export default CountrySpecifics;
