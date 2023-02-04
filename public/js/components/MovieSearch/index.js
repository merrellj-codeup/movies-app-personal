import MovieCard from '../MovieCard/index.js';

class MovieSearch {
    constructor() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('search-wrapper');
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', 'Search for a movie ...');
        this.input.classList.add('movie-search');
        this.input.addEventListener('focusin', this.handleFocusIn.bind(this));
        // run this.handleFocusOut whenever the escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
                this.handleFocusOut();
            }
        });
        // add a debounce to the input
        this.input.addEventListener('input', this.handleDebounce.bind(this));
        this.input.moviesearch = this;
        this.render();
    }
    render() {
        this.wrapper.appendChild(this.input);
        document.querySelector('.navigation-wrapper').appendChild(this.wrapper);
    }
    handleFocusIn() {
        this.wrapper.classList.add('open');
        // prevent the body from scrolling
        document.body.style.overflow = 'hidden';
    }
    handleFocusOut() {
        //clear the input
        this.input.value = '';
        this.input.blur();
        // allow the body to scroll
        document.body.style.overflow = 'auto';
        let movieGrid = this.wrapper.querySelector('.movie-grid');
        if (movieGrid) {
            movieGrid.remove();
        }
        this.wrapper.classList.remove('open');
    }
    handleDebounce() {
        // clear the timeout
        clearTimeout(this.input.timeout);
        // start a new timeout
        this.input.timeout = setTimeout(() => {
            this.handleSearch();
        }, 500);
    }
    handleSearch() {
        // get the value of the input
        let query = this.input.value;
        // if the query is empty, return
        if (query === '' || query.length < 3 || query === this.input.lastQuery) {
            return;
        }
        if (query.toLowerCase() === 'the' || query.toLowerCase() === 'the ') {
            return;
        }
        // set the last query
        this.input.lastQuery = query;
        console.log('Searching for =>', query);
        // add a div to the wrapper
        let movieGrid = this.wrapper.querySelector('.movie-grid');
        if (movieGrid) {
            movieGrid.remove();
            movieGrid = document.createElement('div');
            movieGrid.classList.add('movie-grid');
        } else {
            movieGrid = document.createElement('div');
            movieGrid.classList.add('movie-grid');
        }
        this.wrapper.appendChild(movieGrid);
        // get the movies
        this.getMovies(query);
    }
    async getMovies(query) {
        // get the movies from the API
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${keys.tmdb}&language=en-US&query=${query}&page=1&include_adult=false`;
        let response = await fetch(url);
        let movies = await response.json();
        this.renderMovies(movies.results);
    }
    renderMovies(movies) {
        // remove any existing movies
        let movieGrid = this.wrapper.querySelector('.movie-grid');
        movieGrid.innerHTML = '';
        // loop through the movies
        let interval = 50;
        movies.forEach((movie, index) => {
            // create the movie element
            let movieCard = new MovieCard(movie, movieGrid);
            // delay 50ms before moving to the next movie
            setTimeout(function () {
                let movieAnimation = movieCard.element.animate([
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1
                    }
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
              }, index * interval);
        });
    }
}

export default MovieSearch