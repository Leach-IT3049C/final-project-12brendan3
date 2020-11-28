zip.workerScriptsPath = `js/lib/`;

readMaps();

resize();

drawMainMenu();

function drawMainMenu() {
  clearButtons();

  addCircleButton(0.5, 0.5, 0.2, `#60C`, `Click To Play`, 0.06, () => {
    drawLevelSelect();
  });
  
  drawButtons();
}
