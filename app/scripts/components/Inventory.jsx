import React from 'react';
import MUI from 'material-ui';

import Store from '../store/inventory';
import Action from '../actions/inventory';
import TransactionsAction from '../actions/transactions';
import TransactionsStore from '../store/transactions';

import UsersStore from '../store/users';

import ContentAddBox from 'material-ui/lib/svg-icons/content/add-circle';
import ContentRemoveBox from 'material-ui/lib/svg-icons/content/remove-circle';

import FormInput from './FormInput';
import TransactionTypes from '../constants/TransactionTypes';
import ColumnTypes from '../constants/ColumnTypes';

import Dialog from './Dialog';

function getStateFromStores(){
	return {
	    user: UsersStore.user(),
	    inventory: Store.list(),
	    transaction: { orders_attributes: [] },
	    checked: false,
	    order: {}
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
  		state.openAddDialog = false;
  		state.openRemoveDialog = false;
		return state;
    },
    componentDidMount: function() {
		Action.list();
		Store.addChangeListener(this._onChange);
		UsersStore.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
		UsersStore.removeChangeListener(this._onChange);
	},
	render: function(){
		var items = this.state.inventory && this.state.inventory.map(function(i){
			return (
					<MUI.TableRow key={i.id}>
						<MUI.TableRowColumn style={ ColumnTypes.COLUMN_10 }>{i.id}</MUI.TableRowColumn>
						<MUI.TableRowColumn>{i.product.name}</MUI.TableRowColumn>
						<MUI.TableRowColumn style={ ColumnTypes.COLUMN_20 }>{i.quantity}</MUI.TableRowColumn>
						{ this.state.user && this.state.user.admin ?
						<MUI.TableRowColumn style={ ColumnTypes.COLUMN_20 }>
      						<ContentAddBox onClick={ this._handleAddBtnClick.bind(this, i) } />
      						<ContentRemoveBox onClick={ this._handleRemoveBtnClick.bind(this, i) } />
						</MUI.TableRowColumn>
						:null}
					</MUI.TableRow>
				)
		}.bind(this))
		var actions = {
			add: [
				<MUI.FlatButton
					label="Update"
					primary={true}
					disabled={ !this.state.canSubmit }
					onTouchTap={this._handleAddClick }/>,
				<MUI.FlatButton
					label="Cancel"
					primary={true}
					onTouchTap={this._handleClose}/>
      		],
			remove: [
				<MUI.FlatButton
					label="Update"
					primary={true}
					disabled={ !this.state.canSubmit }
					onTouchTap={this._handleRemoveClick }/>,
				<MUI.FlatButton
					label="Cancel"
					primary={true}
					onTouchTap={this._handleClose}/>
      		]

		}


		return (
			<div>
				<MUI.Table onCellClick={this._handleRowClick }>
					<MUI.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<MUI.TableRow>
							<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_10}>ID</MUI.TableHeaderColumn>
							<MUI.TableHeaderColumn>Product</MUI.TableHeaderColumn>
							<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_20}>Quantity</MUI.TableHeaderColumn>
							{ this.state.user && this.state.user.admin ?
							<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_20}>Actions</MUI.TableHeaderColumn>
							: null }
						</MUI.TableRow>
					</MUI.TableHeader>
					<MUI.TableBody displayRowCheckbox={false}>
						{ items }
					</MUI.TableBody>
				</MUI.Table>
				<MUI.Dialog
					title={"Add stocks: " + this.state.order.name }
					actions={actions.add}
					modal={true}
					open={this.state.openAddDialog}
					>
					<Formsy.Form 
						onValid={this._enableButton} 
						onInvalid={this._disableButton}>
						<FormInput 
							name="quantity" 
							value={this.state.order.quantity}
							onChange={ this._handleChange }
							validations="isInt" 
							validationError="This field must be numeric"
 							floatingLabelText="Quantity" 
							required/>
					</Formsy.Form>

				</MUI.Dialog>
				<MUI.Dialog
					title={"Remove stocks: " + this.state.order.name }
					actions={actions.remove}
					modal={true}
					open={this.state.openRemoveDialog}
					>
					<Formsy.Form 
						onValid={this._enableButton} 
						onInvalid={this._disableButton}>
						<FormInput 
							name="quantity" 
							value={this.state.order.quantity}
							onChange={ this._handleChange }
							validations="isInt" 
							validationError="This field must be numeric"
 							floatingLabelText="Quantity" 
							required/>
						<MUI.Checkbox label="Spoiled" onCheck={ this._handleCheck }/>
					</Formsy.Form>

				</MUI.Dialog>

			</div>
			)
	},
	_handleClose: function(){
		this.setState({
			openAddDialog: false,
			openRemoveDialog: false
		})
	},
	_handleChange: function(name, value){
		var order = this.state.order;
		order[name] = value 
		this.setState({
			order: order
		})
	},
	_handleAddClick: function(){
		var transaction = {
			type_id: TransactionTypes.TRANSACTIONS_ADD,
			user_id: this.state.user.id,
			notes: "Add Item",
			orders_attributes: []
		}
		transaction.orders_attributes.push(this.state.order)
		TransactionsAction.create(transaction)

		this.setState({
			openAddDialog: false
		})
	},
	_handleRemoveClick: function(){
		var transaction = {
			type_id: this.state.checked ? TransactionTypes.TRANSACTIONS_SPOIL : TransactionTypes.TRANSACTIONS_REMOVE,
			user_id: this.state.user.id,
			notes: "Remove Item",
			orders_attributes: []
		}
		transaction.orders_attributes.push(this.state.order)
		TransactionsAction.create(transaction)

		this.setState({
			openRemoveDialog: false
		})
	},
	_handleCheck: function(e, value){
		this.setState({
			checked: value
		})
	},
	_handleAddBtnClick: function(item){
		var transaction = this.state.transaction;
		this.setState({
			openAddDialog: true,
			order: {
				name: item.product.name,
				product_id: item.id
			}
		})
	},
	_handleRemoveBtnClick: function(item){
		var transaction = this.state.transaction;
		this.setState({
			openRemoveDialog: true,
			order: {
				name: item.product.name,
				product_id: item.id
			}
		})
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
	_onClick: function(id){
		this.context.router.push('/products/' + id)
	},
    _onChange: function(){
    	this.setState(getStateFromStores())
    }

})
