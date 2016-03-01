import React from 'react';
import MUI from 'material-ui';

import Store from '../../store/users';
import Action from '../../actions/users';

import FormInput from '../FormInput';

function getStateFromStores(){
	return {
	    user: Store.get()
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
		Store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
		CategoriesStore.removeChangeListener(this._onChange);
	},
	render: function(){
		var item = this.state.user;
		if(!item) return false;
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

					<FormInput 
						name="password" 
						value={item.password}
						onChange={ this._handleChange }
						floatingLabelText="Password" 
						validationError="This field is required"
						required/>

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
