import type { DropdownItemProps } from 'semantic-ui-react';
/* eslint-disable import/prefer-default-export */
type GetOptions = (k: string, selects: Record<string, any>) => Array<DropdownItemProps>
export const getOptions: GetOptions = (key, selects) => Object.values(selects[key])
  .map((val: any) => ({
    key: val,
    value: val,
    text: val.toString(),
  }));

type StripOutDefaults = <T>(obj: T, initialState: () => T) => Partial<T>
export const stripOutDefaults: StripOutDefaults = (obj, initialState) => {
  const settings:any = {};
  const entries = Object.entries(obj);
  const intial:Record<string, any> = initialState();
  entries.forEach((arr: [string, number|string]) => {
    const [key, value] = arr;
    if (value !== intial[key]) {
      settings[key] = value;
    }
  });
  return settings;
};
