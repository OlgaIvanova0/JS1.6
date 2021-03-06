"use strict";
/*Задание 1.Доработать функцию замены картинки в галерее таким образом, чтобы она проверяла наличие большой
картинки по указанному в src адресу. Если такой картинки не существует или она не доступна, то должна
ставиться картинка-заглушка сообщающая об ошибке.*/

/*Задание 3. 3*. Добавить в галерею функцию перехода к следующему изображению. По сторонам от большой картинки
должны быть стрелки “вперед” и “назад”, по нажатию на которые происходит замена изображения на
следующее или предыдущее.*/

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки открыть.
 */
const gallery = {
  settings: {
    previewSelector: '.mySuperGallery',
    openedImageWrapperClass: 'galleryWrapper',
    openedImageClass: 'galleryWrapper__image',
    openedImageScreenClass: 'galleryWrapper__screen',
    openedImageCloseBtnClass: 'galleryWrapper__close',
    openedImageCloseBtnSrc: 'images/close.png',
    errorImageClass: 'error_img',
    errorImageSrc: 'images/error-img.jpg',
    buttonNextClass: 'btnNext',
    buttonNextText: '>>',
    buttonPrewClass: 'btnPrew',
    buttonPrewText: '<<',
    openImgSrc: null,
    nextImgSrc: null,
    prewImgSrc: null,
    lastImgSrc: null,

  },
  /**
   * Инициализирует галерею, ставит обработчик события.
   * @param {Object} userSettings Объект настроек для галереи.
   */
  init(userSettings = {}) {
    // Записываем настройки, которые передал пользователь в наши настройки.
    Object.assign(this.settings, userSettings);
    // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
    // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
    // gallery и передадим туда событие MouseEvent, которое случилось.
    document
      .querySelector(this.settings.previewSelector)
      .addEventListener('click', event => this.containerClickHandler(event));
  },
  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
    // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
    if (event.target.tagName !== 'IMG') {
      return;
    } 
    // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
    this.openImage(event.target.dataset.full_image_url);
    this.settings.openImgSrc = event.target.dataset.full_image_url;        
  },
  /**
   * Открывает картинку.
   * @param {string} src Ссылка на картинку, которую надо открыть.
   */
  openImage(src) {
    // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
    this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = src;   
  },
  /**
   * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
   * @returns {Element}
   */
  getScreenContainer() {
    // Получаем контейнер для открытой картинки.
    const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
    // Если контейнер для открытой картинки существует - возвращаем его.
    if (galleryWrapperElement) {
      return galleryWrapperElement;
    }
    // Возвращаем полученный из метода createScreenContainer контейнер.
    return this.createScreenContainer();
  },
  /**
   * Создает контейнер для открытой картинки.
   * @returns {HTMLElement}
   */
  createScreenContainer() {
    // Создаем сам контейнер-обертку и ставим ему класс.
    const galleryWrapperElement = document.createElement('div');
    galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);
    // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
    const galleryScreenElement = document.createElement('div');
    galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
    galleryWrapperElement.appendChild(galleryScreenElement);
    // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
    const closeImageElement = new Image();
    closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
    closeImageElement.src = this.settings.openedImageCloseBtnSrc;
    closeImageElement.addEventListener('click', () => this.close());
    galleryWrapperElement.appendChild(closeImageElement);
    // Создаем кнопку вперед
    const btnNext = document.createElement('button');
    btnNext.textContent = this.settings.buttonNextText;
    btnNext.classList.add(this.settings.buttonNextClass);
    galleryWrapperElement.appendChild(btnNext);
    btnNext.addEventListener('click', () => this.nextImg());
    //создаем кнопку назад
    const btnPrew = document.createElement('button');
    btnPrew.textContent = this.settings.buttonPrewText;
    btnPrew.classList.add(this.settings.buttonPrewClass);
    btnPrew.addEventListener('click', () => this.prewImg());
    galleryWrapperElement.appendChild(btnPrew);
    // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
    const image = new Image();
    image.classList.add(this.settings.openedImageClass);
    galleryWrapperElement.appendChild(image);
    
    image.onerror = () => { //если картинка не найдена - вставляем картинку с сообщением об ошибке.
        image.classList.remove(this.settings.openedImageClass);
        image.classList.add(this.settings.errorImageClass);
        image.src = this.settings.errorImageSrc; 
        this.settings.openedImageClass = this.settings.errorImageClass;  
    };

    // Добавляем контейнер-обертку в тег body.
    document.body.appendChild(galleryWrapperElement);
    // Возвращаем добавленный в body элемент, наш контейнер-обертку.
    return galleryWrapperElement;
  },
  /**
   * Закрывает (удаляет) контейнер для открытой картинки.
   */
  close() {
    document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
  },
  nextImg(){
    let gallery = document.getElementsByClassName('imgGallery');
    if (+this.settings.openImgSrc[11] < gallery.length){
      this.settings.nextImgSrc = this.settings.openImgSrc.substr(0, 11) + (+this.settings.openImgSrc[11] + 1) + this.settings.openImgSrc.substr(12, 15);
    } else {
      this.settings.nextImgSrc = this.settings.openImgSrc.substr(0, 11) + (+this.settings.openImgSrc[11] - 3) + this.settings.openImgSrc.substr(12, 15);
    };
    this.openImage(this.settings.nextImgSrc);
    this.settings.openImgSrc = this.settings.nextImgSrc;  
  },
  prewImg(){ 
    if (+this.settings.openImgSrc[11] > 1){
    this.settings.prewImgSrc = this.settings.openImgSrc.substr(0, 11) + (+this.settings.openImgSrc[11] - 1) + this.settings.openImgSrc.substr(12, 15);
  } else {
    this.settings.prewImgSrc = this.settings.openImgSrc.substr(0, 11) + (+this.settings.openImgSrc[11] + 3) + this.settings.openImgSrc.substr(12, 15);
  };
  this.openImage(this.settings.prewImgSrc);
  this.settings.openImgSrc = this.settings.prewImgSrc; 
  },
};
// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({previewSelector: '.galleryPreviewsContainer'});





/*Задание 2.Реализовать модуль корзины. У каждого товара есть кнопка «Купить», при нажатии на которую
происходит добавление имени и цены товара в блок корзины. Корзина должна уметь считать
общую сумму заказа. Один товар можно добавить несколько раз.*/

const basket = {
goods: [], //список купленных товаров
countEl: 0, //количество товаров
priceEl: 0, //место для показа общей суммы товаров
};

const init = () => {
    const elems = document.querySelectorAll('button'); //нашли кнопки
       for (const elem of elems){
            elem.addEventListener('click', () => {
               const price = elem.dataset.price; 
               const name = elem.dataset.name;
               basket.goods.push({name: name, price: +price}); //записываем все купленные товары 
               basket.countEl++; //считаем количество товаров
               basket.priceEl = basket.priceEl + +price; //считаем общую сумму 

               const countTotal = document.getElementById('basket-count'); //нашли куда выводить количество
               const priceTotal = document.getElementById('basket-price'); //нашли куда вывести сумму
               countTotal.innerText = basket.countEl; //выводим итоги
               priceTotal.textContent = basket.priceEl;
            });
       };  
};
init();












