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
//       const paraParentDivTag = col.querySelector('p');
//       console.log('para parent = ' + paraParentDivTag);
//       if (paraParentDivTag) {
//         const paraDivTag = paraParentDivTag.closest('div');
//         const newParentTag = document.createElement('div');
//         const preTags = col.querySelectorAll('pre');
//         if(newParentTag) {
//           newParentTag.classList.add('i-dont-know');
//           preTags.forEach(function( p, index) {
//             newParentTag.append(p);
//           });
//         }
// paraDivTag.append(newParentTag);  
//       }
    });
      // only move the <pre>fields</pre>, symbolizing the "form", in a column (footer) into each own div (to then style)
      // not the way to do this in production!
      const paraColDiv = row.querySelector('.columns-para-col');
      if (paraColDiv) {
        const preTags = paraColDiv.querySelectorAll('pre');
        if (preTags && preTags.length > 1) {
          const newParentDivTag = document.createElement('div');
          if (newParentDivTag) {
            newParentDivTag.classList.add('columns-basic-form');
            newParentDivTag.classList.add('form-content');
            newParentDivTag.classList.add('row');
            preTags.forEach(function(singlePreTag, index) {
              if (index !== preTags.length - 1) {
                singlePreTag.classList.add('col-md-6');
              } else {
                singlePreTag.classList.add('col-md-12');
              }
              singlePreTag.classList.add('input-col');
              newParentDivTag.append(singlePreTag);
            });
          }

          // now add another div to "simulate" the submit button
          // urgh
          const newSubmitDivTag = document.createElement('div');
          if (newSubmitDivTag) {
            newSubmitDivTag.classList.add('form-submit');
            const newButtonTag = document.createElement('button');
            if (newButtonTag) {
              newButtonTag.classList.add('arrows');
              newButtonTag.classList.add('small-arrow');
              newButtonTag.classList.add('blue');
              newButtonTag.classList.add('left');
              newButtonTag.classList.add('with-hover');
              const newSpanTag = document.createElement('span');
              if (newSpanTag) {
                newSpanTag.classList.add('icon-form');
              }
              newButtonTag.append(newSpanTag);
            }
            newSubmitDivTag.append(newButtonTag);
          }
          newParentDivTag.append(newSubmitDivTag);
          paraColDiv.append(newParentDivTag);
        }
      }
  });
}
