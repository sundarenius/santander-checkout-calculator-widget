// eslint-disable-next-line import/prefer-default-export
import { EventTypes } from 'types/global-types';

const sendPostMessage = (data:Record<string, any>) => {
  window.parent.postMessage(data, '*');
};

export const errorCallback = (err: string) => {
  sendPostMessage({
    eventType: EventTypes.SANTANDER_CALCULATOR_ERROR,
    payload: err,
  });
};
