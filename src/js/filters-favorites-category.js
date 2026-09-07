import { fetchCardsWithFilters } from './API/filters-api';
import { createMarkupGridCard, storedFavorites } from './markup-card';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createPagination } from './tui-pagination';

const categoriesAllFav = document.querySelector('.categories-list-favorites');
const loader = document.querySelector('.loader');
const cards = document.querySelector('.list-recipes-favorites');
const btnAllCategories = document.querySelector('.btn-all-categories');

let catValue = '';
let itemsPerPage = 4;
let filteredRecipes = [];
let pagination;

setCardsLimit();

if (categoriesAllFav) {
  categoriesAllFav.addEventListener('click', getFilterCategory);
}

if (btnAllCategories) {
  btnAllCategories.addEventListener('click', onAllRecipes);
}

if (cards) {
  showAllFavorites();
}

/*
===================
RESPONSIVE LIMIT
===================
*/

function setCardsLimit() {
  updateItemsPerPage();

  window.addEventListener('resize', () => {
    const previousLimit = itemsPerPage;

    updateItemsPerPage();

    if (previousLimit !== itemsPerPage) {
      updatePagination(filteredRecipes.length);
      renderRecipesPage(1);
    }
  });
}

function updateItemsPerPage() {
  const width = window.innerWidth;

  if (width >= 1200) {
    itemsPerPage = 8;
  } else if (width >= 768) {
    itemsPerPage = 6;
  } else {
    itemsPerPage = 4;
  }
}

/*
===================
CATEGORY FILTER
===================
*/

function getFilterCategory(event) {
  const categoryBtn = event.target.closest('.js-fav-cat');

  if (!categoryBtn) {
    return;
  }

  removeActiveCategory();
  categoryBtn.classList.add('active');
  catValue = categoryBtn.textContent.trim();
  renderFilteredCatRecipes();
}

async function renderFilteredCatRecipes() {
  try {
    loader.classList.remove('hidden');

    const recipes = await fetchCardsWithFilters();

    filteredRecipes = recipes.filter(recipe => {
      const matchesCategory =
        recipe.category.toLowerCase() === catValue.toLowerCase();

      const isFavorite = storedFavorites.some(
        favorite => favorite._id === recipe._id
      );

      return matchesCategory && isFavorite;
    });

    if (!filteredRecipes.length) {
      cards.innerHTML = '';
      updatePagination(0);
      Notify.warning('Nothing was found for your request!');
      return;
    }

    updatePagination(filteredRecipes.length);
    renderRecipesPage(1);
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader.classList.add('hidden');
  }
}

/*
===================
CLEAR CATEGORIES
===================
*/

function onAllRecipes() {
  catValue = '';

  removeActiveCategory();
  showAllFavorites();
}

function showAllFavorites() {
  filteredRecipes = storedFavorites;

  if (!filteredRecipes.length) {
    cards.innerHTML = '';

    updatePagination(0);

    return;
  }

  updatePagination(filteredRecipes.length);
  renderRecipesPage(1);
}

/*
===================
PAGINATION
===================
*/

function updatePagination(totalItems) {
  pagination = createPagination({
    totalItems,
    itemsPerPage,
    visiblePages: 3,
  });

  pagination.on('afterMove', event => {
    renderRecipesPage(event.page);
  });
}

function renderRecipesPage(page = 1) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const recipesToRender = filteredRecipes.slice(start, end);
  cards.innerHTML = createMarkupGridCard(recipesToRender);
}

/*
===================
HELPERS
===================
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
