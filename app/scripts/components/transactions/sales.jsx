import React from 'react';
import MUI from 'material-ui';
import Moment from 'moment';

import ActionSearch from 'material-ui/lib/svg-icons/action/search';
import Store from '../../store/transactions';
import Action from '../../actions/transactions';

import Utils from '../../utils';
import TransactionTypes from '../../constants/TransactionTypes';
import ColumnTypes from '../../constants/ColumnTypes';
import FormInput from '../FormInput';

var today = new Date();

function getStateFromStores(){
	return {
	    transactions: Store.sales()
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
  		state.open = false;
  		state.openFilterNav = false;
  		state.openAdminDialog = false;
	    state.startDate = new Date(Moment([today.getFullYear(), today.getMonth()]));
	    state.endDate = new Date(Moment([today.getFullYear(), today.getMonth()]).endOf('month'));
		return state;
    },
    componentDidMount: function() {
		Action.sales(this.state.startDate, this.state.endDate);

		Store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function(){
		let style = { position: 'fixed', bottom: 30, right: this.state.openFilterNav ? 250 : 30, zIndex: 1400 };
		let results = this.state.transactions;
		let total = 0;

		var transactions = results && results.map(function(i){
			let isVoid = i.void ? { backgroundColor: '#EEE', color: '#999'} : {};
			total += i.amount;
			return (
					<MUI.TableRow key={i.id} style={isVoid}>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_10}>{i.id}</MUI.TableRowColumn>
						<MUI.TableRowColumn>{i.notes}</MUI.TableRowColumn>
						<MUI.TableRowColumn>{i.user.name}</MUI.TableRowColumn>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_AMOUNT}>{i.amount.toFixed(2)}</MUI.TableRowColumn>
					</MUI.TableRow>
				)
		}.bind(this))


		var transaction = this.state.transaction;
      	var orders = transaction && transaction.orders.map(function(i){
			return (
					<MUI.TableRow key={i.id}>
						<MUI.TableRowColumn>{i.name}</MUI.TableRowColumn>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_10}>{i.quantity}</MUI.TableRowColumn>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_AMOUNT}>{i.price.toFixed(2)}</MUI.TableRowColumn>
					</MUI.TableRow>
				)
		})
		var dialog = (
				<MUI.Table>
					<MUI.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<MUI.TableRow>
							<MUI.TableHeaderColumn>Name</MUI.TableHeaderColumn>
							<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_10}>Quantity</MUI.TableHeaderColumn>
							<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_AMOUNT}>Price</MUI.TableHeaderColumn>
						</MUI.TableRow>
					</MUI.TableHeader>
					<MUI.TableBody displayRowCheckbox={false}>
						{ orders }
						<MUI.TableRow>
							<MUI.TableRowColumn><strong>Total</strong></MUI.TableRowColumn>
							<MUI.TableRowColumn></MUI.TableRowColumn>
							<MUI.TableRowColumn style={ColumnTypes.COLUMN_AMOUNT}><strong>{transaction && transaction.amount.toFixed(2)}</strong></MUI.TableRowColumn>
						</MUI.TableRow>
					</MUI.TableBody>
				</MUI.Table>
				)
		var actions = {
			transaction: [
				<MUI.FlatButton
					label="Admin"
					primary={true}
					disabled={ transaction && transaction.void }
					onTouchTap={this._handleAdminDialog}/>,
				<MUI.FlatButton
					label="Close"
					primary={true}
					disabled={false}
					onTouchTap={this._handleClose}/>
      		],
      		void: [
				<MUI.FlatButton
					label="Update"
					primary={true}
					disabled={!this.state.canSubmit} 
					onTouchTap={this._handleVoid }/>,
				<MUI.FlatButton
					label="Close"
					primary={true}
					disabled={false}
					onTouchTap={this._handleAdminDialog}/>
      		]
		}

		return (

			<div>
				<MUI.LeftNav width={286} openRight={true} open={this.state.openFilterNav} >
					<MUI.AppBar title="Filter"/>
					<div className="container-fluid">

					    <MUI.DatePicker 
					    	value={this.state.startDate} 
					    	hintText="Start Date" 
							floatingLabelText="Start Date" 
					    	autoOk={true} 
					    	style={{display: 'inline-block' }}
					    	onChange={ this._handleStartDateChange } />
						<br/>
					    <MUI.DatePicker 
					    	value={this.state.endDate} 
					    	hintText="End Date" 
							floatingLabelText="End Date" 
					    	autoOk={true} 
					    	style={{display: 'inline-block' }}
					    	onChange={ this._handleEndDateChange } />
						<br/>
		    			<MUI.RaisedButton label="Filter" primary={true} onClick={this._handleFilterClick } />
	    			</div>
				</MUI.LeftNav>
				<MUI.FloatingActionButton style={style} onClick={this._handleFilterNavClick }>
					<ActionSearch />
				</MUI.FloatingActionButton>
			<h4 className="text-right">Total: { total.toFixed(2) }</h4> 

			<MUI.Table onCellClick={this._handleRowClick }>
				<MUI.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<MUI.TableRow>
						<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_10}>ID</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn>Notes</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn>User</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_AMOUNT}>Amount</MUI.TableHeaderColumn>
					</MUI.TableRow>
				</MUI.TableHeader>
				<MUI.TableBody displayRowCheckbox={false}>
					{ transactions }
				</MUI.TableBody>
			</MUI.Table>
		    <MUI.Divider />


			<MUI.Dialog
				title={"Transaction: " + (transaction && transaction.transaction_type.name)}
				actions={actions.transaction}
				modal={true}
				open={this.state.open}>
				{ dialog }
				<small>
					User: { transaction && transaction.user.name }  
					<span className="pull-right">Posted: { Moment(transaction && transaction.created_at).format("MM/DD/YYYY, h:mm:ss a") }</span>
					<br/>
					{ transaction && transaction.void ? 
					<span className="pull-right">Void: { Moment(transaction && transaction.updated_at).format("MM/DD/YYYY, h:mm:ss a") }</span>					
					: null }
				</small>
			</MUI.Dialog>

			<MUI.Dialog
				title={"Void Sale"}
				actions={actions.void}
				modal={true}
				open={this.state.openAdminDialog }>
				<Formsy.Form 
					onValid={this._enableButton} 
					onInvalid={this._disableButton}>

					<FormInput 
						value={transaction && transaction.notes}
						name="notes"
						floatingLabelText="Notes"
						onChange={this._handleChange }
						multiLine={true}
						fullWidth={true}
						rowsMax={4}
						required/>
					<FormInput
						type="checkbox"
						name="void"
						value={transaction && transaction.void }
						floatingLabelText="Void this transaction?"
						onChange={ this._handleToggleVoid }
						validations="isTrue"
						validationError="This field must checked"
						defaultChecked={ transaction && transaction.void }/>					
				</Formsy.Form>
			</MUI.Dialog>

			</div>
			)
	},
	_handleFilterClick: function(){
		Action.sales(this.state.startDate, this.state.endDate);
	},
	_handleFilterNavClick: function(){
		this.setState({
			openFilterNav: !this.state.openFilterNav
		})
	},
	_handleStartDateChange: function(e, value){
		this.setState({
			startDate: value
		})
	},
	_handleEndDateChange: function(e, value){
		this.setState({
			endDate: value
		})
	},
	_handleSelectChange: function(e, value){
		this.setState({
			selectValue: value
		})
	},
	_handleRowClick: function(index){
		this.setState({
			transaction: this.state.transactions[index],
			open: true
		})
	},
	_handleToggleVoid: function(e, value){
		var transaction = this.state.transaction;
		transaction.void = value;
		this.setState({
			transaction: transaction
		})
	},
	_handleAdminDialog: function(){
		this.setState({
			openAdminDialog: !this.state.openAdminDialog
		})
		// console.log(this.state.transaction)
		// var transaction = {
	 //    	amount: 0,
	 //    	type_id: TransactionTypes.TRANSACTIONS_VOID,
	 //    	orders: this.state.transaction.orders,
	 //    	notes: "TRANSACTIONS_VOID",
	 //    	user_id: 1			
		// }
	},
	_handleChange: function(name, value){
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

	_handleVoid: function(){
		Action.update(this.state.transaction)
	},
	_handleClose: function(){
		this.setState({
			open: false
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
    _onChange: function(){
    	this.setState(getStateFromStores())
    }

})
