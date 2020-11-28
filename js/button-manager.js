let buttons = [];

const hit = document.getElementById(`hit-sound`);

function getButtons() {
  return buttons;
}

function addCircleButton(locX, locY, radius, color, text, textSize, callback, remove = true) { // Adds circle button to array to be drawn
  buttons.push({type: `circle`, x: locX, y: locY, radius: radius, color: color, text: text, textSize: textSize, callback: callback, remove: remove});
}

function addRectButton(locX, locY, width, height, color, text, textSize, callback, remove = true) { // Adds rectangle button to array to be drawn
  buttons.push({type: `rectangle`, x: locX, y: locY, width: width, height: height, color: color, text: text, textSize: textSize, callback: callback, remove: remove});
}

function clearButtons() { // Removes all buttons
  buttons = [];
}

function triggerButton(clickedButton) {
  hit.play();
  if (buttons[clickedButton].remove) {
    buttons[clickedButton].callback();
    buttons.splice(clickedButton, 1);
  } else {
    buttons[clickedButton].callback();
  }
  drawButtons();
}