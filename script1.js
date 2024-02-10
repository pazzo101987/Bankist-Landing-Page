'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//  we will use event delegation for page navigation :
// for this we need to go through 2 steps :
// 1. Add event listner to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED COMPONENT

// here we will use event delegation :
// we add the event to the parent element of the buttons :

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //if we leave it only as "e.target" it will console log the span or the button , it depends where we click
  //if we add ".parentElement", when we click on the botton , it will console the container
  //that's why "closes" witha specified class name , will only console log the button

  //Guard clause
  if (!clicked) return; // this is to avoid getting error when we click outside the button where there is no parent with a class '.operations__tab'

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active')); //this is to return the non clicked bottons to their normal place
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Activate tab:
  clicked.classList.add('operations__tab--active'); //this is to add up animation to the clicked botton
  //Activate content area:
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // this is to get the number of content tab from the data attribute ( check HTML)
});
// MENUE FADE ANIMATION

const handHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //this is to defind the link where the mouse will hit
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //this is to select all of these links into one constant using the closest to go up and then select all the element under this parent with the class name ' nav__link'
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      //since siblings contains also the element clicked itself , so here with this condition we will eliminate it from changing the opacity to 0.5
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  handHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handHover(e, 1);
});

//STICKY NAVIGATIO:

// const initialCoords = section1.getBoundingClientRect(); // this is will give us information about the section 1 like height, width, distance from the top , etc...
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// this method works , but it can generate problems for old devices

//Sticky navigation using Intersection Observer API :

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

// the callback function :

const stickyNav = function (entries) {
  const [entry] = entries; // it's similar to [entry] = entries [0] ==> takes the first element of the entries array and assigns it to the variable entry.
  console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

// the options :

const stickyOptions = {
  root: null, // that's mean we're refering to the viewport
  threshold: 0, // that's mean the header is no longer seen in the viewport
  rootMargin: `-${navHeight}px`, //this is an options to apply the callback function x px earlier or 0px later
};

// the obesrver :

const headerObserver = new IntersectionObserver(stickyNav, stickyOptions);
headerObserver.observe(header);

// REVEAL SECTIONS ON SCROLL

const allSections = document.querySelectorAll('.section');

//callback function

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

//Options

const sectionOptions = {
  root: null,
  threshold: 0.15,
};

//Observer :

const sectionObserver = new IntersectionObserver(revealSection, sectionOptions);
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

//callback
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

//options

const loadOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(loadImg, loadOptions);
imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

// create dots based on the number of slides

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

// activate the dot , make the dot belongs to the slide selected be in different color by adding a specifc class
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// to make the first dot activated when we reload the page
activateDot(0);

// the logic that make the slide moving
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

// This is to make the slides start usually from the slide 0 when we reload
goToSlide(0);

//Next slide

const nextSlide = function () {
  // if we're already at the last slide and we keep clicking it will take us back to the first slide
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// Previous slide

const prevSlide = function () {
  // if we're at the first slide and keep clicking , it will take us to the very last slide
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// this is to make us able to navigate between slides using the keyboard buttons left and right
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else {
    nextSlide();
  }
});
// this is to make us navigate between slides by clicking on the dots :
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide; //This will let as get the element clicked and then see the data set number of it ( data attribute is like an id)
    goToSlide(slide);
    activateDot(slide);
  }
});

/////////////////////////////////////////
// // LECTURE

// // SELECTING ELEMENTS :

// // This will select the header
// const header = document.querySelector('.header');
// // If we want to select multiple elements with the same type
// const allSections = document.querySelectorAll('section');
// // => This will select all the element with the tag ' section'
// document.getElementById('section--1');
// document.getElementsByTagName('button');
// document.getElementsByClassName('btn');

// // CREATING & SELECTING ELEMENTS :

// //1. .insertAdjacentHTML

// //2. second method

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies ! <button class="btn btn--close-cookie"> Got it!</button>';
// // header.prepend(message); //this will add the element as the first child of the parent element
// header.append(message); //===> this will add the element as the last child of the parent element
// // using prepend and append directly will only let the element once , as first ot last element
// // if we want the element to appear multiple time we use :
// // header.append(message.cloneNode(true));

// //DELETE ELEMENTS

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// //           STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '106%';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// //We used the parseFloat method to extract the number from the getComputedStyle(message).height which is basicly a string

// // document.documentElement.style.setProperty('--color-primary', 'orangered');
// //we use this method to change custom properties of css

// //           ATTRIBUTES

// //standard
// // const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt);
// // console.log(logo.src);
// // console.log(logo.className);

// // Non-standard
// // console. log(logo.designer);
// // console. log(logo.getAttribute('designer'));

// // logo.alt = 'Hello World'; ===> this is to change the attribute value
// // logo.setAttribute('company' , 'Bankist'); ===> this is set a new attribue

// //           CLASSES

// // logo.classList.add()
// // logo.classList.remove()
// // logo.classList.toggle()
// // logo.classList.contains()

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('Your are reading the heading 3 !');
//   // h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// const h1 = document.querySelector('h1');

// DOM TRAVERSING : GOING DOWNWARDS : CHILD

// console.log(h1.querySelectorAll('.highlight')); //this is to select children with specific class or id
// console.log(h1.childNodes); //this is to select the Nodes
// console.log(h1.children); //this is to select the elements
// console.log(h1.lastElementChild); //this is to select the first element child
// console.log(h1.firstElementChild); //this is to select the last element child

// DOM TRAVERSING : GOING UPWARDS : PARENTS

// console.log(h1.parentNode);//This is to select the parent Node
// console.log(h1.parentElement);//This is to select the parent element
// console.log(h1.closest('.header'));//This is to select the closest parent with the specific class/id/element name

// DOM TRAVERSING : GOING sideways : SIBLINGS
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
