
class Camera{
  constructor(handler){
    this.handler = handler;
  }


  handleMoveXandMoveY(){

    var player = this.handler.character;
    var map  = this.handler.currentMap;

    map.moveX = 0;
    map.moveY = 0;
    //by convenction after resizing player.renderY = player.y and after creating new player, player.y = player.renderY
    //maybe it is not beutifull but dont change it, whole camera depends on this principle :)
    player.renderX = Game.handler.character.x;
    player.renderY = Game.handler.character.y;

    if(player.y + player.height/2 < (window.innerHeight)/2) {
      map.moveY += (window.innerHeight - Game.handler.heightOfDisplayWindow)/2;
      player.renderY += (window.innerHeight - Game.handler.heightOfDisplayWindow)/2;
    }
    if(player.renderY + player.height/2 > (window.innerHeight)/2){
      var diffrenceBetweenBottomBorderAndYCenterOfPlayer = (TileStatic.height * map.heightOfMap) - (player.height + player.y);
      if(diffrenceBetweenBottomBorderAndYCenterOfPlayer < Game.handler.heightOfDisplayWindow/2){
        var yChangeTemp = (window.innerHeight - Game.handler.heightOfDisplayWindow)/2 + (Game.handler.heightOfDisplayWindow - diffrenceBetweenBottomBorderAndYCenterOfPlayer);
        map.moveY -= (player.y  - yChangeTemp);
        player.renderY -= (player.y  - yChangeTemp);
      }else {

        while(player.renderY + player.height/2>= Math.floor(window.innerHeight/2)){
          map.moveY -= 1;
          player.renderY -= 1;
        }
      }
    }




    if(player.x + player.width/2< (window.innerWidth)/2 ){
      map.moveX += (window.innerWidth - Game.handler.widthOfDisplayWindow)/2;
      player.renderX += (window.innerWidth - Game.handler.widthOfDisplayWindow)/2;
    }
    if(player.renderX + player.width/2 > (window.innerWidth)/2) {
      var diffrenceBetweenRightBorderAndYCenterOfPlayer = (TileStatic.width * map.widthOfMap) - (player.width/2 + player.x);
      if(diffrenceBetweenRightBorderAndYCenterOfPlayer < Game.handler.widthOfDisplayWindow/2){
        var xChangeTemp = (window.innerWidth - Game.handler.widthOfDisplayWindow)/2 + (Game.handler.widthOfDisplayWindow - diffrenceBetweenRightBorderAndYCenterOfPlayer);
        map.moveX -= (player.x - player.width/2 - xChangeTemp);
        player.renderX -= (player.x - player.width/2 - xChangeTemp);
      }else {

        console.log("im in HEREEEE !!!");
        while(player.renderX + player.width/2 - 3 >= window.innerWidth/2 + 1){
          map.moveX -= 1;
          player.renderX -= 1;
        }
      }
  	}
  }


  setWidthAndHeightOfDisplayWindow(){
    if(window.innerWidth< 550){
      Game.handler.widthOfDisplayWindow = window.innerWidth;
    }else{
      Game.handler.widthOfDisplayWindow = 550;
    }

    if(window.innerHeight< 400){
      Game.handler.heightOfDisplayWindow = window.innerHeight;
    }else{
      Game.handler.heightOfDisplayWindow = 400;
    }
  }




  tick(){

    var map = this.handler.currentMap;
  	var player = this.handler.character;

    if(player.currentSprite === player.right && player.renderX + player.width/2 >= (this.handler.gameCanvasesWidth)/2){


      if(player.x + player.width + player.speed <= TileStatic.width * map.widthOfMap - Game.handler.widthOfDisplayWindow/2){

        while(player.renderX + player.width/2 - 3 >= window.innerWidth/2 + 1){
          map.moveX -= 1;
          player.renderX -= 1;
        }

  		}

  	}else if(player.currentSprite === player.left && player.renderX + player.width/2 <= this.handler.gameCanvasesWidth/2){

      if(player.x + player.width/2 >=Game.handler.widthOfDisplayWindow/2){

        while(player.renderX + player.width/2 <= window.innerWidth/2 + 4){
          map.moveX += 1;
          player.renderX += 1;
        }

  		}
    }
  	if(player.currentSprite === player.down && player.renderY >= this.handler.gameCanvasesHeight/2){


      if(player.y + player.height <=(TileStatic.height * map.heightOfMap - Game.handler.heightOfDisplayWindow/2)){

        while(player.renderY >= window.innerHeight/2){
          map.moveY -= 1;
          player.renderY -= 1;
        }

  		}

  	}else if(player.currentSprite === player.up && (player.renderY  <= this.handler.gameCanvasesHeight/2)){

      if(player.y + player.height >=Game.handler.heightOfDisplayWindow/2){

        while(player.renderY + player.height<= window.innerHeight/2){
          map.moveY += 1;
          player.renderY += 1;
        }

  		}

    }
  }
}
