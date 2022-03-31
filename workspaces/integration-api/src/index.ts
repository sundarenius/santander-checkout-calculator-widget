import sharedData from '@santander-calculator-widget/shared/shared-data.json';
import { Theme } from '@santander-calculator-widget/app/src/types/global-types';
import type { ApiConfig, PaymentDetails } from './utils/types';
import { environment, hostedUrls, iframeId } from './utils/types';
import { buildUrl, initApiCallbacks } from './utils/helpers';

const { measures } = sharedData;

interface Configs extends Partial<ApiConfig> {
  theme?: Partial<Theme>,
  paymentDetails?: Partial<PaymentDetails>
}

const SANTANDER_CHECKOUT_WIDGET = class {
  private elId: string;
  private config: Partial<ApiConfig>;
  private theme: Partial<Theme>;
  private paymentDetails: Partial<PaymentDetails>;
  private iframeUrl: string;
  private hostedOrigin: string;
  private containerHeight: string = measures.height;
  private containerWidth: string = measures.width;
  public api = {};

  constructor (elId: string, configs: Configs, api: (a: any) => void) {
    const config = { ...configs };
    const theme = { ...configs.theme && { ...configs.theme } };
    const paymentDetails = { ...configs.paymentDetails && { ...configs.paymentDetails } };
    delete config.theme;
    delete config.paymentDetails;

    if (api) {
      initApiCallbacks(api);
    }

    this.elId = elId;
    this.config = config;
    this.theme = theme;
    this.paymentDetails = paymentDetails;
    this.hostedOrigin = this.setEnvironment();
    this.iframeUrl = this.getNewUrl();
    this.setIFrameData();
    this.api = this.createApi();
  }

  getNewUrl () {
    return buildUrl(this.hostedOrigin, this.config, this.theme, this.paymentDetails);
  }

  setIFrameData () {
    this.setFrameAndContainerMeasures({
      containerHeight:
        this.config.containerHeight
        || this.containerHeight,
      containerWidth: this.config.containerWidth || this.containerWidth,
    });
    this.buildIframe();
  }

  createApi () {
    const update = () => {
      this.iframeUrl = this.getNewUrl();
      this.setIFrameData();
    };
    return {
      updateConfig: (payload: Partial<ApiConfig>) => {
        this.config = { ...this.config, ...payload };
        update();
      },
      updateTheme: (payload: Partial<Theme>) => {
        this.theme = { ...this.theme, ...payload };
        update();
      },
      updatePaymentDetails: (payload: Partial<PaymentDetails>) => {
        this.paymentDetails = { ...this.paymentDetails, ...payload };
        update();
      },
    };
  }

  setEnvironment (): string {
    if (this.config.environment && this.config.environment === environment.DEVELOPMENT) {
      return hostedUrls.DEVELOPMENT;
    }
    return hostedUrls.PRODUCTION;
  }

  buildIframe () {
    const container: HTMLElement | null = document.querySelector(`#${this.elId}`);
    const iframe = document.createElement('iframe');
    // Add attributes
    iframe.src = this.iframeUrl;
    iframe.id = iframeId;
    iframe.style.height = this.containerHeight;
    iframe.style.width = this.containerWidth;
    iframe.style.border = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    if (container) {
      container.innerHTML = '';
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.height = this.containerHeight;
      container.style.maxWidth = this.containerWidth;
      container.style.width = '100%';
      if (this.config.iframeHeight) {
        container.style.minHeight = this.config.iframeHeight;
        iframe.style.minHeight = this.config.iframeHeight;
      }
      container.appendChild(iframe);
    }
  }

  increaseFrameMeasures (pxMeasure: string): string {
    const asInt = Number(pxMeasure.split('px')[0]);
    return `${asInt + 10}px`;
  }

  setFrameAndContainerMeasures ({ containerHeight, containerWidth }:
  {
    containerHeight: string,
    containerWidth: string
  }) {
    if (containerHeight) {
      this.containerHeight = this.increaseFrameMeasures(containerHeight);
    }
    if (containerWidth) {
      this.containerWidth = this.increaseFrameMeasures(containerWidth);
    }
  }
};

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
      SANTANDER_CHECKOUT_WIDGET: typeof SANTANDER_CHECKOUT_WIDGET
    }
}

window.SANTANDER_CHECKOUT_WIDGET = SANTANDER_CHECKOUT_WIDGET;
