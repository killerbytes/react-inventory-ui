import React from 'react';
import MUI from 'material-ui';

import Store from '../store/products';
import Action from '../actions/products';
import CategoriesStore from '../store/categories';
import CategoriesAction from '../actions/categories';
import ProductsList from './products/list_child';

import FormInput from './FormInput';
import ActionAdd from 'material-ui/lib/svg-icons/content/add';

function getStateFromStores(){
	return {
	    products: Store.list(),
	    categories: CategoriesStore.list(),
	    item: Store.get()
	}
}

module.exports = React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
	},
	childContextTypes: {
		location: React.PropTypes.object
	},
  	getInitialState: function (){
  		var state = getStateFromStores();
  		state.openNew = false;
  		state.openEdit = false;
		return state;
    },
    componentDidMount: function() {
		Action.list();
		CategoriesAction.list();
		Store.addChangeListener(this._onChange);
		CategoriesStore.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
		CategoriesStore.removeChangeListener(this._onChange);
	},
	render: function(){
		let style = { position: 'fixed', bottom: 30, right: this.state.openFilterNav ? 250 : 30, zIndex: 1400 };

		var item;

		if(this.state.item) item = this.state.item;

		return (
			<div>
				<MUI.FloatingActionButton style={style} onClick={this._handleNew }>
					<ActionAdd />
				</MUI.FloatingActionButton>

				<div className="row">	
					<ProductsList 
						onClick={this._onClick}
						categories={this.state.categories} 
						products={this.state.products} />
				</div>

			</div>
			)
	},
	_onClick: function(item){
		this.context.router.push('/products/' + item.id)
	},
	_handleNew: function(id){
		this.context.router.push('/products/new')
	},
    _onChange: function(){
    	this.setState(getStateFromStores())
    }

})
