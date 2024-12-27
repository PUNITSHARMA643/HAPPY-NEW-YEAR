<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel ="stylesheet" href="style.css">

    <title>Document</title>
</head>
<body>
    <!-- <canvas id="canvas">Canvas is not supported in your browser.</canvas> -->
    <div class="f-body"> <canvas id="canvas">Canvas is not supported in your browser.</canvas> </div>

    <div class="w-container">Happy New Year</div>

    <div class = "container">
    <div class="bg-body">2</div>
    <div class="bg-body">0</div>
    <div class="bg-body">2</div>
    <div class="bg-body" id = "block4">4</div>
    <div class="bg-body" id="block5">5</div>
    </div>

    <audio id="blastSound" src="ringtone.mp3"></audio>
    <script src = "script.js"></script>
    <script src = "srcipt1.js"></script>
</body>
</html>






document.addEventListener("DOMContentLoaded", function() {
    const block4 = document.getElementById("block4");
    const block5 = document.getElementById("block5");

    const block4Rect = block4.getBoundingClientRect();
    const block5Rect = block5.getBoundingClientRect();

    const distance = block4Rect.left - block5Rect.left;

    block5.style.transition = "transform 2s";
    block5.style.transform = `translateX(${distance}px)`;

    block5.addEventListener("transitionend", () => {
        block4.textContent = "5";
        block5.textContent = "4";
        block5.style.transform = "translateX(0)";
    });
});








window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();



var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),
		cw = window.innerWidth,
		ch = window.innerHeight,
		fireworks = [],
		particles = [],
		hue = 120,
		limiterTotal = 5,
		limiterTick = 0,
		timerTotal = 8,
		timerTick = 0,
		mousedown = false,
		mx,
		my;


     var blastSound = document.getElementById('blastSound');

     function playBlastSound() {
         blastSound.currentTime = 0; // Rewind to the start
         blastSound.play();
     }
 
 
     function explode() {
         playBlastSound();
 
     }

		
canvas.width = cw;
canvas.height = ch;


function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// create firework
function Firework( sx, sy, tx, ty ) {
	// actual coordinates
	this.x = sx;
	this.y = sy;
	// starting coordinates
	this.sx = sx;
	this.sy = sy;
	// target coordinates
	this.tx = tx;
	this.ty = ty;
	// distance from starting point to target
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 3;
	// populate initial coordinate collection with the current coordinates
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random( 50, 70 );
	// circle target indicator radius
	this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function( index ) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift( [ this.x, this.y ] );
	
	// cycle the circle target indicator radius
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	
	// speed up the firework
	this.speed *= this.acceleration;
	
	// get the current velocities based on angle and speed
	var vx = Math.cos( this.angle ) * this.speed,
			vy = Math.sin( this.angle ) * this.speed;
	// how far will the firework have traveled with velocities applied?
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
	
	// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		// remove the firework, use the index passed into the update function to determine which to remove
		fireworks.splice( index, 1 );
	} else {
		// target not reached, keep traveling
		this.x += vx;
		this.y += vy;
	}
}

// draw firework
Firework.prototype.draw = function() {
	ctx.beginPath();
	// move to the last tracked coordinate in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();
	
	ctx.beginPath();
	// draw the target for this firework with a pulsing circle
	ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	ctx.stroke();
}

// create particle
function Particle( x, y ) {
	this.x = x;
	this.y = y;
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	// set a random angle in all possible directions, in radians
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	// friction will slow the particle down
	this.friction = 0.95;
	// gravity will be applied and pull the particle down
	this.gravity = 1;
	// set the hue to a random number +-50 of the overall hue variable
	this.hue = random( hue - 50, hue + 50 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = random( 0.015, 0.03 );
}

// update particle
Particle.prototype.update = function( index ) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift( [ this.x, this.y ] );
	// slow down the particle
	this.speed *= this.friction;
	// apply velocity
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	// fade out the particle
	this.alpha -= this.decay;
	
	// remove the particle once the alpha is low enough, based on the passed in index
	if( this.alpha <= this.decay ) {
		particles.splice( index, 1 );
	}
}

// draw particle
Particle.prototype.draw = function() {
	ctx. beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}

// create particle group/explosion
function createParticles( x, y ) {
	// increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
	var particleCount = 30;
	while( particleCount-- ) {
		particles.push( new Particle( x, y ) );
	}
}

function loop() {
	requestAnimFrame( loop );
	
  
  hue= random(0, 360 );
	
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	ctx.globalCompositeOperation = 'lighter';
	
	var i = fireworks.length;
	while( i-- ) {
		fireworks[ i ].draw();
		fireworks[ i ].update( i );
	}
	
	// loop over each particle, draw it, update it
	var i = particles.length;
	while( i-- ) {
		particles[ i ].draw();
		particles[ i ].update( i );
	}
	
	// launch fireworks automatically to random coordinates, when the mouse isn't down
	if( timerTick >= timerTotal ) {
		if( !mousedown ) {
			// start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
			fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
			timerTick = 0;
		}
	} else {
		timerTick++;
	}
	
	// limit the rate at which fireworks get launched when mouse is down
	if( limiterTick >= limiterTotal ) {
		if( mousedown ) {
			// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
			fireworks.push( new Firework( cw / 2, ch, mx, my ) );
			limiterTick = 0;
		}
	} else {
		limiterTick++;
	}
}

// mouse event bindings
// update the mouse coordinates on mousemove
canvas.addEventListener( 'mousemove', function( e ) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener( 'mousedown', function( e ) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener( 'mouseup', function( e ) {
	e.preventDefault();
	mousedown = false;
});


//Touch event
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    mousedown = true;
    var touch = e.touches[0];
    mx = touch.pageX - canvas.offsetLeft;
    my = touch.pageY - canvas.offsetTop;
    explode();
});

canvas.addEventListener('touchmove', function(e) {
    if (mousedown) {
        var touch = e.touches[0];
        mx = touch.pageX - canvas.offsetLeft;
        my = touch.pageY - canvas.offsetTop;
    }
});

canvas.addEventListener('touchend', function(e) {
    mousedown = false;
});

// once the window loads, we are ready for some fireworks!
window.onload = loop;






body{
    background: #000000;
    overflow: hidden;
}

canvas {
	cursor: crosshair;
	display: block;
}

.bg-body{
    margin: 1%;
    color: yellow;
    background-color: white;
    width: 100px;
    height: 100px;  
    font-size:100px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;  
}

.w-container{
    font-size: 500%;
    margin-top: 5%;
    margin-left: 25%;
    width: 800px;
    background-color: aqua;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

}

.container{
    margin-top: 5%;
    background-color: aqua;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.f-body
{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('rain.mp4') no-repeat center center;
    background-size: cover;
    z-index: -1;

}

#block4{
    position: relative;
}

#block5{
    position:absolute;
    right:-150px
}

