import type { FC, SyntheticEvent } from 'react';
import { useEffect } from 'react';
import { Grid, Input, Dropdown } from 'semantic-ui-react';
import { useAppSelector, useAppDispatch } from 'redux/redux-hooks';
import type { AppDispatch } from 'redux/store';
import type {
  Translations,
  Theme,
  AmountOption,
} from 'types/global-types';
import { LabelPosition } from 'types/global-types';
import { amountOptionsFixed, toPascalCase } from 'utils/helpers';
import { paymentActions } from 'redux/actions';

interface Props {
  translations: Translations,
  theme: Theme,
  labelPosition: LabelPosition,
  amountOptions: Array<AmountOption>
}

const Selections:FC<Props> = ({
  translations,
  theme,
  labelPosition,
  amountOptions: a,
}) => {
  const dispatch: AppDispatch = useAppDispatch();

  const amountOptions = amountOptionsFixed(a);
  const months: number = useAppSelector(({ paymentDetails }) => paymentDetails.months);

  const monthsAlias = toPascalCase(translations.monthsAlias);

  const defaultValue = amountOptions[0].value;

  const updateSelectedAmount = (e: SyntheticEvent, { value }: any): void => {
    dispatch(paymentActions.setSelectedAmount(Number(value)));
  };

  useEffect(() => {
    dispatch(paymentActions.setSelectedAmount(defaultValue));
  }, [dispatch, defaultValue]);

  createStyleTag(
    theme.borderRadius,
    theme.font.split(',').filter((val) => !val.includes('http')).join(','),
    (labelPosition === LabelPosition.RIGHT),
  );

  return (
    <Grid.Row id="selections-modern-container" centered>
      <Grid.Column>
        <Dropdown
          labeled
          placeholder={translations.monthlyAmount}
          fluid
          selection
          defaultValue={defaultValue}
          options={amountOptions}
          onChange={updateSelectedAmount}
        />
      </Grid.Column>
      <Grid.Column>
        <Input
          labelPosition={labelPosition === LabelPosition.LEFT ? 'left corner' : 'right corner'}
          label={monthsAlias}
          disabled
          value={`${months} ${translations.months}`}
        />
      </Grid.Column>
    </Grid.Row>
  );
};

const createStyleTag = (borderRadius: string, font: string, labelRight?: boolean) => {
  const style = document.createElement('style');
  style.innerText = `
  .ui.input>input,
  .ui.fluid.dropdown {
    border-radius: ${borderRadius}!important;
  }
  #selections-modern-container .ui.corner.label {
    padding-top: 3.5px;
  }
  #selections-modern-container > div:nth-child(2) > div > input[type=text] {
    font-family: ${font};
  }
  ${labelRight ? `
  #selections-modern-container .ui.corner.label {
    width: 3.8em;
  }
    .ui.corner.label:after {
      position: absolute;
      content: "";
      right: -1px;
      top: 0;
      z-index: -1;
      width: 0;
      height: 0;
      background-color: transparent!important;
      border-top: 0 solid transparent;
      border-right: 6em solid transparent;
      border-bottom: 4em solid transparent;
      border-left: 0 solid transparent;
      border-right-color: inherit;
      transition: border-color .1s ease;
    }
  ` : `
  .ui.left.corner.label:after {
    border-top: 4em solid transparent;
    border-right: 4.8em solid transparent;
    border-bottom: 0 solid transparent;
    border-left: 0 solid transparent;
    border-top-color: inherit;
  }
  `}
  `;
  window.self.document.body.appendChild(style);
};

export default Selections;
