const camera = {
    x: player.position.x - canvas.width / 2,
    y: player.position.y - canvas.height / 2,
    width: canvas.width,
    height: canvas.height,
    speed: 0.025 // Camera lerp speed
};
const layers = [
    { x: 0, y: 0, speed: 0.2, color: 'black' }, // Background layer (farthest)
];

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function updateCamera() {
    camera.x = lerp(camera.x, player.position.x - camera.width / 2, camera.speed);
    camera.y = lerp(camera.y, player.position.y - camera.height / 2, camera.speed);

    if (camera.x < 0) camera.x = 0;
    if (camera.y < 0) camera.y = 0;
    if (camera.x + camera.width > gameWorld.width) camera.x = gameWorld.width - camera.width;
    if (camera.y + camera.height > gameWorld.height) camera.y = gameWorld.height - camera.height;
}

function drawLayer(layer) {
    ctx.fillStyle = layer.color;
    ctx.fillRect(layer.x - camera.x * layer.speed, layer.y - camera.y * layer.speed, gameWorld.width, gameWorld.height);
}