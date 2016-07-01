var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var Rebase = require('re-base');
var base = Rebase.createClass('https://watchitnow.firebaseio.com/');

// <App />
var App = React.createClass({
  getInitialState : function() {
    return {
     movies : {},
    }
  },
  componentDidMount : function() {
    base.syncState('/', {
      context : this,
      state : 'movies',
    });
  },
  addMovie : function(movie) {
    var number = Math.floor((Math.random() * 1000) + 1);
    this.state.movies['movie' + number] = movie;
    this.setState({ movies : this.state.movies });
  },
  deleteMovie : function(key, status) {
    this.state.movies[key] = null;
    this.setState({ movies : this.state.movies });
  },
  addRating : function(key, rate) {
    this.state.movies[key].rating = rate;
    this.setState({movies : this.state.movies});
  },
  changeStatus : function(key) {
    this.state.movies[key].status = "watched";
    this.setState({movies : this.state.movies});
  },
  renderWatchedMovie : function(key) {
    if (this.state.movies[key].status == "not watched") {
      return (
        <Movie key={key} deleteMovie={this.deleteMovie} index={key} details={this.state.movies[key]} addRating={this.addRating} changeStatus={this.changeStatus} />
      )
    }
  },
  renderUnwatchedMovie : function(key) {
    if (this.state.movies[key].status == "watched") {
      return (
        <Movie key={key} deleteMovie={this.deleteMovie} index={key} details={this.state.movies[key]} addRating={this.addRating} changeStatus={this.changeStatus} />
      )
    }
  },
  render : function() {
    return (
      <div class="container">
        <Header />
        <MovieList addMovie={this.addMovie} />
        <ul className="movielist watched">
          {Object.keys(this.state.movies).map(this.renderWatchedMovie)}
        </ul>
        <ul className="movielist unwatched">
          {Object.keys(this.state.movies).map(this.renderUnwatchedMovie)}
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
  var rate = target.parentElement.children[0];
  rate.classList.add('show');
  },
  deleteMovieButton : function() {
    var key = this.props.index;
    this.props.deleteMovie(key);
  },
  onButtonClick : function(e) {
    var key = this.props.index;
    var parent = e.target.parentElement.parentElement;
    parent.classList.toggle('selected');
   var rateStars =  e.target.parentElement.parentElement.parentElement;
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
        <button className="delete-movie" onClick={this.deleteMovieButton}>Delete</button>
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
});

var AddMovieForm = React.createClass({
  createMovie: function(event) {
    event.preventDefault();
    var movie = {
      title : this.refs.title.value,
      status : this.refs.status.value,
      rating : ""
    }
    this.props.addMovie(movie);
    this.refs.movieForm.reset();
  },
  render: function() {
    return (
      <form className="add-movie-form" ref="movieForm" onSubmit={this.createMovie}>
        <input type="text" ref="title" placeholder="Movie Title" />
        <select ref="status">
          <option value="watched">Watched</option>
          <option value="not watched">Want To Watch</option>
        </select>
        <button type="submit">Add Movie</button>
      </form>
    )
  }
});

var MovieList = React.createClass({
  render: function() {
    return (
      <AddMovieForm {...this.props}/>
    )
  }
})

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('.app'));
