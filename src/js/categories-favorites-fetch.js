import { fetchCards } from './API/grid-cards-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  createMarkupCategoriesFavorites,
  storedFavorites,
} from './markup-card';

const categoriesAllFav = document.querySelector('.categories-list-favorites');
const paginationContainer = document.getElementById('tui-pagination-container');
const favDefault = document.querySelector('.favorites-default');
const favCategories = [];

if (storedFavorites.length === 0) {
  categoriesAllFav.classList.add('is-hidden');
  paginationContainer.classList.add('is-hidden');
  favDefault.classList.remove('is-hidden');
} else {
  favDefault.classList.add('is-hidden');
  renderFavoriteCategories();
}

async function renderFavoriteCategories() {
  try {
    const result = await fetchCards(1, 1000);
    const filteredRecipes = result.results.filter(item =>
      storedFavorites.includes(item._id)
    );

    filteredRecipes.forEach(cat => {
      favCategories.push({ id: cat._id, name: cat.category });
    });

    const uniqueCats = favCategories.filter(
      (cat, index, array) =>
        array.findIndex(item => item.name === cat.name) === index
    );

    const categoriesList = createMarkupCategoriesFavorites(uniqueCats);
    categoriesAllFav.insertAdjacentHTML('beforeend', categoriesList);
  } catch (error) {
    console.error(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}
