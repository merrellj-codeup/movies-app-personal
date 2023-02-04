import { featuredMovies, FeaturedMovie, handleArrowKeys } from "./components/MovieFeatured/index.js";
import SpotlightMovie from "./components/MovieCard/index.js";
import MovieSearch from "./components/MovieSearch/index.js";

(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object 
    // with your team name in the "js/movies-api.js" file.
    let search = new MovieSearch();
    const movies = await getFavMovies();
    for (let movie of movies) {
        let featuredMovie = new FeaturedMovie(movie);
    }
    //shuffle the featured movies
    featuredMovies.sort(() => Math.random() - 0.5);
    //render the featured movies
    featuredMovies.forEach((movie, index) => {
        // if the movie is in the center of the list, run it's render method with no arguments. At least one movie will be in the center of the list.
        // if the movie is in the first half of the list, run it's render method with a 'left' argument
        // if the movie is in the second half of the list, run it's render method with a 'right' argument
        if (index === Math.floor(featuredMovies.length / 2)) {
            movie.render();
        }
        else if (index < Math.floor(featuredMovies.length / 2)) {
            movie.render('left');
        }
        else {
            movie.render('right');
        }
    });
    console.log("Featured Movies =>", featuredMovies);
    document.addEventListener("keydown", handleArrowKeys);
    let tmdbMovies = await getSpotlightMovies('action');
    let movieGrid = document.querySelector('.movie-grid');
    tmdbMovies.forEach(movie => {
        let newMovie = new SpotlightMovie(movie, movieGrid);
    });
})();