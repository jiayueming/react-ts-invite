import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import './common/iconfont/iconfont.css';
import {HashRouter} from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducers from './redux/reducer'
declare global {
    interface Window { devToolsExtension: any; }
}
/* tslint:disable */
const store = createStore(reducers, compose(
	applyMiddleware(thunk),
	window.devToolsExtension?window.devToolsExtension():(f: any)=>f
))
ReactDOM.render(
    (<Provider store={store}>
        <HashRouter>
            <App></App>
        </HashRouter>
    </Provider>),
  document.getElementById('root') as HTMLElement
);