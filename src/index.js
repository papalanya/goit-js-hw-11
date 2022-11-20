import './sass/main.scss';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import PixabayAPI from './js/PixabayAPI.js';

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    searchEnd: document.querySelector('.search-end'),
}

const { form, gallery, searchEnd } = refs;

const pixabayAPI = new PixabayAPI();

form.addEventListener('submit', onSearch);

let shownImages = 0;
let lightbox = {};

const endlessScroll = new IntersectionObserver(
    ([entry], observer) => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);

            loadMore();
        }
    },
    { root: null, rootMargin: '50px', threshold: 0.5 },
);

function addObserve() {
    const lastImage = document.querySelector('.photo-card:last-child');

    if (lastImage) {
        endlessScroll.observe(lastImage);
    }
}

function exodus(totalHits) {
    if (shownImages < totalHits) {
        addObserve();
    } else {
        showSearchEnd();
    }
}

function showSearchEnd() {
    searchEnd.classList.add('is-visible')
}

function hideSearchEnd() {
    searchEnd.classList.remove('is-visible');
}

function resetGallery() {
    gallery.innerHTML = '';
}

function addLightbox() {
    lightbox = new SimpleLightbox('.gallery a', {
        showCounter: false,
        captionsData: 'alt',
        captionsDelay: 250,
    });
}

async function onSearch(e) {
    e.preventDefault();
    resetGallery();
    pixabayAPI.resetPage();
    hideSearchEnd();

    pixabayAPI.query = form.elements.searchQuery.value.trim();

    try {
        const data = await pixabayAPI.fetchQuery();

        if (data.totalHits === 0) {
            return Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
        }

        shownImages = data.hits.length;
        Notiflix.Notify.success(
            `Hooray! We found ${data.totalHits} images.`
        );
        appendPhotosMarkup(data.hits);
        addLightbox();
        exodus(data.totalHits);
    } catch (error) {
        console.log(error);
    }
}

function appendPhotosMarkup(cards) {
    gallery.insertAdjacentHTML('beforeend', PhotosMarkup(cards));
}

async function loadMore() {
    try {
        const data = await pixabayAPI.fetchQuery();
        appendPhotosMarkup(data.hits);
        lightbox.refresh();

        shownImages += data.hits.length;

        exodus(data.totalHits);
    } catch (error) {
        console.log(error);
    }
}

function PhotosMarkup(cardsArray) {
    return cardsArray
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
                <a href="${largeImageURL}" class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" class="photo-card__img" width="300" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes</b><br />${likes}</p>
                        <p class="info-item"><b>Views</b><br />${views}</p>
                        <p class="info-item"><b>Comments</b><br />${comments}</p>
                        <p class="info-item"><b>Downloads</b><br />${downloads}</p>
                    </div>
                </a>
            `;
        }).join('');
}