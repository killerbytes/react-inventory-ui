import React from 'react';
import MUI from 'material-ui';
import ActionAdd from 'material-ui/lib/svg-icons/content/add';

import Store from '../store/categories';
import Action from '../actions/categories';

import FormInput from './FormInput';

function getStateFromStores(){
	return {
	    categories: Store.list()
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
		Store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function(){
		let style = { position: 'fixed', bottom: 30, right: this.state.openFilterNav ? 250 : 30, zIndex: 1400 };
		const actions = {
			newItem: [
				<MUI.FlatButton
					label="Cancel"
					secondary={true}
					onTouchTap={this._handleClose} />,
				<MUI.FlatButton
					label="Submit"
					primary={true}
					disabled={!this.state.canSubmit} 
					onTouchTap={this._handleCreate } />
			],
			editItem: [
				<MUI.FlatButton
					label="Cancel"
					secondary={true}
					onTouchTap={this._handleClose} />,
				<MUI.FlatButton
					label="Update"
					primary={true}
					disabled={!this.state.canSubmit} 
					onTouchTap={this._handleUpdate } />
			]
		}

		var categories = this.state.categories && this.state.categories.map(function(i){
			let isActive = i.active ? {} : { backgroundColor: '#EEE', color: '#999'};

			return <MUI.ListItem 
						key={i.id} 
						style={isActive}
						primaryText={i.name} 
						onTouchTap={ this._onClick.bind(this, i) }/>
		}.bind(this))

		var item = this.state.item;
		return (
			<div>
				<MUI.FloatingActionButton style={style} onClick={this._handleAdd }>
					<ActionAdd />
				</MUI.FloatingActionButton>

				<div className="row">			
					<MUI.List>
						{ categories }
					</MUI.List>	
					<MUI.Dialog
						title="Edit Category"
						actions={actions.editItem}
						modal={true}
						open={this.state.openEdit}>
						{ item ? 
						<Formsy.Form 
							onValid={this._enableButton} 
							onInvalid={this._disableButton}>
							<FormInput 
								value={ item.name }
								name="name" 
								onChange={ this._handleChange }
								floatingLabelText="Name" 
								required/>
							<FormInput 
								value={ item.active }
								type="checkbox"
								name="active" 
								onChange={ this._handleChange }
								floatingLabelText="Active"/>
						</Formsy.Form>
						: '' }

					</MUI.Dialog>
					<MUI.Dialog
						title="New Category"
						actions={actions.newItem}
						modal={true}
						open={this.state.openNew}>
						<Formsy.Form 
							onValid={this._enableButton} 
							onInvalid={this._disableButton}>

							<FormInput 
								name="name" 
								onChange={ this._handleChange }
								floatingLabelText="Name" 
								required/>
						</Formsy.Form>

					</MUI.Dialog>
				</div>

			</div>
			)
	},
	_handleAdd: function(){
		this.setState({
			item: {},
			openNew: true
		})		
	},
	_onClick: function(item){
		this.setState({
			openEdit: true,
			item: item
		})

	},
	_handleClose: function(url){
		this.setState({
			openEdit: false,
			openNew: false
		})
	},
	_handleChange: function(name, value){

		var item = this.state.item;
		item[name] = value;
		
		this.setState({
			item: item
		})
	},
	_handleCreate: function(){
		Action.create(this.state.item);
		this.setState({
			openNew: false
		})
	},

	_handleUpdate: function(){
		Action.update(this.state.item);
		this.setState({
			openEdit: false
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
