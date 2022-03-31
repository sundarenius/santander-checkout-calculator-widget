import type { FC } from 'react';
import type { PaymentParams } from 'types/global-types';
import {
  Grid,
  Input,
} from 'semantic-ui-react';
import Label from './Label';
import Column from './Column';
import CountrySpecifics from './CountrySpecifics';

interface Props {
  paymentDetails: PaymentParams,
  setPaymentDetails: (pm: Partial<PaymentParams>) => void
}

const PaymentDetailsContent:FC<Props> = ({
  paymentDetails,
  setPaymentDetails,
}): JSX.Element => {
  const paymentDetailsClone = {
    ...paymentDetails,
  };
  delete paymentDetailsClone.countrySpecifics;
  const entries = Object.entries(paymentDetailsClone);

  return (
    <>
      {
      entries.map((key, index) => {
        if (index % 3 === 0) {
          return (
            <Grid doubling stackable key={key[0]} columns={3}>
              {
                entries.map((k, i) => {
                  if (i >= index && i <= (index + 2)) {
                    return (
                      <Column key={k[0]}>
                        <Label text={k[0]} />
                        <Input
                          defaultValue={k[1]}
                          placeholder={k[0]}
                          onChange={(e, val: any) =>
                            setPaymentDetails({ [val.placeholder]: val.value })}
                        />
                      </Column>
                    );
                  }
                  return null;
                })
              }
            </Grid>
          );
        }
        return null;
      })
    }

      <CountrySpecifics
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
      />

    </>
  );
};

export default PaymentDetailsContent;
