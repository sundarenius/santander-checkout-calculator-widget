import type { FC } from 'react';
import { Grid } from 'semantic-ui-react';
import type { Config } from 'types/global-types';
import Logo from '../Logo';

interface Props {
  config: Config,
  header: string,
  headerFontSize: string
}

const Header:FC<Props> = ({ config, header, headerFontSize }) => {
  const { displayLogo: shouldShowLogo } = config;
  const isFontInt: boolean = typeof headerFontSize === 'number';

  const fontSize = {
    fontSize: isFontInt ? `${headerFontSize}px` : headerFontSize,
  };

  return (
    <Grid.Row>
      <Grid.Column width={10} textAlign="left">
        <p style={fontSize}>{ header }</p>
      </Grid.Column>
      { shouldShowLogo && (
        <Grid.Column width={6} style={{ placeItems: 'flex-end' }} textAlign="right">
          <Logo />
        </Grid.Column>
      )}
    </Grid.Row>
  );
};

export default Header;
