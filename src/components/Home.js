import React, { Component } from 'react';
import '../App.css';

class Home extends Component{
    render(){
        return(
            
            <div  id="homePage">
                <div className="homeCover">
                    <img src={process.env.PUBLIC_URL +'/images/cover.jpg'} alt="Cover"/>
                    <div id="slogan">
                        <h2 id="title">MovieTickets.com</h2>
                        <h4>THE ULTIMATE EXPERIENCE. </h4>
                    </div>
                    <a href="/movies"><button className="btn">Browse Movies</button></a>
                </div>
                <div className="container" id="howItWorks">
                    <div className="row">
                        <h1 style={{textAlign:"center",width:"100%"}}>SKIP THE LINES!</h1> <hr/>
                    </div>
                    <div className="raw" >
                    <h2>Book your ticket online now. Easier than ever.</h2>
                    <h4>Click your favourite movie, Select a screen, Pick the chairs you find suitable and proceed to checkout!</h4>
                    
                    </div>
                </div>
                
            </div>
        );
    }
}
export default Home;