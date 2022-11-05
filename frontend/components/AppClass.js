import React from 'react'
import axios from 'axios'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  state = initialState

  getXY = () => {
    const { index } = this.state
    const x = (index % 3) + 1
    let y
    if (index < 3) y = 1
    else if (index < 6) y = 2
    else if (index < 9) y = 3
    return [x, y]
  }

  getXYMessage = () => {
    const [x, y] = this.getXY()
    return `Coordinates (${x}, ${y})`
  }

  reset = () => {
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    const { index } = this.state
    switch (direction) {
      case 'up':
        return (index < 3) ? index : index - 3
      case 'down':
        return (index > 5) ? index : index + 3
      case 'left':
        return (index % 3 === 0) ? index : index - 1
      case 'right':
        return ((index - 2) % 3 === 0) ? index : index + 1
    }
  }

  move = (evt) => {
    const direction = evt.target.id
    const nextIndex = this.getNextIndex(direction)
    if (nextIndex !== this.state.index) {
      this.setState({
        ...this.state,
        steps: this.state.steps + 1,
        message: initialMessage,
        index: nextIndex,
      })
    } else {
      this.setState({
        ...this.state,
        message: `You can't go ${direction}`,
      })
    }
  }

  onChange = (evt) => {
    const { value } = evt.target
    this.setState({ ...this.state, email: value })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    const [x, y] = this.getXY()
    const { email, steps } = this.state
    let message
    axios.post('http://localhost:9000/api/result', { email, steps, x, y })
      .then(res => {
        message = res.data.message
      })
      .catch(err => {
        message = err.response.data.message
      })
      .finally(() => {
        this.setState({
          ...this.state,
          message,
          email: initialEmail,
        })
      })
  }

  render() {
    const { steps, index, message, email } = this.state
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{`You moved ${steps} time${steps == 1 ? '' : 's'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx == index ? ' active' : ''}`}>
                {idx == index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" onChange={this.onChange} value={email} type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}