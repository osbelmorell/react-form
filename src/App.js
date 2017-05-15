//import PropTypes from 'prop-types';
import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Form from './Components/Form/';
import Input from './Components/Form/Input';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form:null
    }
  }

  componentDidMount() {
    let items = {};
    items['osbel1'] = [Math.random(1,19)]
    items['osbel2'] = [Math.random(1,19)]
    items['osbel3'] = [Math.random(1,19)]
    //console.log(items);
    setTimeout(()=>{
      delete items.osbel2;
      //console.log(items);
      // this.setState({
      //   form:[
      //     {
      //       name:'hello1',
      //       type:'text',
      //       id:'hello_1'
      //     },
      //     {
      //       name:'hello2',
      //       type:'number',
      //       id:'hello_2'
      //     },
      //     {
      //       name:'hello',
      //       type:'text',
      //       id:'hello_3'
      //     }
      //   ]
      // })
    },600)
  } 
  render() {
    return (
      <div className="App">
        <Form changeUrl='http://www.google.com'>
          <Input label={'Email'} name={'email'} id={'email'} validations="isEmail" required/>
          <Input label={'name'} name={'osbel2'} id={'osbel2'} required />
          <Input label={'Phone'} name={'phone'} id={'phone'} required validations={"isMobilePhone:en-US"} />
          <Input label={'Zip'} name={'osbel3'} id={'osbel3'} required validations="isFloat,isLength:5:5"/>
        </Form>
      </div>
    );
  }
}

export default App;
