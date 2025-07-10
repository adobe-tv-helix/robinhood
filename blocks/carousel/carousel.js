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

console.log('end OG carousel decorate ...');
}