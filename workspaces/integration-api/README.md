# 🚀 Santander checkout widget integration api

This project has been created using **webpack-cli**, you can now run

```
npm run build
```

or

```
yarn build
```

to bundle your application

## How to

This is a frontend API to be integrated to users browser via html code.

This script will create an iframe for the widget and add all the configs as url parameters.

We have a config page from the app where you can set all the different configurations. Navigate to `/config` in the widget app.

Example code:
````
<script type=text/javascript src='{hosted script generated in /dist folder}'></script>

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
          "loanAmount": 25000,
          "countrySpecifics": {
            SE: {
              nomInterestRate: 45,
              termFee: 111,
              startupFee: 99,
            },
            DK: {
              nomInterestRate: 11,
              termFee: 13,
            }
          }
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
<body>
````

The third argument with the API that currently contains an error callback is optional.

One could also add `countrySpecifics` payment details as in the example above that will take place when it matches the `country` option.

The countrySpecific needs to have a key of a valid and supported country code in the app. 
If no countrySpecifics is found, it fallbacks to default values or the ones set in payment details.

ex:
```
 countrySpecifics: {
   NO: {
    nomInterestRate: 19,
    termFee: 10
    startupFee: 0
   }
   SE: {},
   DK: {},
   GB: {}
 }
```
All keys in countrySpecifics are optional.
Means one could only pass in only one of those keys and leave the rest as default.
