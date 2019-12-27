import React, { Component } from 'react';
import '../App.css';
import Home from './Home'
import Auth from './Authentication'
class Body extends Component{
    
    render(){
        let appBody;
        if(this.props.page=='home'){
            appBody=<Home />
        }
        else if(this.probs.page=='auth'){
            appBody=<Auth />
        }
        return(

            <div>
                {appBody}
            </div>
        );
    }
}
export default Body;