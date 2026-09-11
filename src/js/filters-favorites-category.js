import { fetchCards } from './API/grid-cards-api';
import { createMarkupGridCard, storedFavorites } from './markup-card';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  renderFavoriteRecipes,
  getItemsPerPage,
} from './grid-card-favorites-fetch';
import { getPagination, updatePagination } from './tui-pagination';

const categoriesAllFav = document.querySelector('.categories-list-favorites');
const loader = document.querySelector('.loader');
const cards = document.querySelector('.list-recipes-favorites');
const btnAllCategories = document.querySelector('.btn-all-categories');

let catValue = '';
let isFilterMode = false;
let paginationListenerAdded = false;

if (cards) {
  init();
}

function init() {
  renderFavoriteRecipes(1).then(() => {
    initPaginationListener();
  });

  initEventListeners();
  initResize();
}

/*
====================
PAGINATION
====================
*/

function initPaginationListener() {
  if (paginationListenerAdded) {
    return;
  }

  const pagination = getPagination();

  if (!pagination) {
    return;
  }

  pagination.on('afterMove', event => {
    if (isFilterMode) {
      renderFilteredCatRecipes(event.page);
    } else {
      renderFavoriteRecipes(event.page);
    }
  });

  paginationListenerAdded = true;
}

/*
====================
EVENT LISTENERS
====================
*/

function initEventListeners() {
  categoriesAllFav?.addEventListener('click', getFilterCategory);
  btnAllCategories?.addEventListener('click', onAllRecipes);
}

/*
====================
RESPONSIVE
====================
*/

function initResize() {
  let previousLimit = getItemsPerPage();

  window.addEventListener('resize', () => {
    const newLimit = getItemsPerPage();

    if (newLimit === previousLimit) {
      return;
    }

    previousLimit = newLimit;

    if (isFilterMode) {
      renderFilteredCatRecipes(1);
    } else {
      renderFavoriteRecipes(1);
    }
  });
}

/*
====================
CATEGORY FILTER
====================
*/

function getFilterCategory(event) {
  const categoryBtn = event.target.closest('.js-fav-cat');

  if (!categoryBtn) {
    return;
  }

  removeActiveCategory();

  categoryBtn.classList.add('active');
  catValue = categoryBtn.textContent.trim();
  isFilterMode = true;
  renderFilteredCatRecipes(1);
}

/*
====================
FILTER RECIPES
====================
*/

async function renderFilteredCatRecipes(page = 1) {
  loader?.classList.remove('hidden');

  try {
    const itemsPerPage = getItemsPerPage();
    const recipes = await fetchCards(1, 1000);
    const filteredRecipes = recipes.results.filter(recipe => {
      const isFavorite = storedFavorites.includes(recipe._id);

      const matchesCategory =
        recipe.category.toLowerCase() === catValue.toLowerCase();

      return isFavorite && matchesCategory;
    });

    if (!filteredRecipes.length) {
      cards.innerHTML = '';

      updatePagination({
        totalItems: 0,
        itemsPerPage,
        reset: true,
      });

      Notify.warning('Nothing was found for your request!');

      return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    cards.innerHTML = createMarkupGridCard(filteredRecipes.slice(start, end));

    updatePagination({
      totalItems: filteredRecipes.length,
      itemsPerPage,
      reset: page === 1,
    });
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader?.classList.add('hidden');
  }
}

/*
====================
ALL CATEGORIES
====================
*/

function onAllRecipes() {
  catValue = '';

  isFilterMode = false;

  removeActiveCategory();
  renderFavoriteRecipes(1);
}

/*
====================
HELPERS
====================
*/

function removeActiveCategory() {
  const categoryBtns = categoriesAllFav?.querySelectorAll('.js-fav-cat');

  if (!categoryBtns) {
    return;
  }

  categoryBtns.forEach(btn => {
    btn.classList.remove('active');
  });
}
