Crafty.c("AI", {
  required: "2D, DOM, Collision, Tween, Color, Motion,Mouse, AngularMotion, Image, Fourway",
  fireDelay: 0,
  diffMod: 1,
  init: function(team,type){
    this.init = true;
    this.w = 30;
    this.h = 30;
    this.fourway(200)
    this.origin("center")
    this.healthBar = Crafty.e('Status').attr({x:this.x,y:this.y+30})
    this.onHit("projectile",function(hitData){
      Engine.collide(this,hitData)
    })
    this.onHit("Attack",function(hitData){
      Engine.collide(this,hitData)
    })
    this.hitDelay = 10;
  },

  generic: function(){
    if(this.init){
      this.id = 1;
      this.spawn={x:this.x,y:this.y}
      this.init = false;
    }
      this.currPos = {
        x:this.x,
        y:this.y
      }
      //this.rotation = Engine.getRotation(this.currPos,Crafty.mousePos);





  },
  "player": function(){
    if(this.init){
      this.range = 400
      this.maxHealth = Math.round(100*this.diffMod);
      this.health = this.maxHealth;
      this.image('ranger2.png')
      this.init = false;
      this.damage = 20*this.diffMod
      this.speed =1;
      this.value=10*this.diffMod
    }
  },
  attack: function(){

      if(this.fireDelay <=0){
        console.log('test')
        this.cancelTween;
        var arrowX = this.x+this.w/2;
        var arrowY = this.y+this.h/2;
        var arrow = Crafty.e("2D,Color,Collision,Arrow,DOM,Image")
        .attr({
            x:arrowX,
            y:arrowY,
            w:5,
            h:30,
            rotation: this._rotation,
            xspeed: 5 * Math.sin(this._rotation/57.3),
            yspeed: 5 * Math.cos(this._rotation/57.3)

          })
        .color('#17a80a')
        arrow.damage = this.damage

        var spread= Crafty.math.randomNumber(-0.5,0.5)
        arrow.bind("EnterFrame",function(){
          this.x-= this.xspeed+spread
          this.y+=this.yspeed+spread
          //BOUNDS

        })
        Crafty.e("Delay").delay(function() {
          arrow.destroy();

        }, 2000);
        this.fireDelay = 25

      }






  },




  events: {
    "EnterFrame": function(){
      this.generic();
      this.healthBar.x = this.x;
      this.healthBar.y = this.y+40
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
