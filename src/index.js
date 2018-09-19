import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss'

window.addEventListener('load', onLoad);

let chosenMovie;
let data = [];
let links;

function setData(someData) {
    for (let i = 0; i < someData.length; i++) {
        someData[i].id = 'item' + i;
    }
    data = someData;
}

function getData() {
    return data;
}


function getMoviesData(url) {
    return new Promise(function (resolve, reject) {
        let linkData = new XMLHttpRequest();
        linkData.open('GET', url, true);
        linkData.onreadystatechange = function () {
            if (linkData.readyState === 4) {
                if (linkData.status === 200) {
                    setData(JSON.parse(linkData.responseText));
                    data = getData();
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

function setMoviesBlocks(moviesData) {
    let templateLink = document.querySelector('#movies');
    for (let i = 0; i < moviesData.length; i++) {
        let movieInfo = moviesData[i];
        let clone = templateLink.content.cloneNode(true);
        let image = clone.querySelector('.template-item-back');
        let title = clone.querySelector('h5');
        let wrap = clone.querySelector('.template-item');
        title.textContent = movieInfo.title;
        image.setAttribute('style', 'background: url(src/img/' + movieInfo.preview + ') no-repeat center; background-size: contain;');
        wrap.setAttribute('id', movieInfo.id);
        templateLink.parentNode.appendChild(clone);
    }
    let videoChoice = document.querySelector('#second-container');
    videoChoice.onclick = function () {
        let link = event.target;
        let clickLink = event.target;
        data = getData();
        if (link.attributes.id) {
            if (link.attributes.id.value !== 'second-container') {
                for (let i = 0; i < data.length; i++) {
                    if (link.attributes.id.value === data[i].id) {
                        chosenMovie = data[i];
                        break;
                    }
                }
            }
        } else {
            link = link.parentNode;
            for (let i = 0; i < data.length; i++) {
                if (link.attributes.id.value === data[i].id) {
                    chosenMovie = data[i];
                    break;
                }
            }
        }
        if (!clickLink.attributes.id || clickLink.attributes.id && clickLink.attributes.id.value !== 'second-container') {
            changeMovie(chosenMovie);
        }
    };
}

function changeMovie(newMovie) {
    links = getLinks();
    if (newMovie !== chosenMovie) {
        chosenMovie = newMovie;
        setMovie(chosenMovie);
        links.videoTag.play();
    } else {
        setMovie(chosenMovie);
        links.videoTag.load();
        links.videoTag.play();
    }
}

function setMovies(data) {
    chosenMovie = data[0];
    setMovie(chosenMovie);
    setMoviesBlocks(data);
}

function onLoad() {
    getMoviesData('../data.json').then((data) => {
        setMovies(data);
    });
}

