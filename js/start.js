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
    clearCanvas();
    const circleRad = (canvas.height / 2) * 0.60;
    circlePath.arc((canvas.width / 2), (canvas.height / 2), circleRad, 0, 2 * Math.PI);
    context.fillStyle = `#6600CC`;
    context.fill(circlePath);
    context.fillStyle = `#FFFFFF`;
    const textHeight = circleRad * 0.3;
    context.font = `${textHeight}px arial`;
    context.textAlign = `center`;
    context.fillText(`Click To Play`, (canvas.width / 2), (canvas.height / 2) + (textHeight * 0.8 / 2));
}

function clearCanvas() {
    context.fillStyle = `#000000`;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function resize() {

    clearCanvas();

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

    drawMainMenu();
}

window.addEventListener(`resize`, (resizeEvent) => {
    resize();
});

resize();