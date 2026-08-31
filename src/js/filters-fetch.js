import {
  fetchCardsWithFilters,
  fetchAreas,
  fetchIngredients,
} from './API/filters-api';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'debounce';
import { defaultData } from './pagination';
import { createMarkupGridCard } from './markup-card';

import SlimSelect from 'slim-select';
import 'slim-select/styles';

let currentPage = 1;
let currentlimit = 6;
let allRecipes = null;

let timeSlimSelect;
let areaSlimSelect;
let ingredientsSlimSelect;

const loader = document.querySelector('.loader');

const elements = {
  cards: document.querySelector('.list-recipes'),
  searchInput: document.querySelector('.filter-search'),
  resetButton: document.querySelector('.js-reset-filters'),
  selectTimeButton: document.querySelector('#time-select'),
  selectAreaButton: document.querySelector('#area-select'),
  selectIngredientsButton: document.querySelector('#ingredients-select'),
};

/*
====================
EVENT LISTENERS
====================
*/

if (elements.searchInput) {
  elements.searchInput.addEventListener(
    'input',
    debounce(getQueryNameRecipes, 1000)
  );
}

if (elements.resetButton) {
  elements.resetButton.addEventListener('click', clearFilters);
}

if (elements.selectAreaButton) {
  elements.selectAreaButton.addEventListener('change', getFilterArea);
}

if (elements.selectTimeButton) {
  elements.selectTimeButton.addEventListener('change', getFilterTime);
}

if (elements.selectIngredientsButton) {
  elements.selectIngredientsButton.addEventListener(
    'change',
    getFilterIngredients
  );
}

/*
====================
COMMON FUNCTIONS
====================
*/

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

function getActiveFilters() {
  return {
    name: elements.searchInput.value.trim().toLowerCase(),
    area: elements.selectAreaButton.value.trim().toLowerCase(),
    time: Number(elements.selectTimeButton.value),
    ingredient: elements.selectIngredientsButton.value,
  };
}

async function renderFilteredRecipes() {
  try {
    loader.classList.remove('hidden');

    const recipes = await getAllRecipes();
    const filters = getActiveFilters();
    const limit = getCurrentLimit();

    const filteredRecipes = recipes.filter(recipe => {
      const matchesName =
        !filters.name || recipe.title.toLowerCase().includes(filters.name);

      const matchesArea =
        !filters.area || recipe.area.toLowerCase().includes(filters.area);

      const matchesTime = !filters.time || Number(recipe.time) <= filters.time;

      const matchesIngredient =
        !filters.ingredient ||
        recipe.ingredients.some(
          ingredient => ingredient.id === filters.ingredient
        );

      return matchesName && matchesArea && matchesTime && matchesIngredient;
    });

    if (filteredRecipes.length === 0) {
      elements.cards.innerHTML = defaultData(currentPage, currentlimit);
      Notify.warning('Nothing was found for your request!');
      return;
    }

    const recipesOnPage = filteredRecipes.slice(0, limit);

    elements.cards.innerHTML = createMarkupGridCard(recipesOnPage);
    elements.resetButton.classList.remove('hidden');

    if (
      filters.name === '' &&
      filters.area == false &&
      filters.time == false &&
      filters.ingredient == false
    ) {
      elements.resetButton.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader.classList.add('hidden');
  }
}

/*
====================
SEARCH
====================
*/

function getQueryNameRecipes(e) {
  const inputValue = e.target.value.trim();

  if (inputValue === '') {
    //elements.resetButton.classList.add('hidden');
    cardsWithSearchData();

    //Notify.info('Your query is empty. Please try again');
    return;
  }

  cardsWithSearchData(inputValue, currentlimit);
}

async function cardsWithSearchData() {
  await renderFilteredRecipes();
}

/*
====================
AREA FILTER
====================
*/

function getFilterArea(e) {
  const selectValue = e.target.value.trim();

  if (selectValue === '') return;

  cardsWithFiltersAreaData(selectValue, currentlimit);
}

async function cardsWithFiltersAreaData(selectedArea, currentLimit) {
  await renderFilteredRecipes();
}

/*
====================
TIME FILTER
====================
*/

function getFilterTime(e) {
  const selectValue = e.target.value.trim();

  if (selectValue === '') return;

  cardsWithFiltersTimeData(selectValue, currentlimit);
}

async function cardsWithFiltersTimeData(selectedTime, currentLimit) {
  await renderFilteredRecipes();
}

/*
====================
INGREDIENT FILTER
====================
*/

function getFilterIngredients(e) {
  const selectValue = e.target.value.trim();

  if (selectValue === '') return;

  renderFilteredRecipes();
}

/*
====================
CLEAR FILTERS
====================
*/

function clearFilters(e) {
  if (e.target) {
    elements.searchInput.value = '';

    timeSlimSelect.setSelected(['']);
    areaSlimSelect.setSelected(['']);
    ingredientsSlimSelect.setSelected(['']);

    elements.cards.innerHTML = defaultData(currentPage, currentlimit);
    elements.resetButton.classList.add('hidden');
  }
}

/*
====================
SET SELECT TIME
====================
*/

if (elements.selectTimeButton) {
  const selectTime = [];

  for (let time = 5; time <= 160; time += 5) {
    selectTime.push(time);
  }

  elements.selectTimeButton.insertAdjacentHTML(
    'beforeend',
    createMarkupSelectTime(selectTime)
  );

  timeSlimSelect = new SlimSelect({
    select: elements.selectTimeButton,
    settings: {
      showSearch: false,
    },
  });
}

function createMarkupSelectTime(arr) {
  return arr
    .map(
      time => `
        <option
          class="filter-select-option"
          value="${time}"
        >
          ${time} min
        </option>
      `
    )
    .join('');
}

/*
====================
SET SELECT AREA
====================
*/

if (elements.selectAreaButton) {
  selectAreaData();
}

async function selectAreaData() {
  try {
    const result = await fetchAreas();

    elements.selectAreaButton.insertAdjacentHTML(
      'beforeend',
      createMarkupSelectArea(result)
    );

    areaSlimSelect = new SlimSelect({
      select: elements.selectAreaButton,
      settings: {
        showSearch: false,
      },
    });
  } catch {
    Notify.failure('Oops! Filters went wrong! Try reloading the page!');
  }
}

function createMarkupSelectArea(arr) {
  return arr
    .map(({ name }) => `<option value="${name}">${name}</option>`)
    .join('');
}

/*
====================
SET SELECT INGREDIENTS
====================
*/

if (elements.selectIngredientsButton) {
  selectIngredientsData();
}

async function selectIngredientsData() {
  try {
    const result = await fetchIngredients();

    elements.selectIngredientsButton.insertAdjacentHTML(
      'beforeend',
      createMarkupSelectIngredients(result)
    );

    ingredientsSlimSelect = new SlimSelect({
      select: elements.selectIngredientsButton,
      settings: {
        showSearch: false,
      },
    });
  } catch {
    Notify.failure('Oops! Filters went wrong! Try reloading the page!');
  }
}

function createMarkupSelectIngredients(arr) {
  return arr
    .map(
      ({ _id, name }) => `
        <option
          class="filter-select-option"
          value="${_id}"
        >
          ${name}
        </option>
      `
    )
    .join('');
}
