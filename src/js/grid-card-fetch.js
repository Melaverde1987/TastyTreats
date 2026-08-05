import { fetchCards } from './API/grid-cards-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

function createMarkupGridCard(arr) {
  return arr
    .map(({ _id, title, description, rating, thumb }) => {
      const roundRating = Math.round(rating);
      const ratingNumber = rating.toFixed(1);
      return `<li class="item-recipes">
            <div class="wrap-recipes">
              <button type="button" class="btn-add-to-favorite" name="${_id}">
                  <svg class="icon-heart" width="22" height="22">
                    <use href="./sprite.svg#heart-favorite"></use>
                  </svg>
              </button>
              <img
                class="img-recipes"
                src="${thumb}"
                alt="${title}"
                width="335"
                height="335"
              />
              <div class="thumb-desc">
                <h3 class="title-recipes">${title}</h3>
                <p class="description-recipes">${description}</p>
                <div class="rating">
                  <p class="rating-number">${ratingNumber}</p>
                  <div class="stars">
                    ${markupRatingStars(roundRating)}
                  </div>        
                  <button
                    type="button"
                    class="btn btn-primary btn-recipes"
                    data-modal-popup-open
                    id="${_id}"
                  >
                    See recipe
                  </button>
                </div>
              </div>
            </div>
          </li>`;
    })
    .join('');
}

function markupRatingStars(roundRating) {
  return Array.from(
    { length: 5 },
    (_, index) => `
    <svg class="icon-star${index < roundRating ? ' star' : ''}">
      <use href="./sprite.svg#rating-star"></use>
    </svg>
  `
  ).join('');
}

export {
  createMarkupGridCard,
  setCardsLimit,
  setCardsLimitResizer,
  defaultData,
};
