// Get a reference to the canvas
let canvas = document.getElementById("simulationCanvas");

// Get a 2D rendering context for the canvas
let ctx = canvas.getContext("2d");

// Set the size of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw a circle on the canvas
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2, false);
ctx.fillStyle = "white";
ctx.fill();

let missile = {
    x: canvas.width / 2,
    y: canvas.height,
    speed: 2,
    dx: 0,
    dy: 0,
    isConnected: true
};

let target = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
};

function drawObjects() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the missile
    ctx.beginPath();
    ctx.arc(missile.x, missile.y, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();

    // Draw the target
    ctx.beginPath();
    ctx.arc(target.x, target.y, 20, 0, Math.PI * 2, false);
    ctx.fillStyle = "red";
    ctx.fill();
}

// Initial drawing of objects
drawObjects();

function updateMissilePosition() {
    // Calculate direction vector from missile to target
    let dx = target.x - missile.x;
    let dy = target.y - missile.y;

    // Calculate distance between missile and target
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction vector and multiply by speed
    missile.dx = (dx / distance) * missile.speed;
    missile.dy = (dy / distance) * missile.speed;

    // Add dx and dy to the missile's x and y coordinates
    missile.x += missile.dx;
    missile.y += missile.dy;

    // Redraw the objects with their new positions
    drawObjects();
}

// Call updateMissilePosition every 20ms
setInterval(updateMissilePosition, 20);
