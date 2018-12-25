/**
 * @file: temp entry
 * @author: teeeemoji
 * @date: 2018/12/25
 * @description: temp entry
 */

const React = require('react')
const ReactDOM = require('react-dom')
const Demo = require('examples/${DemoName}').default

console.log('module', module)
if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(<Demo/>, document.getElementById('root'))
