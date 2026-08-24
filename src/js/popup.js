const body = document.querySelector('body');

const refs = {
  modal: document.querySelector('[data-modal-popup]'),
  closeModalBtn: document.querySelector('[data-modal-popup-close]'),
};

refs.modal.addEventListener('click', handleModalClick);

function handleModalClick(e) {
  const closeModalBtn = e.target.closest('[data-modal-popup-close]');
  const isBackdropClick = e.target === refs.modal;

  if (!closeModalBtn && !isBackdropClick) return;

  closeModal();
}

function closeModal() {
  refs.modal.classList.add('is-hidden');
  body.style.overflow = '';
}
