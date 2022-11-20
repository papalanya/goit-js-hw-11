import './sass/main.scss';
import Notiflix from 'notiflix';

import SimpleLightbox from "Simplelightbox";
// Дополнительный импорт стилей
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