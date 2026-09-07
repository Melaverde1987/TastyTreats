import { fetchCategories } from './API/categories-api';
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
}

storedFavorites.forEach(cat => {
  favCategories.push(cat.category.toLowerCase());
});

const uniqueCats = favCategories.filter(
  (cat, index, array) => array.indexOf(cat) === index
);

if (categoriesAllFav) renderFavoriteCategories();

async function renderFavoriteCategories() {
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
