import { fetchPopular, fetchByID } from './API/popular-recipes-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import sprite from '../img/sprite.svg';

const elements = document.querySelector('.popular-list');
const popup = document.querySelector('[data-modal-popup]');
const currentRecipe = document.querySelector('.popup-wrapper');
const body = document.querySelector('body');

if (elements) {
  elements.addEventListener('click', handleClick);
}

async function handleClick(event) {
  const recipe = event.target.closest('.popular-recipes-list');

  if (recipe) {
    const { id } = recipe;
    body.style.overflow = 'hidden';
    popup.classList.remove('is-hidden');

    try {
      const response = await fetchByID(id);
      //console.log('response', response);
      currentRecipe.innerHTML = createMarkupPopup(response);
    } catch (error) {
      console.log(error);
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }
  }
}

function createMarkupPopular(arr) {
  return arr
    .map(
      ({ _id, title, description, preview }) =>
        `<li id="${_id}" class="popular-recipes-list">
          <img class="img-popular"
            src="${preview}"
            alt="${title}"
          />
          <div class="popular-card">
            <h4 class="popular-title">${title}</h4>
            <p class="popular-text">
              ${description}
            </p>
          </div>
        </li>`
    )
    .join('');
}

async function popularData() {
  let getList;
  try {
    const result = await fetchPopular();
    if (result.length) {
      elements.innerHTML = createMarkupPopular(result);

      getList = document.querySelectorAll('.popular-recipes-list');
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }

  return { getList: getList /*result: result*/ };
}

popularData();

function createMarkupPopup(arr) {
  const roundRating = Math.round(arr.rating);

  return `
  <button type="button" data-modal-popup-close class="close-button">
    <svg class="close-window" width="20" height="20">
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
          item => ` <li class="tag"><p class="type-item-text">#${item}</p></li>`
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
    </li>
    `
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
    <a href="" class="btn btn-primary btns-holder-text">Add to favorite</a
    ><a href="" class="btn btn-outline btns-holder-text">Give a rating</a></div>
  </div>`;
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
