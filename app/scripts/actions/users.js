import Dispatcher from '../dispatcher';
import API from '../api';
import ActionTypes from '../constants/ActionTypes';

module.exports = {
  list: function(id) {
	API.get('/users').then(function(res){
		if(!res) return false;
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_USERS_SUCCESS,
	      res: res
	    });
	});
  },
  get: function(id) {
	API.get('/users/'+ id).then(function(res){
		if(!res) return false;
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_USER_SUCCESS,
	      res: res
	    });
	});
  },
  create: function(item) {
	API.post('/users', {
		user: item
	}).then(function(res){
		if(!res) return false;
	    Dispatcher.dispatch({
	      type: ActionTypes.CREATE_USER_SUCCESS,
	      res: res
	    });
	});
  },
  login: function(item) {
	API.post('/sessions', {
		user: item
	}).then(function(res){
		if(!res) return false;
	    Dispatcher.dispatch({
	      type: ActionTypes.CREATE_SESSION_SUCCESS,
	      res: res
	    });
	});
  },
  logout: function(item) {
		Dispatcher.dispatch({
			type: ActionTypes.REMOVE_SESSION_SUCCESS,
		});
  },

};
