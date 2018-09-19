import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss'

window.addEventListener('load', onLoad);

let chosenMovie;
let data = [];
let links;

function getMoviesData(url) {
    return new Promise(function (resolve, reject) {
        let linkData = new XMLHttpRequest();
        linkData.open('GET', url, true);
        linkData.onreadystatechange = function () {
            if (linkData.readyState === 4) {
                if (linkData.status === 200) {
                    data = JSON.parse(linkData.responseText);
                    resolve(data);
                } else reject('error');
            }
        };
        linkData.send();
    });
}

function getLinks() {
    let chosenTitle = document.querySelector('#chosenTitle');
    let chosenDirector = document.querySelector('#chosenDirector');
    let chosenDescription = document.querySelector('#chosenDescription');
    let chosenSource = document.querySelector('#source');
    let videoTag = document.querySelector('#video');

    return {chosenTitle, chosenDirector, chosenDescription, chosenSource, videoTag};
}

function setMovie(movie) {
    links = getLinks();
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
    let videoChoice = document.querySelectorAll('.template-item');
    for (let i = 0; i < videoChoice.length; i++) {
        videoChoice[i].onclick = function () {
            changeMovie(videoChoice, i, chosenMovie, data);
        }
    }
}

function changeMovie(arr, i, lastChosenMovie, moviesData) {
    let newMovie = [];
    links = getLinks();
    for (let j = 0; j < arr.length; j++) {
        if (arr[i].textContent.trim() === moviesData[j].title) {
            newMovie = moviesData[j];
            break;
        }
    }
    if (newMovie !== lastChosenMovie) {
        lastChosenMovie = newMovie;
        setMovie(lastChosenMovie);
        links.videoTag.play();
    } else {
        setMovie(lastChosenMovie);
        links.videoTag.load();
        links.videoTag.play();
    }
}


function setMovies(data) {
    chosenMovie = data[0];
    let template = document.querySelector('#movies');
    setMovie(chosenMovie);
    setMoviesBlocks(template, data);
}

function onLoad() {
    getMoviesData('../data.json').then((data) => {
            setMovies(data);
        });
}

