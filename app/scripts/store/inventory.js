import { EventEmitter } from 'events';
import assign from 'object-assign';

import Dispatcher from '../dispatcher';
import Action from '../actions/inventory';
import ActionTypes from '../constants/ActionTypes';

var CHANGE_EVENT = 'change';

var _list = null;

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
  list: function() {
    return _list;
  }

});

Store.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.REQUEST_INVENTORIES_SUCCESS:
    	_list = action.results;
    	Store.emitChange();
      break;
    default:
      // do nothing
  }

});

module.exports = Store;



