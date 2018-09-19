import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss'

window.addEventListener('load', onLoad);

function getMoviesData(url) {
    return new Promise(function (resolve, reject) {
        let linkData = new XMLHttpRequest();
        linkData.open('GET', url, true);
        linkData.onreadystatechange = function () {
            if (linkData.readyState === 4) {
                if (linkData.status === 200) {
                    let someData = JSON.parse(linkData.responseText);
                    for (let i = 0; i < someData.length; i++) {
                        someData[i].id = 'item' + i;
                    }
                    resolve(someData);
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
    let currentIdLink = document.querySelector('#video_wrap');
    currentIdLink = currentIdLink.parentNode;

    return {chosenTitle, chosenDirector, chosenDescription, chosenSource, videoTag, currentIdLink};
}

function setMovie(movie) {
    let links = getLinks();
    links.currentIdLink.setAttribute('id', movie.id);
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
}

function getChosenMovie(targetLink, moviesArr) {
    for (let i = 0; i < moviesArr.length; i++) {
        if (targetLink.attributes.id.value === moviesArr[i].id) {
            return moviesArr[i];
        }
    }
}

function onClick(data) {
        let link = event.target;
        let clickLink = event.target;
        let chosenMovie;
        if (link.attributes.id) {
            if (link.attributes.id.value !== 'second-container') {
                chosenMovie = getChosenMovie(link, data);
            }
        } else {
            link = link.parentNode;
            chosenMovie = getChosenMovie(link, data);
        }
        if (!clickLink.attributes.id || clickLink.attributes.id && clickLink.attributes.id.value !== 'second-container') {
            changeMovie(chosenMovie, data);
        }
}

function changeMovie(newMovie, data) {
    let links = getLinks();
    let lastMovie;
    for (let i = 0; i < data.length; i++) {
        if (links.currentIdLink.id === data[i].id) {
            lastMovie = data[i];
            break;
        }
    }
    if (newMovie.id !== links.currentIdLink.id) {
        setMovie(newMovie);
        links.videoTag.play();
    } else {
        setMovie(lastMovie);
        links.videoTag.load();
        links.videoTag.play();
    }
}

function setMovies(data) {
    setMovie(data[0]);
    setMoviesBlocks(data);
}

function onLoad() {
    let data;
    getMoviesData('../data.json').then((_data) => {
        data = _data;
        setMovies(data);
    });
    let videoChoice = document.querySelector('#second-container');
    videoChoice.addEventListener('click', function(){onClick(data)});
}

