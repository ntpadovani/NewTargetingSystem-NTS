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
    speed: 8,
    dx: 0,
    dy: 0,
    isConnected: true
};

let target = { //target object
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
};

// Here I Load the images
let missileImage = new Image();
let targetDestroyed = new Image();

// Count how many images have been loaded
let imagesLoaded = 0;

// Function to be called when an image is loaded
function imageLoaded() {
    imagesLoaded++;

    // If both images have been loaded, start the simulation
    if (imagesLoaded === 2) {
        // Call updateMissilePosition every 20ms
        setInterval(updateMissilePosition, 20); //To keep track of the missile trajectory 
    }
}

// Set up the onload function for each image
missileImage.onload = imageLoaded;
targetDestroyed.onload = imageLoaded;

// Set the src after setting up the onload function
missileImage.src = "missile.png";
targetDestroyed.src = "targetDestroyed.png";

let explosionEnded = false; //variable to manage end of explosion

function drawObjects() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (collision) {
        if (curFrame >= frameCount - 1) {
            explosionEnded = true;
            // If the missile successfully destroys the target, show a message on location
            ctx.drawImage(targetDestroyed, target.x - targetDestroyed.width / 2, target.y - targetDestroyed.height / 2);
        } 
        if (!explosionEnded) {
            // Draw explosion
            ctx.drawImage(exploAnim, srcX, srcY, exploWidth, exploHeight, exploX, exploY, exploWidth, exploHeight);
        }
    } else {
        // Draw the missile
        ctx.save();  // Save the current state of the canvas
        ctx.translate(missile.x, missile.y);  // Move the origin to the missile's location
        ctx.rotate(Math.atan2(missile.dy, missile.dx) + Math.PI/2);  // To rotate the missile by the angle of movement
        ctx.drawImage(missileImage, -missileImage.width / 2, -missileImage.height / 2);  // Here I draw the missile centered at the new origin
        ctx.restore();  // Restore the canvas state to how it was before we moved the origin

        // Draw the target
        ctx.beginPath();
        ctx.arc(target.x, target.y, 20, 0, Math.PI * 2, false);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}


function updateMissilePosition() {
    // Only update position if there has been no collision and explosion hasn't ended
    if (!collision && !explosionEnded) {
        // Calculate direction vector from missile to target
        let dx = target.x - missile.x;
        let dy = target.y - missile.y;

        // Calculate distance between missile and target
        let distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is less than the sum of the radii, a collision has occurred
        if (distance < 190 + 10) { // I made some adjustments to make the missile explode at the tip
            collision = true;
            startExplosion();
        } else {
            // Normalize direction vector and multiply by speed
            missile.dx = (dx / distance) * missile.speed;
            missile.dy = (dy / distance) * missile.speed;

            // Add dx and dy to the missile's x and y coordinates
            missile.x += missile.dx;
            missile.y += missile.dy;
        }
    } 

    // If the explosion has not ended, keep drawing
    if (!explosionEnded) {
        drawObjects();
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

let exploCanvasWidth = 240; //The width of the canvas where I will display the explosion animation. Frams width
let exploCanvasHeight = 300; //The Height of the canvas where I will display the explosion animation. Frames height
/////////////////////////////////////////////////////////////////////////////////////////////////////
let spriteWidth = 1820; //The width of the spritesheet
let spriteHeight = 320; //The Height of the spritesheet
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploColumn = 7; //Represents the number of columns in the spritesheet. The individual frames of the animation
/////////////////////////////////////////////////////////////////////////////////////////////////////
let trackRight = 0; //This will track movement to the right starting at the 0th position
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploWidth = spriteWidth/exploColumn; //The width of a single sprite is the division of its width by the size of each frame
let exploHeight = spriteHeight/1; //I wrote one since the sprite contains 1 row. If not it would be divided by the number of rows(a row variable)
/////////////////////////////////////////////////////////////////////////////////////////////////////
let curFrame = 0; //The current frame to be displayed
let frameCount = 7; //The number of frames
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploX=0; //Coordinates to render the sprite
let exploY=0; 
/////////////////////////////////////////////////////////////////////////////////////////////////////
let srcX=0; //x and y coordinates of the canvas to get the single frame
let srcY=0; 
/////////////////////////////////////////////////////////////////////////////////////////////////////
let right = true; //Establishes that the movement is to the right at the start
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploSpeed = 4; //The movement speed
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploCanvas = document.getElementById('explosion'); // Get a reference to the canvas 
exploCanvas.width = exploCanvasWidth;//Setting width and height of the canvas
exploCanvas.height = exploCanvasHeight;
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploAnim = new Image();//Creating an Image object for our animation
exploAnim.src = "explosion.png";
/////////////////////////////////////////////////////////////////////////////////////////////////////
let exploInterval; //To control the interval between frames
/////////////////////////////////////////////////////////////////////////////////////////////////////
function updateFrame(){
    // If we've shown all the frames, stop the explosion
    if (curFrame >= frameCount - 1) {
        stopExplosion();
    } else {
        // Updating the frame index 
        curFrame++;
        
        // Calculating the x coordinate for spritesheet 
        srcX = curFrame * exploWidth; 
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function drawExplo() {
    // Clear the already drawn sprite before rendering the new sprite
    ctx.clearRect(exploX, exploY, exploWidth, exploHeight); 

    // Updating the frame 
    updateFrame();

    // Drawing the image 
    ctx.drawImage(exploAnim, srcX, srcY, exploWidth, exploHeight, exploX, exploY, exploWidth, exploHeight);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
function startExplosion() {
    exploX = target.x - exploWidth / 2; // adjust these values as needed
    exploY = target.y - exploHeight / 2;
    exploInterval = setInterval(drawExplo, 100); // start the explosion animation
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
function stopExplosion() {
    clearInterval(exploInterval); // stop the explosion animation
    curFrame = 0; // reset the frame count

    // Draw the "Target Destroyed" image
    ctx.drawImage(targetDestroyed, target.x - 150, target.y - 50, 300, 100);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//The explosion animation function
//function animateExplosion() {
   //let explosion = document.getElementById('explosion');
   // explosion.style.left = `${target.x - 50}px`;
    //explosion.style.top = `${target.y - 150}px`;

    //let frame = 0;
    //let numFrames = 7;  // The total number of frames in the sprite sheet
    //let frameWidth = 240;  // The width of each frame in the sprite sheet
    //let frameRate = 100;  // The time (in milliseconds) each frame should be shown

    // This interval will run every 'frameRate' milliseconds
    //let interval = setInterval(() => {
       // frame++;

        // If we've shown all the frames, reset everything
       // if (frame >= numFrames) {
       //     clearInterval(interval);
       //     explosion.style.backgroundPosition = '0px 0px';
       //     explosion.style.display = 'none';
       // } else {
            // Shift the background image to show the next frame
       //     explosion.style.backgroundPosition = `${-frame * frameWidth}px 0px`; //This is where the explosion animation displays
       //     explosion.style.display = 'block';
      //  }
  //  }, frameRate);
//}

