import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/partials/hero-swiper.css';

const swiper = new Swiper('.swiper-hero', {
  direction: 'horizontal',
  loop: true,
  slidesPerGroup: 1,
  modules: [Pagination],
  spaceBetween: 20,
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return (
        '<button class="' +
        className +
        '">go to slide ' +
        (index + 1) +
        '</button>'
      );
    },
  },
});

export { swiper };
