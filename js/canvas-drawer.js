const canvas = document.getElementById(`game`);

const context = canvas.getContext(`2d`);

let rect = canvas.getBoundingClientRect();

buttonPaths = []; // Something like this shouldn't be done in production - this is a "hack" (the use of this variable)

function drawButtons() { // Draws all buttons in array from button manager
  clear();

  buttonPaths = [];
  
  for (let i = 0; i < buttons.length; i++) {
    const path = new Path2D();

    if (buttons[i].type === `circle`) {
      const radius = buttons[i].radius * canvas.width;
      path.arc((canvas.width * buttons[i].x), (canvas.height * buttons[i].y), radius, 0, 2 * Math.PI);

      context.fillStyle = buttons[i].color;
      context.fill(path);

      context.strokeStyle = `#FFF`;
      context.lineWidth = radius * 0.05;
      context.stroke(path);
    } else if (buttons[i].type === `rectangle`) {
      const width = (buttons[i].width * canvas.width)
      const height = (buttons[i].height * canvas.height);
      path.rect((canvas.width * buttons[i].x) - width / 2, (canvas.height * buttons[i].y) - height / 2, width, height);
      
      context.fillStyle = buttons[i].color;
      context.fill(path);
    } else {
      console.error(`Not a supported shape, 5head.`);
    }

    buttonPaths.push(path);

    const textSize = buttons[i].textSize * canvas.width;

    context.fillStyle = `#FFF`;
    context.font = `${textSize}px arial`;
    context.textAlign = `center`;
    context.fillText(buttons[i].text, (canvas.width * buttons[i].x), (canvas.height * buttons[i].y) + (textSize * 0.75 / 2));
  }
}

function clear() { // Clears canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function resize() {
  let width = document.documentElement.clientHeight * 1.6;
  const maxWidth = document.documentElement.clientWidth * 0.96;
  let height = document.documentElement.clientHeight * 0.9;
  const maxHeight = document.documentElement.clientWidth * 0.54;

  if (width > maxWidth) {
    width = maxWidth;
  }

  if (height > maxHeight) {
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  rect = canvas.getBoundingClientRect();

  drawButtons();
}

window.addEventListener(`resize`, (resizeEvent) => {
  resize();
});

canvas.addEventListener(`click`, (clickEvent) => {
  let clickedButton = null;
  for (let i = buttonPaths.length - 1; i > -1; i--) {
    if (context.isPointInPath(buttonPaths[i], clickEvent.x - rect.left, clickEvent.y - rect.top)) {
      clickedButton = i;
      break;
    }
  }

  if (clickedButton !== null) {
    if (buttons[clickedButton].remove) {
      buttonPaths.splice(clickedButton, 1);
    }
    triggerButton(clickedButton);
  }
});