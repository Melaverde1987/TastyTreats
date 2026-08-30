const body = document.querySelector('body');

const refs = {
  modal: document.querySelector('[data-modal-popup]'),
  closeModalBtn: document.querySelector('[data-modal-popup-close]'),

  openOrderBtn: document.querySelector('[data-order-popup-open]'),
  closeOrderBtn: document.querySelector('[data-order-popup-close]'),
  modalOrder: document.querySelector('[data-order-popup]'),
};

refs.modal.addEventListener('click', handleModalClick);

if (refs.openOrderBtn) {
  refs.openOrderBtn.addEventListener('click', toggleModal);
  refs.closeOrderBtn.addEventListener('click', toggleModal);
}

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

function toggleModal() {
  refs.modalOrder.classList.toggle('is-hidden');
  refs.modalOrder.classList.contains('is-hidden')
    ? (body.style.overflow = '')
    : (body.style.overflow = 'hidden');
}
