class FightHandler{
  constructor(handler){
    this.handler = handler;
    this.normalAttackIcon = undefined;
    this.kamehamehaIcon = undefined;
    this.mainCharacterIcon = undefined;
    this.opponentIcon = undefined;
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
                handler.parentDiv.removeChild(button);
                handler.parentDiv.removeChild(this);
              });

              break;

            }
          }

      }

    })
  }

  fillFightMoveDataToSend(move,event){
    this.handler.dataToSend.fightMove = {
      move
    }
    this.handler.character.hasJustMadeMoveInFight = true;
    if(event){
      event.stopPropagation();
    }
  }

  createFightSkillsButtons(){

    this.mainCharacterIcon = document.createElement("img");
    this.mainCharacterIcon.setAttribute("class", "attackIcons");
    this.mainCharacterIcon.setAttribute("src", this.handler.character.sprite.src);
    this.mainCharacterIcon.style.objectPosition = "0 0";
    this.mainCharacterIcon.style.width = "32px";
    this.mainCharacterIcon.style.height = "32px";
    this.mainCharacterIcon.style.position = "absolute";
    this.mainCharacterIcon.style.visibility = "hidden";


    this.opponentIcon = document.createElement("img");
    this.opponentIcon.setAttribute("class", "attackIcons");
    this.opponentIcon.style.objectPosition = "0 0";
    this.opponentIcon.style.width = "32px";
    this.opponentIcon.style.height = "32px";
    this.opponentIcon.style.position = "absolute";
    this.opponentIcon.style.visibility = "hidden";

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

    var that = this;
    this.normalAttackIcon.addEventListener('click',function(event){that.fillFightMoveDataToSend("normal",event)});
    this.kamehamehaIcon.addEventListener('click',function(event){that.fillFightMoveDataToSend("kamehame",event)});

    this.handler.parentDiv.appendChild(this.normalAttackIcon);
    this.handler.parentDiv.appendChild(this.kamehamehaIcon);
    this.handler.parentDiv.appendChild(this.mainCharacterIcon);
    this.handler.parentDiv.appendChild(this.opponentIcon);
  }

  initializeFight(data){
    var handler = this.handler;
    handler.drawer.removeAllItems();
    handler.character.isFighting = true;
    handler.character.idle = handler.character.idleDown;
    handler.character.currentSprite = handler.character.idle;
    handler.character.opponent = handler.enemies[data.enemyID];
    handler.fightData = {};
    handler.fightData.currentFightTick = data.currentFightTick;
    handler.fightData.maxFightTick = data.maxFightTick;
    handler.fightData.idle = data.idle;
    handler.fightData.moveLeft = data.moveLeft;
    handler.fightData.fightSprite = data.fightSprite;
    handler.fightData.moveRight = data.moveRight;
    handler.fightData.turn = data.turn;

    this.setFightIcons();
  }

  handleFightMove(fightData){
    var handler = this.handler;
    if(fightData.turn){
      handler.fightData.turn = fightData.turn;
    }

    handler.fightData.currentFightTick = fightData.currentFightTick;

    if(fightData.player){
      if(fightData.player.health){
        handler.character.health = fightData.player.health;
      }
      if(fightData.player.playerSkillData){
        handler.fightData.playerSkillData = fightData.player.playerSkillData;
        handler.fightData.skill = new Skill(fightData.player.playerSkillData.frameTable,handler);
        handler.fightData.explosion = new Skill(fightData.player.playerSkillData.detonationTable,handler);
        console.log("changed explosion :c");
        handler.character.isUsingSkill = true;
      }
    }

    if(fightData.opponent){
      handler.character.opponent.health = fightData.opponent.health;
    }
  }

  handleWin(){
    this.handler.character.isUsingSkill = false;
    this.handler.drawer.drawWinDialog();
    this.handler.fightData.maxFightTick = 0;
  }

  handleEndOfFigh(){
    this.handler.character.isFighting = false;
    this.handler.character.isUsingSkill = false;
    this.handler.character.opponent = {};
    this.handler.character.hasJustMadeMoveInFight = false;
    this.handler.fightData = {};
    this.setFightIcons();
    Game.onResize();
  }

  setFightIcons(){
    if(this.handler.character.isFighting){

      if(this.handler.character.opponent){
        this.opponentIcon.setAttribute("src", this.handler.character.opponent.sprite.src);
      }

      if(this.handler.windowSize == "small"){//window.innerWidt < 600 px

        this.normalAttackIcon.style.left = "74px";
        this.normalAttackIcon.style.top = this.handler.gameCanvasesHeight - 74 + "px";
        this.kamehamehaIcon.style.left = "148px";
        this.kamehamehaIcon.style.top = this.handler.gameCanvasesHeight - 74 + "px";


      }else{

        var leftCorner = this.handler.gameCanvasesWidth/5;
        var bottomCorner =  ((9 * this.handler.gameCanvasesHeight/10) - 64);
        this.normalAttackIcon.style.left = leftCorner + "px";
        this.kamehamehaIcon.style.left = leftCorner + 100 + "px";

        this.normalAttackIcon.style.top = bottomCorner + "px";
        this.kamehamehaIcon.style.top = bottomCorner + "px";

      }

      this.mainCharacterIcon.style.left = "10px";
      this.mainCharacterIcon.style.top = "10px";
      this.opponentIcon.style.right = "10px";
      this.opponentIcon.style.top = "10px";

        this.normalAttackIcon.style.visibility = "visible";
        this.kamehamehaIcon.style.visibility = "visible";
        this.mainCharacterIcon.style.visibility = "visible";
        this.opponentIcon.style.visibility = "visible";
    }else{
      this.normalAttackIcon.style.visibility = "hidden";
      this.kamehamehaIcon.style.visibility = "hidden";
      this.mainCharacterIcon.style.visibility = "hidden";
      this.opponentIcon.style.visibility = "hidden";
    }
  }

  onResize(){
    this.setFightIcons();
  }
}
