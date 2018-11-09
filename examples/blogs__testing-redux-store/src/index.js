import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'todomvc-app-css/index.css';
import * as actions from './actions';
import App from './components/App';
import reducer from './reducers';

const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

window.store = store
window.actions = actions
