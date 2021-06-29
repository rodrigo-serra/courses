/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show-menu");
    });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}



/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

linkAction = () => {
    const navMenu = document.getElementById("nav-menu");
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove("show-menu");
}

navLink.forEach(element => element.addEventListener("click", linkAction));




/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName("skills__content");
const skillsHeader = document.querySelectorAll(".skills__header");


const toggleSkills = (e) => {
    // Get the current class name of the parent node which in this case is class="skills__content skills__open"
    // or class="skills__content skills__closed"
    // The children is class="skills__header"
    let itemClass = e.currentTarget.parentNode.className;

    // Close all elements when a user clicks in an arrow
    for(let i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = "skills__content skills__close"
    }
    // Opens the desired element if the previous state was closed
    if(itemClass === 'skills__content skills__close') {
        e.currentTarget.parentNode.className = "skills__content skills__open";
    }

}

skillsHeader.forEach(element => element.addEventListener("click", toggleSkills));
  




/*==================== QUALIFICATION TABS ====================*/

const tabs = document.querySelectorAll("[data-target]");
const tabContents = document.querySelectorAll("[data-content]");

// console.log(tabs);
// console.log(tabContents);

tabs.forEach(element => {
    element.addEventListener("click", () => {
        
        // When the user clicks on the Education button the element.dataset.target returns the element with id="education"
        // The same goes for the work button
        const target = document.querySelector(element.dataset.target);
        
        // Remove qualification__active from all elements with the [data-content] data attribute
        tabContents.forEach(e => e.classList.remove("qualification__active"));

        // Add qualification__active to the target element, i.e., id="work" or id="education"
        target.classList.add("qualification__active");

        // Remove qualification__active from all elements with a [data-target] data attribute
        tabs.forEach(e => e.classList.remove("qualification__active"));

        // Add qualification__active to the desired element, i.e, data.target="#education" or data.target="#work"
        element.classList.add("qualfication__active");

    });
});



/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll(".services__modal");
const modalBtns = document.querySelectorAll(".services__button");
const modalCloses = document.querySelectorAll(".services__modal-close");


const modal = (modalClick) => {
    modalViews[modalClick].classList.add("active-modal");
}

modalBtns.forEach((element, index) => {
    element.addEventListener("click", () => modal(index));
});


modalCloses.forEach(element => {
    element.addEventListener("click", () => {
        modalViews.forEach(e => e.classList.remove("active-modal"));
    });
});




/*==================== PORTFOLIO SWIPER  ====================*/

// From swiper
// https://codesandbox.io/s/gsqbs?file=/index.html:2172-2477

// PARAMETERS
// https://swiperjs.com/swiper-api

// SPECIFY YOUR CONTAINER, IN THIS CASE ".portfolio__container"
let swiperPortfolio = new Swiper(".portfolio__container", {
    cssMode: true,
    loop: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // mousewheel: true,
    // keyboard: true,
});





/*==================== TESTIMONIAL ====================*/

// From swiper
// https://codesandbox.io/s/egigq?file=/index.html:1884-1921

let swiperTestimonial = new Swiper(".testimonial__container", {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints:{
        // when window width is >= 568px
        568:{
            slidesPerView: 2,
        }
    }
});





/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
// Select all section elements with an id attribute
const sections = document.querySelectorAll("section[id]");


// Lights up the a tag element in the navbar according to the section the user is navigating
const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute("id");

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(".nav__menu a[href*=" + sectionId + "]").classList.add("active-link");
        } else {
            document.querySelector(".nav__menu a[href*=" + sectionId + "]").classList.remove("active-link");
        }
    });
}

window.addEventListener("scroll", scrollActive);



/*==================== CHANGE BACKGROUND HEADER ====================*/ 
// Ads box-shadow to the header when the user scrolls out of the home section
const scrollHeader = () => {
     const nav = document.getElementById("header");
     // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
     const scrollY = window.pageYOffset;

     if(scrollY >= 80) {
         nav.classList.add("scroll-header");
     } else {
         nav.classList.remove("scroll-header");
     }
}

window.addEventListener("scroll", scrollHeader);


/*==================== SHOW SCROLL UP ====================*/ 
const scrollUp = () => {
    const scrollU = document.getElementById("scroll-up");
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top id
    const scrollY = window.pageYOffset;

     if(scrollY >= 560) {
         scrollU.classList.add("show-scroll");
     } else {
         scrollU.classList.remove("show-scroll");
     }
}

window.addEventListener("scroll", scrollUp);



/*==================== DARK LIGHT THEME ====================*/  
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme ="uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// console.log(selectedTheme);

// Obtain the current theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

if(selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);
    themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](iconTheme);
}

// Activate/Deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
    // Add/Remove the dark/icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    // Save the theme and the current icon that user choose
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});