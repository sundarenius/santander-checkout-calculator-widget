import type { FC } from 'react';
import type { Config } from 'types/global-types';
import {
  Mode,
  LocaleIds,
  LabelPosition,
  Countries,
} from 'types/global-types';
import { Grid, Select, Input } from 'semantic-ui-react';
import Label from './Label';
import Column from './Column';
import { getOptions } from './configUtils';

interface Props {
  config: Config,
  setConfig: (config: Partial<Config>) => void
}

const selects:Record<string, any> = {
  mode: Mode,
  localeId: LocaleIds,
  displayLogo: [true, false],
  labelPosition: LabelPosition,
  country: Countries,
};

const ConfigContent:FC<Props> = ({
  config,
  setConfig,
}): JSX.Element => {
  const exclude = [
    'defaultLocaleId',
  ];
  const entries = Object.entries(config).filter((val) => !exclude.includes(val[0]));
  const selectsKeys = Object.keys(selects);

  return (
    <>
      {
      entries.map((key, index) => {
        if (index % 3 === 0 && !exclude.includes(key[0])) {
          return (
            <Grid doubling stackable key={key[0]} columns={3}>
              {
                entries.map((k, i) => {
                  if (i >= index && i <= (index + 2)) {
                    return selectsKeys.includes(k[0])
                      ? (
                        <Column key={k[0]}>
                          <Label text={k[0]} />
                          <Select
                            defaultValue={k[1]}
                            placeholder={k[0]}
                            options={getOptions(k[0], selects)}
                            onChange={(e, val: any) =>
                              setConfig({ [val.placeholder]: val.value })}
                          />
                        </Column>
                      )
                      : (
                        <Column key={k[0]}>
                          <Label text={k[0]} />
                          <Input
                            defaultValue={k[1]}
                            placeholder={k[0]}
                            onChange={(e, val: any) =>
                              setConfig({ [val.placeholder]: val.value })}
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
    </>
  );
};

export default ConfigContent;
