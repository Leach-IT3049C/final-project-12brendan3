
let hitObjects = [];
let difficulty = {};
let timing = [];
let objectsLeft = 0;
let circleColors = [`#1A74F2`, `#A420F0`, `#25B9EF`, `#17D174`, `#E22D7C`];
let currentCircleColor = 0;
let score = 0;
let combo = 0;
let maxCombo = 0;
let lastLevel = null;


function startGameOsu(level) {
  clearButtons();
  hitObjects = [];
  difficulty = {};
  timing = [];
  objectsLeft = 0;
  score = 0;
  combo = 0;
  maxCombo = 0;
  lastLevel = level;
  currentCircleColor = 0;
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
  console.log(circleColors[currentCircleColor]);
  for (let i = 0; i < circles.length; i++) {
    if (circles[i].type === 0) {
      setTimeout(() => {
        objectsLeft--;
        let circleRemoveTimeout;

        const timeAdded = totalTimePassed;

        if (circles[i].cycle > 0) {
          currentCircleColor += circles[i].cycle;
          if (currentCircleColor > 4) {
            currentCircleColor = currentCircleColor - circleColors.length;
          }
          console.log(circleColors[currentCircleColor]);
        }

        const buttonID = addCircleButton(circles[i].x, circles[i].y, 0.045, circleColors[currentCircleColor], i + 1 - offset, 0.04, () => {
          clearTimeout(circleRemoveTimeout);
          removeHitCircle(buttonID);
          const timeOff = totalTimePassed - timeAdded - timing[0].beatLength;
          circleHit(timeOff);
          checkEnd(1);
        });

        addHitCircle(buttonID, circles[i].x, circles[i].y, 0.045, circleColors[currentCircleColor], timing[0].beatLength);

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
  if(combo > maxCombo){
    maxCombo = combo;
  }
  combo = 0;
}

function parseHitObjects(hitObjects) {
  let objs = [];
  let lastX = -1;
  let lastY = -1;
  let totalOffset = 0;
  for (let i = 0; i < hitObjects.length; i++) {
    let temp = hitObjects[i].split(`,`);
    let hitObjectType = null;
    let cycle = 0;

    if (temp[3] == 0) {
      hitObjectType = 0;
    } else if (temp[3] == 1 && temp.length < 7) {
      hitObjectType = 0;
    } else if (temp[3] == 2 || (temp[3] > 3 && temp[3] < 7)) {
      hitObjectType = 0;
      if (temp[3] == 2) {
        cycle = 1;
      } else if (temp[3] == 4) {
        cycle = 2;
      } else if (temp[3] == 5) {
        cycle = 3;
      } else {
        cycle = 4;
      }
    } else if (temp[3] == 3) {
      hitObjectType = 3;
    }

    if (hitObjectType !== null) {
      if (temp[0] === lastX && temp[1] === lastY) {
        totalOffset++;
        objs.push({
          x: temp[0]/512 * 0.6 + 0.2 + 0.01 * totalOffset,
          y: temp[1]/384 * 0.8 + 0.1 + 0.01 * totalOffset,
          time: temp[2],
          type: hitObjectType,
          cycle: cycle
        });
      } else {
        totalOffset = 0;
        objs.push({
          x: temp[0]/512 * 0.6 + 0.2,
          y: temp[1]/384 * 0.8 + 0.1,
          time: temp[2],
          type: hitObjectType,
          cycle: cycle
        });
      }

      lastX = temp[0];
      lastY = temp[1];
      
      objectsLeft++;
    }
  }
  return objs;
}

function checkEnd(buttonsLeft) {
  if (objectsLeft <= 0 && buttons.length <= buttonsLeft) {
    drawEndScreen();
  }
}