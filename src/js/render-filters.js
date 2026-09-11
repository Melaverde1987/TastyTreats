import SlimSelect from 'slim-select';
import 'slim-select/styles';
import { fetchAreas, fetchIngredients } from './API/filters-api';

const elements = {
  selectTimeButton: document.querySelector('#time-select'),
  selectAreaButton: document.querySelector('#area-select'),
  selectIngredientsButton: document.querySelector('#ingredients-select'),
};

let timeSlimSelect;
let areaSlimSelect;
let ingredientsSlimSelect;

/*
====================
TIME
====================
*/

if (elements.selectTimeButton) {
  const times = [];

  for (let time = 5; time <= 160; time += 5) {
    times.push(time);
  }

  elements.selectTimeButton.insertAdjacentHTML(
    'beforeend',
    createMarkupSelectTime(times)
  );

  timeSlimSelect = new SlimSelect({
    select: elements.selectTimeButton,
    settings: {
      showSearch: false,
    },
  });
}

function createMarkupSelectTime(arr) {
  return arr
    .map(
      time => `
        <option value="${time}">
          ${time} min
        </option>
      `
    )
    .join('');
}

/*
====================
AREA
====================
*/

if (elements.selectAreaButton) {
  selectAreaData();
}

async function selectAreaData() {
  try {
    const result = await fetchAreas();

    elements.selectAreaButton.insertAdjacentHTML(
      'beforeend',
      createMarkupSelectArea(result)
    );

    areaSlimSelect = new SlimSelect({
      select: elements.selectAreaButton,
      settings: {
        showSearch: false,
      },
    });
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Filters went wrong! Try reloading the page!');
  }
}

function createMarkupSelectArea(arr) {
  return arr
    .map(({ name }) => `<option value="${name}">${name}</option>`)
    .join('');
}

/*
====================
INGREDIENTS
====================
*/

if (elements.selectIngredientsButton) {
  selectIngredientsData();
}

async function selectIngredientsData() {
  try {
    const result = await fetchIngredients();

    elements.selectIngredientsButton.insertAdjacentHTML(
      'beforeend',
      createMarkupSelectIngredients(result)
    );

    ingredientsSlimSelect = new SlimSelect({
      select: elements.selectIngredientsButton,
      settings: {
        showSearch: false,
      },
    });
  } catch (error) {
    console.error(error);

    Notify.failure('Oops! Filters went wrong! Try reloading the page!');
  }
}

function createMarkupSelectIngredients(arr) {
  return arr
    .map(
      ({ _id, name }) => `
        <option value="${_id}">
          ${name}
        </option>
      `
    )
    .join('');
}

export { timeSlimSelect, areaSlimSelect, ingredientsSlimSelect };
