
class Camera{
  constructor(handler){
    this.handler = handler;
  }


  handleMoveXandMoveY(){

    var player = this.handler.character;
    var map  = this.handler.currentMap;

    map.moveX = 0;
    map.moveY = 0;
    //by convention after resizing player.renderY = player.y and after creating new player, player.y = player.renderY
    //maybe it is not beutifull but dont change it, whole camera depends on this principle :)
    player.renderX = this.handler.character.x;
    player.renderY = this.handler.character.y;


    //moveY and player.renderY -> horizontal position of map
    if(player.y + player.height/2 < (this.handler.gameCanvasesHeight)/2) {
      //do nothing :) as long as we measure position of entities relative to the canvas not to the window then we are safe
    }
    if(player.renderY + player.height/2 > (this.handler.gameCanvasesHeight)/2){
      var diffrenceBetweenBottomBorderAndYCenterOfPlayer = (TileStatic.height * map.heightOfMap) - (player.height + player.y);
      if(diffrenceBetweenBottomBorderAndYCenterOfPlayer < this.handler.gameCanvasesHeight/2){
        while(player.renderY + player.height/2>= Math.floor(this.handler.gameCanvasesHeight - diffrenceBetweenBottomBorderAndYCenterOfPlayer)){
          map.moveY -= 1;
          player.renderY -= 1;
        }
      }else {
        while(player.renderY + player.height/2>= Math.floor(this.handler.gameCanvasesHeight/2)){
          map.moveY -= 1;
          player.renderY -= 1;
        }
      }
    }



    //moveX and player.renderX -> vertical position of map
    if(player.x + player.width/2< (this.handler.gameCanvasesWidth)/2 ){
      //do nothing :) as long as we measure position of entities relative to the canvas not to the window then we are safe
    }
    if(player.renderX + player.width/2 > (this.handler.gameCanvasesWidth)/2) {
      var diffrenceBetweenRightBorderAndXCenterOfPlayer = (TileStatic.width * map.widthOfMap) - (player.width/2 + player.x);
      if(diffrenceBetweenRightBorderAndXCenterOfPlayer < this.handler.gameCanvasesWidth/2){

        while(player.renderX + player.width/2 >= (this.handler.gameCanvasesWidth - diffrenceBetweenRightBorderAndXCenterOfPlayer)){
          map.moveX -= 1;
          player.renderX -= 1;
        }
      }else {
        while(player.renderX + player.width/2 >= this.handler.gameCanvasesWidth/2 ){
          map.moveX -= 1;
          player.renderX -= 1;
        }
      }
  	}
  }





  tick(){

    var map = this.handler.currentMap;
  	var player = this.handler.character;

    if(player.currentSprite === player.right && player.renderX + player.width/2 >= (this.handler.gameCanvasesWidth)/2){


      if(player.x + player.width + player.speed <= TileStatic.width * map.widthOfMap - this.handler.gameCanvasesWidth/2){

        while(player.renderX + player.width/2 - 3 >= this.handler.gameCanvasesWidth/2){
          map.moveX -= 1;
          player.renderX -= 1;
        }

  		}

  	}else if(player.currentSprite === player.left && player.renderX + player.width/2 <= this.handler.gameCanvasesWidth/2){

      if(player.x + player.width/2 >=this.handler.gameCanvasesWidth/2){

        while(player.renderX + player.width/2 <= this.handler.gameCanvasesWidth/2){
          map.moveX += 1;
          player.renderX += 1;
        }

  		}
    }
  	if(player.currentSprite === player.down && player.renderY >= this.handler.gameCanvasesHeight/2){


      if(player.y + player.height <=(TileStatic.height * map.heightOfMap - this.handler.gameCanvasesHeight/2)){

        while(player.renderY >= this.handler.gameCanvasesHeight/2){
          map.moveY -= 1;
          player.renderY -= 1;
        }

  		}

  	}else if(player.currentSprite === player.up && (player.renderY  <= this.handler.gameCanvasesHeight/2)){

      if(player.y + player.height >=this.handler.gameCanvasesHeight/2){

        while(player.renderY + player.height<= this.handler.gameCanvasesHeight/2){
          map.moveY += 1;
          player.renderY += 1;
        }

  		}

    }
  }
}
