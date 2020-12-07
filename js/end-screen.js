

function drawEndScreen() {
  currentGameMode = `EndScreen`;
  clearButtons();
  
  addRectButton(0.9, 0.975, 0.2, 0.05, `#60C`, `Back to Level Select`, 0.015, () => { // Back button
    drawLevelSelect();
  }, false);

  addRectButton(0.5, 0.5, 0.5, 0.15, `#60C`, `Play Again`, 0.025, () => {
    startGameOsu(lastLevel);
  }, false);
}