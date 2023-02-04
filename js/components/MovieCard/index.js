class SpotlightMovie {
    constructor(data, target) {
        this.target = target;
        this.id = data.id;
        this.title = data.title;
        this.poster_path = data.poster_path;
        this.vote_average = data.vote_average;
        this.vote_count = data.vote_count;
        this.video = data.videos;
        this.element = document.createElement('div');
        this.element.classList.add('movie-wrapper');
        this.element.setAttribute('data-movie', this.id);
        this.element.movie = this;
        this.render(target);
        // add a click event to the .movie-hover-play
        this.element.querySelector('.movie-hover-play').addEventListener('click', this.handleTrailerClick.bind(this));
    }
    render(target) {
        let html = `
            <div class="movie-poster-wrapper">
                <img src="https://image.tmdb.org/t/p/original${this.poster_path}" loading="lazy" alt="" class="movie-poster-image">
                <div class="movie-poster-hover">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" class="movie-hover-play">
                        <path d="m600 99.996c132.61 0 259.79 52.68 353.55 146.45 93.77 93.766 146.45 220.95 146.45 353.55s-52.68 259.79-146.45 353.55c-93.766 93.77-220.95 146.45-353.55 146.45s-259.79-52.68-353.55-146.45c-93.77-93.766-146.45-220.95-146.45-353.55 0.14844-132.56 52.875-259.66 146.61-353.39 93.738-93.734 220.83-146.46 353.39-146.61zm0-99.996c-159.13 0-311.74 63.215-424.27 175.73-112.52 112.52-175.73 265.14-175.73 424.27s63.215 311.74 175.73 424.27c112.52 112.52 265.14 175.73 424.27 175.73s311.74-63.215 424.27-175.73c112.52-112.52 175.73-265.14 175.73-424.27s-63.215-311.74-175.73-424.27c-112.52-112.52-265.14-175.73-424.27-175.73zm-150 850v-499.99l450 257.29z" fill="#fff"/>
                    </svg>
                </div>
            </div>
            <h3>${this.title}</h3>
            <div class="movie-rating-wrapper">
                ${this.handleStarsRender()}
                <div class="movie-rating-votes">${this.handleVoteCount()} voters</div>
            </div>
        `;
        this.element.innerHTML = html;
        target.appendChild(this.element);
    }
    handleVoteCount() {
        // votes are rounded down to the nearest 1000
        // if votes are less than 1000, return votes
        // add a comma after every 3 digits
        let votes = this.vote_count;
        if (votes < 1000) {
            return votes;
        }
        let votesString = votes.toString();
        let votesArray = votesString.split('');
        let votesArrayReversed = votesArray.reverse();
        let votesArrayWithCommas = [];
        votesArrayReversed.forEach((digit, index) => {
            if (index % 3 === 0 && index !== 0) {
                votesArrayWithCommas.push(',');
            }
            votesArrayWithCommas.push(digit);
        });
        let votesArrayWithCommasReversed = votesArrayWithCommas.reverse();
        let votesWithCommas = votesArrayWithCommasReversed.join('');
        return votesWithCommas;
    }
    handleStarsRender() {
        // Rating is out of 10
        // Stars are out of 5
        let rating = this.vote_average;
        //console.log(rating);
        let stars = rating / 2;
        //console.log(stars);
        // Round to nearest .5
        stars = Math.round(stars * 2) / 2;
        //console.log(stars);
        // Create svg elements
        let fullStar = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        fullStar.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        fullStar.setAttribute('viewBox', '0 0 24 24');
        fullStar.setAttribute('width', '15');
        fullStar.setAttribute('height', '15');
        fullStar.setAttribute('data-star', 'full');
        fullStar.classList.add('rating-star')
        fullStar.innerHTML = `
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FDCE50"/>
        `;
        let starHalf = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starHalf.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        starHalf.setAttribute('viewBox', '0 0 24 24');
        starHalf.setAttribute('width', '15');
        starHalf.setAttribute('height', '15');
        starHalf.setAttribute('data-star', 'half');
        starHalf.classList.add('rating-star');
        starHalf.innerHTML = `
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FDCE50"/>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#FDCE50" stroke-width="2"/>
        `;
        let starOutline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starOutline.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        starOutline.setAttribute('viewBox', '0 0 24 24');
        starOutline.setAttribute('width', '15');
        starOutline.setAttribute('height', '15');
        starOutline.setAttribute('data-star', 'outline');
        starOutline.classList.add('rating-star');
        starOutline.innerHTML = `
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#FDCE50" stroke-width="2" stroke-linejoin="bevel"/>
        `;
        // return all stars
        let starsArray = [];
        // Loop through stars
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                starsArray.push(fullStar.outerHTML);
            } else if (i - 0.5 === stars) {
                starsArray.push(starHalf.outerHTML);
            } else {
                starsArray.push(starOutline.outerHTML);
            }
        }
        //console.log(starsArray);
        // put all stars into a div
        let starsDiv = document.createElement('div');
        starsDiv.classList.add('rating-stars');
        starsArray.forEach(star => {
            starsDiv.innerHTML += star;
        });
        // make starsDiv a string
        starsDiv = starsDiv.outerHTML;
        //console.log(starsDiv)
        return starsDiv;
    }
    handleTrailerClick() {
        this.renderTrailer();
    }
    renderTrailer() {
        // Step 1. create a div that is fixed to the screen
        // Step 2. create an iframe that is fixed to the screen
        // Step 3. create a button that closes the iframe
        // Step 4. add event listener to button that closes the iframe
        
        let backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        backdrop.innerHTML = `
            <div class="trailer-wrapper">
                <div class="trailer-close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" stroke="#fff" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </div>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${this.video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
        document.body.appendChild(backdrop);
        let closeButton = document.querySelector('.trailer-close-button');
        closeButton.addEventListener('click', () => {
            backdrop.remove();
        });
    }

}

export default SpotlightMovie;