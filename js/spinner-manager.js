let spinners = [];
let spinnerID = 0;

function addSpinner() {
  spinners.unshift({id: spinnerID});
  return spinnerID++;
}

function clearSpinners() { // Removes all Spinners
  hitCircles = [];
}

function removeSpinner(spinnerID) {
  for (let i = 0; i < hitCircles.length; i++) {
    if (hitCircles[i].id === spinnerID) {
      hitCircles.splice(i, 1);
      break;
    }
  }
}