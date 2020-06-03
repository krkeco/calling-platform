import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { polyfill } from 'mobile-drag-drop';

import { CookiesProvider } from 'react-cookie';

// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

// options are optional ;)
polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
window.addEventListener('touchmove', function () {});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
    	<App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
