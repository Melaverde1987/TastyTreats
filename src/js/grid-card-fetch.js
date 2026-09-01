import { fetchCards } from './API/grid-cards-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkupGridCard } from './markup-card';

const loader = document.querySelector('.loader');

const elements = {
  cards: document.querySelector('.list-recipes'),
};

let currentlimit = 6;
let currentPage = 1;

if (elements.cards) {
  setCardsLimit();
}

function setCardsLimit() {
  if (window.screen.width >= 768 && window.screen.width < 1200) {
    currentlimit = 8;
    defaultData();
  } else if (window.screen.width >= 1200) {
    currentlimit = 9;
    defaultData();
  }
  setCardsLimitResizer();
}

function setCardsLimitResizer() {
  window.addEventListener('resize', function () {
    if (window.screen.width >= 768 && window.screen.width < 1200) {
      currentlimit = 8;
      defaultData();
    } else if (window.screen.width >= 1200) {
      currentlimit = 9;
      defaultData();
    } else {
      currentlimit = 6;
      defaultData();
    }
  });
}

async function defaultData() {
  try {
    const result = await fetchCards(currentPage, currentlimit);
    elements.cards.innerHTML = createMarkupGridCard(result.results);
    loader.classList.add('hidden');
  } catch (error) {
    console.log(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

export { setCardsLimit, setCardsLimitResizer, defaultData };
