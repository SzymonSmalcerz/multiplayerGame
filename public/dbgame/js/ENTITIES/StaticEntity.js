var staticSprite = new Image();
var staticSprite32px = new Image();




class StaticEntity extends Entity{

  constructor(handler,data){
    // WHAT THE FUUUUUUUUUUUUUCK
    staticSprite.src = "dbgame/js/SPRITES/spriteStaticEntities.png";
    staticSprite32px.src = "dbgame/js/SPRITES/spriteStaticEntities32px.png";
    super(handler,data.x,data.y,);


    this.xPositionInImage = data.xPosInSprite;
  	this.yPositionInImage = data.yPosInSprite;


    this.widthInImage = data.widthInImage || 64;
  	this.width = this.widthInImage;
  	this.heightInImage = data.heightInImage || 64;
  	this.height = this.heightInImage;
  	this.collisionHeight = data.collisionHeight || this.height/8;
  	this.collisionWidth = data.collisionWidth || this.width/3;

    if(data.collisionWidth == 0 || data.collisionHeight == 0){
      this.flatRendering = true;
    }

    this.sprite = staticSprite;
    this.gridSize = 64;
  };

  draw(){

  	this.handler.ctx.drawImage(this.sprite,																	// imagesource
  							   this.xPositionInImage*this.gridSize,this.yPositionInImage*this.gridSize,	// x and y position of particular image in sprite
  							   this.widthInImage,this.heightInImage,												// width and height of particular image in sprite
  							   this.renderX,this.renderY,											// x and y on the screen
  							   this.width,this.height);		// width and height of the particular image on the

  };



}

class StaticEntity32 extends StaticEntity{
  constructor(handler,data){
      super(handler,data);
      this.gridSize = 32;
      this.sprite = staticSprite32px;
  }
}
