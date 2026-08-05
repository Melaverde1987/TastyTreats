/*
const refs = {
  openModalBtn: document.querySelector('[data-modal-popup-open]'),
  closeModalBtn: document.querySelector('[data-modal-popup-close]'),
  modal: document.querySelector('[data-modal-popup]'),
};

refs.openModalBtn.addEventListener('click', toggleModal);
refs.closeModalBtn.addEventListener('click', toggleModal);

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
}
  */

const refs = {
  cardsList: document.querySelector('.list-recipes'),
  modal: document.querySelector('[data-modal-popup]'),
  closeModalBtn: document.querySelector('[data-modal-popup-close]'),
};

refs.cardsList.addEventListener('click', handleCardsClick);
refs.modal.addEventListener('click', handleModalClick);

function handleCardsClick(e) {
  const openModalBtn = e.target.closest('[data-modal-popup-open]');
  console.log('openModalBtn', openModalBtn);

  if (!openModalBtn) return;

  openModal();
}

function handleModalClick(e) {
  const closeModalBtn = e.target.closest('[data-modal-popup-close]');
  const isBackdropClick = e.target === refs.modal;

  if (!closeModalBtn && !isBackdropClick) return;

  closeModal();
}

function openModal() {
  console.log('refs.modal', refs.modal);
  refs.modal.classList.remove('is-hidden');
}

function closeModal() {
  refs.modal.classList.add('is-hidden');
}

/*
(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-order-popup-open]'),
    closeModalBtn: document.querySelector('[data-order-popup-close]'),
    modal: document.querySelector('[data-order-popup]'),
  };

  if (refs.openModalBtn) {
    refs.openModalBtn.addEventListener('click', toggleModal);
    refs.closeModalBtn.addEventListener('click', toggleModal);
  }

  function toggleModal() {
    refs.modal.classList.toggle('is-hidden');
    refs.modal.classList.contains('is-hidden')
      ? bodyScrollLock.enableBodyScroll(refs.openModalBtn)
      : bodyScrollLock.disableBodyScroll(refs.openModalBtn);
  }
})();
*/
