const canvas = document.getElementById(`game`);

const context = canvas.getContext(`2d`);

const circlePath = new Path2D();

canvas.addEventListener(`click`, (clickEvent) => {
    var rect = canvas.getBoundingClientRect();
    if (context.isPointInPath(circlePath, clickEvent.x-rect.left, clickEvent.y-rect.top)) {
        clearCanvas();
    }
});

function drawMainMenu() {
    console.log(`Drawing....`);
    const circleRad = (canvas.height / 2) * 0.60;
    circlePath.arc((canvas.width / 2), (canvas.height / 2), circleRad, 0, 2 * Math.PI);
    context.fillStyle = `#60C`;
    context.fill(circlePath);
    context.strokeStyle = `#FFF`;
    context.lineWidth = circleRad * 0.05;
    context.stroke(circlePath);
    context.fillStyle = `#FFF`;
    const textHeight = circleRad * 0.3;
    context.font = `${textHeight}px arial`;
    context.textAlign = `center`;
    context.fillText(`Click To Play`, (canvas.width / 2), (canvas.height / 2) + (textHeight * 0.8 / 2));
    console.log(`Drawed!`);
}

function clearCanvas() {
    console.log(`Clearing....`);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(0,0);
    console.log(`Cleared!`);
}

function resize() {
    let width = document.documentElement.clientHeight * 1.6;
    let maxWidth = document.documentElement.clientWidth * 0.96;
    let height = document.documentElement.clientHeight * 0.9;
    let maxHeight = document.documentElement.clientWidth * 0.54;

    if (width > maxWidth) {
        width = maxWidth;
    }

    if (height > maxHeight) {
        height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;

    console.log(`Clear!`);
    clearCanvas();
    console.log(`Draw!`);
    drawMainMenu();
}

window.addEventListener(`resize`, (resizeEvent) => {
    resize();
});

resize();