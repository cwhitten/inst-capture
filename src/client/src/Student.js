import React, { Component } from 'react'
import axios from 'axios'
import Twilio from 'twilio-video'

class Student extends Component {
  constructor (props) {
    super()
    console.log('p', props)
    this.state = props
    this.viewScreen = this.viewScreen.bind(this)
  }

  viewScreen () {
    console.log('view screen intent', this.state.track)
  }

  render () {
    if (!this.state) return null
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <a className="link dim black b f1 f-headline-ns tc db mb3 mb4-ns" title="Student">{this.state.name}</a>
        <a
          onClick={this.viewScreen}
          className="f6 link dim ba bw2 ph3 pv2 mb2 dib black center" href="#0">See Screen</a>
        <video></video>
      </div>
    )
  }
}

export default Student
