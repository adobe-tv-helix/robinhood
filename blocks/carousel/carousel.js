import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { moveInstrumentation, isAuthorEnvironment } from '../../scripts/scripts.js';

let suppressObserver = false; // custom added for robinhood
function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);

  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  // custom added for robinhood
  // suppress intersectionobserver temporarily
  suppressObserver = true;

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });

  // custom added for robinhood
  // Wait until scroll finishes; time may vary! 500ms is usually good for smooth scroll
  setTimeout(() => {
    updateActiveSlide(activeSlide);
    suppressObserver = false;
  }, 500);
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
//   if (!slideIndicators) return;  // commented out because slide indicators (under carousel) not displayed for robinhood

  if (slideIndicators) {
    slideIndicators.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
        const slideIndicator = e.currentTarget.parentElement;
        showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
        });
    });
  }

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  // commented out original
//   const slideObserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) updateActiveSlide(entry.target);
//     });
//   }, { threshold: 0.5 });
  // custom added for robinhood
  // IntersectionObserver now respects the suppressObserver flag
    const slideObserver = new IntersectionObserver((entries) => {
        if (suppressObserver) return; // <-- Ignore during button navigation

        // Only look for slides that are at least 50% visible
        const visibleSlides = entries.filter(entry => entry.isIntersecting);
        visibleSlides.sort((a, b) => a.target.dataset.slideIndex - b.target.dataset.slideIndex);
        if (visibleSlides.length > 0) {
          updateActiveSlide(visibleSlides[0].target);
        }
    }, { threshold: 0.5 });
    // end custom added for robinhood
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    // commented out original because slide indicators (dots under carousel) are not displayed for robinhood
    // slideIndicatorsNav.append(slideIndicators);
    // block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    // custom add for robinhood to add prev/next button at bottom instead of overlaying at edges of slide image
    slideIndicatorsNav.append(slideNavButtons);
    block.append(slideIndicatorsNav);

    // commented out original because prev/next buttons displayed where dots were and not
    // in middle of image for robinhood
    // container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);

    // custom added for robinhood
    if (isAuthorEnvironment) {
      moveInstrumentation(row, slide);
    }
    // end custom add for robinhood
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
// TODO debugging
    row.childNodes.forEach(node => {
        console.log('row = ' + row + ', inner html = ' + row.innerHTML + ', index = ' + idx + ', node = ' + node.textContent);
    });
     row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}