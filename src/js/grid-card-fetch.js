import { fetchCards } from './API/grid-cards-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkupGridCard } from './markup-card';
import { updatePagination } from './tui-pagination';

const loader = document.querySelector('.loader');

const elements = {
  cards: document.querySelector('.list-recipes'),
};

function getItemsPerPage() {
  const width = window.innerWidth;

  if (width >= 1200) {
    return 9;
  }

  if (width >= 768) {
    return 6;
  }

  return 4;
}

async function defaultData(page = 1) {
  if (!elements.cards) {
    return;
  }

  loader?.classList.remove('hidden');

  try {
    const itemsPerPage = getItemsPerPage();
    const result = await fetchCards(page, itemsPerPage);
    elements.cards.innerHTML = createMarkupGridCard(result.results);
    const totalItems = result.totalPages * itemsPerPage;

    updatePagination({
      totalItems,
      itemsPerPage,
      reset: page === 1,
    });
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader?.classList.add('hidden');
  }
}

export { defaultData, getItemsPerPage };
