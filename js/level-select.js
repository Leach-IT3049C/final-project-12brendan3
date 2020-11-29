let currentPage = 1;


function drawLevelSelect() {
  clearButtons();
  addRectButton(0.975, 0.975, 0.05, 0.05, `#60C`, `Back`, 0.015, () => { // Back button
    drawMainMenu();
  }, false);
  
  let totalPages = Math.ceil(levelList.length / 5);
  
  addRectButton(0.5, 0.1, 0.5, 0.15, `#60C`, `${levelList[5*currentPage-5].name} [${levelList[5*currentPage-5].difficulty}]`, 0.025, () => {
    startGameOsu(levelList[5*currentPage-5]);
  });

  if (levelList[5*currentPage-4]) {
    addRectButton(0.5, 0.3, 0.5, 0.15, `#60C`, `${levelList[5*currentPage-4].name} [${levelList[5*currentPage-4].difficulty}]`, 0.025, () => {
      startGameOsu(levelList[5*currentPage-4]);
    });
  }
  
  if (levelList[5*currentPage-3]) {
    addRectButton(0.5, 0.5, 0.5, 0.15, `#60C`, `${levelList[5*currentPage-3].name} [${levelList[5*currentPage-3].difficulty}]`, 0.025, () => {
      startGameOsu(levelList[5*currentPage-3]);
    });
  }
    
  if (levelList[5*currentPage-2]) {
    addRectButton(0.5, 0.7, 0.5, 0.15, `#60C`, `${levelList[5*currentPage-2].name} [${levelList[5*currentPage-2].difficulty}]`, 0.025, () => {
      startGameOsu(levelList[5*currentPage-2]);
    });
  }

  if (levelList[5*currentPage-1]) {
    addRectButton(0.5, 0.9, 0.5, 0.15, `#60C`, `${levelList[5*currentPage-1].name} [${levelList[5*currentPage-1].difficulty}]`, 0.025, () => {
      startGameOsu(levelList[5*currentPage-1]);
    });
  }

  addRectButton(0.1, 0.1, 0.2, 0.1, `#60C`, `Previous Page`, 0.02, () => {
    if (currentPage > 1){
      currentPage--;
    } else if (currentPage === 1) {
      currentPage = totalPages;
    }
    drawLevelSelect();
    // Pages up
  }, false);

  addRectButton(0.1, 0.3, 0.2, 0.1, `#60C`, `${currentPage}/${totalPages}`, 0.025, () => {
    if (currentPage > 1){
      currentPage = 1;
    } else if (currentPage === 1) {
      currentPage = totalPages;
    }
    drawLevelSelect();
    // Swaps between page 1 and last page (other pages go to 1)
  }, false);

  addRectButton(0.1, 0.5, 0.2, 0.1, `#60C`, `Next Page`, 0.02, () => {
    if (currentPage < totalPages){
      currentPage++;
    } else if (currentPage === totalPages) {
      currentPage = 1;
    }
    drawLevelSelect();
    // Pages down
  }, false);

  drawButtons();
}