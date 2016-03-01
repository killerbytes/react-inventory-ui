import React from 'react';
import MUI from 'material-ui';

import Store from '../../store/products';
import CategoriesStore from '../../store/categories';
import Action from '../../actions/products';
import CategoriesAction from '../../actions/categories';

import FormInput from '../FormInput';

function getStateFromStores(){
	return {
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
		return getStateFromStores();
    },
    componentDidMount: function() {
		Action.get(this.props.routeParams.id);
		CategoriesAction.list();
		Store.addChangeListener(this._onChange);
		CategoriesStore.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
		CategoriesStore.removeChangeListener(this._onChange);
	},
	render: function(){
		var item = this.state.item;
		if(!item) return false;
		var categories = this.state.categories && this.state.categories.map(function(i){
			return <MUI.MenuItem key={i.id} value={i.id} primaryText={i.name}/>	
		})
		return (
			<div>
				{ item ? 
				<Formsy.Form 
					onValid={this._enableButton} 
					onInvalid={this._disableButton}>

					<FormInput 
						name="name" 
						value={item.name}
						onChange={ this._handleChange }
						floatingLabelText="Name" 
						validationError="This field is required"
						required/>

					<MUI.SelectField 
						floatingLabelText="Category"
						name="category_id" 
						value={item.category_id} 
						onChange={this._handleSelectCategoryChange}>
						{ categories }
					</MUI.SelectField>

					<FormInput 
						value={item.price}
						name="price" 
						validations="isFloat" 
						validationError="This field must be numeric"
						onChange={ this._handleChange }
						floatingLabelText="Price" 
						required/>

					<MUI.Toggle
						onToggle={ this._handleToggleChange }
						defaultToggled={ item.active }
						name="active"
						label="Active" />

					<FormInput 
						value={item.inventory.quantity}
						name="inventory.quantity" 
						onChange={ this._handleChange }
						validations="isInt" 
						validationError="This field must be numeric"
						floatingLabelText="Quantity" 
						required/>
					<FormInput 
						value={item.item}
						name="item" 
						onChange={ this._handleChange }
						floatingLabelText="Item" />
					<MUI.Toggle
						onToggle={ this._handleToggleChange }
						defaultToggled={ item.set }
						name="set"
						label="Set" />

					<br />
					<div className="text-center">
						<MUI.FlatButton 
							disabled={!this.state.canSubmit} 
							label="Update" 
							primary={true} 
							onClick={ this._handleSubmit } />
						<MUI.FlatButton 
							label="Cancel" 
							onClick={ this._handleCancel } />
							
					</div>
				</Formsy.Form>
				: '' }

			</div>
			)
	},
	_handleSelectCategoryChange: function(e, index, value){
		this._handleChange("category_id", value)

	},
	_handleToggleChange: function(e, value){
		this._handleChange(e.currentTarget.name, value)
	},
	_handleChange: function(name, value){
		var item = this.state.item;

		if(/\./.test(name)){
			var test = name.split(".");
			item[test[0]][test[1]] = value
		}else{
			item[name] = value;
		}

		this.setState({
			item: item
		})
	},
	_handleSubmit: function(){
		Action.update(this.state.item);
	},
	_handleCancel: function(){
		this.context.router.push('/products');
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
