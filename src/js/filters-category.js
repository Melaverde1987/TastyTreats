import { fetchCardsWithFilters } from './API/filters-api';
import { createMarkupGridCard, storedFavorites } from './markup-card';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const categoriesAllFav = document.querySelector('.categories-list-favorites');
const loader = document.querySelector('.loader');
const cards = document.querySelector('.list-recipes-favorites');
const btnAllCategories = document.querySelector('.btn-all-categories');

let allRecipes = null;
let catValue = '';
let currentPage = 1;
let currentlimit = 6;

if (categoriesAllFav) {
  categoriesAllFav.addEventListener('click', getFilterCategory);
}

function getFilterCategory(e) {
  if (!e.target.classList.contains('js-fav-cat')) {
    return;
  }

  const catBtns = categoriesAllFav.querySelectorAll('.js-fav-cat');

  catBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  e.target.classList.add('active');
  catValue = e.target.textContent.trim();

  renderFilteredCatRecipes();
}

function getCurrentLimit() {
  if (window.innerWidth >= 1200) {
    return 9;
  }

  if (window.innerWidth >= 768) {
    return 8;
  }

  return currentlimit;
}

async function getAllRecipes() {
  if (!allRecipes) {
    allRecipes = await fetchCardsWithFilters();
  }

  return allRecipes;
}

async function renderFilteredCatRecipes() {
  try {
    loader.classList.remove('hidden');

    const recipes = await getAllRecipes();

    const filteredRecipes = recipes.filter(recipe => {
      const matchesCategory = recipe.category
        .toLowerCase()
        .includes(catValue.toLowerCase());

      const isFavorite = storedFavorites.some(
        favorite => favorite._id === recipe._id
      );

      return matchesCategory && isFavorite;
    });

    if (filteredRecipes.length === 0) {
      Notify.warning('Nothing was found for your request!');
      return;
    }

    cards.innerHTML = createMarkupGridCard(filteredRecipes);
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader.classList.add('hidden');
  }
}

/*
===================
CLEAR CATEGORIS
===================
*/

btnAllCategories.addEventListener('click', onAllRecipes);

function onAllRecipes() {
  catValue = '';

  const catBtns = categoriesAllFav.querySelectorAll('.js-fav-cat');
  catBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  cards.innerHTML = createMarkupGridCard(storedFavorites);
}
