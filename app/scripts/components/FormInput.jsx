import React from 'react';
import Formsy from 'formsy-react';
import MUI from 'material-ui';

module.exports = React.createClass({
	mixins: [Formsy.Mixin],
	propTypes: {
		name: React.PropTypes.string.isRequired,
		value: React.PropTypes.any,
		floatingLabelText: React.PropTypes.string.isRequired,
		hintText: React.PropTypes.string,
		rows: React.PropTypes.number,
		multiLine: React.PropTypes.bool,
		errorText: React.PropTypes.string
	},
  	getInitialState(){
		return {
			errorText: null
		}
	},
	componentWillReceiveProps(props, state){
		if(!this.isPristine() && this.isRequired() && !props.value){
			this.setState({
				errorText: "This field is required"
			})			
		}else{
			this.setState({
				errorText: this.getErrorMessage()
			})

		}

	},
	// validate(){
	// 	console.log(this.getErrorMessage())
	// 	return this.props.required ? !!this.getValue() : true;
	// },
	render() {
		// const className = 'form-group' + (this.props.className || ' ') + (this.showRequired() ? 'required' : this.showError() ? 'error' : null);
		const errorMessage = this.getErrorMessage();
		let field;
		switch(this.props.type){
			case "date":
				field = (
					<MUI.DatePicker
						fullWidth={true}
						name={ this.props.name }
						value={ this.props.value ? new Date(  this.props.value ) : null}
						onChange = { this._onChange }
						floatingLabelText= { this.props.floatingLabelText + (this.isRequired() ? ' *' : '') } />
					)
			break;
			case "toggle":
				field = (
					<MUI.Toggle
						name={ this.props.name }
						value={this.props.value }
						defaultToggled={ this.props.defaultToggled }
						onToggle={ this._onChange }
						label={ this.props.floatingLabelText }/>
  					)
			break;
			case "checkbox":
				field = (
					<MUI.Checkbox
						checked={this.props.value }
						onCheck={ this._onChange }
						label={ this.props.floatingLabelText }/>
  					)
			break;
			default:
				field = (
					<MUI.TextField
						fullWidth={true}
						onChange = { this._onChange }
						errorText={ this.state.errorText }
						value={ this.props.value }  
						type={this.props.type}    			
						name={ this.props.name }
						multiLine={ this.props.multiLine }
						hintText={ this.props.hintText }
						rows={ this.props.rows }						
						floatingLabelText= { this.props.floatingLabelText + (this.isRequired() ? ' *' : '') } />
					)
			break;

		}
		return ( 
				<div>{ field }</div>
		);
	},
	_onChange(e, value) {
		// if(!this.isValid()){
		// 	this.setState({
		// 		errorText: this.getErrorMessage()
		// 	})
		// }else{
		// 	this.setState({
		// 		errorText: null
		// 	})			
		// }

		// if(this.isRequired()){
		// 	this.setState({
		// 		errorText: value ? null : "This field is required"
		// 	})			
		// }
	    this.setValue(e ? e.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']: value);
		var value = e ? e.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'] : value;
		// var value = this.props.type === 'toggle' ? value : (e ? e.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'] : value)
		if(this.props.onChange) this.props.onChange(this.props.name, value);
	
		// switch(this.props.type){
		// 	case 'date':
				// this.setState({ value: value })
		// 		break;
		// 	default:
		// 		this.setValue(e.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'])
		// 		break;
		// }

		// this.setValue(e.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'])
		// this.setValue(value);
	},

});
