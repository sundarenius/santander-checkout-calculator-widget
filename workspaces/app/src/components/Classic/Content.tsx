import type { FC } from 'react';
import { Grid } from 'semantic-ui-react';
import Header from './Header';
import Body from './Body';
import { useAppSelector } from 'redux/redux-hooks';
import type {
  Theme,
  Translations,
  AmountOption,
  Config,
} from 'types/global-types';
import { useOffsetWidth } from 'utils/custom-hooks';
import { setContainerHeight } from 'utils/helpers';

interface Props {
  id: string
}

const Content:FC<Props> = ({ id }): JSX.Element => {
  const theme: Theme = useAppSelector(({ context }) => context.theme);
  const shouldDisplayLogo: Config['displayLogo'] = useAppSelector(({ context }) =>
    context.config.displayLogo);
  const translations: Translations = useAppSelector(({ context }) => context.translations);
  const amountOptions: Array<AmountOption> = useAppSelector(({ paymentDetails }) =>
    paymentDetails.amountOptions);

  const width = useOffsetWidth(id);
  setContainerHeight(width, id);

  return (
    <Grid
      padded
      style={{ height: '100%' }}
      textAlign="center"
      columns={2}
      stretched
      verticalAlign="middle"
    >
      <Header
        width={width}
        theme={theme}
        translations={translations}
        amountOptions={amountOptions}
        displayLogo={shouldDisplayLogo}
      />

      <Body
        translations={translations}
      />

      <Grid.Row
        columns={1}
        textAlign="left"
      >
        <Grid.Column textAlign="left">
          <p style={{ fontSize: theme.footerFontSize }}>{ translations.footer }</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Content;
