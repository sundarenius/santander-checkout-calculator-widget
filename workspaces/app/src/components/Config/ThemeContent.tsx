import type { FC } from 'react';
import type { Theme } from 'types/global-types';
import { Grid, Input, Select } from 'semantic-ui-react';
import Label from './Label';
import Column from './Column';
import { getOptions } from './configUtils';

const selects:Record<string, any> = {
  raised: [0, 1, 2],
};

interface Props {
  theme: Theme,
  setTheme: (theme: Partial<Theme>) => void
}

const ThemeContent:FC<Props> = ({
  theme,
  setTheme,
}): JSX.Element => {
  const entries = Object.entries(theme);
  const selectsKeys = Object.keys(selects);

  return (
    <>
      {
      entries.map((key, index) => {
        if (index % 3 === 0) {
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
                              setTheme({ [val.placeholder]: val.value })}
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
                              setTheme({ [val.placeholder]: val.value })}
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

export default ThemeContent;
