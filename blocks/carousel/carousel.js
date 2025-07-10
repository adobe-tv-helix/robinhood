import { fetchPlaceholders } from '../../scripts/placeholders.js';

let carouselId = 0;
export default async function decorate(block) {
    console.log('in beginning of OG carousel decorate ....');
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;
console.log('before placeholders in OG carousel decorate ....');
  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');
console.log('after first placeholder in OG carousel decorate...');
  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);
console.log('before second placeholder in OG carousel decorate ...');
  let slideIndicators;
//   if (!isSingleSlide) {
//     const slideIndicatorsNav = document.createElement('nav');
//     slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
//     slideIndicators = document.createElement('ol');
//     slideIndicators.classList.add('carousel-slide-indicators');
//     slideIndicatorsNav.append(slideIndicators);
//     block.append(slideIndicatorsNav);
// console.log('before third placeholder in carousel decorate ...');
//     const slideNavButtons = document.createElement('div');
//     slideNavButtons.classList.add('carousel-navigation-buttons');
//     slideNavButtons.innerHTML = `
//       <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
//       <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
//     `;

//     container.append(slideNavButtons);
//   }

//   rows.forEach((row, idx) => {
//     const slide = createSlide(row, idx, carouselId);
//     slidesWrapper.append(slide);

//     if (slideIndicators) {
//       const indicator = document.createElement('li');
//       indicator.classList.add('carousel-slide-indicator');
//       indicator.dataset.targetSlide = idx;
//       indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
//       slideIndicators.append(indicator);
//     }
//     row.remove();
//   });

//   container.append(slidesWrapper);
//   block.prepend(container);

  if (!isSingleSlide) {
    // bindEvents(block);
  }
console.log('end OG carousel decorate ...');
}