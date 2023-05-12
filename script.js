// Get a reference to the canvas
let canvas = document.getElementById("simulationCanvas");

// Get a 2D rendering context for the canvas
let ctx = canvas.getContext("2d");

// Set the size of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw a circle on the canvas (missile)
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2, false);
ctx.fillStyle = "white";
ctx.fill();

let collision = false; //variable to manage collision

let missile = { //missile object
    x: canvas.width / 2,
    y: canvas.height,
    speed: 4,
    dx: 0,
    dy: 0,
    isConnected: true
};

let target = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
};

// Here I Load the images
let missileImage = new Image();
let targetDestroyed = new Image();

// Count how many images have been loaded
let imagesLoaded = 0;

// Set up the onload function for both images
missileImage.onload = targetDestroyed.onload = function() {
    imagesLoaded++;

    // If both images have been loaded, start the simulation
    if (imagesLoaded === 2) {
        // Call updateMissilePosition every 20ms
        setInterval(updateMissilePosition, 20);
    }
};

// Set the src after setting up the onload function
missileImage.src = "missile.png";
targetDestroyed.src = "targetDestroyed.png";



// Update drawObjects function
function drawObjects() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (collision) {
        // Draw the explosion at the target's location
        ctx.drawImage(targetDestroyed, target.x - 50, target.y - 50, 300, 100);
    } else {
        // Draw the missile
        ctx.save();  // Save the current state of the canvas
        ctx.translate(missile.x, missile.y);  // Move the origin to the missile's location
        ctx.rotate(Math.atan2(missile.dy, missile.dx) + Math.PI/2);  // Rotate the canvas by the angle of movement
        ctx.drawImage(missileImage, -missileImage.width / 2, -missileImage.height / 2);  // Draw the missile centered at the new origin
        ctx.restore();  // Restore the canvas state to how it was before we moved the origin

        // Draw the target
        ctx.beginPath();
        ctx.arc(target.x, target.y, 20, 0, Math.PI * 2, false);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}

// Initial drawing of objects
drawObjects();


function updateMissilePosition() {
    // Only update position if there has been no collision
    if (!collision) {
        // Calculate direction vector from missile to target
        let dx = target.x - missile.x;
        let dy = target.y - missile.y;

        // Calculate distance between missile and target
        let distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is less than the sum of the radii, a collision has occurred
        if (distance < 190 + 10) {
            collision = true;
            animateExplosion();
        } else {
            // Normalize direction vector and multiply by speed
            missile.dx = (dx / distance) * missile.speed;
            missile.dy = (dy / distance) * missile.speed;

            // Add dx and dy to the missile's x and y coordinates
            missile.x += missile.dx;
            missile.y += missile.dy;
        }
    }

    // Redraw the objects with their new positions
    drawObjects();
}

// Call updateMissilePosition every 20ms
setInterval(updateMissilePosition, 20);

function animateExplosion() {
    let explosion = document.getElementById('explosion');
    explosion.style.left = `${target.x}px`;
    explosion.style.top = `${target.y}px`;

    let frame = 0;
    let numFrames = 7;  // The total number of frames in the sprite sheet
    let frameWidth = 240;  // The width of each frame in the sprite sheet
    //let frameHeight = 300; // The height of each frame in the sprite sheet
    let frameRate = 50;  // The time (in milliseconds) each frame should be shown

    // This interval will run every 'frameRate' milliseconds
    let interval = setInterval(() => {
        frame++;

        // If we've shown all the frames, reset everything
        if (frame >= numFrames) {
            clearInterval(interval);
            explosion.style.backgroundPosition = '0px 0px';
            explosion.style.display = 'none';
        } else {
            // Shift the background image to show the next frame
            // Note: Make sure the sprites in your sprite sheet are arranged horizontally
            explosion.style.backgroundPosition = `${-frame * frameWidth}px 0px`; //This is where the explosion animation displays
            explosion.style.display = 'block';
        }
    }, frameRate);
}
