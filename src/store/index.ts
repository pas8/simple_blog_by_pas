import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import * as reducers from './modules';

const combinecRedusers = combineReducers({ ...reducers });
const configureStore = createStore(combinecRedusers);

export default configureStore;
