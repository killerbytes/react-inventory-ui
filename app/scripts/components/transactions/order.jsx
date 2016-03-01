import React from 'react';
import MUI from 'material-ui';
import ActionShop from 'material-ui/lib/svg-icons/action/shopping-cart';

import Store from '../../store/transactions';
import Action from '../../actions/transactions';

import CategoriesStore from '../../store/categories';
import CategoriesAction from '../../actions/categories';

import ProductsStore from '../../store/products';
import ProductsAction from '../../actions/products';
import ProductsList from '../products/list_child';

import UsersStore from '../../store/users';

import Utils from '../../utils';
import TransactionTypes from '../../constants/TransactionTypes';
import FormInput from '../FormInput';

function getStateFromStores(){
	return {
		user: UsersStore.user(),
	    categories: CategoriesStore.list(),
	    products: ProductsStore.list(),
	    openOrders: false,
	    transaction: { 
		    amount: 0,
		    notes: 'Sale',
	    	type_id: TransactionTypes.TRANSACTIONS_SALE,
	    	orders_attributes: [],
	    }
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
  		state.snackbarOpen= false;
  		state.message = "";
		return state;
    },
    componentDidMount: function() {
		CategoriesAction.list();
		ProductsAction.list();

		Store.addChangeListener(this._onChange);
		CategoriesStore.addChangeListener(this._onChange);
		ProductsStore.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
		CategoriesStore.removeChangeListener(this._onChange);
		ProductsStore.removeChangeListener(this._onChange);
	},
	render: function(){
		let style = { position: 'fixed', bottom: 30, right: this.state.openOrders ? 250 : 30, zIndex: 1400 };
		var item = this.state.item;
		var categories = this.state.categories && this.state.categories.map(function(i){
			return <MUI.MenuItem key={i.id} value={i.id} primaryText={i.name}/>	
		})

		var products = this.state.products && this.state.products.map(function(i){
			return <MUI.ListItem key={i.id} primaryText={i.name} onTouchTap={ this._handleProductClick.bind(this, i) }/>
		}.bind(this))

		var orders = this.state.transaction && this.state.transaction.orders_attributes.map(function(i){
			return <MUI.ListItem key={i.product_id} 
									primaryText={i.name} 
									secondaryText={i.quantity + '@ ' + i.price.toFixed(2)}  
									onTouchTap={ this._handleOrderClick.bind(this, i) }/>
		}.bind(this))

		var transaction = this.state.transaction;
		return (
			<div>
				<ProductsList 
					onClick={this._handleProductClick}
					categories={this.state.categories} 
					products={this.state.products} />

				<MUI.Divider />


				<MUI.LeftNav width={286} openRight={true} open={this.state.openOrders} >
					<MUI.AppBar title="Orders"/>
					<MUI.List>
						{ orders }
					</MUI.List>	
					<div className="container-fluid">
						<h4>Total: { transaction.amount.toFixed(2) }</h4> 
						<Formsy.Form 
							onValid={this._enableButton} 
							onInvalid={this._disableButton}>
							<MUI.TextField
								value={this.state.transaction.notes}
								name="notes" 
								rows={3}
								onChange={ this._handleChange }
								floatingLabelText="Notes" />

							<br />
							<div className="text-center">
							
								<MUI.FlatButton 
									disabled={this.state.transaction.orders_attributes.length == 0}
									label="Place Order" 
									primary={true} 
									onClick={ this._handleSubmit } />
							</div>
						</Formsy.Form>
					</div>

				</MUI.LeftNav>

				<MUI.FloatingActionButton style={style} onClick={this._handleOrdersNavClick }>
					<ActionShop />
				</MUI.FloatingActionButton>

				<MUI.Snackbar
					open={this.state.snackbarOpen}
					message={this.state.message}
					action="undo"
					autoHideDuration={3000}
					onRequestClose={this._handleRequestClose} />


			</div>
			)
	},
	_handleOrdersNavClick: function(){
		this.setState({
			openOrders: !this.state.openOrders
		})
	},
	_handleRequestClose: function(){
		this.setState({
			snackbarOpen: false
		})
	},
	_handleProductClick: function(item, e){
		if(!item.active) return false;
		var transaction = this.state.transaction;
		var message;


		if(_.find(transaction.orders_attributes, {product_id: item.id })){
			var index = _.indexOf(transaction.orders_attributes, _.find(transaction.orders_attributes, {product_id: item.id }));
			transaction.orders_attributes[index].quantity++;
			message = transaction.orders_attributes[index].name + ' x 1 added. Total: ' +  transaction.orders_attributes[index].quantity;
		}else{
			var newItem = {
				product_id: item.id,
				name: item.name,
				price: item.price,
				quantity: 1
			}
			transaction.orders_attributes.push(newItem)
			message = newItem.name + ' x 1 added'
		}
		transaction.amount += item.price;
		this.setState({
			transaction: transaction,
			message: message,
			snackbarOpen: true
		})
	},
	_handleOrderClick: function(item, e){
		var transaction = this.state.transaction;
			var index = _.indexOf(transaction.orders_attributes, _.find(transaction.orders_attributes, {product_id: item.product_id }));
			if(transaction.orders_attributes[index].quantity == 1){
				transaction.orders_attributes.splice(index, 1)
			}else{
				transaction.orders_attributes[index].quantity--;
			}

		transaction.amount -= item.price;
		this.setState({
			transaction: transaction
		})
	},
	_handleChange: function(e){
		var value = e.currentTarget.value;
		var name = e.currentTarget.name;
		var item = this.state.transaction;
		if(/\./.test(name)){
			var test = name.split(".");
			item[test[0]][test[1]] = value
		}else{
			item[name] = value;
		}
		this.setState({
			transaction: item
		})
	},

	_handleSubmit: function(){
		var transaction = this.state.transaction;
		transaction.user_id = this.state.user.id;
		this.setState({
			message: 'Order placed. Total Amount: ' + this.state.transaction.amount.toFixed(2),
			snackbarOpen: true,
			transaction: transaction
		})
		Action.create(transaction);
	},
	_enableButton: function () {
		this.setState({
			canSubmit: true
		});
	},
	_disableButton: function () {
		this.setState({
			canSubmit: false
		});
	},
    _onChange: function(){
    	this.setState(getStateFromStores())
    }

})
