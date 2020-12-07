let endVolume = 1;
let timeEnteredEndScreen = 0;
let songFadingOut = false;

function drawEndScreen() {
  endVolume = 1;
  songFadingOut = true;
  timeEnteredEndScreen = totalTimePassed;
  currentGameMode = `EndScreen`;
  clearButtons();
  
  addRectButton(0.9, 0.975, 0.2, 0.05, `#60C`, `Back to Level Select`, 0.015, () => { // Back button
    song.pause();
    drawLevelSelect();
    songFadingOut = false;
    song.volume = songVolumeSlider.value / 100;
  }, false);

  addRectButton(0.5, 0.5, 0.5, 0.15, `#60C`, `Play Again`, 0.025, () => {
    song.pause();
    songFadingOut = false;
    song.volume = songVolumeSlider.value / 100;
    startGameOsu(lastLevel);
  }, false);
}

function fadeOutSong() {
  if (songFadingOut) {
    endVolume = (3000 - (totalTimePassed - timeEnteredEndScreen)) / 3000;
    if (endVolume > 0.02) {
      song.volume = songVolumeSlider.value * endVolume / 100 ;
    } else {
      song.volume = 0;
      songFadingOut = false;
      song.pause();
    }
  }
}