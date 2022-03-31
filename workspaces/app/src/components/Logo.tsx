import type { FC } from 'react';
import { Image } from 'semantic-ui-react';
import { useAppSelector } from 'redux/redux-hooks';

interface Props {
  logoUrl?: string
}

const Logo:FC<Props> = ({ logoUrl: propLogo }) => {
  const logoUrl: string = useAppSelector(({ context }) => context.config.logoUrl);
  const logoHeight: string = useAppSelector(({ context }) => context.config.logoHeight);

  return (
    <Image
      style={{ height: logoHeight }}
      src={propLogo || logoUrl}
    />
  );
};

export default Logo;
