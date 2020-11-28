let currentPage = 1;


function drawLevelSelect() {
  addRectButton(0.975, 0.975, 0.05, 0.05, `#60C`, `Back`, 0.015, () => { // Back button
    drawMainMenu();
  }, false);
  
  const levels = getLevels();
  let totalPages = Math.ceil(levels.length / 5);

  console.log(`Page: ${currentPage}`);
  console.log(`Total Pages: ${totalPages}`);
  
  addRectButton(0.5, 0.1, 0.5, 0.15, `#60C`, levels[5*currentPage-5], 0.05, () => {
    console.log(levels[5*currentPage-5]);
  });

  if (levels[5*currentPage-4]) {
    addRectButton(0.5, 0.3, 0.5, 0.15, `#60C`, levels[5*currentPage-4], 0.05, () => {
      console.log(levels[5*currentPage-4]);
    });
  }
  
  if (levels[5*currentPage-3]) {
    addRectButton(0.5, 0.5, 0.5, 0.15, `#60C`, levels[5*currentPage-3], 0.05, () => {
      console.log(levels[5*currentPage-3]);
    });
  }
    
  if (levels[5*currentPage-2]) {
    addRectButton(0.5, 0.7, 0.5, 0.15, `#60C`, levels[5*currentPage-2], 0.05, () => {
      console.log(levels[5*currentPage-2]);
    });
  }

  if (levels[5*currentPage-1]) {
    addRectButton(0.5, 0.9, 0.5, 0.15, `#60C`, levels[5*currentPage-1], 0.05, () => {
      console.log(levels[5*currentPage-1]);
    });
  }

  addRectButton(0.1, 0.1, 0.2, 0.1, `#60C`, `Previous Page`, 0.02, () => {
    if (currentPage > 1){
      currentPage--;
    } else if (currentPage === 1) {
      currentPage = totalPages;
    }
    clearButtons();
    drawLevelSelect();
    //Pages up
  }, false);

  addRectButton(0.1, 0.3, 0.2, 0.1, `#60C`, `${currentPage}/${totalPages}`, 0.025, () => {
    clearButtons();
    drawLevelSelect();
    //Nothing
  }, false);

  addRectButton(0.1, 0.5, 0.2, 0.1, `#60C`, `Next Page`, 0.02, () => {
    if (currentPage < totalPages){
      currentPage++;
    } else if (currentPage === totalPages) {
      currentPage = 1;
    }
    clearButtons();
    drawLevelSelect();
    //Pages down
  }, false);

  drawButtons();
}