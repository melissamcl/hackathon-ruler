const tab = async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

document.addEventListener('DOMContentLoaded', () => {
  // main()

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: main
  });
});

function main() {
  const body = document.querySelector('body');

  for (let left = 0; left < window.innerWidth + 50; left += 50) {
    for (let top = 0; top < window.innerHeight + 50; top += 50) {
      const block = document.createElement('div')
      block.style.top = `${top}px`;
      block.style.left = `${left}px`;
      block.setAttribute('class', 'grid');
      body.appendChild(block);
    }
  }


  let rectTop;
  let rectLeft;

  const mouseMove = (e) => {
    const newLeft = e.pageX;
    const newTop = e.pageY;
    // console.log(rectTop, rectLeft, newLeft, newTop)
    const rect = document.getElementById('rect-drawing');
    let width = Math.abs(newLeft - rectLeft);
    let height = Math.abs(newTop - rectTop);
    rect.style.width = `${width}px`;
    rect.style.height = `${height}px`;

    let currentTop = rectTop;
    let currentLeft = rectLeft;

    if (newLeft < rectLeft) {
      currentLeft = newLeft;
    }
    if (newTop < rectTop) {
      currentTop = newTop;
    }

    rect.style.left = `${currentLeft}px`;
    rect.style.top = `${currentTop}px`;

    // calculate widthPosition -> where on the page the width displays
    const oldLabels = document.querySelectorAll('.labels');
    const oldCornerLabels = document.querySelectorAll('.corner-labels-container')
    // console.log(oldLabels);
    if (oldLabels) {
      for (let i = 0; i < oldLabels.length; i++) {
        body.removeChild(oldLabels[i]);
      }
      for (let j = 0; j < oldCornerLabels.length; j++) {
        body.removeChild(oldCornerLabels[j]);
      }
    }

    const widthLabel = document.createElement('div');
    widthLabel.setAttribute('class', 'labels');
    widthLabel.setAttribute('id', 'width-label');
    // widthLabel.innerText = `${width}px`;
    widthLabel.innerHTML = `<span class="spacer-h">&nbsp;</span><span class="label-text">${width}px</span><span class="spacer-h">&nbsp;</span>`;
    widthLabel.style.width = `${width}px`;
    const widthPositionLeft = currentLeft
    const widthPositionTop = currentTop + height + 10
    widthLabel.style.left = `${widthPositionLeft}px`;
    widthLabel.style.top = `${widthPositionTop}px`
    body.appendChild(widthLabel);

    const heightLabel = document.createElement('div');
    heightLabel.setAttribute('class', 'labels');
    heightLabel.setAttribute('id', 'height-label');
    // heightLabel.innerText = `${height}px`;
    heightLabel.innerHTML = `<span class="spacer-v">&nbsp;</span><span class="label-text">${height}px</span><span class="spacer-v">&nbsp;</span>`;
    heightLabel.style.height = `${height}px`
    const heightPositionTop = currentTop;
    const heightPositionLeft = currentLeft + width + 10;
    heightLabel.style.top = `${heightPositionTop}px`;
    heightLabel.style.left = `${heightPositionLeft}px`;
    body.appendChild(heightLabel);

    if (height > 85 && width > 115) {
      //left side
      const leftSideLabels = document.createElement('div');
      leftSideLabels.setAttribute('class', 'corner-labels-container');
      leftSideLabels.setAttribute('id', 'left-labels-container');

      const topLeftLabel = document.createElement('div');
      topLeftLabel.setAttribute('class', 'corner-labels');
      topLeftLabel.setAttribute('id', 'top-left-label');
      topLeftLabel.innerHTML = `x: ${currentLeft}px<br>y: ${currentTop}px`;

      const bottomLeftLabel = document.createElement('div');
      bottomLeftLabel.setAttribute('class', 'corner-labels');
      bottomLeftLabel.setAttribute('id', 'bottom-left-label');
      bottomLeftLabel.innerHTML = `x: ${currentLeft}px<br>y: ${currentTop + height}px`;

      leftSideLabels.style.width = `${width}px`;
      leftSideLabels.style.height = `${height}px`;
      leftSideLabels.style.top = `${currentTop}px`;
      leftSideLabels.style.left = `${currentLeft}px`;

      body.appendChild(leftSideLabels);
      leftSideLabels.append(topLeftLabel);
      leftSideLabels.append(bottomLeftLabel);

      //right side
      const rightSideLabels = document.createElement('div');
      rightSideLabels.setAttribute('class', 'corner-labels-container');
      rightSideLabels.setAttribute('id', 'right-labels-container');

      const topRightLabel = document.createElement('div');
      topRightLabel.setAttribute('class', 'corner-labels');
      topRightLabel.setAttribute('id', 'top-right-label');
      topRightLabel.innerHTML = `x: ${currentLeft + width}px<br>y: ${currentTop}px`;

      const bottomRightLabel = document.createElement('div');
      bottomRightLabel.setAttribute('class', 'corner-labels');
      bottomRightLabel.setAttribute('id', 'bottom-right-label');
      bottomRightLabel.innerHTML = `x: ${currentLeft + width}px<br> y: ${currentTop + height}px`;

      rightSideLabels.style.width = `${width}px`;
      rightSideLabels.style.height = `${height}px`;
      rightSideLabels.style.top = `${currentTop}px`;
      rightSideLabels.style.left = `${currentLeft}px`;

      body.appendChild(rightSideLabels);
      rightSideLabels.append(topRightLabel);
      rightSideLabels.append(bottomRightLabel);
    }
  }



  // if new mouse left < original left, 
  // calc width as absolute value
  // recalc left as left - width

  window.addEventListener('mousedown', (e) => {
    const toRemove = document.getElementById('rect-drawing');
    if (toRemove) {
      body.removeChild(toRemove);
      const oldLabels = document.querySelectorAll('.labels');
      const oldCornerLabels = document.querySelectorAll('.corner-labels-container')
      // console.log(oldLabels);
      for (let i = 0; i < oldLabels.length; i++) {
        body.removeChild(oldLabels[i]);
      }
      for (let j = 0; j < oldCornerLabels.length; j++) {
        body.removeChild(oldCornerLabels[j]);
      }
    }


    const rect = document.createElement('div');
    rect.setAttribute('id', 'rect-drawing');
    rectTop = e.pageY;
    rectLeft = e.pageX;
    rect.style.top = `${rectTop} px`;
    rect.style.left = `${rectLeft} px`;
    body.appendChild(rect);


    console.log('mousedown', rectLeft, rectTop)

    window.addEventListener('mousemove', mouseMove)
  })

  window.addEventListener('mouseup', (e) => {
    removeEventListener('mousemove', mouseMove);
    const rect = document.getElementById('rect-drawing');
    if (!rect.style.width && !rect.style.height) {
      body.removeChild(rect);
    }
  })

}
  // });
// });