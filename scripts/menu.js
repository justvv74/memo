(() => {
  const DROPDOWN_MENU_BTN = document.querySelector('.header__item-btn');
  const DROPDOWN_MENU_LIST = document.querySelector('.header__difficulty-list');
  const BURGER_BTN = document.querySelector('.header__mobile-btn');
  const MOBILE_MENU = document.querySelector('.header__mobile-list');
  const MOBILE_MENU_BTN = document.querySelectorAll('.mobile-menu-btn');
  const MOBILE_MENU_START = document.querySelector('.header__mobile-item-btn');
  const MOBILE_DIFF_LIST = document.querySelector('.header__mobile-difficulty-list');
  const MEDIA_QUERY = window.matchMedia('(max-width: 768px)');

  DROPDOWN_MENU_BTN.addEventListener('click', () => {
    DROPDOWN_MENU_LIST.classList.toggle('header__difficulty-list--visible')
  });

  document.addEventListener('click', (e) => {
    if(!e.target.closest('.header__item-btn')) {
      DROPDOWN_MENU_LIST.classList.remove('header__difficulty-list--visible');
    }
  });

  BURGER_BTN.addEventListener('click', () => {
    MOBILE_MENU.classList.toggle('header__mobile-list--active');
  });

  MOBILE_MENU_START.addEventListener('click', () => {
    MOBILE_DIFF_LIST.classList.add('header__mobile-difficulty-lis--active');
  });

  MOBILE_MENU_BTN.forEach((e) => {
    e.addEventListener('click', () => {
      MOBILE_MENU.classList.remove('header__mobile-list--active');
      MOBILE_DIFF_LIST.classList.remove('header__mobile-difficulty-lis--active');
    });
  });

  MEDIA_QUERY.addEventListener('change', () => {
    if (MOBILE_MENU.classList.contains('header__mobile-list--active')) {
      MOBILE_MENU.classList.remove('header__mobile-list--active');
    }
  });
})();
