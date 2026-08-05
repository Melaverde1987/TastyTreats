import SlimSelect from 'slim-select';
import 'slim-select/styles';

const selectClass = document.querySelectorAll('.filter-select');

selectClass.forEach(item => {
  new SlimSelect({
    select: item,
    settings: {
      showSearch: false,
    },
  });
});
