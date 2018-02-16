class Mob extends Entity{

  constructor(handler,id,sprite,x,y){

    super(handler,x,y);

    this.id = id || Math.floor((Math.random() * 100000) + 1);
    this.sprite = sprite;
    this.floatingFrame = 1

  }

  tick(){
    this.draw();
  }

  draw(){
    //draw sprite
    var mob = this;

    var isSwiming = false;
    if(this.handler.currentMap && this.handler.currentMap.specialTiles.length){

      this.handler.currentMap.specialTiles.forEach(function(entity){
        if(Helper.areTwoEntitiesInRange(mob,entity)){
          isSwiming = true;
        }
      });
    }
    this.isFloating = isSwiming;

    //if mob is not floating then just render mob
  	if(this.currentSprite && !this.isFloating){
      this.renderMob();
    //else if mob is floating then render diffrent way
    }else if(this.currentSprite){
      this.renderFloatingMob();
    }


    //increnment tick counter
    this.tickCounter+=0.25;
  }

  renderMob(){
    this.handler.ctx.drawImage(this.sprite,							// imagesource
                    this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].x*this.width,this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].y*this.height,	// x and y position of particular image in sprite
                    this.width,this.height,							// width and height of particular image in sprite
                    this.renderX,this.renderY,											// x and y on the screen
                    this.width,this.height);		        // width and height of the particular image on the screen

  }

  renderFloatingMob(){

          this.floatingFrame += 1;

          var temp = 0;
          var tick = 3.5;
          var timeFrame = tick*8;

          if(this.floatingFrame % timeFrame < tick || (this.floatingFrame % timeFrame >= tick*6 && this.floatingFrame % timeFrame < tick*8)){
            temp = 0;
          }else if((this.floatingFrame % timeFrame >= tick && this.floatingFrame % timeFrame < tick*2) || (this.floatingFrame % timeFrame >= tick*4 && this.floatingFrame % timeFrame < tick*6)){
            temp = 2;
          }else if(this.floatingFrame % timeFrame >= tick*2 && this.floatingFrame % timeFrame < tick*4){
            temp = 4;
          }
          this.handler.ctx.drawImage(this.sprite,																	// imagesource
                          this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].x*this.width,this.currentSprite[Math.floor(this.tickCounter)%this.currentSprite.length].y*this.height,	// x and y position of particular image in sprite
                          this.width,this.height/2,												// width and height of particular image in sprite
                        this.renderX,this.renderY + temp,											// x and y on the screen
                          this.width,this.height/2);		// width and height of the particular image on the screen

  }


  

}
