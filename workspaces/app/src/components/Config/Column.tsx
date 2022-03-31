import type { FC, ReactNode } from 'react';
import { Grid } from 'semantic-ui-react';

interface Props {
  children: ReactNode
}
const Column:FC<Props> = ({ children }) =>
  <Grid.Column>{children}</Grid.Column>;

export default Column;
