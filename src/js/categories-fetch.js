import { fetchCategories } from './API/categories-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const categoriesAll = document.querySelector('.categories-list');

categoriesData();

async function categoriesData() {
  try {
    const result = await fetchCategories();
    const categoriesList = createMarkupCategories(result);
    categoriesAll.insertAdjacentHTML('beforeend', categoriesList);
  } catch (error) {
    console.log(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
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
