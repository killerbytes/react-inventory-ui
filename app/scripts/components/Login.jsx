import React from 'react';
import MUI from 'material-ui';

import Action from '../actions/users';
import Store from '../store/users';

import FormInput from './FormInput';

function getStateFromStores(){
	return {
		user: {}
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
		Store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function(){
		var user = this.state.user;
		return (
			<div>
				<Formsy.Form 
					onValid={this._enableButton} 
					onInvalid={this._disableButton}>

					<FormInput 
						name="email" 
						value={user.email}
						onChange={ this._handleChange }
						floatingLabelText="Email" 
						validationError="This field is required"
						required/>

					<FormInput 
						name="password" 
						type="password"
						value={user.password}
						onChange={ this._handleChange }
						floatingLabelText="Password" 
						validationError="This field is required"
						required/>

					<br />
					<div className="text-center">
						<MUI.FlatButton 
							disabled={!this.state.canSubmit} 
							label="Login" 
							primary={true} 
							onClick={ this._handleSubmit } />
						<MUI.FlatButton 
							label="Cancel" 
							onClick={ this._handleCancel } />
					</div>
				</Formsy.Form>


			</div>
			)
	},
	_handleChange: function(name, value){
		var item = this.state.user;

		if(/\./.test(name)){
			var test = name.split(".");
			item[test[0]][test[1]] = value
		}else{
			item[name] = value;
		}

		this.setState({
			user: item
		})
	},
	_handleSubmit: function(){
		Action.login(this.state.user);
	},
	// _handleCancel: function(){
	// 	this.context.router.push('/products');
	// },
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
