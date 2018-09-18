import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss'

window.addEventListener('load', onLoad);

let data = [];

let linkData = new XMLHttpRequest();
linkData.open('GET', '../data.json'); // async=true
linkData.onload = function () {
    if (linkData.readyState === 4 && linkData.status === 200) {
        data = JSON.parse(linkData.responseText);
    }
};
linkData.send(null);

function onLoad() {

    let chosenMovie = data[0];

    let template = document.querySelector('#movies');

    const chosenTitle = document.querySelector('#chosenTitle');
    const chosenDirector = document.querySelector('#chosenDirector');
    const chosenDescription = document.querySelector('#chosenDescription');
    const chosenSource = document.querySelector('#source');
    const videoTag = document.querySelector('#video');

    const links = {chosenTitle, chosenDirector, chosenDescription, chosenSource, videoTag};

    function setMovie(links, movie) {
        if (typeof(movie.video) !== 'object') {
            links.chosenSource.setAttribute('src', 'src/' + movie.video);
        } else links.chosenSource.setAttribute('src', 'src/video/' + movie.video[0]);
        links.videoTag.setAttribute('poster', 'src/img/' + movie.preview);
        links.videoTag.load();
        links.chosenTitle.textContent = movie.title;
        links.chosenDirector.textContent = movie.director;
        links.chosenDescription.textContent = movie.description;
    }

    function setMoviesBlocks(templateLink, moviesData) {
        for (let i = 0; i < moviesData.length; i++) {
            let movieInfo = moviesData[i];
            let clone = templateLink.content.cloneNode(true);
            let image = clone.querySelector('.template-item-back');
            let title = clone.querySelector('h5');
            title.textContent = movieInfo.title;
            image.setAttribute('style', 'background: url(src/img/' + movieInfo.preview + ') no-repeat center; background-size: contain;');
            templateLink.parentNode.appendChild(clone);
        }
    }

    setMovie(links, chosenMovie);
    setMoviesBlocks(template, data);

    let videoChoice = document.querySelectorAll('.template-item');

    function changeMovie(arr, i, lastChosenMovie, moviesData, video) {
        let newMovie = [];
        for (let j = 0; j < arr.length; j++) {
            if (arr[i].textContent.trim() === moviesData[j].title) {
                newMovie = moviesData[j];
            }
        }
        if (newMovie !== lastChosenMovie) {
            lastChosenMovie = newMovie;
            setMovie(links, lastChosenMovie);
            video.play();
        } else {
            setMovie(links, lastChosenMovie);
            video.load();
            video.play();
        }
    }

    for (let i = 0; i < videoChoice.length; i++) {
        videoChoice[i].onclick = function () {
            changeMovie(videoChoice, i, chosenMovie, data, videoTag);
        }
    }
}

