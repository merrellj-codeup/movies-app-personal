// In this project, we will be using a Firebase database to store our movie data.
// Configuring Firebase is more involved than what is covered in this lesson,
// so we have provided a class that will handle the configuration for you.
let db = new FirebaseDatabase({
    team: "merrell" // Replace this with your team name
});

// You will use the "db" object to make requests to the database very similarly to how you
// would use the "fetch" function to make requests to an API. The only difference is that
// you will be adding "db" in front of the "fetch" function.
// Example: db.fetch(url, options);

// Here is a function that uses the "db.fetch()" method to make a
// GET request to the "/movies" endpoint:
const getFavMovies = async () => {
    // const url = '/movies';
    const url = `http://localhost:3000/favorites`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    // let response = await db.fetch(url, options);
    let response = await fetch(url, options);
    let data = await response.json();
    console.log(data);
    return data;
}

// And here is a function that will add a new movie:
const addFavMovie = async (movie) => {
    // "movie" is an object that contains the movie data
    // Example: {title: "The Matrix", year: 1999, rating: 5}
    // You do NOT need to add an id to the movie object.
    // After the movie is added to the database, the database will
    // automatically add an id to the movie object and return it.
    const url = '/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    };
    let response = await db.fetch(url, options);
    return await response.json();
}

// Here is where you will create your own functions to further interact with the database.
// HAPPY CODING!!!

// Get featured movies from https://www.themoviedb.org/ API
const getSpotlightMovies = async (genre) => {
    // "genre" is a string that contains the genre of the movie
    // if no genre is provided, then the function will return now playing movies
    // Example: "Action", "Comedy", "Horror", etc.
    let url;
    if (genre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${keys.tmdb}&language=en-US&sort_by=popularity.desc&include_adult=false&include_videos=true&page=1&with_genres=${genre}`;
    }
    else {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${keys.tmdb}&include_adult=false&include_videos=true&language=en-US&page=1`;
    }
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let response = await fetch(url, options);
    let movies = await response.json();
    
    console.log('Spotlight Movies =>', movies.results);
    return movies.results;
}

const getMovieCredits = async (movieId) => {
    let url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${keys.tmdb}&language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let response = await fetch(url, options);
    let credits = await response.json();
    return credits;
}

const getMovieVideos = async (movieId) => {
    let url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${keys.tmdb}&language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let response = await fetch(url, options);
    let videos = await response.json();
    return videos;
}

const postFavoriteMovie = async (movie) => {
    const url = `http://localhost:3000/favorites`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    };
    let response = await fetch(url, options);
    return await response.json();
}

const deleteFavoriteMovie = async (movieId) => {
    const url = `http://localhost:3000/favorites/${movieId}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let response = await fetch(url, options);
    return await response.json();
}



export { getFavMovies, addFavMovie, getSpotlightMovies, getMovieCredits, getMovieVideos, postFavoriteMovie, deleteFavoriteMovie };