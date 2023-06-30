import { deleteFavoriteMovie } from "../../movies-api.js";

let featuredMovies = [];

const handleArrowKeys = (e) => {
    if(e.keyCode === 37){ //left
        let previousSibling = document.querySelector('[data-featured="center"').previousElementSibling;
        if(previousSibling){
            previousSibling.click();
        } else {
            document.querySelector('[data-featured="center"').parentElement.lastElementChild.click();
        }
    }
    else if(e.keyCode === 39){ //right
        let nextSibling = document.querySelector('[data-featured="center"').nextElementSibling;
        if(nextSibling){
            nextSibling.click();
        }
        else {
            document.querySelector('[data-featured="center"').parentElement.firstElementChild.click();
        }
    }
};

const handleSlideTimer = () => {
    let nextSibling = document.querySelector('[data-featured="center"').nextElementSibling;
    if(nextSibling){
        nextSibling.click();
    }
    else {
        document.querySelector('[data-featured="center"').parentElement.firstElementChild.click();
    }
};

class FeaturedMovie {
    constructor(data) {
        this.id = data.id;
        this.original_title = data.original_title;
        this.poster_path = data.poster_path;
        this.overview = data.overview;
        this.releaseDate = data.release_date;
        this.vote_average = data.vote_average;
        this.vote_count = data.vote_count;
        this.cast = data.credits?.cast;
        this.video = data.videos?.results[0];
        this.element = document.createElement('div');
        this.element.classList.add('featured-movie-3d-parent');
        this.element.setAttribute('data-featured-movie', this.id);
        this.element.setAttribute('featured-movie', '');
        this.element.movie = this;
        // add to featuredMovies array
        featuredMovies.push(this);
    }
    render(position) {
        if (position) {
            this.element.classList.add(position);
        } else {
            this.element.classList.remove('left');
            this.element.classList.remove('right');
            this.element.setAttribute('data-featured', 'center');
            this.handleBGVideoRender();
        }
        let html = `
            <div class="featured-movie-3d-child ${position ? position : ''}">
                <div class="featured-movie">
                    <div class="featured-movie-left">
                        <img src="https://image.tmdb.org/t/p/original${this.poster_path}" loading="eager" alt="" class="movie-poster">
                    </div>
                    <div class="featured-movie-right">
                        <h3>${this.original_title}</h3>
                        <div class="movie-rating-wrapper">
                            ${this.handleStarsRender()}
                            <div class="movie-rating-votes">${this.handleVoteCount()} voters</div>
                        </div>
                        <div class="featured-description-wrapper">
                            <p class="featured-movie-description">${this.overview}</p>
                        </div>
                        <h4>Cast:</h4>
                        ${this.handleCastRender()}
                        <div class="div-block">
                            <div class="button delete">  
                                <div>Remove</div>
                            </div>
                            <div class="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" version="1.1" viewBox="0 0 1200 1200" class="play-icon">
                                    <path d="m600 99.996c132.61 0 259.79 52.68 353.55 146.45 93.77 93.766 146.45 220.95 146.45 353.55s-52.68 259.79-146.45 353.55c-93.766 93.77-220.95 146.45-353.55 146.45s-259.79-52.68-353.55-146.45c-93.77-93.766-146.45-220.95-146.45-353.55 0.14844-132.56 52.875-259.66 146.61-353.39 93.738-93.734 220.83-146.46 353.39-146.61zm0-99.996c-159.13 0-311.74 63.215-424.27 175.73-112.52 112.52-175.73 265.14-175.73 424.27s63.215 311.74 175.73 424.27c112.52 112.52 265.14 175.73 424.27 175.73s311.74-63.215 424.27-175.73c112.52-112.52 175.73-265.14 175.73-424.27s-63.215-311.74-175.73-424.27c-112.52-112.52-265.14-175.73-424.27-175.73zm-150 850v-499.99l450 257.29z" fill="#fff"/>
                                </svg>
                                <div>Watch Trailer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.element.innerHTML = html;
        document.querySelector('.featured-movies').appendChild(this.element);
        this.element.addEventListener('click', this.handleSliderClick.bind(this));
        // Add event listener to delete button
        // bind this to the handleDelete function
        this.element.querySelector('.delete').addEventListener('click', this.handleDelete.bind(this));
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
        fullStar.setAttribute('width', '24');
        fullStar.setAttribute('height', '24');
        fullStar.setAttribute('data-star', 'full');
        fullStar.classList.add('rating-star')
        fullStar.innerHTML = `
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FDCE50"/>
        `;
        let starHalf = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starHalf.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        starHalf.setAttribute('viewBox', '0 0 24 24');
        starHalf.setAttribute('width', '24');
        starHalf.setAttribute('height', '24');
        starHalf.setAttribute('data-star', 'half');
        starHalf.classList.add('rating-star');
        starHalf.innerHTML = `
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FDCE50"/>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#FDCE50" stroke-width="2"/>
        `;
        let starOutline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starOutline.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        starOutline.setAttribute('viewBox', '0 0 24 24');
        starOutline.setAttribute('width', '24');
        starOutline.setAttribute('height', '24');
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
    handleVoteCount() {
        // votes are rounded down to the nearest 1000
        // if votes are less than 1000, return votes
        // add a comma after every 3 digits
        let votes = this.vote_count;
        if (votes < 1000) {
            return votes;
        }
        let votesString = parseInt(votes).toString();
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
    handleCastRender() {
        // get cast and render 5 cast members
        let cast = this.cast;
        let castWrapper = document.createElement('div');
        castWrapper.classList.add('cast-wrapper');
        cast?.forEach((member, index) => {
            if (index < 5) {
                let castMember = document.createElement('div');
                castMember.classList.add('cast-avatar-wrapper');
                castMember.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w92${member.profile_path}" loading="lazy" alt="" class="cast-avatar">
                `;
                castWrapper.appendChild(castMember);
            }
        });
        // if there are more than 5 cast members, add a div with a + sign
        if (cast?.length > 5) {
            let castMember = document.createElement('div');
            let castMemberCount = cast.length - 5;
            castMember.classList.add('cast-avatar-wrapper');
            castMember.classList.add('more');
            castMember.innerHTML = `
                <div">+${castMemberCount}</div>
            `;
            castWrapper.appendChild(castMember);
        }
        // make castWrapper a string
        castWrapper = castWrapper.outerHTML;
        return castWrapper;
    }
    handleSliderClick(e) {
        // get the first parent with a class of .featured-movie-3d-parent
        // console.log(e);
        let activeCard = this.element;
        activeCard.setAttribute('data-featured', 'center');
        activeCard.classList.remove('right', 'left');
        activeCard.children[0].classList.remove('left', 'right');
        let previousCard = activeCard.previousElementSibling;
        let previousCards = [];
        while (previousCard) {
            previousCards.push(previousCard);
            previousCard = previousCard.previousElementSibling;
        }
        previousCards.forEach((card, index) => {
            card.setAttribute('data-featured', '');
            card.classList.add('left');
            card.style.zIndex = 1;
            if (card.children[0] && card.children[0].classList.contains('featured-movie-3d-child')) {
                card.children[0].classList.add('left');
                card.children[0].classList.remove('right');
            }
            card.classList.remove('right');
        });

        let nextCard = activeCard.nextElementSibling;
        let nextCards = [];
        while (nextCard) {
            nextCards.push(nextCard);
            nextCard = nextCard.nextElementSibling;
        }
        nextCards.forEach((card, index) => {
            card.setAttribute('data-featured', '');
            card.classList.add('right');
            card.style.zIndex = nextCards.length - index;
            if (card.children[0] && card.children[0].classList.contains('featured-movie-3d-child')) {
                card.children[0].classList.add('right');
                card.children[0].classList.remove('left');
            }
            card.classList.remove('left');
        });
        activeCard.style.zIndex = nextCards.length + 1;
        activeCard.movie.handleBGVideoRender();
    }
    handleBGVideoRender() {
        // remove any existing video
        let video = document.querySelector('.background-video');
        if (video) {
            video.remove();
        }
        // if there is a video, render it as a video that silently auto plays in the background
        // the video is hosted on youtube and it's id is stored in this.video.id
        // so an iframe will have to be created and the video will have to be added to the page
        if (this.video) {
            // create the iframe
            let video = document.createElement('iframe');
            video.classList.add('background-video');
            video.setAttribute('src', `https://www.youtube.com/embed/${this.video.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&vq=hd720&start=30&playlist=${this.video.key}`);
            video.setAttribute('frameborder', '0');
            video.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
            video.setAttribute('allowfullscreen', '');
            // add the video to .page-background-wrapper
            let pageBackgroundWrapper = document.querySelector('.page-background-wrapper');
            pageBackgroundWrapper.appendChild(video);

        }
    }
    handleDelete() {
        let sibling = this.element.nextElementSibling;
        if (!sibling) {
            sibling = this.element.previousElementSibling;
        }
        this.element.removeEventListener('click', this.handleSliderClick);
        let leftSide = this.element.querySelector('.featured-movie-left');
        let rightSide = this.element.querySelector('.featured-movie-right');
        // animate opacity to 0 on the left side, then remove it
        // shortly after animate opacity to 0 on the right side, then remove it
        // then animate opacity to 0 on the main element, then remove it
        let leftSideAnimation = leftSide.animate([
            {
                opacity: 1
            },
            {
                opacity: 0
            }
        ], {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
        setTimeout(() => {
            let rightSideAnimation = rightSide.animate([
                {
                    opacity: 1
                },
                {
                    opacity: 0
                }
            ], {
                duration: 300,
                easing: 'ease-in-out',
                fill: 'forwards'
            });
            setTimeout(() => {
                let mainAnimation = this.element.animate([
                    {
                        opacity: 1
                    },
                    {
                        opacity: 0
                    }
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
                setTimeout(() => {
                    this.element.remove();
                    this.element = null;
                    sibling.click();
                    deleteFavoriteMovie(this.id);
                }, 300);
            }, 300);
        }, 300);

        // this.element.remove();
        // this.element = null;
    }
}

export { featuredMovies, handleArrowKeys, handleSlideTimer, FeaturedMovie };