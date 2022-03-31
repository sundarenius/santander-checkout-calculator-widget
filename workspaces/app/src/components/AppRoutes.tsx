import type { FC } from 'react';
import { lazy, Suspense } from 'react';
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { Paths, Mode } from 'types/global-types';
import type { Measures } from 'types/global-types';
import { useAppSelector } from 'redux/redux-hooks';
import Loader from 'components/Loader';

const Modern = lazy(() => import('pages/Modern'));
const ConfigPage = lazy(() => import('pages/Config'));
const Classic = lazy(() => import('pages/Classic'));

const AppRoutes: FC = (): JSX.Element => {
  const history:any = useHistory();
  const containerHeight: Measures = useAppSelector(({ context }) => context.config.containerHeight);
  const containerWidth: Measures = useAppSelector(({ context }) => context.config.containerWidth);
  const mode: Mode = useAppSelector(({ context }) => context.config.mode);

  initRoutePush(history, mode);

  return (
    <Switch>
      <Suspense fallback={<Loader containerHeight={containerHeight} containerWidth={containerWidth} />}>
        <Route exact path={Paths.CONFIG} component={ConfigPage} />
        <Route exact path={Paths.CLASSIC} component={Classic} />
        <Route exact path={Paths.MODERN} component={Modern} />
      </Suspense>
    </Switch>
  );
};

const initRoutePush = (history: any, mode: Mode): void | null => {
  const isConfigPath: boolean = history.location.pathname === Paths.CONFIG;
  if (isConfigPath) return null;

  // If mode is not set but modern or classic is set as path, resolve to that path.
  if (history.location.search === ''
      && (history.location.pathname === Paths.MODERN || history.location.pathname === Paths.CLASSIC)) {
    return null;
  }

  const historyPush = (path: string) => history.push(path + history.location.search);

  switch (mode) {
    case Mode.MODERN:
    default:
      historyPush(Paths.MODERN);
      break;
    case Mode.CLASSIC:
      historyPush(Paths.CLASSIC);
      break;
  }
};

export default AppRoutes;
