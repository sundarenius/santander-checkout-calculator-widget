import ReactDOM from 'react-dom';
import './styles/index.css';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
