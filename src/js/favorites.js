import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  storedFavorites,
  createMarkupGridCard,
  createMarkupCategoriesFavorites,
} from './markup-card';

import { fetchCards } from './API/grid-cards-api';
import { fetchCategories } from './API/categories-api';

const listRecipe = document.querySelector('.list-recipes');
const favoritesCardContainer = document.querySelector(
  '.list-recipes-favorites'
);
const categoriesAll = document.querySelector('.categories-list-favorites');
const favDefault = document.querySelector('.favorites-default');

if (listRecipe) {
  listRecipe.addEventListener('click', onClickFavorite);
}

if (favoritesCardContainer) {
  favoritesCardContainer.addEventListener('click', onClickFavorite);
}

function onClickFavorite(event) {
  const heartIcon = event.target.closest('.btn-add-to-favorite');

  if (heartIcon) {
    heartIcon.classList.toggle('active');

    const name = heartIcon.dataset.name;
    const _id = name;

    const existingIndex = storedFavorites.findIndex(
      recipe => recipe._id === _id
    );

    if (existingIndex !== -1) {
      storedFavorites.splice(existingIndex, 1);
      localStorage.setItem('favoriteRecipes', JSON.stringify(storedFavorites));
      Notify.info('Recipe removed from favorites!');
    } else {
      setFavorites(name);
    }
  }
}

async function setFavorites(id) {
  try {
    const result = await fetchCards(1, 1000);
    const recipe = result.results.find(item => item._id === id);
    storedFavorites.push(recipe);
    localStorage.setItem('favoriteRecipes', JSON.stringify(storedFavorites));
    Notify.success('Recipe added to favorites!');
  } catch (error) {
    console.log(error);
  }
}

/*
==========================
RENDER ON FAVORITES PAGE
==========================
*/

if (favoritesCardContainer) renderFavoriteRecipes();

function renderFavoriteRecipes() {
  favDefault.classList.add('is-hidden');
  favoritesCardContainer.innerHTML = createMarkupGridCard(storedFavorites);
}

const favCategories = [];

storedFavorites.forEach(cat => {
  favCategories.push(cat.category.toLowerCase());
});

const uniqueCats = favCategories.filter(
  (cat, index, array) => array.indexOf(cat) === index
);

if (categoriesAll) categoriesDataFavorites();

async function categoriesDataFavorites() {
  try {
    const result = await fetchCategories();
    const filtered = result.filter(category =>
      uniqueCats.includes(category.name.toLowerCase())
    );

    const categoriesList = createMarkupCategoriesFavorites(filtered);
    categoriesAll.insertAdjacentHTML('beforeend', categoriesList);
  } catch (error) {
    console.log(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}
