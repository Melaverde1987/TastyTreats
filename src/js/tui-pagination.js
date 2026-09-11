import Pagination from 'tui-pagination';

const container = document.getElementById('tui-pagination-container');

let pagination = null;

function getPagination(options = {}) {
  if (!container) {
    return null;
  }

  if (!pagination) {
    pagination = new Pagination(container, {
      totalItems: 0,
      itemsPerPage: 4,
      visiblePages: 3,
      page: 1,
      ...options,
    });
  }

  return pagination;
}

function updatePagination({ totalItems, itemsPerPage, reset = true }) {
  const instance = getPagination({
    totalItems,
    itemsPerPage,
  });

  if (!instance) {
    return null;
  }

  instance.setItemsPerPage(itemsPerPage);

  if (reset) {
    instance.reset(totalItems);
  }

  return instance;
}

export { getPagination, updatePagination };
