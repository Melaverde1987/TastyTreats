import { fetchCards } from './API/grid-cards-api';
import { createMarkupGridCard, storedFavorites } from './markup-card';
import { getPagination, updatePagination } from './tui-pagination';

const favoritesCardContainer = document.querySelector(
  '.list-recipes-favorites'
);

const loader = document.querySelector('.loader');

/*
===================
RESPONSIVE LIMIT
===================
*/
function getItemsPerPage() {
  const width = window.innerWidth;

  if (width >= 1200) {
    return 8;
  }

  if (width >= 768) {
    return 6;
  }

  return 4;
}

if (favoritesCardContainer) {
  renderFavoriteRecipes(1).then(() => {
    initPaginationListener();
  });
}

function initPaginationListener() {
  const pagination = getPagination();

  if (!pagination) {
    return;
  }

  pagination.on('afterMove', event => {
    renderFavoriteRecipes(event.page);
  });
}

async function renderFavoriteRecipes(page = 1) {
  loader?.classList.remove('hidden');

  try {
    const itemsPerPage = getItemsPerPage();
    const result = await fetchCards(1, 1000);
    const filteredRecipes = result.results.filter(item =>
      storedFavorites.includes(item._id)
    );

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const totalItems = filteredRecipes.length;

    favoritesCardContainer.innerHTML = createMarkupGridCard(
      filteredRecipes.slice(start, end)
    );

    updatePagination({
      totalItems,
      itemsPerPage,
      reset: page === 1,
    });
  } catch (error) {
    console.error(error);
  } finally {
    loader?.classList.add('hidden');
  }
}

export { renderFavoriteRecipes, getItemsPerPage };
