var monsters = [];
var heroes = [];
var waiting = true;
var mouseDn = false;
var mousePosition= {};


var assetsObj = {
  "images":[]

  }

$(document).ready(function(){
  Crafty.init(window.innerWidth,window.innerHeight);

  Crafty.scene("main",function(){
    Crafty.background('#2e2e2e');
    var screen = Crafty.e("2D, Mouse, DOM, Color")
    .color('#fff')
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
      console.log("Mouse Pos: "+mousePosition.x +"  Player: "+playerPos.x)

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

      })

    var player = Crafty.e("AI");
    player.x = 1500
    player.y = 1500
    player.color('red')

  Crafty.viewport.clampToEntities = false;
  Crafty.viewport.scale(3);
  Crafty.one("CameraAnimationDone", function() {
      Crafty.viewport.follow(player, 0, 0);
  });
  Crafty.viewport.centerOn(player, 0);


  })
  Crafty.load(assetsObj,function(){Crafty.scene('main')});
})
