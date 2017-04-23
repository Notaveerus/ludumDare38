var waiting = true;
var mouseDn = false;
var mousePosition= {};
var HEIGHT = 3000;
var WIDTH = 3000;
var ENEMIES = 4;
var CELLS = 10;
var cells = {};
var infected = {};
var cellSpawn = 1;
var player;
var assetsObj = {
  "images":['virus.png']

  }

$(document).ready(function(){
  Crafty.init(window.innerWidth,window.innerHeight);
  Crafty.bind('KeyDown',function(e){
    if(e.key == Crafty.keys.R){
      console.log("hello")
      cells = {};
      infected = {};
      mouseDn = false;
      if(Crafty.isPaused())
        Crafty.pause();
      Crafty.scene('main')


    }
  })
  Crafty.scene("main",function(){
    Crafty.background('#f76d7d ');

    var screen = Crafty.e("2D, Mouse, DOM, Color, World")
    .color('#9a4d4d')
    .attr({w:3000,h:3000,x:0,y:0})
    .bind('MouseMove', function(e){
      mousePosition = {
        x:e.clientX,
        y:e.clientY
      }
      var playerPos = {
        x:window.innerWidth/2,
        y:window.innerHeight/2
      }


      player.rotation = Engine.getRotation(playerPos, mousePosition);

    })
    .bind('MouseDown',function(e){
      if(e.mouseButton === Crafty.mouseButtons.LEFT){
          mouseDn = true;
          player.attack();
        }


      })
      .bind("MouseUp", function(e){
        mouseDn = false;
      })
    .bind('MouseWheelScroll',function(evt){

    })
    .bind("EnterFrame",function(){
      player.fireDelay--;
      if(mouseDn){
        player.attack();
      }
      if(player.health<=0){
        var gameOver = Crafty.e('2D,DOM,Text')
        .attr({x:player.x-150,y:player.y+75,w:600})
        .text("Game Over. <br/>Press 'R' to Restart")
        .textColor('red')
        .textFont({
          size: '36px',
          type: 'bold',
          family: 'Arial'
        })
        Crafty.pause();
      }
      if(Object.keys(infected).length===10){
        var gameOver = Crafty.e('2D,DOM,Text')
        .attr({x:player.x-150,y:player.y+75,w:600})
        .text("You have infected every cell. <br />Press 'R' to play again")
        .textColor('#bac22a')
        .textFont({
          size: '36px',
          type: 'bold',
          family: 'Arial'
        })
        Crafty.pause();
      }
    })


    player = Crafty.e("Player");
    player.x = 1500
    player.y = 1500

  Crafty.viewport.clampToEntities = false;
  Crafty.viewport.scale(2);
  Crafty.one("CameraAnimationDone", function() {
      Crafty.viewport.follow(player, 0, 0);
  });
  Crafty.viewport.centerOn(player, 0);

  for(var i=0;i<CELLS;i++){
    var cell =Crafty.e("Cell");
    cell.id=i;
    var randNum = Crafty.math.randomInt(700,1400)
    cell.x=WIDTH/2+(randNum* Math.cos(cellSpawn*Math.PI/9));
    cell.y=HEIGHT/2+(randNum * Math.sin(cellSpawn*Math.PI/9));
    cellSpawn+=5
    for(var j=0;j<ENEMIES;j++){
      var spawnLoc = Engine.getSpawn(cell)
      Crafty.e("AI").attr({x:spawnLoc.x,y:spawnLoc.y})
    }
    cells[cell.id]=cell;
  }


  })
  Crafty.load(assetsObj,function(){Crafty.scene('main')});
})
