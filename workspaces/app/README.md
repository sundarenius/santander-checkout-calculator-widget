This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Dependencies

This project is built with:

* TypeScript
* React
* SemanticUI - <https://react.semantic-ui.com/>
* Redux (Redux-toolkit)
* Webpack
* ES6 and Node

## App structure

The app contains three different paths, `/modern`, `/classic`, and `/config`.

Modern and classic paths are set via the `mode=modern|classic` option and the config page is for configurating the widget with all the different options.

The options are set via url parameters.

Eg: `http://localhost:3000/?containerHeight=150px&containerWidth=450px&logoHeight=20px&mode=modern&localeId=en_GB`

When bootstrapping via the integration api. You add configs via a config object and it will generate a url like the above as an iframe.

All options are documentated at `src/types/global-types.ts` and initial states are set in `initialStates.ts`.

## Style guide for this project
We're following the `Google TypeScript Style Guide` for naming conventions found in the following link:
`https://google.github.io/styleguide/tsguide.html`
[Google TS style guide](https://google.github.io/styleguide/tsguide.html)

Read this before start working in this project.

To break it down very briefly ..

````
PascalCase: TheMilleniumFalcon ->	class / interface / type / enum / decorator / type parameters
lowerCamelCase: theMilleniumFalcon ->	variable / parameter / function / method / property / module alias
CONSTANT_CASE: THE_MILLENIUM_FALCON ->	global constants, enums properties
#ident	private identifiers are never used.

* Abbreviations: Treat abbreviations like acronyms in names as whole words, i.e. use loadHttpUrl, not loadHTTPURL, unless required by a platform name (e.g. XMLHttpRequest).
* Dollar sign: Identifiers should not generally use $, except when aligning with naming conventions for third party frameworks.
* Type parameters: Type parameters, like in Array<T>, may use a single upper case character (T) or UpperCamelCase.
* Test names: Test method names in Closure testSuites and similar xUnit-style test frameworks may be structured with _ separators, e.g. testX_whenY_doesZ().
* _ prefix/suffix: Identifiers must not use _ as a prefix or suffix.
* Imports: Module namespace imports are lowerCamelCase while files are lower-kebab-case, which means that imports correctly will not match in casing style, such as
`import * as fooBar from './foo-bar'`. React component files are the exception here, those files should be PascalCase.jsx
````

## Unit testing
(No unit testing has been added .. yet .. but this is the guidelines if we add some)
We are using jest and react-testing-library for our unit tests. We want to follow react-testing-library best practices for this. So make sure to read through the docs.

https://testing-library.com/docs/react-testing-library/example-intro

React testing library encourages the tester to test DOM output and not function implementations, testing output is what user cares about, and testing code
implementations makes it harder to refactor code.

React Testing Library aims to test the component, like how users would, users see the button, heading, form and other elements by their role, not by their id or class, or element tag name. When you use React Testing Library, you should NOT try to access the DOM like how you would do by document.querySelector API (which you can incidentally use in your tests, but it's not recommended for the reasons stated in this paragraph).

See the lists of available queries to use instead of document.querySelector..
https://testing-library.com/docs/queries/about/

There is also some custom jest matchers that you can use to extend jest's expect api. These will make your tests more declarative, clear to read and to maintain.

Link:
https://github.com/testing-library/jest-dom

For triggering user events you should include the user-event library in most cases. See available events on its Github repo:
https://github.com/testing-library/user-event#table-of-contents

Can also use the built in fireEvent API from testing-library:
https://testing-library.com/docs/dom-testing-library/api-events/

````
if your test uses instance() or state(), know that you're testing things that the user couldn't possibly know about or even care about, which will take your tests further from giving you confidence that things will work when your user uses them. Kent C. Dodds
````

You can unit test over docker with following commands:
`docker build -f Dockerfile.jest -t jest/bo2 .` // Builds a new image based on Dockerfile.jest
`docker run --ipc=host --shm-size=2500M --name jest-test --rm -i jest/bo2 yarn test` // Starts a new container with above image and runs `yarn test`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
