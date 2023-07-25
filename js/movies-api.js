import keys from './keys.js';

const firebaseConfig = {
    apiKey: keys.firebase,
    authDomain: "codeup-curriculum.firebaseapp.com",
    databaseURL: "https://codeup-curriculum-default-rtdb.firebaseio.com",
    projectId: "codeup-curriculum",
    storageBucket: "codeup-curriculum.appspot.com",
    messagingSenderId: "374518315918",
    appId: "1:374518315918:web:e7417b3a5070a0089c82df",
    measurementId: "G-HJL17B39JL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore().collection('movies');


const getFavMovies = async () => {
    // const url = `http://localhost:3000/favorites`;
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // };
    // try {
    //     let response = await fetch(url, options);
    //     let data = await response.json();
    //     console.log(data);
    //     return data;
    // } catch (error) {
    //     console.log(error);
    //     alert(`Please start the json-server. Type "json-server --watch db.json" in the terminal.`);
    // }
    const response = await db.get();
    const movies = await response.docs.map(doc => doc.data());
    return movies;
}
const postFavoriteMovie = async (movie) => {
    // const url = `http://localhost:3000/favorites`;
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(movie),
    // };
    // let response = await fetch(url, options);
    // return await response.json();
    console.log(movie)
    await db.add(movie);
    // get the document that was just added
    const snapshot = await db.get(movie.id);
    
}
const patchFavMovie = async (movie) => {
    // const url = `http://localhost:3000/favorites/${movie.id}`;
    // const options = {
    //     method: 'PATCH',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(movie),
    // };
    // let response = await fetch(url, options);
    // return await response.json();
    const response = await db.doc(movie.id).update(movie);
}

// Get featured movies from https://www.themoviedb.org/ API
const getSpotlightMovies = async (genre, page) => {
    // "genre" is a string that contains the genre of the movie
    // if no genre is provided, then the function will return now playing movies
    // Example: "Action", "Comedy", "Horror", etc.
    let url;
    let nextPage = page || 1;
    if (genre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${keys.tmdb}&language=en-US&sort_by=popularity.desc&include_adult=false&include_videos=true&page=${nextPage}&with_genres=${genre}`;
    }
    else {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${keys.tmdb}&include_adult=false&include_videos=true&language=en-US&page=${nextPage}`;
    }
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let response = await fetch(url, options);
    let movies = await response.json();
    
    console.log('Spotlight Movies =>', movies);
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
    // sort the videos so that the trailer is first
    videos.results.sort((a, b) => {
        if (a.type === 'Trailer') {
            return -1;
        }
        else {
            return 1;
        }
    });
    return videos;
}

const deleteFavoriteMovie = async (movieId) => {
    // const url = `http://localhost:3000/favorites/${movieId}`;
    // const options = {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // };
    // let response = await fetch(url, options);
    // return await response.json();
    const response = await db.doc(`${movieId}`).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}



export { getFavMovies, getSpotlightMovies, getMovieCredits, getMovieVideos, postFavoriteMovie, deleteFavoriteMovie, patchFavMovie };