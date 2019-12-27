import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
//import Body from './components/Body'
import Home from './components/Home'
import Footer from './components/Footer'
import Auth from './components/Authentication'
import Movies from './components/Movies'
import Dashboard from './components/Dashboard'
import Movie from'./components/Movie'
class App extends Component {
  constructor(){
    super();
    this.state={
      curRoute  : 'home',
      isLoggedIn: false,
      movieId   : null,
      user      : {type: null}
  }
    this.changeRoute= this.changeRoute.bind(this);
  }
  changeRoute(e,routeName){
    var curr=document.getElementsByClassName('active');
    console.log(curr[0])
    if(curr.length>0)
      curr[0].classList.remove('active')
    var navElem=e.target
    navElem.classList.add('active')
    this.setState({curRoute: routeName});
    //console.log(this.state.curRoute);
  }
  componentDidUpdate(){
    console.log(this.state.curRoute)
  }
  componentDidMount() {
    if(JSON.parse(sessionStorage.getItem('user')!==null)){
      this.setState({user:JSON.parse(sessionStorage.getItem('user'))})
    }

    // axios.get(`http://localhost:8000/api/try`)
    // .then(res => {
    //   console.log(res['data']);
    //   this.setState({ isLoggedIn : true});
    // })

    
  }
  
  render() {
    const loggedIn=true;
    return (
      <div className="App"> 
      <script src="https://use.fontawesome.com/0746bccab0.js"></script> 
        <Router>
          { loggedIn&&
          <nav className={"navbar navbar-expand-lg "+(this.state.curRoute=='home'? 'homeNav':'')}  >
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" 
            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item " onClick={(e)=>this.changeRoute(e,'home')}>
                  <Link className="nav-link " to="/"><b className="active">Home</b></Link>
                </li>
                <li className="nav-item" onClick={(e)=>this.changeRoute(e,'movies')}>
                  <Link className="nav-link" to="/movies"><b>Movies</b></Link>
                </li>
                {  console.log(this.state.user['type']) }

                  {this.state.user['type']==='admin' &&
                  <li className="nav-item" onClick={(e)=>this.changeRoute(e,'dashboard')}>
                    <Link className="nav-link" to="/dashboard"><b>Dashboard</b></Link>
                  </li>
                }
                
              </ul>
              
                <button className="btn" onClick={()=>this.changeRoute('auth')}>
                <Link to="/auth"><i className="fas fa-sign-in" ></i>LOGIN/SIGN UP</Link></button>
            </div>
          </nav>
          }
          <div id="appBody" className="clearfix">
            <Switch>
             
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/movies">
                  <Movies></Movies> 
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/auth">
                  <Auth />
                </Route>
                <Route path="/movie/:id" children={<MovieFactory />}>
                </Route>
              </Switch>
          </div>
          </Router>

        <Footer />
      </div>
    );
  }
}
export default App;



function MovieFactory() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <Movie id={id} />
  );
}

