import React from 'react';
import MUI from 'material-ui';

import Action from '../actions/users';
import Store from '../store/users';

import FormInput from './FormInput';

function getStateFromStores(){
	return {
		users: Store.list()
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
    	Action.list();
		Store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function(){
		console.log(this.state.users)
		var users = this.state.users && this.state.users.map(function(i){
			let isActive = i.active ? {} : { backgroundColor: '#EEE', color: '#999'};

			return <MUI.ListItem 
						key={i.id} 
						style={isActive}
						primaryText={i.name} 
						onTouchTap={ this._onClick.bind(this, i) }/>
		}.bind(this))

		return (
			<div>
				<MUI.List>
					{ users }
				</MUI.List>	


			</div>
			)
	},
	_onClick: function(){
		
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
		Action.create(this.state.user);
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
