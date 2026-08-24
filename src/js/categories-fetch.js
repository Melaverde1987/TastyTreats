import { fetchCategories } from './API/categories-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkupGridCard } from './grid-card-fetch';
import { fetchCards } from './API/grid-cards-api';

const cardsGrid = document.querySelector('.list-recipes');
const categoriesAll = document.querySelector('.categories-list');
const btnAllCategories = document.querySelector('.btn-all-categories');
const loader = document.querySelector('.loader');

btnAllCategories.addEventListener('click', onAllRecipes);
categoriesAll.addEventListener('click', onSearchbyCategory);

async function onAllRecipes() {
  try {
    loader.classList.remove('hidden');
    const data = await getDataArr();
    cardsGrid.innerHTML = createMarkupGridCard(data);
  } catch (error) {
  } finally {
    loader.classList.add('hidden');
  }
}

async function onSearchbyCategory(e) {
  if (!e.target.classList.contains('category-btn')) {
    return;
  }
  const value = e.target.textContent;

  try {
    loader.classList.remove('hidden');
    const data = await getDataArr();
    const recipesByCategory = data.filter(
      item => item.category.toLowerCase() === value.toLowerCase()
    );
    if (recipesByCategory.length == 0) {
      Notify.info('There is no recipes in this category');
    }
    cardsGrid.innerHTML = createMarkupGridCard(recipesByCategory);
  } catch (error) {
  } finally {
    loader.classList.add('hidden');
  }
}

async function getDataArr() {
  const res = await fetchCards(1, currentlimit);
  return res.results;
}

function createMarkupCategories(data) {
  return data
    .map(
      item => `
      <li class="categories-element" data-id=${item._id}>
        <button class="category-btn" type="button">${item.name}</button>
      </li>`
    )
    .join('');
}

categoriesData();

async function categoriesData() {
  try {
    const result = await fetchCategories();
    const categoriesList = createMarkupCategories(result);
    categoriesAll.insertAdjacentHTML('beforeend', categoriesList);
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

let currentlimit = 0;
if (document.documentElement.clientWidth < 768) {
  currentlimit = 6;
} else if (
  document.documentElement.clientWidth >= 768 &&
  document.documentElement.clientWidth < 1280
) {
  currentlimit = 8;
} else {
  currentlimit = 9;
}
