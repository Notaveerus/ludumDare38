Crafty.c("Player", {
  required: "2D, DOM, Collision, Tween, Color, Motion,Mouse, AngularMotion, Image, Fourway",
  fireDelay: 0,
  diffMod: 1,
  init: function(){
    this.init = true;
    this.w = 30;
    this.h = 30;
    this.damage = 50;
    this.health = 10000;
    this.fourway(200)
    this.image('virus.png');
    this.origin("center")
    this.healthBar = Crafty.e('Status').attr({x:this.x,y:this.y+30})
    this.onHit("Attack",function(hitData){
      Engine.collide(this,hitData)
      if(Object.keys(infected).length>0&&infected.constructor === Object){
        var randInt = Crafty.math.randomInt(0,Object.keys(infected).length-1)
        var cured = infected[Object.keys(infected)[randInt]];
        delete infected[cured.id];
        cells[cured.id] = cured;
        cured.image('cell.png')
      }
      if(this.health<=0){

      }
    })
    this.hitDelay = 10;


  },
  attack: function(){
      if(this.fireDelay <=0){
        this.cancelTween;
        var arrowX = this.x+this.w/2;
        var arrowY = this.y+this.h/2;
        var arrow = Crafty.e("2D,Color,Bullet,Collision,DOM,Image")
        .attr({
            x:arrowX,
            y:arrowY,
            w:5,
            h:30,
            rotation: this._rotation,
            xspeed: 15 * Math.sin(this._rotation/57.3),
            yspeed: 15 * Math.cos(this._rotation/57.3)
          })
        .color('#17a80a')
        arrow.damage = this.damage
        arrow.bind("EnterFrame",function(){
          this.x-= this.xspeed
          this.y+=this.yspeed
        })
        Crafty.e("Delay").delay(function() {
          arrow.destroy();
        }, 2000);
        this.fireDelay = 15
      }
  },
  events: {
    "EnterFrame": function(){

      if(this.x > 3000-this.w){
        this.x = 3000-this.w;
      }
      if(this.x <=0){
        this.x = 0
      }
      if(this.y > 3000-this.w) {
        this.y = 3000-this.w;
      }
      if(this.y < 0) {
        this.y = 0;
      }
    }
  }
})

Crafty.c("AI",{
  required: "2D, DOM, Collision, Tween, Color, Motion,Mouse, AngularMotion, Image",
  fireDelay: 1,
  los: 600,
  diffMod: 1,
  init: function(){
    this.init = true;
    this.w = 30;
    this.h = 30;
    this.origin("center")
    this.healthBar = Crafty.e('Status').attr({x:this.x,y:this.y+30})
    this.hitDelay = 10;
    this.type = 'ranged';
    this.onHit("Bullet", function(hitData){
      Engine.collide(this,hitData)
      if(this.health <=0){
        Engine.death(this)
      }
    })
  },
  generic: function(){
    if(this.init){
      this.id = 1;
      this.spawn = {x:this.x,y:this.y}
    }
    this.currPos = {
      x:this.x,
      y:this.y
    }
    this.dist = 0;
    this.targeting=false;
    if(player){
      var dist = Crafty.math.distance(this.currPos.x, this.currPos.y, player.x,player.y)
      if(dist<this.dist||!this.dist){
        this.dist = dist;
        this.targetPos={
          x:player.x,
          y:player.y
        }
        if(this.dist<this.los){
          this.rotation= Engine.getRotation(this.currPos, this.targetPos);
          this.targeting=true;
        }
      }
    }
  },
  "ranged": function(){
    if(this.init){
      this.range=300;
      this.maxHealth = 100;
      this.damage = 50;
      this.health = this.maxHealth;
      this.image('whiteCell.png')
      this.init=false;
      this.speed=1;
    }
    if(this.dist){
      if(this.dist<this.range && this.targeting &&this.fireDelay <0){
        var arrowX = this.x+this.w/2;
        var arrowY = this.y+this.h/2;
        var arrow = Crafty.e("2D,Color,Collision,Attack,DOM,Image")
        .attr({
            x:arrowX,
            y:arrowY,
            w:5,
            h:30,
            rotation: this._rotation,
            xspeed: 7 * Math.sin(this._rotation/57.3),
            yspeed: 7 * Math.cos(this._rotation/57.3)

          })
        .color("#533108")
        arrow.team = this.team;
        arrow.damage = this.damage

        var spread= Crafty.math.randomNumber(-0.5,0.5)
        arrow.bind("EnterFrame",function(){
          this.x-= this.xspeed+spread
          this.y+=this.yspeed+spread
        })
        Crafty.e("Delay").delay(function() {
          arrow.destroy();

        }, 2000);
        this.fireDelay = 35
      }
      else if(this.dist>this.range&&this.dist<this.los){
        Engine.moveTo(this,this.speed)
      }
      this.fireDelay--;
    }

  },
  events: {
    "EnterFrame": function(){
      this.generic();
      this[this.type]();
      this.healthBar.x = this.x;
      this.healthBar.y = this.y +40;
      if(this.health<=0){
        Engine.death(this);
      }
    }
  }
})

Crafty.c("Cell",{
  required: "2D, DOM, Collision, Color, Image",
  init: function(){
    this.w = 45;
    this.h = 45;
    this.image("cell.png")
    this.onHit("Player",function(hitData){
      this.image('cellInfected.png')
      if(cells[this.id]){
        player.health+=50
        delete cells[this.id];
        infected[this.id]=this;
        Engine.generateEnemies();
      }

    })

  }

})
Crafty.c('Status',{
  init: function(){
    this.requires('2D, DOM, Color, Text, Tween');
    this.w = 30;
    this.h = 3;
    this.maxWidth = 30;
    this.status=100;
    this.color("#ff0000");

  },
  subtract: function(num,obj){
    var fraction = (num/obj)*this.maxWidth;
    this.w -=fraction;
    if(this.w<0){
      this.w=0
    }
    if(this.w>this.maxWidth){
      this.w = this.maxWidth
    }

  },
  events: {
    "EnterFrame": function(){
    }
  }

})
