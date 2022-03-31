import type { FC } from 'react';
import { useAppSelector, useAppDispatch } from 'redux/redux-hooks';
import type { Theme, Config, PaymentDetailsState } from 'types/global-types';
import { Mode } from 'types/global-types';
import { isIframed } from 'utils/helpers';
import { paymentActions } from 'redux/actions';
import type { AppDispatch } from 'redux/store';
import { getPaymentIntervals } from 'utils/payment-helpers';
import { Container } from 'semantic-ui-react';

const getBoxShadow = (raised: number) => {
  const boxShadowOne = '0 1px 2px 0 rgb(34 36 38 / 15%)';
  const boxShadowTwo = '0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%)';
  return raised === 1 ? boxShadowOne : boxShadowTwo;
};

const containerStyles = (theme: Theme, config: Config) => {
  const raised = Number(theme.raised) ? getBoxShadow(Number(theme.raised)) : '';
  const splittedFont = theme.font.split(',');
  const fontFamily = splittedFont
    .filter((val) => !val.includes('http')).join(',');

  return {
    maxHeight: config.containerHeight,
    height: '100vh',
    border: '1px solid',
    borderColor: theme.border,
    background: theme.background,
    color: theme.text,
    borderRadius: theme.borderRadius,
    WebkitBoxShadow: raised,
    boxShadow: raised,
    padding: config.mode === Mode.MODERN ? '10px' : '5px 0',
    fontFamily,
  };
};

const sectionStyles = (config: Config) => ({
  maxWidth: config.containerWidth,
  margin: isIframed() ? '15px' : '3px',
});

interface Props {
  id: string
  content: FC<{id: string}>
}

const WidgetContainer: FC<Props> = ({ id, content: Content }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useAppSelector(({ context }) => context.theme);
  const config: Config = useAppSelector(({ context }) => context.config);
  const loanAmount: PaymentDetailsState['loanAmount'] = useAppSelector(({ paymentDetails }) =>
    paymentDetails.loanAmount);
  const error: string|null = useAppSelector(({ context }) => context.error);

  dispatch(paymentActions.setAmountOptions(getPaymentIntervals(loanAmount, config.country)));

  return (
    <section style={sectionStyles(config)}>
      <Container id={id} style={containerStyles(theme, config)}>
        { error === null
          ? <Content id={id} />
          : <p>Error: { error }</p> }
      </Container>
    </section>
  );
};

export default WidgetContainer;
