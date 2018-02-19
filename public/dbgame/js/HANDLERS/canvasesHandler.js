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


              var button = document.createElement("button");
              button.setAttribute("id", "buttonNormAttack");
              button.setAttribute("width", "10%");
              button.setAttribute("height", "5%");
              button.textContent = "normAttack";
              handler.parentDiv.appendChild(button);



              var buttonFastAttack = document.createElement("button");
              buttonFastAttack.setAttribute("id", "buttonFastAttack");

              buttonFastAttack.textContent = "fastAttack";
              buttonFastAttack.style.position = "absolute";
              buttonFastAttack.style.left = "200px";
              buttonFastAttack.style.top = "200px";
              console.log(buttonFastAttack.top);
              handler.parentDiv.appendChild(buttonFastAttack);

              button.addEventListener('click',function(event){
                handler.dataToSend.fight = {
                  enemyID : enemyID,
                  typeOfFight: "normal"
                };

                handler.parentDiv.removeChild(buttonFastAttack);
                handler.parentDiv.removeChild(this);
              });

              buttonFastAttack.addEventListener('click',function(event){
                handler.dataToSend.fight = {
                  enemyID : enemyID,
                  typeOfFight: "fast"
                };

                handler.parentDiv.removeChild(button);
                handler.parentDiv.removeChild(this);
              });

              break;

            }
          }

      }

    })
  }

  setWidthAndHeightOfCanvases(){




    this.handler.gameCanvasesWidth = window.innerWidth/2;
    this.handler.gameCanvasesHeight = window.innerHeight/10 * 8;
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
  }
}
