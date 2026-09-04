import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const paginationContainer = document.getElementById('tui-pagination-container');

function createPagination(options = {}) {
  const defaultOptions = {
    totalItems: 0,
    itemsPerPage: 8,
    visiblePages: 5,
    page: 1,
  };

  return new Pagination(paginationContainer, {
    ...defaultOptions,
    ...options,
  });
}

export { createPagination };
