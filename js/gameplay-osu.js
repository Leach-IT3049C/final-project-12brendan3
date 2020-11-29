
let hitObjects = [];
let beatLength = 0; //time in Milliseconds


function startGameOsu(level) {
  clearButtons();
  hitObjects = [];
  beatLength = 0;
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
  //level.mapdata
  //level.music

  const songBlob = await getSongBlob(level.songFile);
  const musicDataBase64 = await getBase64FromBlob(songBlob);
  songSource.src = musicDataBase64;
  song.load();

  let lines = level.data.split('\r\n')

  let currentType = 0;
  let hitObjects = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === `[HitObjects]`){
      currentType = 7;
    } else if (currentType === 7 && lines[i]) {
      hitObjects.push(lines[i]);
    }
    if (lines[i] === `[TimingPoints]`){
      currentType = 6;
    } else if (currentType === 6 && lines[i]) {
      let timingPoint = lines[i].split(`,`)
      beatLength = timingPoint[1];
    }
  }

  doDaThings(parseHitObjects(hitObjects));
}

function doDaThings(circles) {
  song.play();
  for (let i = 0; i < circles.length; i++) {
    console.log(`Waiting: ${circles[i].time-beatLength} milliseconds`);
    setTimeout(() => {
      addCircleButton(circles[i].x, circles[i].y, 0.05, `#FF2BF4`, i + 1, 0.010, () => {
        console.log(`WHEE!`);
      });
      /*
      setTimeout(() => {
        console.log(`Remove ${i+1} Circle`)//Add ID's to Circles so we can remove them
        //Remove button
        clearButtons();//Temp
        drawButtons();
      },(beatLength + 500));
      */
      drawButtons();
    }, circles[i].time - beatLength - 500);
  }
}

function parseHitObjects(hitObjects) {
  let objs = [];
  for(let i = 0; i < hitObjects.length; i++) {
    let temp = hitObjects[i].split(`,`);
    objs.push({
      x: temp[0]/640 + 0.1,//x Position on 640x480 resolution
      y: temp[1]/480,//y Position on 640x480 resolution
      time: temp[2],//Time
      type: temp[3]//Type Circle = 0
    })
  }
  return objs;
}