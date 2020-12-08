
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

function startMap(hitObjects) {
  song.play();
  let offset = 0;
  for (let i = 0; i < hitObjects.length; i++) {
    setTimeout(() => { // This is a heavy way of loading everything in, we need a better solution for sure.
      objectsLeft--;
      if (hitObjects[i].type === `circle` || hitObjects[i].type === `slider`) {
          let circleRemoveTimeout;

          const timeAdded = totalTimePassed;

          if (hitObjects[i].cycle > 0) {
            offset = i;
            currentCircleColor += hitObjects[i].cycle;
            while (currentCircleColor > 4) {
              currentCircleColor = currentCircleColor - circleColors.length;
            }
          }

          const newButtonID = addCircleButton(hitObjects[i].x, hitObjects[i].y, 0.045, circleColors[currentCircleColor], i + 1 - offset, 0.04, () => {
            clearTimeout(circleRemoveTimeout);
            removeHitCircle(newButtonID);
            const timeOff = totalTimePassed - timeAdded - timing[0].beatLength * 1.5;
            circleHit(timeOff);
            checkEnd(1);
          });

          addHitCircle(newButtonID, hitObjects[i].x, hitObjects[i].y, 0.045, circleColors[currentCircleColor], timing[0].beatLength * 1.5);

          circleRemoveTimeout = setTimeout(() => {
            removeButton(newButtonID);
            circleMiss();
            checkEnd(0);
          }, timing[0].beatLength * 2);
       } else if (hitObjects[i].type === `spinner`) {
        const newSpinnerID = addSpinner();

        setTimeout(() => {
          removeSpinner(newSpinnerID);
          checkEnd(0);
        }, hitObjects[i].spinnerTime - hitObjects[i].time);
      }
    }, hitObjects[i].time - timing[0].beatLength * 1.5);
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
    const splitObjectData = hitObjects[i].split(`,`);
    let hitObjectType = null;
    let cycle = 0;
    let spinnerTime = 0;
    let sliderCurveType = ``;
    let sliderCurvePoints = [];

    const binaryData = (splitObjectData[3] >>> 0).toString(2).padStart(8, 0);

    if (binaryData.charAt(binaryData.length - 1) == 1) {
      hitObjectType = `circle`;
    } else if (binaryData.charAt(binaryData.length - 2) == 1) {
      hitObjectType = `slider`;
    } else if (binaryData.charAt(binaryData.length - 4) == 1) {
      hitObjectType = `spinner`;
    } else if (binaryData.charAt(binaryData.length - 8) == 1) {
      hitObjectType = `hold`; // How??
    }

    if (hitObjectType === `slider`) {
      let splitSliderData = splitObjectData[5].split(`|`);
      sliderCurveType = splitSliderData[0];
      splitSliderData.splice(0, 1);
      sliderCurvePoints = splitSliderData;
    }

    if (hitObjectType === `spinner`) {
      spinnerTime = splitObjectData[5];
    }

    if (binaryData.charAt(binaryData.length - 3) == 1) {
      cycle = 1;
      if (binaryData.charAt(binaryData.length - 5) == 1) {
        cycle += 1;
      }
  
      if (binaryData.charAt(binaryData.length - 6) == 1) {
        cycle += 2;
      }
  
      if (binaryData.charAt(binaryData.length - 7) == 1) {
        cycle += 4;
      }
    }

    if (hitObjectType !== null) {
      if (splitObjectData[0] === lastX && splitObjectData[1] === lastY && (hitObjectType == `circle` || hitObjectType == `slider`)) {
        totalOffset++;
        objs.push({
          x: splitObjectData[0]/512 * 0.6 + 0.2 + 0.01 * totalOffset,
          y: splitObjectData[1]/384 * 0.8 + 0.1 + 0.01 * totalOffset,
          time: splitObjectData[2],
          type: hitObjectType,
          cycle,
          spinnerTime,
          sliderCurveType,
          sliderCurvePoints
        });
      } else {
        totalOffset = 0;
        objs.push({
          x: splitObjectData[0]/512 * 0.6 + 0.2,
          y: splitObjectData[1]/384 * 0.8 + 0.1,
          time: splitObjectData[2],
          type: hitObjectType,
          cycle,
          spinnerTime,
          sliderCurveType,
          sliderCurvePoints
        });
      }

      lastX = splitObjectData[0];
      lastY = splitObjectData[1];
      
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