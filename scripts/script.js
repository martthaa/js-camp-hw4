'use strict';

const header = document.querySelector('.header');
const nav = document.querySelector('.main-nav__container');
const progressBar = document.querySelector('.main-nav__progress-bar');
const servicesCards = document.querySelector('.cards');
const servicesNav = document.querySelector('.services__nav');
const carouselCards = document.querySelectorAll('.carousel__card-container');
const carouselBtnRight = document.querySelector('.carousel-btn--right');
const carouselBtnLeft = document.querySelector('.carousel-btn--left');
const signUpForm = document.querySelector('form');
const firstNameInput = document.querySelector('.form-input--first-name');
const lastNameInput = document.querySelector('.form-input--last-name');
const emailInput = document.querySelector('.form-input--email');
const footerSpanYear = document.querySelector('.footer-copyright-year');
const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const modalOverlay = document.querySelector('.overlay');

let servicesBtnActive = document.querySelector('.services__nav-btn--selected');
let modalCloseTimer;

const DB_USERSDATA =
  'https://http-fetch-react-default-rtdb.europe-west1.firebasedatabase.app/usersdata.json';

// progress bar

window.addEventListener('scroll', () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / totalHeight) * 100;
  progressBar.style.width = `${progress}%`;
});

// animation
const handleHover = function (e) {
  if (e.target.classList.contains('link')) {
    const hoveredLink = e.target;
    const navLinks = e.target
      .closest('.main-nav__links')
      .querySelectorAll('.link');
    const navLogo = document.querySelector('.main-nav__logo');

    navLinks.forEach(link => {
      if (link !== hoveredLink) {
        link.style.opacity = this.hoverOpacity;
      }
    });
    navLogo.style.opacity = this.hoverOpacity;
  }
};

nav.addEventListener('mouseover', handleHover.bind({ hoverOpacity: 0.5 }));
nav.addEventListener('mouseout', handleHover.bind({ hoverOpacity: 1 }));

// nav

document.querySelector('.main-nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('link')) {
    const sectionId = e.target.getAttribute('href');
    const selectedSection = document.querySelector(sectionId);
    const selectedSectionPosition = selectedSection.getBoundingClientRect().top;
    const navHeight = -nav.getBoundingClientRect().height;
    const Y_OFFSET = sectionId === '#section--blog' ? 50 : -50;

    const yCord =
      selectedSectionPosition + navHeight + window.pageYOffset + Y_OFFSET;

    window.scrollTo({
      top: yCord,
      behavior: 'smooth',
    });
  }
});

// sticky nav

const navObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
};

const stickyNavHandler = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    progressBar.classList.remove('hidden');
  } else {
    nav.classList.remove('sticky');
    progressBar.classList.add('hidden');
  }
};

const navigationObserver = new IntersectionObserver(
  stickyNavHandler,
  navObserverOptions
);

navigationObserver.observe(header);

// work with api

fetch('https://dummyjson.com/products')
.then(r => r.json())
.then(res => {
    data = res.products;
    filteredProducts = [];
    filterButtons.forEach(button => {
      const attr = button.getAttributeNode('data-filter-name').value;
      const firstItem = data.find(item => item.category === attr);
      if (firstItem) filteredProducts.push(firstItem);
    });
    appendCards(filteredProducts)
})
.catch(err => console.error(err));

const filterButtons = document.querySelectorAll('.filter_button');
    let data = [];
    let filteredProducts = [];

    filterButtons.forEach(button => {
        button.onclick = (e) => {
            const categoryAttrValue = e.target.getAttributeNode('data-filter-name').value;
            if (categoryAttrValue !== "all") {
                filteredProducts = data.filter((product, index) => {
                  return product.category === categoryAttrValue
                });
            } else {
              filteredProducts = [];
              filterButtons.forEach(button => {
                const attr = button.getAttributeNode('data-filter-name').value;
                const firstItem = data.find(item => item.category === attr);
                if (firstItem) filteredProducts.push(firstItem);
              });
            }

            const wrapper = document.querySelector('.card_list');
            while (wrapper.lastElementChild) {
              wrapper.removeChild(wrapper.lastElementChild);
            }

            appendCards(filteredProducts.slice(0, 7))
            filterButtons.forEach(item => item.className = "filter_button")
            e.target.className = "filter_button filter_button__active"
        }
    })

    const appendCards = function(products) {
        const wrapper = document.querySelector('.card_list');
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = "card";

            const cardAvatar = document.createElement('div');
            cardAvatar.className = "card_img";

            const image = document.createElement('img');
            image.src = product.thumbnail;

            const cardContent = document.createElement('div');
            cardContent.className = "card_content";

            const title = document.createElement('span');
            title.textContent = product.title;

            const descr = document.createElement('p');
            descr.textContent = product.description;

            cardAvatar.appendChild(image);
            cardContent.appendChild(title);
            cardContent.appendChild(descr);
            div.appendChild(cardAvatar)
            div.appendChild(cardContent);
            wrapper.appendChild(div)

        })
    };


// slider

let curSlide = 0;
const lastSlide = carouselCards.length;

const scrollSlide = () => {
  carouselCards.forEach((card, i) => {
    card.style.transform = `translateX(${120 * (i - curSlide * 2)}%)`;
  });
};

const nextSlide = () => {
  ++curSlide;
  if (curSlide === lastSlide / 2) curSlide = 0;
  scrollSlide();
};

const prevSlide = () => {
  --curSlide;
  if (curSlide === -1) curSlide = lastSlide / 2 - 1;
  scrollSlide();
};

carouselCards.forEach((card, i) => {
  card.style.transform = `translateX(${120 * i}%)`;
});

carouselBtnRight.addEventListener('click', nextSlide);
carouselBtnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

// blog

const revealBlogs = entries => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.style.animation = 'show-blog 1s';
    entry.target.style.opacity = 1;
  } else {
    entry.target.style.opacity = 0;
    entry.target.style.animation = '';
  }
};

const blogsSectionObs = new IntersectionObserver(revealBlogs, {
  root: null,
  threshold: 0,
});

const blogsSection = document.querySelector('.blogs');
blogsSectionObs.observe(blogsSection);

// modal

const randomize = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const createParticles = particlesNum => {
  for (let i = 0; i < particlesNum; i++) {
    const bar = document.createElement('div');
    bar.classList.add('fall-bar');
    bar.style.backgroundColor = `rgb(${randomize(0, 255)}, ${randomize(
      0,
      255
    )}, ${randomize(0, 255)})`;
    bar.style.left = `${randomize(0, modalOverlay.offsetWidth)}px`;
    bar.style.animationDelay = `${randomize(0, 3)}s`;
    bar.style.animationDuration = `${randomize(4, 8)}s`;
    bar.style.transform = `rotate(${randomize(0, 360)}deg)`;
    modalOverlay.appendChild(bar);
  }
};

const openModal = () => {
  modal.classList.remove('invisible');
  modalOverlay.classList.remove('invisible');
  createParticles(30);
  clearTimeout(modalCloseTimer);
  modalCloseTimer = setTimeout(closeModal, 5000);
};

const closeModal = () => {
  modal.classList.add('invisible');
  modalOverlay.classList.add('invisible');
  document
    .querySelectorAll('.fall-bar')
    .forEach(bar => (bar.style.display = 'none'));

  clearTimeout(modalCloseTimer);
};

modalOverlay.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);

// parse date
const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'Decemeber',
};

const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
const modalDate = `${months[currentMonth]} ${currentDay}`;

document.querySelector('.modal__date').textContent = modalDate;

// form and congrModal

const postUserData = async userData => {
  const request = await fetch(DB_USERSDATA, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

const localStorageInit = () => {
  if (!localStorage.getItem('users'))
    localStorage.setItem('users', JSON.stringify([]));
};

const addToStorage = (storage, data) => {
  const selectedStorage = JSON.parse(localStorage.getItem(storage));
  selectedStorage.push(data);
  localStorage.setItem(storage, JSON.stringify(selectedStorage));
};

localStorageInit();

signUpForm.addEventListener('submit', e => {
  e.preventDefault();
  const nameRegex = /^[A-Z][a-z]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [firstNameError, lastNameError, emailError] =
    document.querySelectorAll('.form-input-error');

  const nameIsValid = nameRegex.test(firstNameInput.value);
  const lastNameIsValid = nameRegex.test(lastNameInput.value);
  const emailIsValid = emailRegex.test(emailInput.value);

  const formIsValid = nameIsValid && lastNameIsValid && emailIsValid;

  firstNameInput.classList[nameIsValid ? 'remove' : 'add']('input--invalid');
  firstNameError.classList[nameIsValid ? 'add' : 'remove']('hidden');

  lastNameInput.classList[lastNameIsValid ? 'remove' : 'add']('input--invalid');
  lastNameError.classList[lastNameIsValid ? 'add' : 'remove']('hidden');

  emailInput.classList[emailIsValid ? 'remove' : 'add']('input--invalid');
  emailError.classList[emailIsValid ? 'add' : 'remove']('hidden');

  if (formIsValid) {
    const userData = {
      id: Math.random().toFixed(6),
      userFirstName: firstNameInput.value,
      userLastName: lastNameInput.value,
      userEmail: emailInput.value,
    };
    addToStorage('users', userData);
    postUserData(userData);
    if (firstNameInput.value === 'Sigma') openModal();
  }
});

// loader

const LOADING_TIMEOUT = 5000; // 5 seconds

window.addEventListener('load', () => {
  const content = document.querySelector('.content');
  const loader = document.querySelector('.loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    content.classList.remove('hidden');
  }, LOADING_TIMEOUT);
});

// map
google.maps.event.addDomListener(window, 'load', init);
        
function init() {
    let mapOptions = {
        zoom: 18,

        center: new google.maps.LatLng(49.803037012373075, 24.00122152587979), 

        styles: [{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#878787"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f9f5ed"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"color":"#f5f5f5"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#aee0f4"}]}]
    };

    let mapElement = document.querySelector('.js-map');

    let map = new google.maps.Map(mapElement, mapOptions);

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(49.803037012373075, 24.00122152587979),
        map: map,
        title: 'Snazzy!'
    });
}

// close modal

const IDLE_EVENT_LIST = ['click', 'scroll', 'selectionchange'];
const IDLE_TIMEOUT = 60 * 1000; // 1 minute

const resetTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(showAlert, IDLE_TIMEOUT);
};

const showAlert = () => {
  confirm('Are you still here?') ? resetTimer() : window.close();
};

IDLE_EVENT_LIST.forEach(event => {
  document.addEventListener(event, resetTimer);
});

let timer = setTimeout(showAlert, IDLE_TIMEOUT);

// updated date
const currentYear = new Date().getFullYear();
footerSpanYear.textContent = currentYear;
