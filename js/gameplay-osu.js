
let hitObjects = [];
let difficulty = {};
let timing = [];
let objectsLeft = 0;
let circleColor = `#87007A`;
let score = 0;
let combo = 0;


function startGameOsu(level) {
  clearButtons();
  hitObjects = [];
  difficulty = {};
  timing = [];
  objectsLeft = 0;
  score = 0;
  combo = 0;
  circleColor = `#87007A`;
  currentGameMode = `osu!`;
  readLevelData(level);
}

function getBase64FromBlob(blob) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.readAsDataURL(blob);
  
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}

function getSongBlob(songFile) {
  return new Promise((resolve) => {
    songFile.getData(new zip.BlobWriter(), (songBlob) => {
      resolve(songBlob);
    });
  });
}

async function readLevelData(level) {
  const songBlob = await getSongBlob(level.songFile);
  const songDataBase64 = await getBase64FromBlob(songBlob);
  songSource.src = songDataBase64;
  song.load();

  let lines = level.data.split('\r\n')

  let currentType = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === `[Difficulty]`){
      currentType = 5;
    } else if (currentType === 5 && lines[i].startsWith(`SliderMultiplier:`)) {
      difficulty.sliderMultiplier = lines[i].substr(17);
    }
    
    if (lines[i] === `[TimingPoints]`) {
      currentType = 6;
    } else if (currentType === 6 && lines[i]) {
      const timingPoint = lines[i].split(`,`);
      if (timingPoint[6] === `1`) {
        timing.push({beatLength: timingPoint[1]});
      } else {
        timing.push({beatLength: difficulty.sliderMultiplier * (-timingPoint[1]) / 100});
      }
    }

    if (lines[i] === `[HitObjects]`) {
      currentType = 7;
    } else if (currentType === 7 && lines[i]) {
      hitObjects.push(lines[i]);
    }
  }

  startMap(parseHitObjects(hitObjects));
}

function startMap(circles) {
  song.play();
  let offset = 0;
  for (let i = 0; i < circles.length; i++) {
    if (circles[i].type === 0) {
      setTimeout(() => {
        objectsLeft--;
        let circleRemoveTimeout;

        const timeAdded = totalTimePassed;

        if (circles[i].cycle) {
          cycleCircleColors();
          offset = i;
        }

        const buttonID = addCircleButton(circles[i].x, circles[i].y, 0.045, circleColor, i + 1 - offset, 0.04, () => {
          clearTimeout(circleRemoveTimeout);
          removeHitCircle(buttonID);
          const timeOff = totalTimePassed - timeAdded - timing[0].beatLength;
          circleHit(timeOff);
          checkEnd(1);
        });

        addHitCircle(buttonID, circles[i].x, circles[i].y, 0.045, circleColor, timing[0].beatLength);

        circleRemoveTimeout = setTimeout(() => {
          removeButton(buttonID);
          circleMiss();
          checkEnd(0);
        }, timing[0].beatLength * 2);
      }, circles[i].time - timing[0].beatLength);
    }
  }
}

function circleHit(timeOff) {
  combo++;
  let hitValue = 0;

  const timingBad = timing[0].beatLength * 0.625;
  const timingGood = timing[0].beatLength * 0.25;
  const absoluteTimeOff = Math.abs(timeOff);

  if (absoluteTimeOff >= timingBad) {
    hitValue = 50;
  } else if (absoluteTimeOff >= timingGood) {
    hitValue = 100;
  } else {
    hitValue = 300;
  }

  score += hitValue + (combo - 1) * hitValue;
}

function circleMiss() {
  combo = 0;
}

function parseHitObjects(hitObjects) {
  let objs = [];
  let lastX = -1;
  let lastY = -1;
  for(let i = 0; i < hitObjects.length; i++) {
    let temp = hitObjects[i].split(`,`);
    let hitObjectType = null;
    let cycle = false;

    if (temp[3] == 0) {
      hitObjectType = 0;
    } else if (temp[3] == 1 && temp.length < 7) {
      hitObjectType = 0;
    } else if ((temp[3] > 3 && temp[3] < 7) || temp[3] == 2) {
      hitObjectType = 0;
      cycle = true;
    }

    if (hitObjectType !== null) {
      objs.push({
        x: temp[0] === lastX ? temp[0]/512 * 0.6 + 0.21 : temp[0]/512 * 0.6 + 0.2,
        y: temp[1] === lastY ? temp[1]/384 * 0.8 + 0.11 : temp[1]/384 * 0.8 + 0.1,
        time: temp[2],
        type: hitObjectType,
        cycle: cycle
      });

      lastX = temp[0];
      lastY = temp[1];
      
      objectsLeft++;
    }
  }
  return objs;
}

function checkEnd(buttonsLeft) {
  if (objectsLeft <= 0 && buttons.length <= buttonsLeft) {
    console.log(`End score: ${score}`);
    drawLevelSelect();
  } 
}

function cycleCircleColors() {
  switch(circleColor) {
    case `#87007A`:
      circleColor = `#BF0000`;
      break;
    case `#BF0000`:
      circleColor = `#0077C7`;
      break;
    case `#0077C7`:
      circleColor = `#00AD0C`;
      break;
    case `#00AD0C`:
      circleColor = `#B8AE00`;
      break;
    case `#B8AE00`:
      circleColor = `#87007A`;
      break;
  }
}