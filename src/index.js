import './sass/main.scss';
import Notiflix from 'notiflix';
const axios = require('axios').default;

import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

let searchResult = '';
let q = '';
let gallery = new SimpleLightbox('.gallery a', {enableKeyboard: true,});


// Pixabay API

const PixabayAPI = {
    baseURL: 'https://pixabay.com/api/',
    key: '31299288-10c92835a232b11626e7788a3',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    order: 'popular',
    page: '1',
    per_page: '40',
}

const markupData = {
    markup: '',
    htmlCode: '',
}

const searchForm = document.querySelector('.search-form');
const gallerySelector = document.querySelector('.gallery');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const {elemets: {searchQuery}} = e.target;
    searchResult = searchQuery.value;

    console.log('searchResult:', `'${searchResult}'`);
    console.log('q:', `'${q}'`);
})