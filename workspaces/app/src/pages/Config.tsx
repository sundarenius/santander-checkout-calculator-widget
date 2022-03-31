import type { FC } from 'react';
import { useState, useReducer } from 'react';
import {
  Menu,
  Segment,
  Container,
  Grid,
  Button,
  Icon,
  Popup,
} from 'semantic-ui-react';
import Logo from 'components/Logo';
import ConfigContent from 'components/Config/ConfigContent';
import ThemeContent from 'components/Config/ThemeContent';
import PaymentDetailsContent from 'components/Config/PaymentDetailsContent';
import CodeSnippet from 'components/Config/CodeSnippet';
import LivePreview from 'components/Config/LivePreview';
import ApiContent from 'components/Config/ApiContent';
import {
  initialConfig,
  initialTheme,
  paymentDetailsAcceptedAsParams,
} from 'redux/initialStates';
import type { Config, Theme, PaymentParams } from 'types/global-types';
import 'prismjs/themes/prism-coy.css';

const styles = {
  background: 'rgb(245 245 245)',
};

const reducer = <State, Payload>() => (state: State, payload: Payload) => ({
  ...state,
  ...payload,
});

const ConfigPage:FC = () => {
  const [activeItem, setActiveItem] = useState('Config');
  const [hasRendered, setHasRendered] = useState(false);
  const [reload, newReload] = useReducer((state) => state + 1, 1);
  const [config, setConfig] = useReducer(reducer<Config, Partial<Config>>(), initialConfig());
  const [theme, setTheme] = useReducer(reducer<Theme, Partial<Theme>>(), {
    ...initialTheme(),
    // eslint-disable-next-line max-len
    font: 'Roboto, sans-serif, https://fonts.googleapis.com/css2?family=Roboto&display=swap',
  });
  const [paymentDetails, setPaymentDetails] = useReducer(
    reducer<PaymentParams, PaymentParams>(),
    {
      ...paymentDetailsAcceptedAsParams(),
      loanAmount: 25000, // as default loan amount,
      countrySpecifics: undefined,
    },
  );

  const sections: string[] = [
    'Config',
    'Theme',
    'Payment details',
    'Codesnippet',
    'Api',
  ];

  const handleItemClick = (e: any, { name }: Record<string, string>) =>
    setActiveItem(name);

  const openNewWindow = () => {
    const frame: HTMLIFrameElement | null = document.querySelector('#_CHECKOUT_WIDGET_IFRAME_');
    if (frame && frame.src) {
      window.open(frame.src);
    }
  };

  return (
    <Container id="config-page-container" style={{ width: '100vw' }}>
      <Menu attached="top" tabular>
        { sections.map((section) => (
          <Menu.Item
            key={section}
            name={section}
            active={activeItem === section}
            onClick={handleItemClick}
          />
        )) }

        <Header activeItem={activeItem} />

        <Menu.Menu position="right">
          <Menu.Item>
            <Logo />
            <Popup
              content="Reload widget"
              trigger={(
                <Button
                  onClick={newReload}
                  disabled={!hasRendered}
                  color="orange"
                  style={{
                    marginLeft: '15px',
                    marginRight: '15px',
                  }}
                  icon="sync"
                />
              )}
            />
            <Popup
              content="Open widget in new window"
              trigger={<Button onClick={openNewWindow} primary icon="window restore outline" />}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Segment
        style={{
          border: 'none',
          background: styles.background,
          height: '95vh',
          color: '#333333',
        }}
        attached="bottom"
      >
        <Grid style={{ minHeight: '75vh', background: styles.background }} columns={2}>
          <Grid.Row verticalAlign="middle" textAlign="center">
            <Grid.Column>
              { getContent({
                activeItem,
                config,
                setConfig,
                theme,
                setTheme,
                paymentDetails,
                setPaymentDetails,
              }) }
            </Grid.Column>
            <Grid.Column>
              <LivePreview
                setHasRendered={setHasRendered}
                reload={reload}
                config={config}
                theme={theme}
                paymentDetails={paymentDetails}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
};

const Header:FC<{ activeItem: string }> = ({ activeItem }) => {
  const getText = () => {
    switch (activeItem) {
      case 'Config':
      default:
        return 'Configuration options';
      case 'Theme':
        return 'Theme config options';
      case 'Payment details':
        return 'Set payment details';
      case 'Codesnippet':
        // eslint-disable-next-line max-len
        return 'HTML example of your configurations. Default values are not added.';
      case 'Api':
        // eslint-disable-next-line max-len
        return 'You can use the API to update configurations "on the fly". See Codesnippets page for an example';
    }
  };
  return (
    <p
      style={{
        fontSize: '14px',
        marginTop: '17px',
        marginLeft: '25px',
        background: '#f5f5f5',
        borderRadius: '5px',
        padding: '0px 5px',
      }}
    >
      <Icon name="info" />
      { getText() }
    </p>
  );
};

interface GetContent {
  activeItem: string,
  config: Config,
  setConfig: (config: Partial<Config>) => void,
  theme: Theme,
  setTheme: (theme: Partial<Theme>) => void,
  paymentDetails: PaymentParams,
  setPaymentDetails: (pm: PaymentParams) => void,
}
type GetContentType = (payload: GetContent) => JSX.Element;

const getContent: GetContentType = ({
  activeItem,
  config,
  setConfig,
  theme,
  setTheme,
  paymentDetails,
  setPaymentDetails,
}) => {
  switch (activeItem) {
    case 'Config':
    default:
      return (
        <ConfigContent
          config={config}
          setConfig={setConfig}
        />
      );
    case 'Theme':
      return (
        <ThemeContent
          theme={theme}
          setTheme={setTheme}
        />
      );
    case 'Payment details':
      return (
        <PaymentDetailsContent
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
        />
      );
    case 'Codesnippet':
      return (
        <CodeSnippet
          config={config}
          theme={theme}
          paymentDetails={paymentDetails}
        />
      );
    case 'Api':
      return <ApiContent />;
  }
};

const createStyleTag = () => {
  const style = document.createElement('style');
  style.innerText = `
#config-page-container .ui.input>input,
#config-page-container .ui.selection.dropdown {
  min-width: 12em;
  max-width: 15em;
  width: 240px;
}
#config-page-container > div.ui.top.attached.tabular.menu > a.active.item {
  background: ${styles.background};
}
#config-page-container > div.ui.bottom.attached.segment > div >
div > div:nth-child(1) > div.ui.doubling.stackable.one.column.grid > div > form {
  max-width: 400px!important;
  margin-bottom: -20%;
}
  `;
  window.self.document.body.appendChild(style);
};

createStyleTag();

export default ConfigPage;
