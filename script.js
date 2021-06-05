'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const contents = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach( btn => btn.addEventListener('click' , openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

document.querySelector('.btn--scroll-to').addEventListener('click', function(e){
  e.preventDefault();
  document.getElementById('section--1').scrollIntoView({behavior: "smooth"});
})

////////////////////////////////////////
/////////event delegation
document.querySelector('.nav__links').addEventListener('click', function(e){
  if(e.target.classList.contains('nav__link')){
    e.preventDefault();
    const id = e.target.getAttribute('href')
    document.querySelector(`${id}`).scrollIntoView({behavior: 'smooth'});
  }
})

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  //gaurd clause
  if(!clicked) return;
  
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
 
  contents.forEach(content => content.classList.remove('operations__content--active') );
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

const handelHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    //const siblings = nav.querySelectorAll('.nav__link');
  
    const logo = document.querySelector('.nav__logo')
    //const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sibling =>{ if(sibling !== link)
      sibling.style.opacity = this; 
      //console.log(this)--would return undefined if used regular function instead of arrow function--here arrow func takes in this value using leical scoping
    });
    logo.style.opacity = this ; 
  }
};
nav.addEventListener('mouseover', handelHover.bind(0.5));
nav.addEventListener('mouseout', handelHover.bind(1));

////////////////////////////////
/////sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function(entries){
  const [entry] = entries
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const obsOption = {
  root: null,
  threshold: 0, // when 0% of header is visible we want our callback func to invoke
  rootMargin: `-${navHeight}px`
}

const observer = new IntersectionObserver(obsCallback, obsOption)
observer.observe(header);

///////////////////////////////////////////
///section-reveal
const sections = document.querySelectorAll('.section');

const sectionCallback = function(entries, observer){
  const [entry] = entries;
  //console.log(entry);
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionOption = {
  root: null,
  threshold: 0.1
}

const sectionObserver = new IntersectionObserver(sectionCallback, sectionOption);

sections.forEach(function(section){
  //section.classList.add('section--hidden');
  sectionObserver.observe(section);
})

////////////////////////////////////////////
///////lazy-loading-img
const images = document.querySelectorAll('img[data-src]');

const obsLazyCallback = function(entries, observer){
  const[entry] = entries;
  //console.log(entry);
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function(e){
    e.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)
}

const lazyOption = {
  root: null,
  threshold: 0.1,
  rootMargin: '200px'
}

const lazyObserver = new IntersectionObserver(obsLazyCallback, lazyOption); 
images.forEach(image => lazyObserver.observe(image));

/////////////////////////////////////////////
/////slider
const slides = document.querySelectorAll('.slide');
let currSlide = 0;
const maxLength = slides.length;
const dotContainer = document.querySelector('.dots');


const createDots = function(){
  slides.forEach(function(_, i){
    const html = `<button class="dots__dot" data-slide="${i}"></button>`;
    dotContainer.insertAdjacentHTML('beforeend', html);
  })
}

//const dots = document.querySelectorAll('.dots__dot');
const activeDot = function(slideNum){
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(function(dot){
    dot.classList.remove('dots__dot--active');
  });
  document.querySelector(`.dots__dot[data-slide ='${slideNum}']`).classList.add('dots__dot--active');
};

const switchSlide = function(slideNum){
  slides.forEach(function(slide, i){
    slide.style.transform = `translateX(${100 * (i-slideNum)}%)`;
    //console.log('done')
  })
}

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const nextSlide = function (){
  if (currSlide === maxLength - 1) currSlide = 0 ;
  else currSlide++ ;
  switchSlide(currSlide);
  activeDot(currSlide);
}

const prevSlide = function (){
  if (currSlide === 0) currSlide = maxLength - 1 ;
  else currSlide-- ;
  switchSlide(currSlide);
  activeDot(currSlide);
  
}

const init = function () {
  switchSlide(0);
  createDots();
  activeDot(0);
};
init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  //console.log(e.key)
  if(e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide(); // short-Circuiting
});

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    //console.log('lll')
    const slideNumber = +e.target.dataset.slide;
    switchSlide(currSlide = slideNumber)
     // to avoid weird beahaviour on using both btn and dots to switch slide therfore updating value of currslide too and avoiding it to get resetting to Zero againa and again
    activeDot(slideNumber);
    }
})


