import { fetchCardsWithFilters } from './API/filters-api';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'debounce';

import { defaultData, getItemsPerPage } from './grid-card-fetch';
import { createMarkupGridCard } from './markup-card';
import { getPagination, updatePagination } from './tui-pagination';
import {
  timeSlimSelect,
  areaSlimSelect,
  ingredientsSlimSelect,
} from './render-filters';

let catValue = '';
let isFilterMode = false;
let paginationListenerAdded = false;

const loader = document.querySelector('.loader');

const elements = {
  cards: document.querySelector('.list-recipes'),
  categories: document.querySelector('.categories-list'),
  btnAllCategories: document.querySelector('.btn-all-categories'),
  searchInput: document.querySelector('.filter-search'),
  resetButton: document.querySelector('.js-reset-filters'),
  selectTimeButton: document.querySelector('#time-select'),
  selectAreaButton: document.querySelector('#area-select'),
  selectIngredientsButton: document.querySelector('#ingredients-select'),
};

if (elements.cards) {
  init();
}

function init() {
  defaultData(1).then(() => {
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
      renderFilteredRecipes(event.page);
    } else {
      defaultData(event.page);
    }
  });

  paginationListenerAdded = true;
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
      renderFilteredRecipes(1);
    } else {
      defaultData(1);
    }
  });
}

/*
====================
EVENT LISTENERS
====================
*/

function initEventListeners() {
  elements.categories?.addEventListener('click', getFilterCategory);

  elements.searchInput?.addEventListener(
    'input',
    debounce(() => {
      renderFilteredRecipes(1);
    }, 1000)
  );

  elements.resetButton?.addEventListener('click', clearFilters);

  elements.selectAreaButton?.addEventListener('change', () => {
    renderFilteredRecipes(1);
  });

  elements.selectTimeButton?.addEventListener('change', () => {
    renderFilteredRecipes(1);
  });

  elements.selectIngredientsButton?.addEventListener('change', () => {
    renderFilteredRecipes(1);
  });

  elements.btnAllCategories?.addEventListener('click', onAllCategories);
}

/*
====================
ACTIVE FILTERS
====================
*/

function getActiveFilters() {
  return {
    name: elements.searchInput?.value.trim().toLowerCase() || '',
    area: elements.selectAreaButton?.value.trim() || '',
    time: Number(elements.selectTimeButton?.value) || 0,
    ingredient: elements.selectIngredientsButton?.value || '',
  };
}

function hasActiveFilters(filters) {
  return Boolean(
    //catValue ||
    filters.name || filters.area || filters.time || filters.ingredient
  );
}

/*
====================
FILTER RECIPES
====================
*/

async function renderFilteredRecipes(page = 1) {
  loader?.classList.remove('hidden');

  isFilterMode = true;

  try {
    const filters = getActiveFilters();
    const itemsPerPage = getItemsPerPage();

    const hasNameFilter = Boolean(filters.name);

    const recipes = await fetchCardsWithFilters({
      category: catValue,
      page: hasNameFilter ? 1 : page,
      limit: hasNameFilter ? 1000 : itemsPerPage,
      time: filters.time,
      area: filters.area,
      ingredient: filters.ingredient,
    });

    let filteredRecipes = recipes.results;

    // SEARCH BY NAME

    if (hasNameFilter) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(filters.name)
      );
    }

    // NOTHING FOUND

    if (!filteredRecipes.length) {
      elements.cards.innerHTML = '';

      updatePagination({
        totalItems: 0,
        itemsPerPage,
      });

      updateResetButton(filters);
      Notify.warning('Nothing was found for your request!');
      return;
    }

    // NAME FILTER

    if (hasNameFilter) {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      elements.cards.innerHTML = createMarkupGridCard(
        filteredRecipes.slice(start, end)
      );

      updatePagination({
        totalItems,
        itemsPerPage,
        reset: page === 1,
      });
    } else {
      elements.cards.innerHTML = createMarkupGridCard(filteredRecipes);

      const totalItems = recipes.totalPages * itemsPerPage;

      updatePagination({
        totalItems,
        itemsPerPage,
        reset: page === 1,
      });
    }

    initPaginationListener();

    updateResetButton(filters);
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader?.classList.add('hidden');
  }
}

/*
====================
CATEGORY
====================
*/

function getFilterCategory(event) {
  const categoryBtn = event.target.closest('.category-btn');

  if (!categoryBtn) {
    return;
  }

  const categoryBtns = elements.categories.querySelectorAll('.category-btn');

  categoryBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  categoryBtn.classList.add('active');
  catValue = categoryBtn.textContent.trim();
  renderFilteredRecipes(1);
}

/*
====================
ALL CATEGORIES
====================
*/

function onAllCategories() {
  catValue = '';

  const categoryBtns = elements.categories?.querySelectorAll('.category-btn');

  categoryBtns?.forEach(btn => {
    btn.classList.remove('active');
  });

  const filters = getActiveFilters();

  if (hasActiveFilters(filters)) {
    renderFilteredRecipes(1);
  } else {
    isFilterMode = false;
    defaultData(1);
    //elements.resetButton?.classList.add('hidden');
  }
}

/*
====================
CLEAR FILTERS
====================
*/

function clearFilters() {
  if (elements.searchInput) {
    elements.searchInput.value = '';
  }

  timeSlimSelect?.setSelected(['']);
  areaSlimSelect?.setSelected(['']);
  ingredientsSlimSelect?.setSelected(['']);

  const categoryBtns = elements.categories?.querySelectorAll('.category-btn');

  categoryBtns?.forEach(btn => {
    btn.classList.remove('active');
  });

  catValue = '';
  isFilterMode = false;

  elements.resetButton?.classList.add('hidden');
  defaultData(1);
}

/*
====================
RESET BUTTON
====================
*/

function updateResetButton(filters) {
  elements.resetButton?.classList.toggle('hidden', !hasActiveFilters(filters));
}
