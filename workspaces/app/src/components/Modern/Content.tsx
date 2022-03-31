import type { FC } from 'react';
import { Grid } from 'semantic-ui-react';
import { useAppSelector } from 'redux/redux-hooks';
import type {
  Config,
  Theme,
  Translations,
  AmountOption,
} from 'types/global-types';
import Header from './Header';
import Selections from './Selections';
import Footer from './Footer';
import { useOffsetWidth } from 'utils/custom-hooks';
import { setContainerHeight } from 'utils/helpers';

interface Props {
  id: string
}
const ModernContent:FC<Props> = ({ id }) => {
  const config: Config = useAppSelector(({ context }) => context.config);
  const theme: Theme = useAppSelector(({ context }) => context.theme);
  const translations: Translations = useAppSelector(({ context }) => context.translations);
  const amountOptions: Array<AmountOption> = useAppSelector(({ paymentDetails }) =>
    paymentDetails.amountOptions);

  const width = useOffsetWidth(id);
  setContainerHeight(width, id);

  return (
    <Grid
      // stackable
      padded
      stretched
      divided={false}
      columns={2}
      verticalAlign="middle"
      style={{ height: '100%' }}
    >
      <Header header={translations.header} config={config} headerFontSize={theme.headerFontSize} />

      <Selections
        translations={translations}
        theme={theme}
        labelPosition={config.labelPosition}
        amountOptions={amountOptions}
      />

      <Footer
        translations={translations}
        theme={theme}
      />

    </Grid>
  );
};

export default ModernContent;
