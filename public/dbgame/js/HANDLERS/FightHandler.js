class FightHandler{
  constructor(handler){
    this.handler = handler;
  }

  set(){
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
              button.textContent = "normAttack";
              button.style.position = "absolute";
              button.style.left = handler.enemies[enemyID].renderX + handler.enemies[enemyID].width + "px";
              button.style.top = handler.enemies[enemyID].renderY + handler.enemies[enemyID].height + "px";



              var buttonFastAttack = document.createElement("button");
              buttonFastAttack.setAttribute("id", "buttonFastAttack");
              buttonFastAttack.textContent = "fastAttack";
              buttonFastAttack.style.position = "absolute";
              buttonFastAttack.style.left = handler.enemies[enemyID].renderX + handler.enemies[enemyID].width + "px";
              buttonFastAttack.style.top = handler.enemies[enemyID].renderY + "px";


              handler.parentDiv.appendChild(button);
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
}
