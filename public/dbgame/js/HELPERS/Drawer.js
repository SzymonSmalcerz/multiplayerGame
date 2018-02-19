class Drawer{

  constructor(handler){
    this.handler = handler;
    this.itemsToDraw = [];
    this.ctx = handler.ctx;
  }

  drawItems(){

    if(this.itemsToDraw.length <= 0){
      return;
    }

    this.itemsToDraw = this.itemsToDraw.filter(function(item){
      if(item.timePassed){
        return false;
      }

      item.draw();
      return true;
    })

  }

  addItemToDraw(path,renderX, renderY, howLongImageMustLast, widthInImage, heightInImage,xPosInImage, yPosInImage, widthOnTheScreem, heightOnTheScreen){

    widthOnTheScreem = widthOnTheScreem || widthInImage;
    heightOnTheScreen = heightOnTheScreen || heightInImage;
    xPosInImage = xPosInImage || 0;
    yPosInImage = yPosInImage || 0;

    this.itemsToDraw.push(new ItemToDraw(this.ctx,path,renderX, renderY, howLongImageMustLast, widthInImage, heightInImage,xPosInImage, yPosInImage, widthOnTheScreem, heightOnTheScreen));

  }

}



class ItemToDraw{
  constructor(ctx,path,renderX, renderY, howLongImageMustLast, widthInImage, heightInImage,xPosInImage, yPosInImage, widthOnTheScreem, heightOnTheScreen){

    this.ctx = ctx;

    this.image = new Image();
    this.image.src = path;

    this.renderX = renderX;
    this.renderY = renderY;

    this.widthInImage = widthInImage;
    this.heightInImage = heightInImage;
    this.xPosInImage = xPosInImage;
    this.yPosInImage = yPosInImage;
    this.widthOnTheScreem = widthOnTheScreem;
    this.heightOnTheScreen = heightOnTheScreen;

    this.lastUntil = new Date().getTime() + howLongImageMustLast;
  }

  draw(){
    this.ctx.drawImage(this.image,this.xPosInImage*this.widthInImage,this.yPosInImage*this.heightInImage,
                             this.widthInImage,this.heightInImage,
                             this.renderX,this.renderY,
                             this.widthOnTheScreem,this.heightOnTheScreen);

    if(new Date().getTime() > this.lastUntil){
      this.timePassed = true;
    }

  }
}
