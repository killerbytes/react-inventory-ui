import { EventEmitter } from 'events';
import assign from 'object-assign';

import Dispatcher from '../dispatcher';
import Action from '../actions/categories';
import ActionTypes from '../constants/ActionTypes';
import Utils from '../utils';

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
    case ActionTypes.REQUEST_CATEGORIES_SUCCESS:
    	_list = action.res;
    	Store.emitChange();
      break;
    case ActionTypes.REQUEST_CATEGORY_SUCCESS:
    	_item = action.res;
    	Store.emitChange();
      break;
    case ActionTypes.UPDATE_CATEGORY_SUCCESS:
    	Utils.updateList(_list, action.res.id, action.res);
    	Store.emitChange();
      break;
    default:
      // do nothing
  }

});

module.exports = Store;



