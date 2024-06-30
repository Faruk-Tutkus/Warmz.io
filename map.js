function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.width = canvas.width;
    camera.height = canvas.height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // İlk başta boyutlandır



