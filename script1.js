'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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
// Scrolling :
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation :

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

// Tabbed Component :

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

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
