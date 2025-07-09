export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
      const paraTag = col.querySelector('p');
      if (paraTag) {
        const parentDivTag = paraTag.closest('div');
        if (parentDivTag) {
          parentDivTag.classList.add('columns-para-col');
        }
      }
      //
      const secondP = col.querySelectorAll('.columns-para-col > p')[1];
      if (secondP) {
        console.log('the sceond para = ' + secondP.textContent);
      }
    });
  });
}
