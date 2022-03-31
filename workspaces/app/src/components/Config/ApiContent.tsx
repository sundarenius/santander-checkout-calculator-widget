import type { FC, SyntheticEvent } from 'react';
import { useReducer, useState } from 'react';
import { Grid, Input, Button } from 'semantic-ui-react';
import Column from './Column';

const ApiContent:FC = (): JSX.Element => {
  const entries = [
    [
      'updateConfig',
      '',
    ],
    [
      'updateTheme',
      '',
    ],
    [
      'updatePaymentDetails',
      '',
    ],
  ];

  const initialState:Record<string, string> = {
    updateConfig: '',
    updateTheme: '',
    updatePaymentDetails: '',
  };

  const reducer = (state: typeof initialState, payload: Record<string, string>) => ({
    ...initialState,
    ...payload,
  });

  const [state, dispatch] = useReducer(reducer, initialState);
  const [latestEvent, setLatestEvent] = useState(['', '', '']);

  const handleClick = (type: string) => {
    const splitted = state[type].split(':').map((val) => val.trim());
    if (splitted.length > 0) {
      window.checkoutWidget.api[type]({
        [splitted[0]]: splitted[1],
      });

      setLatestEvent([
        `checkoutWidget.api.${type}(`,
        '{',
        `${splitted[0]}: ${splitted[1]}`,
        '}',
        ');',
      ]);
    }
  };

  const handleChange = (e: SyntheticEvent, val: any) => {
    dispatch({
      [val.id]: val.value,
    });
  };

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
                    return (
                      <Column key={k[0]}>
                        <span
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            fontSize: '11px',
                          }}
                        >
                          API: {k[0]}. ex: &quot;key: value&quot;
                        </span>
                        <Input
                          id={k[0]}
                          defaultValue={k[1]}
                          placeholder={k[0]}
                          onChange={handleChange}
                        />
                        <Button
                          style={{
                            marginTop: '20px',
                            width: '200px',
                            fontSize: '12px',
                            padding: '10px 0',
                          }}
                          onClick={() => handleClick(k[0])}
                        >
                          Trigger update
                        </Button>
                      </Column>
                    );
                  }
                  return null;
                })
              }
              { latestEvent[0].length > 0
                && (
                <div style={{
                  position: 'absolute',
                  top: '140px',
                  left: '30px',
                  textAlign: 'left',
                  background: 'white',
                  padding: '0 10px',
                  borderRadius: '10px',
                  border: '1px solid grey',
                }}
                >
                  {
                  latestEvent.map((val: string) => (
                    <p style={{ marginBottom: '1px' }} key={Math.random()}>{val}</p>
                  ))
                }
                </div>
                )}
            </Grid>
          );
        }
        return null;
      })
    }
    </>
  );
};

export default ApiContent;
