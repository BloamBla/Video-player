import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss'

window.addEventListener('load', onLoad);

function onLoad() {
    let data = require('../data.json');
    let chosenMovie = data[0];
    const videoTag = document.querySelector('#video');
    const chosenSource = document.querySelector('#source');
    const chosenTitle = document.querySelector('#chosenTitle');
    const chosenDirector = document.querySelector('#chosenDirector');
    const chosenDescription = document.querySelector('#chosenDescription');
    const links = {chosenTitle, chosenDirector, chosenDescription, chosenSource};

    function setMovie(){
        if (typeof(chosenMovie.video) !== 'object'){
            links.chosenSource.setAttribute('src', 'src/' + chosenMovie.video);
        } else links.chosenSource.setAttribute('src', 'src/video/' + chosenMovie.video[0]);
        videoTag.setAttribute('poster', 'src/img/' + chosenMovie.preview);
        videoTag.load();
        links.chosenTitle.textContent = chosenMovie.title;
        links.chosenDirector.textContent = chosenMovie.director;
        links.chosenDescription.textContent = chosenMovie.description;
    }

    setMovie();

    let template = document.querySelector('#movies');
    for (let i = 0; i < data.length; i++) {
        let movieInfo = data[i];
        let clone = template.content.cloneNode(true);
        let image = clone.querySelector('.template-item-back');
        let title = clone.querySelector('p');
        title.textContent = movieInfo.title;
        image.setAttribute('style', 'background: url(src/img/' + movieInfo.preview + ') no-repeat center; background-size: contain;');
        template.parentNode.appendChild(clone);
    }

    let videoChoise = document.querySelectorAll('.template-item');

    for (let i = 0; i < videoChoise.length; i++) {
        videoChoise[i].onclick = function () {
            let newMovie = [];
            for (let j = 0; j < videoChoise.length; j++) {
                if (videoChoise[i].textContent.trim() === data[j].title) {
                    newMovie = data[j];
                }
            }
            if (newMovie !== chosenMovie) {
                chosenMovie = newMovie;
                setMovie();
                video.play();
            }
        }
    }
}

