import Dispatcher from '../dispatcher';
import API from '../api';
import ActionTypes from '../constants/ActionTypes';

module.exports = {
  list: function() {
	API.get('/products').then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_PRODUCTS_SUCCESS,
	      res: res
	    });
	})
  },
  get: function(id) {
	API.get('/products/'+ id).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_PRODUCT_SUCCESS,
	      res: res
	    });
	})
  },
  create: function(item) {
	API.post('/products', {
		product: item
	}).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.CREATE_PRODUCT_SUCCESS,
	      res: res
	    });
	});
  },
  update: function(item) {
	API.put('/products/'+ item.id, {
		product: item
	}).then(function(){
	    Dispatcher.dispatch({
	      type: ActionTypes.UPDATE_PRODUCT_SUCCESS,
	      res: item
	    });
	});
  }

};
