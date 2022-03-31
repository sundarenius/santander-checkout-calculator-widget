import type { FC } from 'react';
import { Placeholder } from 'semantic-ui-react';
import type { Measures } from 'types/global-types';

interface Props {
  containerWidth: Measures,
  containerHeight: Measures
}

const Loader:FC<Props> = ({ containerWidth, containerHeight }): JSX.Element => (
  <Placeholder style={{ width: containerWidth, height: containerHeight }}>
    <Placeholder.Image />
  </Placeholder>
);

export default Loader;
