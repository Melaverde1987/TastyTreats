import { fetchPopup } from './API/popup-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import sprite from '../img/sprite.svg';

const currentRecipe = document.querySelector('.popup-wrapper');
const cardsGrid = document.querySelector('.cards-grid');
const cardsGridFavorites = document.querySelector('.cards-grid-favorites');
const popup = document.querySelector('[data-modal-popup]');
const body = document.querySelector('body');

if (cardsGrid) {
  cardsGrid.addEventListener('click', handleClick);
}

if (cardsGridFavorites) {
  cardsGridFavorites.addEventListener('click', handleClick);
}

async function handleClick(event) {
  if (event.target.classList.contains('btn-recipes')) {
    const { id } = event.target;
    body.style.overflow = 'hidden';

    try {
      const result = await fetchPopup(id);
      currentRecipe.innerHTML = createMarkupPopup(result);
      popup.classList.remove('is-hidden');
    } catch {
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }
  }

  function createMarkupPopup(arr) {
    const roundRating = Math.round(arr.rating);

    return `
    <button type="button" data-modal-popup-close class="close-button">
      <svg class="close-window" width="24" height="24">
        <use href="${sprite}#cross-close-modal"></use>
      </svg>
    </button>
    <h2 class="recipe-name-tablet">${arr.title}</h2>
    <img class="current-recipe-img" src="${arr.thumb}" alt="${arr.title}"/>
    <h2 class="recipe-name">${arr.title}</h2>
    <div class="information">
      <ul class="tags">
        ${arr.tags
          .map(
            item =>
              ` <li class="tag"><p class="type-item-text">#${item}</p></li>`
          )
          .join('')} 
      </ul>
      <p class="current-rating">${arr.rating}</p>
      <ul class="stars">
        ${markupRatingStarsPop(roundRating)}
      </ul>
      <p class="cooking-time">${arr.time} min</p>
    </div>
    <ul class="ingredients-list">
      ${arr.ingredients
        .map(
          ({ measure, name }) => `<li class="current-ingredients-item">
        <p class="current-ingredients-name">${name}</p>
        <p class="current-ingredients-quantity">${measure}</p>
      </li>`
        )
        .join('')} 
    </ul>
    <ul class="current-type-dish">
      ${arr.tags
        .map(
          item => ` <li class="tag"><p class="type-item-text">#${item}</p></li>`
        )
        .join('')} 
    </ul>
    <p class="current-recipe">
      ${arr.instructions}
    </p>
    <div class="btns-holder">
      <a href="" class="btn btn-primary btns-holder-text">Add to favorite</a>
    </div>`;
  }
}

function markupRatingStarsPop(roundRating) {
  return Array.from(
    { length: 5 },
    (_, index) => `
    <svg class="icon-star${index < roundRating ? ' star' : ''}">
      <use href="./sprite.svg#rating-star"></use>
    </svg>
  `
  ).join('');
}
