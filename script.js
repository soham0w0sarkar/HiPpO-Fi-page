'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollto = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector('.nav');
const head = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const targetimg = document.querySelectorAll('img[data-src]');
const slider = document.querySelectorAll(".slide");
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotscontainer = document.querySelector(".dots");

const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
///////////////////////////////////////
//Faded Effect On Nav

const eventhandler = function(e){
    const target = e.target;
    const siblings = target.closest('.nav').querySelectorAll('.nav__link');
    const logo = target.closest('.nav').querySelector('img')
    siblings.forEach(el => {
        if(el !== target)el.style.opacity=this; 
    });
    logo.style.opacity=this;
};

nav.addEventListener('mouseover',eventhandler.bind(0.5));
nav.addEventListener('mouseout',eventhandler.bind(1));

//Page Navigation

document.querySelector('.nav__links').addEventListener('click',(e)=>{
    e.preventDefault();

    if(!e.target.classList.contains('nav__link'))return;

    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
})

scrollto.addEventListener('click',()=>{
        const scrollpo = section1.getBoundingClientRect();
        section1.scrollIntoView({behavior:"smooth"});
});

///////////////////////////////////////
///////////////////////////////////////
//Tabbular component

document.querySelector('.operations__tab-container').addEventListener('click',(e)=>{
    const clicked = e.target.closest(".operations__tab");

    if(!clicked)return;

    document.querySelector('.operations__tab--active').classList.remove('operations__tab--active');
    document.querySelector('.operations__content--active').classList.remove('operations__content--active');

    clicked.classList.add('operations__tab--active');
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

///////////////////////////////////////
///////////////////////////////////////
//Making the head sticky


const headscallback = (entries)=>{
    const [entry] = entries;
    if(!entry.isIntersecting)nav.classList.add('sticky');
    else  nav.classList.remove('sticky');
}

const headobserver = new IntersectionObserver(headscallback,{
    root:null,
    treshold:0,
    rootMargin:`-${nav.getBoundingClientRect().height}px`
});

headobserver.observe(head);

///////////////////////////////////////
///////////////////////////////////////
//Latent arrival of sections;

const sectioncallback= (entries,observer)=>{
    const [entry] = entries;
    
    if(!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
};

const sectionobserver = new IntersectionObserver(sectioncallback,{
    root:null,
    treshold: 0.15,
    rootMargin: '-200px'
});
sections.forEach((section)=>{
    sectionobserver.observe(section);

    section.classList.add('section--hidden');
});

///////////////////////////////////////
///////////////////////////////////////
//lazy loading images

const imageload = (entries,observer)=>{
    const [entry] = entries;

    if(!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    
    entry.target.addEventListener('load',()=>{
        entry.target.classList.remove('lazy-img');
        observer.unobserve(entry.target);
    });
};

const imageobserver = new IntersectionObserver(imageload,{
    root:null,
    treshold:0,
    rootMargin:'200px'
});

targetimg.forEach((img)=>{
    imageobserver.observe(img);
});

/////////////////////////////////
///////////////////////////////
//Slider

const sliderop = ()=>{    
    const createdots = ()=>{
        slider.forEach((_,i)=>{
            dotscontainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`)
        });
    };

    const makedotactive = (slide)=>{
        const dots = document.querySelectorAll(".dots__dot");
        dots.forEach(dot=>dot.classList.remove("dots__dot--active"));

        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
        console.log(dots);
    };

    const gotoslide = (slide)=>{
        slider.forEach((s,index)=>{
            s.style.transform= `translateX(${100 * (index-slide)}%)`;
        });
        makedotactive(slide);
    };

    createdots();
    gotoslide(0);



    let currslide=0;

    const slidehandler = (e)=>{

        if(e.target.dataset.direc === "right" || e.key==='ArrowRight'){
            if(currslide !== slider.length-1)currslide++;
            else currslide = 0;
        
        }else if(e.target.dataset.direc === "left" || e.key==='ArrowLeft'){
            if(currslide === 0)currslide = slider.length-1;
            else currslide--;
        }
        gotoslide(currslide);
    };

    btnRight.addEventListener('click',slidehandler);
    btnLeft.addEventListener('click',slidehandler);
    document.addEventListener('keydown',slidehandler);

    dotscontainer.addEventListener('click',e=>{
        if(!e.target.classList.contains("dots__dot"))return;

        const {slide} = e.target.dataset;
        gotoslide(slide);
    });
};

sliderop();