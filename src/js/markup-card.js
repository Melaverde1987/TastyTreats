const storedFavorites =
  JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

function createMarkupGridCard(arr) {
  return arr
    .map(({ _id, title, description, rating, thumb }) => {
      const roundRating = Math.round(rating);
      const ratingNumber = Number(rating).toFixed(1);
      const heartFull = storedFavorites.some(
        favRecipe => _id === favRecipe._id
      );

      return `
        <li class="item-recipes">
          <div class="wrap-recipes">
            <button type="button" class="btn-add-to-favorite ${heartFull ? 'active' : 'no'}" data-name="${_id}">
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
        </li>
      `;
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

export { storedFavorites, createMarkupGridCard };
