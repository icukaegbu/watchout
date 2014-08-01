// 3 Objects
// The Board, The Blacks and The Hero

var width = 600;
var height = 500;

// Create a Board
d3.select('.board').style('height', height + 'px')
                   .style('width', width + 'px');

// Set up
var numEnemies = 30;
var transitionDuration = 1500;
var setIntervalDuration = 2000;
var positions = [];
var radius = 6;
var xPos;
var yPos;

// Create svg
var svg = d3.select('.board').append('svg').attr('height', height).attr('width', width);

// Create array of random positions
var createPositions = function(){ 
for(var i = 0; i < numEnemies; i++) {
  xPos = Math.random() * width;
  yPos = Math.random() * height;
  positions[i] = {x: xPos, y: yPos};
}
};
createPositions();

// Tell the circles to appear for the first time
var circles = svg.selectAll('circle').data(positions).enter().append('circle');

// Assign positions and radius (size) to all circles!
var assignPositions = function() {
circles.transition().duration(transitionDuration)
       .attr('cx', function(d) { return d.x; })
       .attr('cy', function(d) { return d.y; })
       .attr('r', radius);
};
assignPositions();

// Update the circles with new positions
var newPositions = function() {
createPositions();
circles = svg.selectAll('circle').data(positions);
assignPositions();
};

// Update the circles every 2 seconds
setInterval(newPositions, setIntervalDuration);

// Create several enemies and put them on the Board
// Randomly change their positions (move the enemies)
// Find out when our Hero is hit by an enemy, reduce Hero's point

// WHAT TO TRACK IN THE ENEMY
// -Position in X and Y axes
// --store as an Array of Arrays || a Point object with X and Y axes
// --Random position generator - generates random X,Y and assigns to //   enemies
// --Move the enemy by giving him a new position and using the transition method in d3 to move them

// Have a mouse controlled Hero
// Points accrue as the Hero and avoids being hit by the enemy
// Keep track of high score


// TOUGH QUESTIONS
// --How do we control the Hero with a mouse
// --How do we find out when he has being hit by an enemy


