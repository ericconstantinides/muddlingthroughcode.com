import scrollActivation from './scroll-activation'
import React from 'react'
import ReactDOM from 'react-dom'

import Post from './components/post.js'

// ReactDOM()

const App = () => {
  return (
    <div>
      <Post />
    </div>
  )
}

// the <App /> renders a new instance of App, from the factory above
ReactDOM.render(<App />, document.getElementById('reactApp'))


// NOTES
//
// Remember, 1 COMPONENT PER FILE
//