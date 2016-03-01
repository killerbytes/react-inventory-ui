import { EventEmitter } from 'events';
import assign from 'object-assign';

import Dispatcher from '../dispatcher';
import Action from '../actions/transactions';
import ActionTypes from '../constants/ActionTypes';
import { Router, Route, IndexRoute, useRouterHistory, hashHistory } from 'react-router';

var CHANGE_EVENT = 'change';

var _user = null
	, _list = null;

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
  user: function() {
    return _user;
  },
  list: function() {
    return _list;
  },
  loggedIn: function(){
  	return localStorage.token || false;
  }

});

Store.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {

  	case ActionTypes.REMOVE_SESSION_SUCCESS:
  		localStorage.removeItem("token");
  		localStorage.removeItem("user");
  		_user = null;
  		Store.emitChange();
    	hashHistory.push("/login")
  		break;
  	case ActionTypes.REQUEST_USER_SUCCESS:
    	_user = action.res;  	
    	localStorage.token = _user.token;
    	localStorage.user = _user.id;
    	Store.emitChange();  		
  		break;
    case ActionTypes.CREATE_SESSION_SUCCESS:
    	_user = action.res;
    	localStorage.token = _user.token;
    	localStorage.user = _user.id;
    	hashHistory.push(window.nextPathname || "/")
    	Store.emitChange();
      break;
  	case ActionTypes.REQUEST_USERS_SUCCESS:
  		_list = action.res;
    	Store.emitChange();
  		break;
    case ActionTypes.CREATE_USER_SUCCESS:
    	_user = action.res;
    	Store.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = Store;



