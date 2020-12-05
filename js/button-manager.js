let buttons = [];
let buttonID = 0;

const hit = document.getElementById(`hit-sound`);

function addCircleButton(locX, locY, radius, color, text, textSize, callback, remove = true) { // Adds circle button to array to be drawn
  buttons.unshift({id: buttonID, type: `circle`, x: locX, y: locY, radius: radius, color: color, text: text, textSize: textSize, callback: callback, remove: remove});
  return buttonID++;
}

function addRectButton(locX, locY, width, height, color, text, textSize, callback, remove = true) { // Adds rectangle button to array to be drawn
  buttons.unshift({id: buttonID, type: `rectangle`, x: locX, y: locY, width: width, height: height, color: color, text: text, textSize: textSize, callback: callback, remove: remove});
  return buttonID++;
}

function clearButtons() { // Removes all buttons
  buttons = [];
  buttonID = 0;
}

function removeButton(buttonID) {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].id === buttonID) {
      buttons.splice(i, 1);
      break;
    }
  }
}

function triggerButton(clickedButton) {
  hit.play();
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].id === clickedButton) {
      buttons[i].callback();
      if (buttons[i] && buttons[i].remove) {
        buttons.splice(i, 1);
      }
      break;
    }
  }
}