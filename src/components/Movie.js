import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Scroll from 'react-scroll';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
 
import '../App.css';
import axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Movie extends Component{
    constructor(props){
        super(props);
        this.state={
            movie:"",
            image:'',
            user:{id:0},
            screenings:[],
            screeningsOps:"",
            seatsHtml:[],
            seats   : [],
            takenSeats:[],
            rows:0,
            columns:0,
            pickedSeats:[],
            divDimension:1,
            test :React.createElement('div',{},"Hiiiiii")
        }
        //console.log(JSON.parse(sessionStorage.getItem('user')))
        this.changeScreen=this.changeScreen.bind(this)
        this.submitReservation=this.submitReservation.bind(this)

    }
    scrollTo(h) {
        scroll.scrollTo(h);
      }
    componentDidMount(){
        if(JSON.parse(sessionStorage.getItem('user'))){
            this.setState({user:JSON.parse(sessionStorage.getItem('user'))})
        }
        axios.get(`http://localhost:8000/api/movie/`+this.props.id)
        .then(res => {
        //console.log(res['data']);
       
        //console.log(res['data'])
        this.setState({movie: res['data']['movie'],image:res['data']['image']});
        }, (error) => {
            console.log(error);
          });
        
        axios.get(`http://localhost:8000/api/movieScreenings/`+this.props.id)
        .then(res => {
        //console.log(res['data']);
        
        //console.log(res['data'])
        var e;
        this.setState({screenings: res['data']}, this.changeScreen(e,true));
        const screeningsOps=res['data'].map((screening) =>
            <option key={screening['id']} value={screening['id']}>
                screening {screening['setting']}
            </option>   
        )
        this.setState({screeningsOps: screeningsOps})
        
        }, (error) => {
            console.log(error);
        });
        //this.renderSeats()
        
    }
    checkSeat(row,column){
        var taken =false
        this.state.takenSeats.forEach(function(seat){
            if (row===seat['row'] &&column===seat['column'])
            taken= true
        })
        return taken
    }
    fetchSeats(){
        //console.log('fetching')
        this.setState({seats:""})
        var i=0
        var j;
        var row
        var containerWidth=610
        var padding=2
        var numOfPaddings=(this.state.columns +1)*2
        containerWidth-=(padding*numOfPaddings)
        //console.log(containerWidth)
        var sideLength=Math.floor(containerWidth/this.state.columns)
        //sideLength=sideLength.toString()
        var check
        var className
        var newDiv
        var seatsRowArray
        var seatsRow
        for(i;i<this.state.rows;i++){
            seatsRowArray=[]
            row="<div class='row flexBoxContainer'>"
            j=0
            for(j;j<this.state.columns;j++){
                check=false
                check = this.checkSeat(i,j)
                className='seat'
                if(check ) className='takenSeat'
                row=row+"<div class='"+className+"' style='width:"+sideLength+"px;height:"+sideLength+"px;' onClick='"+ this.pickSeat+"'></div>"
                //if(i==0 &&j==0) console.log(row)
                var t1=i
                var t2=j
                newDiv=React.createElement('div', {key:i*this.state.columns+j,id:i*this.state.columns+j,onClick: (e)=>this.pickSeat(e),className: className , style:{width: sideLength+"px",height:sideLength+"px"}}, i*this.state.columns+j+1);
                seatsRowArray.push(newDiv)
            }
            seatsRow = React.createElement('div',{className:'row flexBoxContainer',key: i},seatsRowArray)

            row+="</div>"
            this.setState(prevState => ({
                seatsHtml   : [...this.state.seatsHtml, row],
                seats       : [...this.state.seats, seatsRow]
              }))
              //this.renderSeats
              //console.log(this.state.seats)
        }
    }
    try(event){
        console.log(event.target.id)
    }
    changeScreen(event,first){
        //console.log('lolo')
        console.log(this.state.screenings.length)
        if(!first)
            var id=event.target.value
        else {
            
            if(this.state.screenings.length==0) return;
            var id=this.state.screenings[0]
        }
        //this.setState({seatsHtml: ""})
        
        axios.get(`http://localhost:8000/api/screeningData/`+id)
        .then(res => {
        //console.log(res['data']);
       
        //console.log(res['data'])
        this.setState({
            takenSeats  : res['data']['takenSeats'],
            rows        : res['data']['rows'],
            columns     : res['data']['columns']
        });
        //console.log(res['data']['rows'])

        this.fetchSeats()
        }, (error) => {
            console.log(error);
          });
    }
    submitReservation(event){
        event.preventDefault()
        var num=this.state.pickedSeats.length

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/makeReservation',
            data: {
              seatsCount        :   num,
              seats             :   this.state.pickedSeats,
              screeningId       :   document.getElementById('screenSel').value,
              userId            :   this.state.user['id']

              
            }
          })
          .then((response) => {
            console.log(response);
            //this.fetchSeats()
            if (response['status']==200){
                for ( var it=0;it<this.state.pickedSeats.length;it++){
                    var elem=document.getElementById(this.state.pickedSeats[it])
                    elem.classList.remove('pickedSeat')
                    elem.classList.add('takenSeat')
                }
                alert('Successfull Reservation. Your reservation id is: ' +response['data']+'. Thank You!')

            }
            this.setState({pickedSeats:[]})
          }, (error) => {
            console.log(error);
            alert('Something went wrong. Sorry :(')
          });
    }
    pickSeat(event){
        var seatId=parseInt(event.target.id)
        var j= seatId%this.state.columns
        var i = Math.floor(seatId/this.state.columns)
        if(this.checkSeat(i,j)){
            return;
        }
        console.log(this.state.pickedSeats)
        
        if(this.state.pickedSeats.some(item => seatId==item)==1){
            var temp=this.state.pickedSeats
            var index = temp.indexOf(5);
            temp.splice(index,1)
            this.setState({pickedSeats: temp})
            document.getElementById(seatId).classList.remove('pickedSeat')
            return
        }
            
        this.setState(prevState => ({
            pickedSeats: [...this.state.pickedSeats, seatId]
          }))
        
        var seat =document.getElementById(seatId)
        console.log(seat)
        seat.classList.add('pickedSeat')
        
    }
    // renderSeats(){
    //     console.log('aye')
    //     const divsrows=this.state.seats.map((row,index) =>
    //         <div className="row flexBoxContainer" key={index}>
    //         { row.map((seat,idx)  =>
    //             <div className="seat" style={{width : this.state.divDimension+"px"}} key={idx}>

    //             </div>
            
    //         )}
    //         </div>
           
    //     );
    //     console.log(divsrows)
    //     this.setState({renderedSeats: divsrows})
    // }
    render(){
        return(
            <div id="MoviePage">
                <div className="row">
                    <div className="col-4 banner">
                    <img src={`data:image/png;base64,${this.state.image}`}/>
                    </div>
                    <div className="col-8 movieData">
                        <h1> {this.state.movie['name']} ({this.state.movie['genre']})</h1><hr />
                        <h4> {this.state.movie['length']} minutes</h4>
                        <h5>Available in cinema now. </h5><br></br>
                        <button className="btn btn-primary" onClick={()=>this.scrollTo(500)}>Buy Ticket</button>
                        <p>Note: You have to be logged in to buy a ticket.</p>
                    </div>
                </div>
                { this.state.user['id'] >0 &&    
                    <div id ="reservation">
                    <h1>Tickets Reservation</h1>
                    <hr/>
                    <p>All you have to do is select a suitable screening, pick your favourite available 
                        chairs(the ones in gray) and Confirm Reservation!</p>
                        <div className="row">
                            
                            <div className="formDiv col-4">
                                
                                <h4>This movie is available on: </h4>
                                <select className="form-control" id="screenSel" onChange={(event)=>this.changeScreen(event,false)}>
                                    {this.state.screeningsOps}
                                </select>
                            </div>
                            <div className="seatsContainer formDiv col-6">
                            <h4>Click on one of the grey seats to select it</h4>
                            <hr />
                            {
                                this.state.seats
                            }
                            </div>
                            
                        </div>
                        <form onSubmit={this.submitReservation}>
                        <button className="btn btn-primary">Confirm </button>
                        </form>
                    </div>
                }
            </div>
        );
    }
}
export default Movie;