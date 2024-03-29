var options = {
  enemyCount : 20,
  height: this.innerHeight * 0.90,
  width: this.innerWidth * 0.90,
  padding: 20
};

var records = {
  records: 0,
  highScore: 0,
  collision: 0
};

//Axis
var axis = {
  x: d3.scale.linear().domain([0,100]).range([0, options.width]),
  y: d3.scale.linear().domain([0,100]).range([0, options.height])
};

var gameboard = d3.select('.board')
                  .append('svg:svg')
                  .attr('width', options.width)
                  .attr('height', options.height)
                  .style('background', '#EEE')
                  .style('display', 'block')
                  .style('margin', '0 auto');

function updateScore() {
  d3.select('.current').select('span').text(records.records.toString());
}

function updateHighScore() {
  records.highScore = Math.max(records.highScore, records.records);

  d3.select('.high').select('span').text(records.highScore.toString());
}

function updateCollision() {
  d3.select('.collisions').select('span').text(records.collision.toString());
}

function makeEnemies() {
  var enemies = [];

  for(var i = 0; i < options.enemyCount; i++){
    enemies.push({ id: i, x: Math.random()*100, y: Math.random()*100 });
  }

  return enemies;
}



var changeEnemies = function(enemyData){
  var enemies = gameboard.selectAll('image.enemy').data(enemyData, function(d){ return d.id; });


  enemies.enter().append('svg:image')
                 .attr('class', 'enemy')
                 .attr('x', function(enemy){ return axis.x(enemy.x);})
                 .attr('y', function(enemy){ return axis.y(enemy.y);})
                 .attr('r', 25)
                 .attr('height', 25)
                 .attr('width', 25)
                 .attr('xlink:href', 'asteroid.png');


  //Removes any enemies who are no longer in the enemies array
  enemies.exit().remove();


  function checkCollision(enemy, callback) {
    players.forEach(function(player) {
      var radiusSum = parseFloat(enemy.attr('r')) + player.r;
      var x = parseFloat(enemy.attr('x')) - player.y;
      var y = parseFloat(enemy.attr('y')) - player.y;

      //var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      var gap = Math.sqrt(x*x + y*y);

      if (gap < radiusSum) {
        callback();
        return true;
      }
      return false;
    });
  }

  function onCollision() {
    updateHighScore();
    records.records = 0;
    updateScore();
    records.collision++;
    updateCollision();
  }

  function onCollisionTween(endPoint) {
    var enemy = d3.select(this);

    var startPos = {
      x: parseFloat(enemy.attr('x')),
      y: parseFloat(enemy.attr('y'))
    };

    var endPos = {
      x: axis.x(endPoint.x),
      y: axis.y(endPoint.y)
    };

    return function(t) {
      checkCollision(enemy, onCollision);

      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x)*t,
        y: startPos.y + (endPos.y - startPos.y)*t
      };

      enemy.attr('x', enemyNextPos.x)
           .attr('y', enemyNextPos.y);
    };
  }

  enemies.transition().duration(1050)
                      .tween('custom', onCollisionTween);
};

var Player = function(options){
  this.color = 'red';
  this.options = options;
  this.r = 10;
  this.setX(0);
  this.setY(0);
};

Player.prototype.onDragging = function(){
  var self = this;
  var dragMove = function(){
    self.move(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag', dragMove);
  this.elem.call(drag);
};

Player.prototype.getX = function(){
  return this.x;
};

Player.prototype.setX = function(x){
  var min = this.options.padding;
  var max = this.options.width - this.options.padding;
  if(x <= min){
    x =min;
  } else if (x >= max){
    x = max;
  }
  this.x = x;
};

Player.prototype.getY = function(){
  return this.y;
};

Player.prototype.setY = function(y){
  var min = this.options.padding;
  var max = this.options.height - this.options.padding;
  if(y <= min){
    y =min;
  } else if (y >= max){
    y = max;
  }
  this.y = y;
};
Player.prototype.transform = function(opts){
  var x = opts.x || this.getX();
  this.setX(x);
  var y = opts.y || this.getX();
  this.setY(y);
  var trans = 'translate(' + this.getX() + ',' + this.getY() + ')';
  this.elem.attr('transform', trans);
};

Player.prototype.move = function(dx, dy) {
  this.transform({
    x:this.getX() + dx,
    y:this.getY() + dy
  });
};

Player.prototype.show = function(board){
  this.elem = board.append('svg:circle')
                  .attr('class', 'player')
                  .attr('fill', this.color)
                  .attr('r', this.r);

  this.transform({
    x: this.options.width * 0.5, 
    y: this.options.height * 0.5
  });


  this.onDragging();
};

function startGame() {
  function turn() {
    newEnemyPos = makeEnemies();
    changeEnemies(newEnemyPos);
  }

  function increaseScore() {
    records.records++;
    updateScore();
  }

  turn();
  setInterval(turn, 1000);

  setInterval(increaseScore, 50);
}

var players = [];
players.push(new Player(options));
players.forEach(function(player){
  player.show(gameboard);
});

startGame();