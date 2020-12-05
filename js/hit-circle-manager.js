let hitCircles = [];

function addHitCircle(circleID, locX, locY, radius, color, beatLength) {
  hitCircles.unshift({id: circleID, x: locX, y: locY, radius: radius, color: color, beatLength: beatLength});
}

function clearHitCircles() { // Removes all Hit Circles
  hitCircles = [];
}

function removeHitCircle(circleID) {
  for (let i = 0; i < hitCircles.length; i++) {
    if (hitCircles[i].id === circleID) {
      hitCircles.splice(i, 1);
      break;
    }
  }
}