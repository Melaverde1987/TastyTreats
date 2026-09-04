import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { storedFavorites } from './markup-card';

import { fetchCards } from './API/grid-cards-api';

const listRecipe = document.querySelector('.list-recipes');
const favoritesCardContainer = document.querySelector(
  '.list-recipes-favorites'
);

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
