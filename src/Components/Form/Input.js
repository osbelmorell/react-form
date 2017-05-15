import React, {Component} from 'react';

class Input extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			value:'',
			isValid: true,
			serverError:null,
			showValidationError:false,
			validationError:'',
			init:null
		}
	}

	componentWillMount()
	{
	    this.props.attachToForm(this);
	    this.setState({
	    	validationError:this.props.validationError + ' ' + (this.props.label || this.props.name)
	    });
	}

	componentWillUnmount() 
	{
		this.props.detachFromForm(this);	
	}

	setValue(val)
	{
		this.setState({
			value:val,
			init:true,
			showValidationError:false
		}, () => {
			this.props.validate(this);
		});
	}

	render()
	{
		//console.log('updated:' , this.state.isValid);
		const markAsValid = this.state.isValid;
		const markAsRequired = this.props.required && !this.state.value;
		let validationError = false;
		let className = '';

		if(markAsRequired){
			className = 'required';
		}else if(!markAsValid){
			className = 'invalid';
		}

		if(this.state.showValidationError){
			validationError = this.state.validationError;
			className += ' invalid'
		}else{
			validationError = markAsValid || markAsRequired ? null : this.state.serverError || this.state.validationError;
		}

		if(this.state.isValid){
			className += ' valid';
		}

		return(
			<div className={className}>
				{this.props.label && <label htmlFor={this.props.id}>{this.props.label}</label>}
				<input 
					type="text" 
					name={this.props.name}
					value={this.state.value}
					id={this.props.id}
					onChange={ e => this.setValue(e.currentTarget.value)}
				/>
				{validationError && <span className='error-message'>{validationError}</span>}
			</div>
		);
	}
}

Input.defaultProps = {
	value:'',
	id:'',
	name:'',
	label:null,
	validationError:'Please enter a valid',
	validations:"isLength:1",
	required:false
}

export default Input;