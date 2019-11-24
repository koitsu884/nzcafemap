import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

function noop() {}

if (process.env.NODE_ENV !== 'development') {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);