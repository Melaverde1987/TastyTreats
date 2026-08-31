import { fetchCards } from './API/grid-cards-api';
import { createMarkupGridCard } from './markup-card';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const loader = document.querySelector('.loader');

const elements = {
  cards: document.querySelector('.list-recipes'),
  btnsPagesBox: document.querySelector('.js-btns-pages'),
  pagWrap: document.querySelector('.js-pag-wrap'),
  btnsBack: document.querySelector('.btns-back'),
  btnsEnd: document.querySelector('.btns-forward'),
};

let pages = 1;
let currentPage = 1;
let currentLimit = 6;
let visiblePages = 3;

if (elements.cards) {
  init();
}

function init() {
  setCardsLimit();

  elements.btnsPagesBox.addEventListener('click', handlerButtonPag);
  elements.pagWrap.addEventListener('click', handlerButtonArrow);

  window.addEventListener('resize', setCardsLimitResizer);
}

function setCardsLimit() {
  const width = window.innerWidth;

  if (width >= 1200) {
    currentLimit = 9;
    visiblePages = 4;
  } else if (width >= 768) {
    currentLimit = 8;
    visiblePages = 3;
  } else {
    currentLimit = 6;
    visiblePages = 3;
  }

  defaultData(currentPage, currentLimit);
}

function setCardsLimitResizer() {
  const oldLimit = currentLimit;
  const oldVisiblePages = visiblePages;

  const width = window.innerWidth;

  if (width >= 1200) {
    currentLimit = 9;
    visiblePages = 4;
  } else if (width >= 768) {
    currentLimit = 8;
    visiblePages = 3;
  } else {
    currentLimit = 6;
    visiblePages = 3;
  }

  if (oldLimit !== currentLimit || oldVisiblePages !== visiblePages) {
    currentPage = 1;
    defaultData(currentPage, currentLimit);
  }
}

async function defaultData(page, limit) {
  loader.classList.remove('hidden');

  try {
    const result = await fetchCards(page, limit);

    pages = result.totalPages;
    currentPage = page;

    elements.cards.innerHTML = createMarkupGridCard(result.results);

    renderPagination();
  } catch (error) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');

    console.log(error);
  } finally {
    loader.classList.add('hidden');
  }
}

function renderPagination() {
  elements.btnsPagesBox.innerHTML = markupBtnPagination();

  togglePaginationArrows();
}

function markupBtnPagination() {
  const buttons = [];

  const startPage = getStartPage();
  const endPage = Math.min(startPage + visiblePages - 1, pages);

  for (let page = startPage; page <= endPage; page += 1) {
    buttons.push(`
      <button
        type="button"
        class="pag-btn ${page === currentPage ? 'btn-active' : ''}"
      >
        ${page}
      </button>
    `);
  }

  return buttons.join('');
}

function getStartPage() {
  if (pages <= visiblePages) {
    return 1;
  }

  let startPage = currentPage - Math.floor(visiblePages / 2);

  if (startPage < 1) {
    startPage = 1;
  }

  if (startPage + visiblePages - 1 > pages) {
    startPage = pages - visiblePages + 1;
  }

  return startPage;
}

function handlerButtonPag(event) {
  const button = event.target.closest('.pag-btn');

  if (!button) {
    return;
  }

  const page = Number(button.textContent);

  if (page === currentPage) {
    return;
  }

  defaultData(page, currentLimit);
}

function handlerButtonArrow(event) {
  const target = event.target;

  if (target.closest('.pag-start-btn')) {
    goToPage(1);
    return;
  }

  if (target.closest('.pag-end-btn')) {
    goToPage(pages);
    return;
  }

  if (target.closest('.pag-forward-btn')) {
    goToPage(currentPage + 1);
    return;
  }

  if (target.closest('.pag-back-btn')) {
    goToPage(currentPage - 1);
  }
}

function goToPage(page) {
  if (page < 1 || page > pages || page === currentPage) {
    return;
  }

  defaultData(page, currentLimit);
}

function togglePaginationArrows() {
  const hidePagination = pages <= visiblePages;

  elements.btnsBack.classList.toggle('visually-hidden', hidePagination);

  elements.btnsEnd.classList.toggle('visually-hidden', hidePagination);
}

export { setCardsLimit, setCardsLimitResizer, defaultData };
