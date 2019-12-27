import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
class MoviesList extends Component{
    constructor(props){
        super(props);
        this.handleHover=this.handleHover.bind(this);
        this.handleMouseAway=this.handleMouseAway.bind(this);
        this.state={
            moviesDivs:""
        }
    }
    componentDidMount(){
        //console.log(this.props.movies)
        const divs=this.props.movies.map((movie,index) =>
            <div className="moviePoster " key={movie['id']} id={movie['name']} onMouseEnter={(e)=>this.handleHover(event,movie['name'])} 
            onMouseLeave={(e)=>this.handleMouseAway(event,movie['name'])}>
                <a href={"/movie/"+movie['id']}> <img src={`data:image/png;base64,${this.props.images[index]}`}/></a>
            
            </div>
        );
        this.setState({moviesDivs: divs});
    }
        handleHover(event,id){
            var div=document.getElementById(id);
            div.classList.add('moviePosterHover')
        }
        handleMouseAway(event,id){
            var div=document.getElementById(id);
            div.classList.remove('moviePosterHover')
        }
        render(){
            return(
                <div className="flexBoxContainer moviesRow">
                {this.state.moviesDivs}
                </div>
            )
        };
}

class Movies extends Component{
    constructor(){
        super();
        this.state={
            movies      :   [],
            images      :   [],
            moviesHtml  : []
        }
    }
    componentDidMount(){
        
        axios.get(`http://localhost:8000/api/movies`)
        .then(res => {
        //console.log(res['data']);
        this.setState({movies   :res['data']['movies'],
                        images  :res['data']['images']
        });

        
        //console.log('yeah')
        this.fetchMovies();
        }, (error) => {
            console.log(error);
          });
    }
    fetchMovies(){
        const moviesPerLine=5;
        let n;
        if(this.state.movies.length % moviesPerLine==0 ){
            n=this.state.movies.length / moviesPerLine
        }
        else{
            let x=this.state.movies.length - (this.state.movies.length % moviesPerLine);
            n=(x/moviesPerLine)+1
        }
        //console.log(n);
        let i=0;
        console.log(this.state.movies)
        for (i; i<n;i+=1){
            let fetchRow=this.state.movies.slice(i*moviesPerLine,Math.min(i*moviesPerLine+moviesPerLine,this.state.movies.length));
            let fetchRowImages=this.state.images.slice(i*moviesPerLine,Math.min(i*moviesPerLine+moviesPerLine,this.state.images.length));
            
            let newLine= <MoviesList movies={fetchRow} images={fetchRowImages} />
            this.setState(prevState => ({
                moviesHtml: [...this.state.moviesHtml, newLine]
              }))
        }
    }
    render(){
        return(
            <div  className="moviesContainer ">
                <h1 style={{textAlign:"left",paddingLeft:"20px"}}>NOW PLAYING</h1>
                {this.state.moviesHtml}
            </div>
                
        );
    }
}
export default Movies;