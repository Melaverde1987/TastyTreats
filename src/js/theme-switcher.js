const body = document.querySelector('body');
const themeSwitchers = document.querySelectorAll(
  '[data-name="theme-switcher"]'
);

let theme = localStorage.getItem('theme');
if (theme == 'dark') {
  body.classList.add('dark');

  themeSwitchers.forEach(element => {
    element.checked = true;
  });
}

themeSwitchers.forEach(element => {
  element.addEventListener('change', function () {
    const isDark = element.checked;

    body.classList.toggle('dark', isDark);

    themeSwitchers.forEach(switcher => {
      switcher.checked = isDark;
    });

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
