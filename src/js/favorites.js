import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkupGridCard } from './grid-card-fetch';

const listRecipe = document.querySelector('.list-recipes');
const btnFavorite = document.querySelectorAll('.btn-add-to-favorite');
const svgFavorite = document.querySelector('.icon-heart');
const favoritesContainer = document.getElementById('favorites-container');
const favoritesCardContainer = document.querySelector(
  '.list-recipes-favorites'
);

// Инициализируем массив избранных рецептов при загрузке страницы
const storedFavorites = [];

if (listRecipe) {
  listRecipe.addEventListener('click', onClickFavorite);
}

function onClickFavorite(evt) {
  if (evt.target.classList.contains('btn-add-to-favorite')) {
    evt.target.classList.toggle('icon-heart-active');
    evt.target.children[0].classList.toggle('active');
    const name = evt.target.getAttribute('name');

    const svgHeart = evt.target;
    svgHeart.classList.toggle('filled-heart');

    const _id = name; // Присваиваем _id значение атрибута 'name'

    // Проверяем, есть ли уже такая карточка в избранном
    const existingIndex = storedFavorites.findIndex(
      recipe => recipe._id === _id
    );

    if (existingIndex !== -1) {
      // Если карточка уже в избранном, удаляем её
      storedFavorites.splice(existingIndex, 1);
    } else {
      // Создаем объект для представления карточки в избранном
      const buttonFavorite = svgHeart
        .closest('.item-recipes')
        .querySelector('.btn-add-to-favorite');
      const card = svgHeart.closest('.item-recipes');
      const titleElement = card.querySelector('.title-recipes');
      const title = titleElement ? titleElement.textContent : '';
      const description = card.querySelector(
        '.description-recipes'
      ).textContent;
      const rating = card.querySelector('.rating-number').textContent;
      const thumb = card.querySelector('.img-recipes').src;

      const favoriteRecipe = {
        _id,
        title,
        description,
        rating,
        thumb,
      };

      // Добавляем карточку в избранные
      storedFavorites.push(favoriteRecipe);
    }

    // Сохраняем обновленный массив в локальное хранилище
    localStorage.setItem('favoriteRecipes', JSON.stringify(storedFavorites));

    // Notify.success('Recipe added to favorites!');

    // Выводим текущее состояние массива
    //console.log(storedFavorites);
  }
}

renderFavoriteRecipes();
function renderFavoriteRecipes() {
  const storedFavorites =
    JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

  //console.log(storedFavorites);

  // Отрисовываем каждую карточку
  //console.log('storedFavorites', storedFavorites);

  //const cardHTML = createMarkupGridCardLS(recipe);
  if (favoritesCardContainer) {
    favoritesCardContainer.innerHTML = createMarkupGridCardLS(storedFavorites);
  }
  //favoritesContainer.innerHTML = cardHTML;
}

function createMarkupGridCardLS(arr) {
  return arr
    .map(({ _id, title, description, thumb }) => {
      return `<li class="item-recipes">
            <div class="wrap-recipes">
              <button type="button" class="btn-add-to-favorite" name="${_id}">
                  <svg class="icon-heart active" width="22" height="22">
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
                  <p class="rating-number">4.${getRandomInt(9)}</p>
                  <div class="stars">
                    <svg class="icon-star">
                      <use href="./sprite.svg#rating-star"></use>
                    </svg>
                    <svg class="icon-star">
                      <use href="./sprite.svg#rating-star"></use>
                    </svg>
                    <svg class="icon-star">
                      <use href="./sprite.svg#rating-star"></use>
                    </svg>
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
