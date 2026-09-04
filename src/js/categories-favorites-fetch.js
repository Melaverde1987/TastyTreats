import { fetchCategories } from './API/categories-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  createMarkupGridCard,
  createMarkupCategoriesFavorites,
  storedFavorites,
} from './markup-card';

import { createPagination } from './tui-pagination';

const categoriesAllFav = document.querySelector('.categories-list-favorites');
const favoritesCardContainer = document.querySelector(
  '.list-recipes-favorites'
);
const favDefault = document.querySelector('.favorites-default');
let itemsPerPage = 4;

setCardsLimit();

function setCardsLimit() {
  if (window.screen.width >= 768 && window.screen.width < 1200) {
    itemsPerPage = 6;
  } else if (window.screen.width >= 1200) {
    itemsPerPage = 8;
  }

  window.addEventListener('resize', function () {
    if (window.screen.width >= 768 && window.screen.width < 1200) {
      itemsPerPage = 6;
    } else if (window.screen.width >= 1200) {
      itemsPerPage = 8;
    } else {
      itemsPerPage = 4;
    }
  });
}

const pagination = createPagination({
  totalItems: storedFavorites.length,
  itemsPerPage: itemsPerPage,
  visiblePages: 3,
});

if (favoritesCardContainer) renderFavoriteRecipes();
pagination.on('afterMove', event => {
  renderFavoriteRecipes(event.page);
});

function renderFavoriteRecipes(page = 1) {
  favDefault.classList.add('is-hidden');

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  favoritesCardContainer.innerHTML = createMarkupGridCard(
    storedFavorites.slice(start, end)
  );
}

const favCategories = [];

storedFavorites.forEach(cat => {
  favCategories.push(cat.category.toLowerCase());
});

const uniqueCats = favCategories.filter(
  (cat, index, array) => array.indexOf(cat) === index
);

if (categoriesAllFav) categoriesDataFavorites();

async function categoriesDataFavorites() {
  try {
    const result = await fetchCategories();
    const filtered = result.filter(category =>
      uniqueCats.includes(category.name.toLowerCase())
    );

    const categoriesList = createMarkupCategoriesFavorites(filtered);
    categoriesAllFav.insertAdjacentHTML('beforeend', categoriesList);
  } catch (error) {
    console.log(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}
