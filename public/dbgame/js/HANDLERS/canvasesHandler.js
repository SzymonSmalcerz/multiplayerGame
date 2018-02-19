 class CanvasesHandler{
  constructor(handler){
    this.handler = handler;
  }

  setCanvases(){

    //parent dib
    this.handler.parentDiv = document.getElementById("pDiv");
    if(!this.handler.parentDiv){

      this.handler.parentDiv = document.createElement("div");
      this.handler.parentDiv.setAttribute("id", "pDiv");
    }
    document.body.appendChild(this.handler.parentDiv);

    //main canvas
    this.handler.canvas = document.getElementById("cnorm");
    if(!this.handler.canvas){

      this.handler.canvas = document.createElement("canvas");
      this.handler.canvas.setAttribute("id", "cnorm");
    }

    this.handler.ctx = this.handler.canvas.getContext('2d');
    this.handler.ctx.imageSmoothingEnabled = true;
    this.handler.ctx.oImageSmoothingEnabled = true;
    this.handler.ctx.webkitImageSmoothingEnabled = true;



    this.handler.parentDiv.appendChild(this.handler.canvas);

    this.setWidthAndHeightOfCanvases();
    var handler = this.handler;
    this.handler.canvas.addEventListener('click', function(event) {


      var playerCenter = Helper.getCenterOfEntity(handler.character);

      for (var enemyID in handler.enemies) {

          if (!handler.enemies.hasOwnProperty(enemyID)) continue;

          var enemyCenter = Helper.getCenterOfEntity(handler.enemies[enemyID]);
          var clickPoint = {
            renderX : event.offsetX,
            renderY : event.offsetY
          };

        if(Helper.getDistanceBetweenTwo2DPoints(clickPoint,enemyCenter) < handler.enemies[enemyID].collisionWidth){
            var distance = Helper.getDistanceBetweenTwo2DPoints(playerCenter,enemyCenter);


            if(distance < handler.character.width + handler.enemies[enemyID].width/2){
              handler.dataToSend.fight = {
                enemyID : enemyID
              };

              var button = document.createElement("button");
              button.setAttribute("id", "button1");
              button.setAttribute("width", "100px");
              button.setAttribute("height", "100px");
              button.setAttribute("position", "absolute");
              button.setAttribute("right", "25%");
              button.setAttribute("top", "25%");
              handler.parentDiv.appendChild(button);
            }

            break;
          }



      }

    });
  }

  setWidthAndHeightOfCanvases(){

    


    this.handler.gameCanvasesWidth = window.innerWidth/2;
    this.handler.gameCanvasesHeight = window.innerHeight/10 * 8;
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
  }
}
