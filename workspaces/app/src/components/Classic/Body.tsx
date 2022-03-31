import type { FC } from 'react';
import { Grid } from 'semantic-ui-react';
import { useAppSelector } from 'redux/redux-hooks';
import type {
  Translations,
  PaymentDetailsState,
  Countries,
} from 'types/global-types';
import { toPascalCase } from 'utils/helpers';
import { useCalculate } from 'utils/custom-hooks';

interface Props {
  translations: Translations
}

const Body:FC<Props> = ({ translations }): JSX.Element => {
  const {
    selectedAmount,
    loanAmount,
    nomInterestRate,
    startupFee,
    termFee,
  }: PaymentDetailsState = useAppSelector(({ paymentDetails }) => paymentDetails);
  const months: number = useAppSelector(({ paymentDetails }) => paymentDetails.months);
  const country: Countries = useAppSelector(({ context }) => context.config.country);
  const countrySpecifics: any = useAppSelector(({ paymentDetails }) =>
    paymentDetails.countrySpecifics);

  const mergedWithCountry = {
    nomInterestRate,
    termFee,
    startupFee,
    ...countrySpecifics
      && countrySpecifics
      && countrySpecifics[country]
      && { ...countrySpecifics[country] },
  };

  const {
    fixedTotalAmount,
    fixedTotalCost,
    effectiveInterestRate,
  } = useCalculate({
    selectedAmount,
    loanAmount,
    nomInterestRate: mergedWithCountry.nomInterestRate,
    startupFee: mergedWithCountry.startupFee,
    termFee: mergedWithCountry.termFee,
  });

  return (
    <>
      <MyGrid
        typeOne={toPascalCase(translations.months)}
        valueOne={`${months} ${translations.monthsAlias}`}
        typeTwo={translations.effectiveInterestRateAlias}
        valueTwo={`${effectiveInterestRate}%`}
      />

      <MyGrid
        typeOne={translations.inTotal}
        valueOne={fixedTotalAmount}
        typeTwo={translations.cost}
        valueTwo={fixedTotalCost}
      />
    </>
  );
};

interface MyGridProps {
  typeOne: string,
  valueOne: string
  typeTwo: string,
  valueTwo: string
}

const MyGrid: FC<MyGridProps> = ({
  typeOne,
  valueOne,
  typeTwo,
  valueTwo,
}) => (
  <Grid.Row>
    <Grid.Column width={8}>
      <Grid verticalAlign="middle">
        <Grid.Row columns={2}>
          <Grid.Column textAlign="left">
            <p>{ typeOne }:</p>
          </Grid.Column>
          <Grid.Column textAlign="left">
            <p>{ valueOne }</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Grid.Column>

    <Grid.Column width={8}>
      <Grid verticalAlign="middle">
        <Grid.Row columns={9}>
          <Grid.Column width={8} textAlign="left">
            <p>{ typeTwo }:</p>
          </Grid.Column>
          <Grid.Column width={8} textAlign="left">
            <p>{ valueTwo }</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Grid.Column>
  </Grid.Row>
);

export default Body;
