const canvas = document.getElementById(`game`);

const context = canvas.getContext(`2d`);

let rect = canvas.getBoundingClientRect();
let mousePos = {x: 0, y: 0};

let currentTime = 1;
let lastTime = currentTime;
let timePassed = 0;
let totalTimePassed = 0;
let currentGameMode = `MainMenu`;

window.requestAnimationFrame(updateScreen);

function updateScreen(time) {
  currentTime = time;
  timePassed = currentTime - lastTime;
  totalTimePassed += timePassed;

  drawButtons();

  if (currentGameMode !== `MainMenu`) {
    drawFPS();
  }

  if (currentGameMode === `osu!`) {
    drawHitCircles();
    drawScore();
    drawCombo();
  }

  if (currentGameMode === `EndScreen`){
    drawScore();
    drawCombo();
    fadeOutSong();
  }
  
  drawCursor();

  window.requestAnimationFrame(updateScreen);
}

function drawButtons() { // Draws all buttons in array from button manager
  clear();
  
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

    buttons[i].path = path;

    const textSize = buttons[i].textSize * canvas.width;

    context.fillStyle = `#FFF`;
    context.font = `${textSize}px arial`;
    context.textAlign = `center`;
    context.fillText(buttons[i].text, (canvas.width * buttons[i].x), (canvas.height * buttons[i].y) + (textSize * 0.75 / 2));
  }
}

function drawFPS() {
  const FPS = 1000 / (currentTime - lastTime);
  lastTime = currentTime;
  context.fillStyle = `#FFF`;
  context.font = `${0.01 * canvas.width}px arial`;
  context.textAlign = `left`;
  context.fillText(`FPS: ${FPS.toFixed(0)}`, (canvas.width * 0.005), (canvas.height * 0.02));
}

function drawScore(){
  context.fillStyle = `#FFF`;
  context.font = `${0.02 * canvas.width}px arial`;
  context.textAlign = `left`;
  context.fillText(`Score: ${score}`, (canvas.width * 0.8), (canvas.height * 0.05));
}

function drawCombo() {
  context.fillStyle = `#FFF`;
  context.font = `${0.03 * canvas.width}px arial`;
  context.textAlign = `left`;
  context.fillText(`x${combo}`, (canvas.width * 0.01), (canvas.height * 0.98));
}

function drawHitCircles() {
  for (let i = 0; i < hitCircles.length; i++) {
    hitCircles[i].usedTime ? hitCircles[i].usedTime += timePassed : hitCircles[i].usedTime = timePassed;

    if (hitCircles[i].beatLength < hitCircles[i].usedTime) {
      removeHitCircle(hitCircles[i].id);
    } else {
      const path = new Path2D();
      const radius = hitCircles[i].radius * canvas.width * (1 + 3 * (hitCircles[i].beatLength - hitCircles[i].usedTime) / hitCircles[i].beatLength);
      path.arc((canvas.width * hitCircles[i].x), (canvas.height * hitCircles[i].y), radius, 0, 2 * Math.PI);

      context.strokeStyle = hitCircles[i].color;
      context.lineWidth = radius * 0.05;
      context.stroke(path);
    }
  }
}

function drawCursor() {
  const path = new Path2D();
  path.arc(mousePos.x, mousePos.y, canvas.width * 0.01, 0, 2 * Math.PI);
  const cursorGradient = context.createRadialGradient(mousePos.x, mousePos.y, canvas.width * 0.0025, mousePos.x, mousePos.y, canvas.width * 0.01);
  cursorGradient.addColorStop(0, `#77EE44`);
  cursorGradient.addColorStop(1, `rgba(128,128,128,0)`);
  context.fillStyle = cursorGradient;
  context.fill(path);
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
}

window.addEventListener(`resize`, () => {
  resize();
});

window.addEventListener(`keydown`, handleClick, false);

canvas.addEventListener(`click`, handleClick);

canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  handleClick();
});

canvas.addEventListener(`mousemove`, (moveEvent) => {
  mousePos.x = moveEvent.clientX - rect.left;
  mousePos.y = moveEvent.clientY - rect.top;
});

function handleClick() {
  let clickedButton = null;
  for (let i = buttons.length - 1; i > -1; i--) {
    if (context.isPointInPath(buttons[i].path, mousePos.x, mousePos.y)) {
      clickedButton = buttons[i].id;
      break;
    }
  }

  if (clickedButton !== null) {
    triggerButton(clickedButton);
  }
}