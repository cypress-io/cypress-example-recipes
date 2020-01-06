import React, { Component } from 'react'

export default class Greeting extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      greeting: 'Hello'
    }
  }

  render () {
    return (
      <div aria-label='greeting'>
        <p>{this.state.greeting} World</p>
        <button onClick={this.updateGreeting.bind(this)}>
          Update greeting
        </button>
      </div>
    )
  }

  updateGreeting () {
    this.setState({
      greeting: 'Bonjour'
    })
  }
}
