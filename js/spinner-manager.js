let spinners = [];
let spinnerID = 0;

function addSpinner() {
  spinners.unshift({id: spinnerID});
  return spinnerID++;
}

function clearSpinners() { // Removes all Spinners
  spinners = [];
}

function removeSpinner(spinnerID) {
  for (let i = 0; i < spinners.length; i++) {
    if (spinners[i].id === spinnerID) {
      spinners.splice(i, 1);
      break;
    }
  }
}