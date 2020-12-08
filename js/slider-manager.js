let sliders = [];
let sliderID = 0;

function addSlider(locX, locY, radius, curveType, curvePoints, color) {
  sliders.unshift({id: sliderID, x: locX, y: locY, radius, curveType, curvePoints, color: color});
  return sliderID++;
}

function clearSliders() { // Removes all Sliders
  sliders = [];
  sliderID = 0;
}

function removeSlider(remSliderID) {
  for (let i = 0; i < sliders.length; i++) {
    if (sliders[i].id === remSliderID) {
      sliders.splice(i, 1);
      break;
    }
  }
}