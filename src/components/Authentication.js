import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    
  } from "react-router-dom";
  import { Redirect } from 'react-router'

import axios from 'axios';
class Auth extends Component{
    constructor(props){
        super(props);
        this.login=this.login.bind(this);
        this.handleLogin=this.handleLogin.bind(this);
        this.handleRegister=this.handleRegister.bind(this);
        this.loginmailupdate=this.loginmailupdate.bind(this);
        this.loginpasswordupdate=this.loginpasswordupdate.bind(this);
        this.signupfirstnameupdate=this.signupfirstnameupdate.bind(this);
        this.signuplastnameupdate=this.signuplastnameupdate.bind(this);
        this.signupemailupdate=this.signupemailupdate.bind(this);
        this.signuppasswordupdate=this.signuppasswordupdate.bind(this);
        this.state={
            loginMail:"",
            loginPassword:"",
            signupfirstname:"",
            signuplastname:"",
            signupemail:"",
            signuppassword:"",
            redirect:false
        }
    }
    login(){
        console.log('here');
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/login',
            data: {
              email: this.state.loginMail,
              passowrd: this.state.loginPassword
            }
          })
          .then((response) => {
            console.log(response['data']);
            if(response!==0){
                sessionStorage.setItem('user',JSON.stringify(response['data']))
                let user= JSON.parse(sessionStorage.getItem('user'))
                this.setState({redirect: true})
            }
          }, (error) => {
            console.log(error);
          });
    }
    register(){
        console.log(this.state.signuppassword);
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/register',
            data: {
              email: this.state.signupemail,
              firstName:this.state.signupfirstname,
              lastName:this.state.signuplastname,
              password: this.state.signuppassword,
            }
          })
          .then((response) => {
            console.log(response);
            if(response!==0){
                sessionStorage.setItem('user',JSON.stringify(response['data']))
                let user= JSON.parse(sessionStorage.getItem('user'))
                this.setState({redirect: true})
            }
          }, (error) => {
            console.log(error);
          });
    }
    loginmailupdate(event){
        this.setState({loginMail:event.target.value});
    }
    loginpasswordupdate(event){
        this.setState({loginPassword:event.target.value});
    }
    signupfirstnameupdate(event){
        this.setState({signupfirstname:event.target.value});
    }
    signuplastnameupdate(event){
        this.setState({signuplastname:event.target.value});
    }
    signupemailupdate(event){
        this.setState({signupemail:event.target.value});
    }
    signuppasswordupdate(event){
        this.setState({signuppassword:event.target.value});
    }
    handleLogin(event){
        event.preventDefault();
        this.login();
    }
    handleRegister(event){
        event.preventDefault();
        this.register();
    }
    render(){
        const { redirect } = this.state;

        if (redirect) {
          return <Redirect to='/'/>;
        }
        return(
            <div id="auth" className="clearfix">
                <div id="loginForm" className="formDiv">
                    <form onSubmit={this.handleLogin}>
                        <h2>Log in</h2>
                        <div className="form-group">
                            <input type="email" name="email"className="form-control"  
                            value={this.state.loginMail} onChange={this.loginmailupdate}aria-describedby="emailHelp" 
                            placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <input type="password" value={this.state.loginPassword}name="password" 
                            onChange={this.loginpasswordupdate} 
                            className="form-control"  placeholder="Password" />
                        </div>
                        
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div id="signupForm" className="formDiv">
                    <form onSubmit={this.handleRegister}>
                        <h2>Sign up</h2>
                        <div className="form-group">
                            <input type="text" className="form-control" value={this.state.signupfirstname} 
                            onChange={this.signupfirstnameupdate} name="firstName"placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" value={this.state.signuplastname} 
                            onChange ={this.signuplastnameupdate} placeholder="Last Name" />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control" value={this.state.signupemail} 
                            name="email"onChange={this.signupemailupdate} aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" value={this.state.signuppassword} 
                             onChange={this.signuppasswordupdate} placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>                
            </div>                
        );
    }
}
export default Auth;