import Dispatcher from '../dispatcher';
import API from '../api';
import ActionTypes from '../constants/ActionTypes';

module.exports = {
  list: function() {
	API.get('/inventories').then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_INVENTORIES_SUCCESS,
	      results: res
	    });
	})
  }

};
