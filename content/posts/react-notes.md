# New React Notes
In teaching myself React, these are my cheatsheet notes that I've taken. They are in no way complete, but they have helped me get off the ground using React.

## Components
There are 2 types of React components:
* **Functional Component** or **Stateless function** - Doesn't contain state. Start with this until you need something more
* **Class Component** - uses ES6 class structure; primary type which can contain state

### Functional Component
```
const MyComponent = () => {
  return (
    <div>
      [...JSX stuff...]
    </div>
  )
}
```

### Class Component
```
import React, { Component } from 'react'
class MyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div>
        [...JSX stuff...]
      </div>
    )
  }
}
```
* `{ Component }` is a fancy ES6 way to pull out React.Component
* if using `state`, it must be initialized in `constructor()`
* JSX must be wrapped in an element (in this case, `<div>`) or a self closing element (like an `<input />`)

### Component w/ Event Handler
```
class SearchBar extends Component {
  render() {
    return (
      <input onChange={this.onInputChange} />
    )
  }
  onInputChange(event) {
    console.dir(event.currentTarget)
  }
}
```
* _curly braces_ `{}` are used to compile the `JSX` as `JS`
* Don't use quotes around curly braces
* the `onChange` event handler is also a `prop`
* we use `this.onInputChange`  so it knows that its a function inside our class

[]:#((teaserBreak))

## State
State is a plain javascript object that is used to _record_ and _react_ to javascript events.

* Each class-based component has **its own state object**
* when component state is **changed, it auto re-renders itself and its children**

```
class SearchBar extends Component {
  constructor(props) {

    // this gives us the Components props
    super(props)

    // only place we'll use `this.state` to "initialize"
    this.state = { searchTerm: '' }
  }
  render() {
    return (
      <input onChange={event => this.setState({ searchTerm: event.target.value })} />
    )
  }
}
```
* `this` is uninitialized inside `constructor()` if `super()` is not called
* thus, if you call `constructor()` **you must call** `super()`
* Call `super(props)` (as opposed to `super()`) only if you need `this.props` inside of `constructor(props)`

## Fleshed out Component
```
class SearchBar extends Component {
  constructor(props) {

    // this gives us the Components props
    super(props)

    // to initialize state; only we use `this.state=`
    this.state = { searchTerm: 'Enter search here' }
  }
  render() {
    return (
      <div>
        <input
          value={this.state.searchTerm}
          onChange={this.onInputChange.bind(this)} />
      </div>
    )
  }
  onInputChange(event) {
    this.setState({ searchTerm: event.target.value })
  }
}
```
* we need to `.bind(this)` so that `this.setState()` knows where to go


**Downwards Data Flow** - only the **most parent** component should be responsible for fetching data.


## SENDING AND RECEIVING DATA
### Send data down to child component:
```
render() {
  return (
    <VideoList videos={this.state.videos} />
  )
}
```
* just pass it as a prop on VideoList element render

### Receive data up from parent component
#### In a functional component:
```
const VideoList = (props) => {
	console.log(props)
}
```

### In a class component
```
class VideoList extends Component {
	console.log(this.props)
}
```


## REACT AUTOMAGICALLY RENDERS ARRAYS
```
const VideoList = (props) => {
  const videoItems = props.videos.map(video => <VideoListItem key={video.id.videoId} video={video} />)
  return (
    <ul className="col=md-4 list-group">
      {videoItems}
    </ul>
  )
}
```
* See how we just use `{videoItems}` and it works!

## To use a passed around function
* from `my-inner-component.js`
```
const myInnerComponent = (props) => {
  const thisCompsData = props.thisCompsData
  const myClickFn = props.myClickFn
  return (
    <li onClick={() => myClickFn(thisCompsData)}></li>
  )
}
```

* _Glorious ES6 Destructuring gives us:_
```
const myInnerComponent = ({thisCompData, myClickFn}) => {
  // do stuff //
```


## Patterns for Event Handling

### bind `this` in `render()` event
```
render() { return <input onClick={this._hndlClk.bind(this)} /> }
_hndlClk() { console.log(this.state.something) }
```
* minor performance hits
* Avoid declaring arrow functions or binding in render for optimal performance. Use [this ESLint rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md).

### use `arrow function` in `render()` event
```
render() { return <input onClick={() => this._hndlClk()} /> }
_hndlClk() { console.log(this.state.something) }
```
* minor performance hits
* Avoid declaring arrow functions or binding in render for optimal performance. Use [this ESLint rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md).

### preestablish `bind` in `constructor`
```
class HelloWorld extends React.Component {
  constructor(props) {
    super(props)
    this._hndlClk = this._hndlClk.bind(this)
  }
  render() { return <input onClick={this_.hndlClk()} /> }
  _hndlClk() { console.log(this.state.message) }
}
```
* Pro: Better performance
* Con: Harder to read

### use `Big Arrow Function` instead of `function`
```
_hndlClk = () => { console.log(this.state.message) }
render() { return <input onClick={this._hndlClk} /> }
```
* Best approach
* No performance hits
* works because arrow functions don't affect `this`
* must enable `transform-class-properties` or enable `stage-2` in Babel.


## JSX Spread Attributes
From: https://facebook.github.io/react/docs/jsx-in-depth.html#spread-attributes

If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" operator to pass the whole props object. These two components are equivalent:

```
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'}
  return <Greeting {...props} />
}
```

Spread attributes can be useful when you are building generic containers. However, they can also make your code messy by making it easy to pass a lot of irrelevant props to components that don't care about them. We recommend that you use this syntax sparingly.


## Your Apps's structure
* App `state` is in the root
* **Visual/UI** `state` will be in other components
* App _Functions_ will trickle down to child components to use in its props
* Component **Elements** have native JavaScript events (onChange, onClick, etc)
* native events can call inner functions (handleChange, handleClick, etc)
* If they affect App State, have then execute a "trickled-down" App function
* If they affect visual, they'll change a Component State

### build process
1. Break your app into components as you'd see on-screen
2. Determine app's global state-changing functions
		1. Add as placeholder functions inside the parent app
3. Create the components
		1. Pass app functions as props
		2. Don't worry about functionality
4. Add in visual component state changes
5. Add in event




