import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

export const store = createStore(reducer)

export const StoreProvider = ({ children }) => (<Provider store={store}>{children}</Provider>)

// expose store during tests
// if this were a class, we could use our class decorator
// to expose the singleton automatically
/* istanbul ignore else */
if (window.Cypress) {
  window.store = store
}
