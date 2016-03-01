import React from 'react';
import MUI from 'material-ui';
import Moment from 'moment';

import ActionSearch from 'material-ui/lib/svg-icons/action/search';
import Store from '../../store/transactions';
import Action from '../../actions/transactions';

import Utils from '../../utils';
import TransactionTypes from '../../constants/TransactionTypes';
import ColumnTypes from '../../constants/ColumnTypes';

var today = new Date();

function getStateFromStores(){
	return {
	    transactions: Store.list()
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
	    state.selectValue = TransactionTypes.TRANSACTIONS_ALL;
	    state.startDate = new Date(Moment([today.getFullYear(), today.getMonth()]));
	    state.endDate = new Date(Moment([today.getFullYear(), today.getMonth()]).endOf('month'));
		return state;
    },
    componentDidMount: function() {
		Action.list(this.state.startDate, this.state.endDate);

		Store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function(){
		let style = { position: 'fixed', bottom: 30, right: this.state.openFilterNav ? 250 : 30, zIndex: 1400 };

		let results = this.state.transactions;
		if(this.state.selectValue != 0){
			results = _.filter(results, { type_id: this.state.selectValue })
		}

		var transactions = results && results.map(function(i){
			return (
					<MUI.TableRow key={i.id}>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_10}>{i.id}</MUI.TableRowColumn>
						<MUI.TableRowColumn>{i.transaction_type.name}</MUI.TableRowColumn>
						<MUI.TableRowColumn>{i.orders[0] && i.orders[0].name}</MUI.TableRowColumn>						
						<MUI.TableRowColumn>{i.user.name}</MUI.TableRowColumn>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_20}>{ Moment(i.created_at).format("MM/DD/YYYY") }</MUI.TableRowColumn>
						<MUI.TableRowColumn style={ColumnTypes.COLUMN_20}>{i.orders[0] && i.orders[0].quantity}</MUI.TableRowColumn>
					</MUI.TableRow>
				)
		}.bind(this))


		var transaction = this.state.transaction;
      	var orders = transaction && transaction.orders.map(function(i){
			return (
					<MUI.TableRow key={i.id}>
						<MUI.TableRowColumn>{i.name}</MUI.TableRowColumn>
						<MUI.TableRowColumn>{i.quantity}</MUI.TableRowColumn>
						{ transaction && transaction.type_id == TransactionTypes.TRANSACTIONS_SALE ? 
							<MUI.TableRowColumn>{i.price}</MUI.TableRowColumn>
						: '' }
					</MUI.TableRow>
				)
		})
		var dialog = (
				<MUI.Table>
					<MUI.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<MUI.TableRow>
							<MUI.TableHeaderColumn>Name</MUI.TableHeaderColumn>
							<MUI.TableHeaderColumn>Quantity</MUI.TableHeaderColumn>
						</MUI.TableRow>
					</MUI.TableHeader>
					<MUI.TableBody displayRowCheckbox={false}>
						{ orders }
					</MUI.TableBody>
				</MUI.Table>
				)

		var actions = [
				<MUI.FlatButton
					label="Close"
					primary={true}
					disabled={false}
					onTouchTap={this._handleClose}/>
      		]

		return (

			<div>
				<MUI.LeftNav width={286} openRight={true} open={this.state.openFilterNav} >
					<MUI.AppBar title="Filter"/>
					<div className="container-fluid">

						<MUI.SelectField 
							value={this.state.selectValue} 
					        floatingLabelText="Filter"
							onChange={this._handleSelectChange}>
							<MUI.MenuItem value={0} primaryText="All"/>
							<MUI.MenuItem value={TransactionTypes.TRANSACTIONS_ADD} primaryText="Add"/>
							<MUI.MenuItem value={TransactionTypes.TRANSACTIONS_REMOVE} primaryText="Remove"/>
							<MUI.MenuItem value={TransactionTypes.TRANSACTIONS_SPOILED} primaryText="Spoiled"/>
						</MUI.SelectField>
						<br/>
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
	
			<MUI.Table onCellClick={this._handleRowClick }>
				<MUI.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<MUI.TableRow>
						<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_10}>ID</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn>Type</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn>Name</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn>User</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_20}>Date</MUI.TableHeaderColumn>
						<MUI.TableHeaderColumn style={ColumnTypes.COLUMN_20}>Quantity</MUI.TableHeaderColumn>
					</MUI.TableRow>
				</MUI.TableHeader>
				<MUI.TableBody displayRowCheckbox={false}>
					{ transactions }
				</MUI.TableBody>
			</MUI.Table>

			<MUI.Dialog
				title={"Transaction: " + (transaction && transaction.transaction_type.name)}
				actions={actions}
				modal={true}
				open={this.state.open}>
				{ dialog }
			</MUI.Dialog>

			</div>
			)
	},
	_handleFilterClick: function(){
		Action.list(this.state.startDate, this.state.endDate);
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
	_handleClose: function(){
		this.setState({
			open: false
		})
	},
    _onChange: function(){
    	this.setState(getStateFromStores())
    }

})
