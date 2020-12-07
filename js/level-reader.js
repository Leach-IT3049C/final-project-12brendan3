let levelList = [];

async function readLevels() {
  const defaultLevel = await getDefaultLevel();
  levelList = levelList.concat(defaultLevel);
}

function readLevelZip(reader) {
  return new Promise((resolve) => {
    reader.getEntries(async (entries) => {
      if (entries.length) {
        let levels = [];
        let songs = {};

        entries.forEach((entry) => {
          if (entry.filename.endsWith(`.osu`)) {
            levels.push(entry);
          } else if (entry.filename.endsWith(`.mp3`)) {
            songs[entry.filename] = entry;
          }
        });

        levelsAdded = [];

        for (let i = 0; i < levels.length; i++) {
          const levelData = await getLevelData(levels[i]);
          if (levelData.mode === 0) {
            levelsAdded.push({data: levelData.rawLevelData, name: levelData.levelTitle, difficulty: levelData.difficultyName, songFile: songs[levelData.audioFileName]});
          }
        }

        resolve(levelsAdded);
      }
    });
  });
}

function getLevelData(entry) {
  return new Promise((resolve) => {
    entry.getData(new zip.TextWriter(), (text) => {
      // Text is the level data
      let lines = text.split('\r\n');

      let inSection = -1;
      let readParts = 0;
      let audioFileName = null;
      let levelTitle = null;
      let difficultyName = null;
      let levelGameMode = null;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === `[General]`){
          inSection = 0;
        } else if (lines[i] === `[Metadata]`){
          inSection = 2;
        } else if (inSection === 0 && lines[i].startsWith(`Mode: `)) {
          levelGameMode = parseInt(lines[i].substr(6));
          readParts++;
        } else if (inSection === 0 && lines[i].startsWith(`AudioFilename: `)) {
          audioFileName = lines[i].substr(15);
          readParts++;
        } else if (inSection === 2 && lines[i].startsWith(`Title:`)) {
          levelTitle = lines[i].substr(6);
          readParts++;
        } else if (inSection === 2 && lines[i].startsWith(`Version:`)) {
          difficultyName = lines[i].substr(8);
          readParts++;
        }

        if (readParts === 4) {
          break;
        }
      }

      resolve({rawLevelData: text, audioFileName, levelTitle, difficultyName, mode: levelGameMode});
    });
  });
}

function getDefaultLevel() {
  return new Promise((resolve) => {
    zip.createReader(new zip.HttpReader(`files/TestLevel.osz`), async (reader) => {
      const mapData = await readLevelZip(reader);
      resolve(mapData);
    }, (err) => {
      console.error(err);
      resolve([]);
    });
  });
}

function readLevelFile(file) {
  zip.createReader(new zip.BlobReader(file), async (reader) => {
    const mapData = await readLevelZip(reader);
    levelList = levelList.concat(mapData);
    if (currentGameMode !== `osu!`) {
      drawLevelSelect();
    }
  }, (err) => {
    console.error(err);
    resolve([]);
  });
}