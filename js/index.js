import { getFavMovies, getSpotlightMovies } from "./movies-api.js";
import { featuredMovies, FeaturedMovie, handleArrowKeys, handleSlideTimer } from "./components/MovieFeatured/index.js";
import SpotlightMovie from "./components/MovieCard/index.js";
import MovieSearch from "./components/MovieSearch/index.js";

(async () => {
    // set a cookie to prevent the browser from blocking the fetch requests to the TMDB API
    document.cookie = "cookie_name=cookie_value; samesite=lax";
    // create a new instance of the MovieSearch class
    // this will render the search bar and handle the search functionality
    let search = new MovieSearch();
    // get the user's favorite movies from json-server
    let movies = await getFavMovies();
    // filter out any movies that don't have a credits property
    movies = movies.filter(movie => movie.credits);
    // create a new FeaturedMovie instance for each movie
    for (let movie of movies) {
        let featuredMovie = new FeaturedMovie(movie);
    }
    //shuffle the featured movies
    featuredMovies.sort(() => Math.random() - 0.5);
    //render the featured movies
    featuredMovies.forEach((movie, index) => {
        // if the movie is in the center of the list, run it's render method with no arguments. At least one movie will be in the center of the list.
        if (index === Math.floor(featuredMovies.length / 2)) {
            movie.render();
        }
        // if the movie is in the first half of the list, run it's render method with a 'left' argument
        else if (index < Math.floor(featuredMovies.length / 2)) {
            movie.render('left');
        }
        // if the movie is in the second half of the list, run it's render method with a 'right' argument
        else {
            movie.render('right');
        }
    });
    //start the timer to handle the slide show
    // const sliderTimer = setInterval(handleSlideTimer, 5000);
    console.log("Featured Movies =>", featuredMovies);
    // add an event listener to the document to handle the arrow keys
    document.addEventListener("keydown", handleArrowKeys);
    // get the spotlight movies from the TMDB API
    let tmdbMovies = await getSpotlightMovies();
    const movieGrid = document.querySelector('.movie-grid');
    // create a new SpotlightMovie instance for each movie
    tmdbMovies.forEach(movie => {
        let newMovie = new SpotlightMovie(movie, movieGrid);
    });

    const splotlightTabs = document.querySelectorAll('.section-tab');
    for (let tab of splotlightTabs) {
        tab.addEventListener('click', async (e) => {
            splotlightTabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add('active');
            let genre = tab.getAttribute('data-genre');
            let newMovies = await getSpotlightMovies(genre);
            movieGrid.innerHTML = '';
            newMovies.forEach(movie => {
                let newMovie = new SpotlightMovie(movie, movieGrid);
            });
        });
    }
})();