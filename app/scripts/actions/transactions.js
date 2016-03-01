import Dispatcher from '../dispatcher';
import API from '../api';
import ActionTypes from '../constants/ActionTypes';
import Moment from 'moment';

module.exports = {
  list: function(start, end) {
  	var url = '/transactions';
  	if(start && end){
  		url += '?start_date=' + Moment(start).format("DD/MM/YYYY") + '&end_date=' + Moment(end).add(1,'d').format("DD/MM/YYYY");
  	}

	API.get(url).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_TRANSACTIONS_SUCCESS,
	      results: res
	    });
	})
  },
  sales: function(start, end) {
  	var url = '/transactions/sales';
  	if(start && end){
  		url += '?start_date=' + Moment(start).format("DD/MM/YYYY") + '&end_date=' + Moment(end).add(1,'d').format("DD/MM/YYYY");
  	}

	API.get(url).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.REQUEST_TRANSACTIONS_SALES_SUCCESS,
	      results: res
	    });
	})
  },
  update: function(item) {
	API.put('/transactions/'+ item.id, {
		transactions: item
	}).then(function(){
	    Dispatcher.dispatch({
	      type: ActionTypes.UPDATE_TRANSACTION_SUCCESS,
	      res: item
	    });
	});
  },
  create: function(item) {
	API.post('/transactions', {
		transactions: item
	}).then(function(res){
	    Dispatcher.dispatch({
	      type: ActionTypes.CREATE_TRANSACTION_SUCCESS,
	      res: res
	    });
	});
  },

};
