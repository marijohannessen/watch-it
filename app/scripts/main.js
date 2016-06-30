var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var Rebase = require('re-base');
var base = Rebase.createClass('https://marismovies.firebaseio.com/');

var movieJSON = {
  movie1 : {
    title: "Titanic",
    image: "http://images.moviepostershop.com/titanic-movie-poster-1997-1020339699.jpg",
    status: "not watched",
    rating: ""
  },
  movie2 : {
    title: "Taken",
    image: "https://www.movieposter.com/posters/archive/main/77/MPW-38536",
    status: "not watched",
    rating: ""
  },
  movie3 : {
    title: "Love Actually",
    image: "http://vignette3.wikia.nocookie.net/glee/images/9/9e/Love-actually-poster.jpg/revision/latest?cb=20121110180622",
    status: "not watched",
    rating: ""
  }
};

// <App />
var App = React.createClass({
  getInitialState : function() {
    return {
     movies : movieJSON
    }
  },
  componentDidMount : function() {
    base.syncState('/', {
      context : this,
      state : 'movies',
      then() {
        this.setState({movies: movieJSON})
      }
    });
  },
  addRating : function(key, rate) {
    this.state.movies[key].rating = rate;
    this.setState({movies : this.state.movies});
  },
  changeStatus : function(key) {
    this.state.movies[key].status = "watched";
    this.setState({movies : this.state.movies});
  },
  renderMovie : function(key) {
    return (
      <Movie key={key} index={key} details={this.state.movies[key]} addRating={this.addRating} changeStatus={this.changeStatus} />
    )
  },
  render : function() {
    return (
      <div class="container">
        <Header />
        <ul className="movielist">
          {Object.keys(this.state.movies).map(this.renderMovie)}
      </ul>
      </div>
    )
  }
});

// <Header />
var Header = React.createClass({

  render : function() {
    return (
      <div className="header">Watch It</div>
    )
  }
});

// <Movie /> li
  // Title
  // Image
  // Watched status
var Movie = React.createClass({

  getRating : function(rating) {
    var stars = [];
    if (rating === '') {
      stars.push(<p>Not yet rated</p>);
    }
    else {
      for (var i = 0; i < rating; i++) {
      stars.push(<i className="fa fa-star star" aria-hidden="true"></i>);
    }
    }
    return (
      <div>{stars}</div>
    )
  },
  handleClick : function(e) {
    var hasWatched = (this.props.details.status === 'watched' ? true : false);
    if (!hasWatched) {
      this.props.changeStatus(this.props.index);
    }
      else {
        this.showRating(e.target);
      }
    },
  showRating : function(target) {
  var rate = target.parentElement.children[0];    rate.classList.add('show');
  },
  onButtonClick : function(e) {
    var key = this.props.index;
    var parent = e.target.parentElement.parentElement;
    parent.classList.toggle('selected');
   var rateStars =      e.target.parentElement.parentElement.parentElement;
   var rating;
   for (var i = 0; i < rateStars.children.length; i++) {
     rateStars.children[i].classList.remove('selected');
     if (rateStars.children[i] === parent) {
        for (var j = 0; j < i+1; j++) {
        rateStars.children[j].classList.add('selected');
       }
       rating = (i+1);
     rateStars.parentElement.classList.remove('show');
     }
   }
    this.props.addRating(key, rating);
  },
  render : function() {
    var details = this.props.details;
    var hasWatched = (details.status === 'watched' ? true : false);
    var hasRated = (details.rating === "" ? false : true);
    var buttonText = ((hasWatched && hasRated) ? 'Movie Rated' : (hasWatched) ? 'Rate Now' : 'Watched It');
    var buttonClass = ((hasWatched && hasRated) ? 'doneRating' : (hasWatched) ? 'rateNow' : 'watchNow');
    return (
      <li className="movie">
        <div className="movie-header">
          <h2>{details.title}</h2>
          <div className="stars">{this.getRating(details.rating)}</div>
        </div>
        <div className="footer">
        <div className="rateMovie">
          <ul>
            <li><a onClick={this.onButtonClick}><i className="fa fa-star empty-star" aria-hidden="true"></i></a></li>
            <li><a onClick={this.onButtonClick}><i className="fa fa-star empty-star" aria-hidden="true"></i></a></li>
            <li><a onClick={this.onButtonClick}><i className="fa fa-star empty-star" aria-hidden="true"></i></a></li>
            <li><a onClick={this.onButtonClick}><i className="fa fa-star empty-star" aria-hidden="true"></i></a></li>
            <li><a onClick={this.onButtonClick}><i className="fa fa-star empty-star" aria-hidden="true"></i></a></li>
          </ul>
        </div>
        <button onClick={this.handleClick} disabled={hasRated} className={buttonClass}>{buttonText}</button>
        </div>
      </li>
    )
  }
})

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('.app'));
