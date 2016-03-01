import Dispatcher from '../dispatcher';
import API from '../api';
import ActionTypes from '../constants/ActionTypes';

module.exports = {
  list: function() {
	API.get('/categories').then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_CATEGORIES_SUCCESS,
	      res: res
	    });
	})
  },
  get: function(id) {
	API.get('/categories/'+ id).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_CATEGORY_SUCCESS,
	      res: res
	    });
	})
  },
  create: function(item) {
	API.post('/categories', {
		category: item
	}).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.UPDATE_CATEGORY_SUCCESS,
	      res: res
	    });
	});
  },
  update: function(item) {
	API.put('/categories/'+ item.id, {
		category: item
	}).then(function(){
	    Dispatcher.dispatch({
	      type: ActionTypes.UPDATE_CATEGORY_SUCCESS,
	      res: item
	    });
	});
  }

};
