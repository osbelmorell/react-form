import React, {Component} from 'react';
import validator from 'validator';

console.log(validator.isMobilePhone('3053086033', 'en-US'));

class Form extends Component
{
	constructor(props) {
		super(props);
		this.attachToForm = this.attachToForm.bind(this);
		this.detachFromForm = this.detachFromForm.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.validate = this.validate.bind(this);

		this.state = {
			isSubmitting:false,
			isValid: true
		}
	}
	componentWillMount() {
		this.model = {};
		this.inputs = {};
		this.childrens = null;
		this.registerInputs();
	}

	componentDidMount()
	{
		// When the form loads we validate it
		this.validateForm();	
	}

	registerInputs()
	{
		if(!this.props.children) return;
		this.childrens = React.Children.map(this.props.children, child => {
			if(child.props.name){
				return React.cloneElement(child, {
					attachToForm:this.attachToForm,
					detachFromForm:this.detachFromForm,
					validate:this.validate
				});
			}else{
				return React.cloneElement(child);
			}
			
		});
	}

	updateModel()
	{
		Object.keys(this.inputs).forEach(name => {
			this.model[name] = this.inputs[name].state.value;
		});
	}

	submit(ev)
	{
		ev.preventDefault();

		if(this.state.isSubmitting) return;

		this.setState({
			isSubmitting:true
		});

		this.updateModel();
		
		if(this.state.isValid){
			console.log('post to API');
			//success
			this.success();

			//errors
			this.setErrorsOnInputs([{
				name:'email',
				isValid:false,
				error:'enter a valid first name'
			}]);

		}else{
			this.showInputsErrors();
		}

	}

	success()
	{
		if(this.props.changeUrl)
		{
			location.href = this.props.changeUrl;
		}
	}

	setErrorsOnInputs(errors)
	{
		const inputs = this.inputs;

		errors.forEach(input => {
			const component = inputs[input['name']];
			component.setState({
				isValid:false,
				serverError:input['error']
			}, this.validateForm)
		});

		this.setState({
			isSubmitting:false
		});
	}

	showInputsErrors()
	{
		const inputs = this.inputs;
		
		Object.keys(inputs).forEach( name => {
			//console.log(inputs[name].state);
			if(!inputs[name].state.isValid){
				inputs[name].setState({
					showValidationError:true
				});
			}
		});

		this.setState({
			isSubmitting:false
		});
	}


	validate(component)
	{
		// If no validations property, do not validate
		if(!component.props.validations){
			return;
		}

		let isValid = true;

		//validate if the input has value or if it is required

		if(component.props.value || component.props.required){
			// We split on comma to iterate the list of validation rules
			component.props.validations.split(',').forEach(validation => {
				
				// By splitting on ":"" we get an array of arguments that we pass
        		// to the validator. ex.: isLength:5 -> ['isLength', '5']
				let args = validation.split(':');

				//We remove the top item and are left with the method to
				//We remove the top item and are left with the method to
				const validateMethod = args.shift();
				
				
				// We use JSON.parse to convert the string values passed to the
        		// correct type. Ex. 'isLength:1' will make '1' actually a number
        		//args.map( arg => JSON.parse(arg));

        		// We then merge two arrays, ending up with the value
        		// to pass first, then options, if any. ['valueFromInput', 5]
        		args = [component.state.value].concat(args);
        		//console.log(validateMethod, args);

        		if(!validator[validateMethod].apply(validator, args)){
        			isValid = false;
        		}
			});
		}

		component.setState({
			isValid:isValid
		}, this.validateForm);

	}

	myFunction()
	{
		console.log('hello bitchers');
	}

	validateForm()
	{
		//console.log(this.state);
		let allIsValid = true;

		const inputs = this.inputs;

		Object.keys(inputs).forEach( name => {
			if(!inputs[name].state.isValid){
				allIsValid = false;
			}
		});

		/// set valid state to form
		this.setState({
			isValid:allIsValid
		});
	}

	attachToForm(component) {

	    this.inputs[component.props.name] = component;
    
	    // We add the value from the component to our model, using the
	    // name of the component as the key. This ensures that we
	    // grab the initial value of the input
	    this.model[component.props.name] = component.state.value;
	    // We have to validate the input when it is attached to put the
    	// form in its correct state
	    this.validate(component);
	}
	  
	  // We want to remove the input component from the inputs map
	detachFromForm(component) {
	    delete this.inputs[component.props.name];
	    // We of course have to delete the model property
	    // if the component is removed
	    delete this.model[component.props.name];
	}

	render()
	{
		return(
			<form onSubmit={this.submit.bind(this)}>
		        {this.childrens}
		        
		        <button 
		        	type="submit"
		        	disabled={this.state.isSubmitting? true : false}
		        >
		        	{this.props.button}
		        </button>

		    </form>
		);
	}
}

Form.defaultProps = {
	changeUrl: false,
	button:'submit'
}

export default Form;