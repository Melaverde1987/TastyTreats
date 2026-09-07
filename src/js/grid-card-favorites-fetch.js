import { createMarkupGridCard, storedFavorites } from './markup-card';
import { createPagination } from './tui-pagination';

const favoritesCardContainer = document.querySelector(
  '.list-recipes-favorites'
);

let itemsPerPage = 4;

setCardsLimit();

/*
===================
RESPONSIVE LIMIT
===================
*/

function setCardsLimit() {
  updateItemsPerPage();

  window.addEventListener('resize', () => {
    const previousLimit = itemsPerPage;

    updateItemsPerPage();
  });
}

function updateItemsPerPage() {
  const width = window.innerWidth;

  if (width >= 1200) {
    itemsPerPage = 8;
  } else if (width >= 768) {
    itemsPerPage = 6;
  } else {
    itemsPerPage = 4;
  }
}

const pagination = createPagination({
  totalItems: storedFavorites.length,
  itemsPerPage: itemsPerPage,
  visiblePages: 3,
});

pagination.on('afterMove', event => {
  renderFavoriteRecipes(event.page);
});

if (favoritesCardContainer) renderFavoriteRecipes();

function renderFavoriteRecipes(page = 1) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  favoritesCardContainer.innerHTML = createMarkupGridCard(
    storedFavorites.slice(start, end)
  );
}
