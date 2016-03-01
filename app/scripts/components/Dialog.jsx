import React from 'react';
import MUI from 'material-ui';


module.exports = React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired,
    	product: React.PropTypes.object.isRequired
	},
	childContextTypes: {
		location: React.PropTypes.object
	},
    componentDidMount: function() {
    },
	componentWillUnmount: function() {
	},
	render: function(){

		console.log(this.props.product)
		return (
			<MUI.Dialog
				title="Dialog With Actions"
				actions={actions}
				modal={true}
				open={this.state.open}
				>
				<Formsy.Form 
					onValid={this._enableButton} 
					onInvalid={this._disableButton}>
					<FormInput 
						name="quantity" 
						onChange={ this._handleChange }
						floatingLabelText="Quantity" 
						validationError="This field is required"
						required/>
				</Formsy.Form>

			</MUI.Dialog>

			)
	},
	_handleClose: function(){
		this.setState({
			open: false,
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
			user_id: 1,
			notes: "Add Item",
			orders: []
		}
		transaction.orders.push(this.state.order)
		console.log(transaction)
		TransactionsAction.create(transaction)
	},
	_handleAddBtnClick: function(item){
		var transaction = this.state.transaction;
		this.setState({
			open: true,
			order: {
				name: item.product.name,
				product_id: item.id
			}
		})
	},
	_onClick: function(id){
		this.context.router.push('/products/' + id)
	},
    _onChange: function(){
    	this.setState(getStateFromStores())
    }

})
