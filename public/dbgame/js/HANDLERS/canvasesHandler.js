class CanvasesHandler{
  constructor(handler){
    this.handler = handler;
  }

  setCanvases(){

    //collision canvas
    this.handler.collisionCanvas = document.getElementById("ccoll");
    if(!this.handler.collisionCanvas){

      this.handler.collisionCanvas = document.createElement("canvas");
      this.handler.collisionCanvas.setAttribute("id", "ccoll");
    }

    this.handler.collisionCtx = this.handler.collisionCanvas.getContext('2d');


    //main canvas
    this.handler.canvas = document.getElementById("cnorm");
    if(!this.handler.canvas){

      this.handler.canvas = document.createElement("canvas");
      this.handler.canvas.setAttribute("id", "cnorm");
    }

    this.handler.ctx = this.handler.canvas.getContext('2d');
    // this.handler.ctx.imageSmoothingEnabled = false;
    // this.handler.ctx.oImageSmoothingEnabled = false;
    // this.handler.ctx.webkitImageSmoothingEnabled = false;

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
            console.log("clicked on enemy !");
            var distance = Helper.getDistanceBetweenTwo2DPoints(playerCenter,enemyCenter);

            console.log("distance: " + distance);
            console.log("handler.character.width: " + handler.character.width);
            console.log("handler.enemies[enemyID].width/2: " + handler.enemies[enemyID].width/2);
            if(distance < handler.character.width + handler.enemies[enemyID].width/2){
              console.log("start warrr !!!!");
              handler.dataToSend.fight = {
                enemyID : enemyID
              };
            }
          }



      }

    });

    document.body.appendChild(this.handler.collisionCanvas);
    document.body.appendChild(this.handler.canvas);
    // document.body.appendChild(this.handler.collisionCanvas)

    this.setWidthAndHeightOfCanvases();
  }

  setWidthAndHeightOfCanvases(){
    // this.handler.canvas.setAttribute("left", String(-window.innerWidth/4));
    // this.handler.collisionCanvas.setAttribute("left", String(-window.innerWidth/4));
    // this.handler.canvas.setAttribute("top", String(-window.innerHeight/10));
    // this.handler.collisionCanvas.setAttribute("top", String(-window.innerHeight/10));


    this.handler.canvas.setAttribute("right", "25%");
    this.handler.canvas.setAttribute("top", "10%");
    this.handler.canvas.setAttribute("width", "50%");
    this.handler.collisionCanvas.setAttribute("right", "25%");
    this.handler.collisionCanvas.setAttribute("top", "10%");
    this.handler.collisionCanvas.setAttribute("width", "50%");

    this.handler.gameCanvasesWidth = window.innerWidth/2;
    this.handler.gameCanvasesHeight = window.innerHeight/10 * 8;
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
    this.handler.collisionCanvas.width = this.handler.gameCanvasesWidth;
    this.handler.collisionCanvas.height = this.handler.gameCanvasesHeight;
  }
}
