zip.workerScriptsPath = `js/lib/`;

const song = document.getElementById(`song`);
const songSource = document.getElementById(`songSource`);

const songVolumeSlider = document.getElementById(`soundRange`);

song.volume = songVolumeSlider.value / 100;

songVolumeSlider.oninput = () => {
  song.volume = songVolumeSlider.value / 100;
} 

readLevels();

resize();

drawMainMenu();

function drawMainMenu() {
  clearButtons();

  addCircleButton(0.5, 0.5, 0.2, `#60C`, `Click To Play`, 0.06, () => {
    drawLevelSelect();
  }, false);
  
  drawButtons();
}

function dragHandler(drag) {
  drag.preventDefault();
}

function dropHandler(drop) {
  drop.preventDefault();
  if (drop.dataTransfer.items) {
    for (var i = 0; i < drop.dataTransfer.items.length; i++) {
      if (drop.dataTransfer.items[i].kind === 'file') {
        const file = drop.dataTransfer.items[i].getAsFile();
        readLevelFile(file);
      }
    }
  } else {
    for (var i = 0; i < drop.dataTransfer.files.length; i++) {
      readLevelFile(drop.dataTransfer.files[i]);
    }
  }
}