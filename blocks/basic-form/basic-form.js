/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // decorate footer DOM
  //block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('some-custom-here');

  block.append(footer);
  console.log('here');
}