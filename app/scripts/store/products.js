import { EventEmitter } from 'events';
import assign from 'object-assign';

import Dispatcher from '../dispatcher';
import Action from '../actions/products';
import ActionTypes from '../constants/ActionTypes';
import Utils from '../utils';

import { Router, Route, IndexRoute, useRouterHistory, hashHistory } from 'react-router';

// var routes = require('../routes.jsx');

// var router = Router.create({
//   routes: routes,
//   location: null // Router.HistoryLocation
// });


var CHANGE_EVENT = 'change';

var _list = null,
	_item = null;

var Store = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  get: function() {
    return _item;
  },
  list: function() {
    return _list;
  }

});

Store.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.REQUEST_PRODUCTS_SUCCESS:
    	_list = action.res;
    	      // router.transitionTo('app');

    	Store.emitChange();
      break;
    case ActionTypes.REQUEST_PRODUCT_SUCCESS:
    	_item = action.res;
    	Store.emitChange();
      break;
    case ActionTypes.UPDATE_PRODUCT_SUCCESS:
    case ActionTypes.CREATE_PRODUCT_SUCCESS:
    	hashHistory.push('/products')
      break;
    default:
      // do nothing
  }

});

module.exports = Store;



