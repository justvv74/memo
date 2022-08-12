(() => {
  // Memo
  const FIELD_CONTAINER = document.getElementById('field-container');
  const FIELD = document.createElement('div');
  const START = document.querySelectorAll('.start-btn');
  const LEVEL_EASY = document.querySelectorAll('.easy-level');
  const LEVEL_MEDIUM = document.querySelectorAll('.medium-level');
  const LEVEL_HARD = document.querySelectorAll('.hard-level');
  const OPEN_CARD_ARR = [];
  const CARD_ATTRIBUTE_ARR = [];
  const CARD_WIN_ARR = [];
  const TIMER_CONTAINER = document.createElement('div');
  const TIMER_AREA = document.createElement('div');
  const TOP_BTN = document.querySelectorAll('.top-list');
  const ABOUT_BTN = document.querySelectorAll('.about-btn');
  let timerSec = 0;
  let sec = 0;
  let min = 0;
  let timerSetInterval;

  // localStorage
  let savedItems = [];

  function getLocalStorageArr() {
    for (let i = 0; i < localStorage.length; ++i) {
      savedItems.push(localStorage.key(i));
    };
  }

  function setCARD_ATTRIBUTE_ARR(arrLength) {
    for (let i = 0; i < (arrLength / 2); ++i) {
      CARD_ATTRIBUTE_ARR.push(i, i);
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffle(CARD_ATTRIBUTE_ARR);

    for (let i = 0; i < arrLength; ++i) {
      FIELD.append(createCard(CARD_ATTRIBUTE_ARR[i], arrLength));
    }
  }

  function createCard(cardNum, arrLength) {
    const CARD = document.createElement('div');

    CARD.classList.add('card');
    CARD.setAttribute('cardN', cardNum);

    CARD.addEventListener('click', (e) => {
      const CARDS = document.querySelectorAll('.card');

      if (e.target.getAttribute('open') !== '1' && OPEN_CARD_ARR.length < 2) {
        CARD.setAttribute('open', '1');
        CARD.classList.add('card-face');
        OPEN_CARD_ARR.push(CARD.getAttribute('cardN'));

        if (OPEN_CARD_ARR[0] === OPEN_CARD_ARR[1]) {
          const CARD_WIN = document.querySelectorAll('.card[open]');

          setTimeout(cardWinTimeout, 300);
          CARD_WIN_ARR.push('1', '1');

          function cardWinTimeout() {
            CARD_WIN.forEach((e) => {
              e.classList.add('win');
            });
          }
        }

        if (OPEN_CARD_ARR.length > 1) {
          setTimeout(closeCard, 800);
        }

        if (CARD_WIN_ARR.length == arrLength) {
          clearInterval(timerSetInterval);
          CARD_WIN_ARR.splice(0, CARD_WIN_ARR.length);
          gameOver(arrLength);
          console.log('работает')
          if (savedItems.indexOf(JSON.stringify(arrLength)) === -1 || getTopValueInSec(arrLength) > timerSec) {
            if (TIMER_AREA.textContent !== 'Слишком долго...') {
              localStorage.setItem(JSON.stringify(arrLength), JSON.stringify(TIMER_AREA.textContent));
            }
          }
        }
      }

      function closeCard() {
        OPEN_CARD_ARR.splice(0, OPEN_CARD_ARR.length);

        CARDS.forEach((e) => {
          e.classList.remove('card-face');
        });

        CARDS.forEach((e) => {
          e.removeAttribute('open');
        });
      }
    });

    return CARD;
  }

  function clearFIELD() {
    document.querySelectorAll('.card').forEach((e) => {
      e.remove();
    });
  }

  function timer() {
    sec++;
    timerSec++;

    if (sec === 60) {
      sec = 0;
      min++;
    }

    TIMER_AREA.textContent = `${min} : ${sec}`;

    if (min === 10) {
      clearInterval(timerSetInterval);
      TIMER_AREA.textContent = 'Слишком долго...';
    }
  }

  function getlocalStorageValue(index) {
    const TOP_ARR = [];
    const SORTED_ITEMS = savedItems.sort();
    let indexConverted = index;

    for (let i = 0; i < localStorage.length; ++i) {
      TOP_ARR.push(localStorage.getItem(SORTED_ITEMS[i]));
    }

    if (indexConverted === 12) {
      indexConverted = SORTED_ITEMS.indexOf('12');
    } if (indexConverted === 18) {
      indexConverted = SORTED_ITEMS.indexOf('18');
    } if (indexConverted === 30) {
      indexConverted = SORTED_ITEMS.indexOf('30');
    }

    return TOP_ARR[indexConverted];
  }

  function getTopValueInSec(e) {
    let time = 599;

    if (savedItems.indexOf(JSON.stringify(e)) !== -1) {
      let min = JSON.parse(getlocalStorageValue(e)).substring(0, 1) * 60;
      time = parseInt(min) + parseInt(JSON.parse(getlocalStorageValue(e)).substring(4,));
    }

    return time;
  }

  function setTimer() {
    TIMER_AREA.textContent = '0 : 0';
    timerSetInterval = setInterval(() => {
      timer();
    }, 1000);
  }

  function gameOver(e) {
    const GAME_OVER_WRAPPER = document.createElement('div');
    const GAME_OVER_BOX = document.createElement('div');
    const GAME_OVER_MESSAGE = document.createElement('p');

    console.log('а эта?')

    if (savedItems.indexOf(JSON.stringify(e)) === -1 && TIMER_AREA.textContent !== 'Слишком долго...' || getTopValueInSec(e) > timerSec && TIMER_AREA.textContent !== 'Слишком долго...') {
      GAME_OVER_MESSAGE.innerHTML = `Игра закончена! <br> Вы установили новый рекорд <br> <strong>${TIMER_AREA.textContent}!</strong>`;
    } else {
      GAME_OVER_MESSAGE.innerHTML = 'Игра закончена!';
    }

    GAME_OVER_MESSAGE.classList.add('game-over-message');
    GAME_OVER_BOX.classList.add('game-over-box');
    GAME_OVER_WRAPPER.classList.add('game-over-wrapper');

    GAME_OVER_BOX.append(GAME_OVER_MESSAGE);
    GAME_OVER_WRAPPER.append(GAME_OVER_BOX);
    FIELD_CONTAINER.append(GAME_OVER_WRAPPER);
  }

  document.addEventListener('DOMContentLoaded', () => {
    START.forEach((e) => {
      e.addEventListener('click', () => {
        if (document.querySelector('.field__timer')) {
          document.querySelector('.field__timer').remove();
        }

        if (document.querySelector('.game-over-wrapper')) {
          document.querySelector('.game-over-wrapper').remove();
        }

        if (document.querySelector('.about__container')) {
          document.querySelector('.about__container').remove();
        }

        if (document.querySelector('.top-container')) {
          document.querySelector('.top-container').remove();
        }

        FIELD.classList.add('field__cards-box', 'flex');
        TIMER_CONTAINER.classList.add('field__timer-box', 'flex');
        TIMER_AREA.classList.add('field__timer');

        TIMER_CONTAINER.append(TIMER_AREA);
        FIELD_CONTAINER.append(TIMER_CONTAINER);
        FIELD_CONTAINER.append(FIELD);

        savedItems = []
        getLocalStorageArr();
        clearInterval(timerSetInterval);
        CARD_ATTRIBUTE_ARR.splice(0, CARD_ATTRIBUTE_ARR.length);
        clearFIELD();
        TIMER_AREA.textContent = '';
        sec = 0;
        min = 0;
        timerSec = 0;
        CARD_WIN_ARR.splice(0,);
      });
    });

    LEVEL_EASY.forEach((e) => {
      e.addEventListener('click', () => {
        setCARD_ATTRIBUTE_ARR(12);
        FIELD.classList.add('easy-level');
        FIELD.classList.remove('hard-level', 'medium-level');
        setTimer();
      });
    });

    LEVEL_MEDIUM.forEach((e) => {
      e.addEventListener('click', () => {
        setCARD_ATTRIBUTE_ARR(18);
        FIELD.classList.add('medium-level');
        FIELD.classList.remove('hard-level', 'easy-level');
        setTimer();
      });
    });

    LEVEL_HARD.forEach((e) => {
      e.addEventListener('click', () => {
        setCARD_ATTRIBUTE_ARR(30);
        FIELD.classList.add('hard-level');
        FIELD.classList.remove('medium-level', 'easy-level');
        setTimer();
      });
    });

    TOP_BTN.forEach((e) => {
      e.addEventListener('click', () => {
        if (document.querySelector('.field__timer-box')) {
          clearInterval(timerSetInterval);
          document.querySelector('.field__timer-box').remove();
        }

        if (document.querySelector('.field__cards-box')) {
          document.querySelector('.field__cards-box').remove();
        }

        if (document.querySelector('.game-over-wrapper')) {
          document.querySelector('.game-over-wrapper').remove();
        }

        if (document.querySelector('.about__container')) {
          document.querySelector('.about__container').remove();
        }

        if (document.querySelector('.top-container')) {
          document.querySelector('.top-container').remove();
        }

        const TOP_FIELD = document.createElement('div');
        const TOP_TITLE = document.createElement('h2');
        const TOP_LIST = document.createElement('ul');

        TOP_FIELD.classList.add('top-container');
        TOP_LIST.classList.add('field__top-list')

        if (!document.querySelector('.field__top-title')) {
          savedItems.splice(0, savedItems.length);
          getLocalStorageArr();
          TOP_TITLE.classList.add('field__top-title');
          TOP_TITLE.textContent = 'Лучшее время';

          const TOP_ROW_EASY = document.createElement('li');
          const TOP_ROW_MEDIUM = document.createElement('li');
          const TOP_ROW_HARD = document.createElement('li');
          const TOP_TIME_EASY = document.createElement('span');
          const TOP_LEVEL_EASY = document.createElement('span');
          const TOP_TIME_MEDIUM = document.createElement('span');
          const TOP_LEVEL_MEDIUM = document.createElement('span');
          const TOP_TIME_HARD = document.createElement('span');
          const TOP_LEVEL_HARD = document.createElement('span');

          TOP_ROW_EASY.classList.add('field__top-item');
          TOP_ROW_MEDIUM.classList.add('field__top-item');
          TOP_ROW_HARD.classList.add('field__top-item');

          const TOP_RESULT = [];
          TOP_RESULT.splice(0, TOP_RESULT.length);

          if (localStorage.length === 0) {
            TOP_TITLE.textContent = 'Результатов пока нет';
          } else {
            if (savedItems.indexOf('12') !== -1) {
              TOP_TIME_EASY.textContent = JSON.parse(localStorage.getItem(savedItems.sort()[savedItems.indexOf('12')]));
            } else {
              TOP_TIME_EASY.textContent = '0 : 0';
            }
            if (savedItems.indexOf('18') !== -1) {
              TOP_TIME_MEDIUM.textContent = JSON.parse(localStorage.getItem(savedItems.sort()[savedItems.indexOf('18')]));
            } else {
              TOP_TIME_MEDIUM.textContent = '0 : 0';
            }
            if (savedItems.indexOf('30') !== -1) {
              TOP_TIME_HARD.textContent = JSON.parse(localStorage.getItem(savedItems.sort()[savedItems.indexOf('30')]));
            } else {
              TOP_TIME_HARD.textContent = '0 : 0';
            }
            TOP_LEVEL_EASY.textContent = 'Простой';
            TOP_LEVEL_MEDIUM.textContent = 'Средний';
            TOP_LEVEL_HARD.textContent = 'Тяжёлый';
          }

          TOP_ROW_EASY.append(TOP_TIME_EASY);
          TOP_ROW_EASY.append(TOP_LEVEL_EASY);
          TOP_ROW_MEDIUM.append(TOP_TIME_MEDIUM);
          TOP_ROW_MEDIUM.append(TOP_LEVEL_MEDIUM);
          TOP_ROW_HARD.append(TOP_TIME_HARD);
          TOP_ROW_HARD.append(TOP_LEVEL_HARD);

          TOP_LIST.append(TOP_ROW_EASY);
          TOP_LIST.append(TOP_ROW_MEDIUM);
          TOP_LIST.append(TOP_ROW_HARD);

          TOP_FIELD.append(TOP_TITLE);
          TOP_FIELD.append(TOP_LIST);
          FIELD_CONTAINER.append(TOP_FIELD);
        }
      });
    });

    ABOUT_BTN.forEach((e) => {
      e.addEventListener('click', (e) => {
        if (document.querySelector('.field__timer-box')) {
          clearInterval(timerSetInterval);
          document.querySelector('.field__timer-box').remove();
        }

        if (document.querySelector('.field__cards-box')) {
          document.querySelector('.field__cards-box').remove();
        }

        if (document.querySelector('.game-over-wrapper')) {
          document.querySelector('.game-over-wrapper').remove()
        }

        if (document.querySelector('.top-container')) {
          document.querySelector('.top-container').remove()
        }

        if (document.querySelector('.about__container')) {
          document.querySelector('.about__container').remove();
        }

        const ABOUT_CONTAINER = document.createElement('div');
        const ABOUT_TITLE = document.createElement('h2');
        const ABOUT_TEXT = document.createElement('p');
        const AUTOR_TITLE = document.createElement('h2');
        const AUTOR_TEXT = document.createElement('p');

        ABOUT_CONTAINER.classList.add('about__container');
        ABOUT_TITLE.classList.add('about__title');
        ABOUT_TEXT.classList.add('about__text');
        AUTOR_TITLE.classList.add('about__autor-title');
        AUTOR_TEXT.classList.add('about__autor-text');

        ABOUT_TITLE.textContent = 'Правила игры';
        ABOUT_TEXT.textContent = 'Игрок переворачивает по две карточки. Если картинки на карточках одинаковые, то карточки исчезают. Игра продолжается пока остаются неоткрытые карточки. В игре есть таймер, если игрок улучшает время прохождения игры, оно записывается в соответствующий список.';
        AUTOR_TITLE.textContent = 'Автор';
        AUTOR_TEXT.innerHTML = 'Василий Жестков. <a href="mailto:just_v@inbox.ru" class="about__autor-mail">just_v@inbox.ru</a>';

        ABOUT_CONTAINER.append(ABOUT_TITLE);
        ABOUT_CONTAINER.append(ABOUT_TEXT);
        ABOUT_CONTAINER.append(AUTOR_TITLE);
        ABOUT_CONTAINER.append(AUTOR_TEXT);
        FIELD_CONTAINER.append(ABOUT_CONTAINER);
      });
    });
  });
})();
