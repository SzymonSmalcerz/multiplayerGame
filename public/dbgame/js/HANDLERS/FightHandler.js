class FightHandler{
  constructor(handler){
    this.handler = handler;
    this.normalAttackIcon = undefined;
    this.kamehamehaIcon = undefined;
  }

  set(){
    var handler = this.handler;
    this.createFightSkillsButtons();
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
                event.stopPropagation();
                handler.parentDiv.removeChild(buttonFastAttack);
                handler.parentDiv.removeChild(this);
              });

              buttonFastAttack.addEventListener('click',function(event){
                handler.dataToSend.fight = {
                  enemyID : enemyID,
                  typeOfFight: "fast"
                };
                event.stopPropagation();
                handler.parentDiv.removeChild(button);
                handler.parentDiv.removeChild(this);
              });

              break;

            }
          }

      }

    })
  }

  createFightSkillsButtons(){
    this.normalAttackIcon = document.createElement("img");
    this.normalAttackIcon.setAttribute("class", "attackIcons");
    this.normalAttackIcon.setAttribute("src", "dbgame/js/SPRITES/fightSkills.png");
    this.normalAttackIcon.style.objectPosition = "0 0";
    this.normalAttackIcon.style.position = "absolute";
    this.normalAttackIcon.style.visibility = "hidden";

    this.kamehamehaIcon = document.createElement("img");
    this.kamehamehaIcon.setAttribute("class", "attackIcons");
    this.kamehamehaIcon.setAttribute("src", "dbgame/js/SPRITES/fightSkills.png");
    this.kamehamehaIcon.style.objectPosition = "-64px 0";
    this.kamehamehaIcon.style.position = "absolute";
    this.kamehamehaIcon.style.visibility = "hidden";

    var handler = this.handler;
    this.normalAttackIcon.addEventListener('click',function(event){
      handler.dataToSend.fightMove = {
        move : "normal"
      }
      handler.character.hasJustMadeMoveInFight = true;
      event.stopPropagation();
    });

    this.kamehamehaIcon.addEventListener('click',function(event){
      handler.dataToSend.fightMove = {
        move : "kamehame"
      }
      handler.character.hasJustMadeMoveInFight = true;
      event.stopPropagation();
    });

    this.handler.parentDiv.appendChild(this.normalAttackIcon);
    this.handler.parentDiv.appendChild(this.kamehamehaIcon);
  }

  tick(){
    if(this.handler.character.isFighting){
      this.normalAttackIcon.style.visibility = "visible";
      this.normalAttackIcon.style.left = this.handler.gameCanvasesWidth/10 + "px";
      this.normalAttackIcon.style.top = this.handler.gameCanvasesHeight - 74 + "px";
      this.kamehamehaIcon.style.visibility = "visible";
      this.kamehamehaIcon.style.left = this.handler.gameCanvasesWidth/10 + 74 + "px";
      this.kamehamehaIcon.style.top = this.handler.gameCanvasesHeight - 74 + "px";
    }else{
      this.normalAttackIcon.style.visibility = "hidden";
      this.kamehamehaIcon.style.visibility = "hidden";
    }
  }
}
