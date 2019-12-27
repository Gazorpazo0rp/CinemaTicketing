import React, { Component } from 'react';
import '../App.css';
import axios,{ post } from 'axios';
import DateTimePicker from 'react-datetime-picker'
class Dashboard extends Component{
    constructor(){
        super();
        this.submitNewMovie=this.submitNewMovie.bind(this);
        this.imageHandler=this.imageHandler.bind(this);
        this.submitNewScreen=this.submitNewScreen.bind(this)
        this.submitNewScreening=this.submitNewScreening.bind(this)
        this.state={
            coverImage  : null,
            moviesOps      : "",
            screensOps     : "",
            date: new Date()
        }


    }
    componentDidMount(){
        
        //
        axios.get(`http://localhost:8000/api/movies`)
        .then(res => {
        //this.setState({screens   :res['data']});
        const movieOps=res['data']['movies'].map((movie) =>
            <option key={movie['id']} value={movie['id']}>
                {movie['name']}
            </option>   
            
        );
        this.setState({moviesOps:    movieOps})
        console.log(movieOps)
        }, (error) => {
            console.log(error);
            });
        
        axios.get(`http://localhost:8000/api/screens`)
        .then(res => {
            const screenOps=res['data'].map((screen) =>
            <option key={screen['id']} value={screen['id']}>
                Screen {screen['id']}
            </option>   
            
        );
        this.setState({screensOps:    screenOps})
        //this.setState({movies   :res['data']});
        }, (error) => {
            console.log(error);
        });
          
    }
    submitNewMovie(event){
        event.preventDefault();
        let movieName=document.getElementById('movieName').value;
        let movieGenre=document.getElementById('movieGenre').value;
        let movieLength=document.getElementById('movieLength').value;
        const formData = new FormData();
        formData.append('image',this.state.coverImage)
        formData.append('name',movieName)
        formData.append('genre',movieGenre)
        formData.append('length',movieLength)
        console.log(formData);
        const url = 'http://localhost:8000/api/addMovie';
        const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    post(url, formData,config).then((response) => {
            console.log(response);
            alert('Movie Added Susscessfully <3')
          }, (error) => {
            console.log(error);
            alert('Sorry Try again.')
          });

        // axios({
        //     method: 'post',
        //     url: 'http://localhost:8000/api/addMovie',
        //     data: {
        //       name      :   movieName,
        //       genre     :   movieGenre,
        //       length    :   movieLength,
        //       image     :   fileData
        //     },
        //     config:{
        //         headers: {
        //             'content-type': 'multipart/form-data'
        //         }
        //     }
        //   })
        //   .then((response) => {
        //     console.log(response);
        //   }, (error) => {
        //     console.log(error);
        //   });
    }
    imageHandler(event){
        this.setState({
            coverImage: event.target.files[0]
            
        });
        console.log(this.state.coverImage)
    }
    submitNewScreen(event){
        event.preventDefault();
        let rows= document.getElementById('rows').value
        let columns= document.getElementById('columns').value
        
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/addScreen',
            data: {
              rows          :   rows,
              columns       :   columns,
              
            }
          })
          .then((response) => {
            console.log(response);
          }, (error) => {
            console.log(error);
          });
    }
    submitNewScreening(event){
        event.preventDefault();
        var e=document.getElementById('movieSel')
        var movieId=e.options[e.selectedIndex].value 
        var ee=document.getElementById('screenSel')
        var screenId=ee.options[ee.selectedIndex].value 
        var setting =document.getElementById('setting')
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/addScreening',
            data: {
              movieId      :   movieId,
              screenId     :   screenId,
              setting      :   this.state.date
            }
          })
          .then((response) => {
            console.log(response);
          }, (error) => {
            console.log(error);
          });
    }
    onChangeDate = date => this.setState({ date })

    render(){
        return(
            <div id="Dashboard">
                <div className="formDiv">
                    <form onSubmit={this.submitNewMovie}>
                        <h2>ADD NEW MOVIE</h2>
                        <div className="form-group">
                            <input type="text" className="form-control" id="movieName" placeholder="Movie Name" required/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="movieGenre" placeholder="Movie Genre" required/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="movieLength" placeholder="Movie Length in minutes" required/>
                        </div>
                        <div className="form-group">
                            <input  type="file" id="file" onChange={this.imageHandler} required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div id ="addScreenForm"className="formDiv">
                    <form onSubmit={this.submitNewScreen}>
                        <h2>ADD NEW SCREEN</h2>
                        <div className="form-group">
                            <input type="text" className="form-control" id="rows" placeholder="Screen Rows" required/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="columns" placeholder="Screen Columns" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div id="addScreening" className="formDiv">
                    <form onSubmit={this.submitNewScreening}>
                        <h2>ADD MOVIE SCREENING</h2>
                        <div className="form-group">
                        <p>Select a movie</p>
                            <select className="form-control" id="movieSel" placeholder="Select Movie">
                                {this.state.moviesOps}
                            </select>
                        </div>
                        <div className="form-group">
                            <p>Select a screen</p>
                            <select className="form-control" id="screenSel">
                                {this.state.screensOps}
                            </select>
                        </div>
                        <div className="form-group">
                            <p>Set the screening setting</p>
                            <DateTimePicker id="setting" onChange={this.onChangeDate} value={this.state.date}/>
                        </div>
                        

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            
        );
    }
}
export default Dashboard;