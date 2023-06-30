import { getFavMovies, getSpotlightMovies } from "./movies-api.js";
import { featuredMovies, FeaturedMovie, handleArrowKeys, handleSlideTimer } from "./components/MovieFeatured/index.js";
import SpotlightMovie from "./components/MovieCard/index.js";
import MovieSearch from "./components/MovieSearch/index.js";

(async () => {
    let search = new MovieSearch();
    let movies = await getFavMovies();
    movies = movies.filter(movie => movie.credits);
    console.log(movies);
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
    setInterval(handleSlideTimer, 30000);
    console.log("Featured Movies =>", featuredMovies);
    document.addEventListener("keydown", handleArrowKeys);
    let tmdbMovies = await getSpotlightMovies('action');
    let movieGrid = document.querySelector('.movie-grid');
    tmdbMovies.forEach(movie => {
        let newMovie = new SpotlightMovie(movie, movieGrid);
    });
})();