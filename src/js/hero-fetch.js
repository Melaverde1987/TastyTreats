import { fetchEvents } from './API/hero-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { initSwiper } from './swiper.js';

const elements = {
  heroCard: document.querySelector('.swiper-hero'),
  swiperWrapper: document.querySelector('.swiper-wrapper'),
};

if (elements.heroCard) {
  heroData();
}

async function heroData() {
  try {
    const result = await fetchEvents();
    elements.swiperWrapper.innerHTML = createMarkupEvents(result);
    initSwiper();
  } catch (error) {
    console.log(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }

  function createMarkupEvents(arr) {
    return arr
      .map(
        ({
          cook: { name, imgWebpUrl },
          topic: {
            name: nameTopic,
            area,
            imgWebpUrl: imgWebpUrlTopic,
            previewWebpUrl,
          },
        }) => `<div class="swiper-slide">
          <div class="swiper-item">
            <div class="chief">
              <img class="chief-photo"
                src="${imgWebpUrl}"
                alt="${name}"
              />
            </div>
            <div class="dish">
              <img class="dish-photo"
                src="${previewWebpUrl}"
                alt="${nameTopic}"
              />
              <div class="dish-text">
                <h2 class="dish-name">${nameTopic}</h2>
                <p class="dish-area">${area}</p>
              </div>
            </div>
            <div class="cuisine">
              <img class="cuisine-photo"
                src="${imgWebpUrlTopic}"
                alt="Preview"
              />
            </div>
          </div>
        </div>`
      )
      .join('');
  }
}
