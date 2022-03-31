# Santander checkout widget

This project is a monorepo and uses yarn workspaces and thus share a commong node_modules folder at root.

Each workspace has the ability to import each other like they were modules, we do this to structure this project and to share
data across all workspaces from shared folder (width and height).

workspaces/app contains all our frontend application code.
workspaces/integration-api contains the bootstrapper code.
workspaces/shared are made to have data that should be shared between the workspaces.

Eslint might give you some "import/no-unresolved" errors if you dont open those folders as root folders when working in your IDE.

The app has 3 different routes/modes.

/modern -> modern UI
/classic -> classic UI
/config -> a sandbox page to play around with configs and get a codesnippet example that can be used by merchants.

A side note:
The converting to other currencies than NOK is statically set based on the currencies values from `5th july 2021`.

This could be updated once in a while or utilize some API. The logic of this can be found at:
`workspaces/app/src/utils/payment-helpers.ts` -> convertToNOK()

## Maintainers

This project was built by Håkan Sundström and is currently maintained by Håkan Sundström.
You can contact him on Slack @hakansundstrom or e-mail hakan.sundstrom@bambora.com or sundarenius@gmail.com.

## (workspaces/app) dependencies

* TypeScript
* React - react hooks
* Semantic UI React - <https://react.semantic-ui.com/>
* Node
* Redux toolkit
* CRA
* Eslint (airbnb + additional rules)

## (workspaces/integration-api) dependencies

* TypeScript
* Webpack
* Eslint (airbnb + additional rules)

## Deployment

Build the integration script at workspaces/integration-api and host the file genertaed in dist/santander-calculator-widget-bootstrapper.js.
An example can be found at workspaces/integration-api/index.html.

You also need to build the app at workspaces/app. You should deploy and host the generated folder ´/build´.

The endpoint of the hosted app must be updated in integration-api project:
workspaces/integration-api/src/utils/types.ts -> hostedUrls -> PRODUCTION.

# Merchant integration guide

An example integration can be found at `workspaces/integration-api/index.html`.

The script url has to be the same url that you are hosting the intergation script found in:
`workspaces/integration-api/dist/santander-calculator-widget-bootstrapper.js.`

1. A script tag with the `santander-calculator-widget-bootstrapper.js` inside head element.
2. A empty div tag with an id={someId}
3. Another script tag with a call to new window.SANTANDER_CHECKOUT_WIDGET with first paremter matching ${someId} from div tag, second parameter with configs,
third parameter with API callbacks (errors mostly, but this can be enhanced).

You can also go directly to app url to the /config path and get a working codesnippet. (Like below for example).

Example:
````
<!DOCTYPE html>
<html>
<head>
<script
  type=text/javascript
  src='https://static.paymentiq.io/santander-calculator-widget-bootstrapper.js'
></script>
<body>

  <div id="checkout-widget-container"></div>

<script>
const checkoutWidget = new window.SANTANDER_CHECKOUT_WIDGET(
  'checkout-widget-container',
  {
    "iframeHeight": "225px",
    "theme": {
        "font": "Roboto, sans-serif, https://fonts.googleapis.com/css2?family=Roboto&display=swap"
    },
    "paymentDetails": {
        "loanAmount": 25000
    }
  }, (api) => {
    api.on({
      error: (data) => console.log(`Error callback: ${data}`),
    })
  }
);

// Api examples: (optional)
// You can add as many key=values as you like in each payload(object)
// Update config:
checkoutWidget.api.updateConfig({
  mode: 'classic',
});
// Update theme:
checkoutWidget.api.updateTheme({
  background: '#333333',
});
// Update payment details:
checkoutWidget.api.updatePaymentDetails({
  loanAmount: '45000',
});
</script>

</body>
</html>
````
