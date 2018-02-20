const {Hit,Hulk,Dragon,Yeti,DarkKnight,MinionSkeleton} = require("./serverSideEnemy");
const Static = require("./serverSideStatic");
const MapTiles = require("./serverSideLevelTiles");
const Helper = require("./Helper");
const Skills = require("./serverSideSkill");
const {CharacterSprites} = require("./Sprites");


class Map{
  constructor(name,tilesAndTeleportCoords,players,enemies,statics,socketTable){
    this.name = name;

    this.players = players;
    this.enemies = enemies;
    this.statics = statics;
    this.tableOfRemovedPlayers = {};
    this.tableOfRemovedEnemies = [];

    this.setEnemies = false;
    this.tableOfSendedEnemies = {};
    this.fight = {};

    this.socketTable = socketTable;
    this.tilesAndTeleportCoords = tilesAndTeleportCoords;
    this.respawnFrame = 0;
    this.dataToSend = {};
  }

  tick(){

    //fightTick
    this.fightTick();

    //add enemies etc
    this.checkForEnemies();

    //prepare data which will be send to client
    this.setEnemiesDataToSend();
    this.setPlayersDataToSend();

    //send data to client
    this.sendData();

    //reset variables and prepare them to next tick()
    this.resetDataToSend();


  }

  sendData(){
    var tempPlayers = this.players;
    for (var playerID in tempPlayers) {

        if (!tempPlayers.hasOwnProperty(playerID)) continue;
        if(this.fight[playerID]){
          this.dataToSend.fightData = this.fight[playerID].dataToSend;
          if(this.fight[playerID].dataToSend.fightResult){
            delete this.fight[playerID];
          }else{
            this.fight[playerID].dataToSend = {};
          }
        }
        this.socketTable[playerID].emit("mapData",this.dataToSend)
        this.dataToSend.fightData = {};


    }
  }

  resetDataToSend(){
    this.dataToSend = {};

    for(var i=0;i<this.tableOfRemovedEnemies.length;i++){
      delete this.tableOfSendedEnemies[this.tableOfRemovedEnemies[i]];
      delete this.enemies[this.tableOfRemovedEnemies[i]];
    }

    this.tableOfRemovedPlayers = {};
    this.tableOfRemovedEnemies = [];
  }

  setEnemiesDataToSend(){


        var enemiesData = {};
        var tempEnemies = this.enemies;
        for (var enemyID in tempEnemies) {

            if (!tempEnemies.hasOwnProperty(enemyID)) continue;

            tempEnemies[enemyID].tick();
            enemiesData[enemyID] = {};
            if(tempEnemies[enemyID].dead){
              this.tableOfRemovedEnemies.push(enemyID);
              enemiesData[enemyID].remove = true;
              continue;
            }

            if(this.setEnemies && this.tableOfSendedEnemies[enemyID]){
              enemiesData[enemyID] = {
                id : enemyID,
                x : tempEnemies[enemyID].x,
                y : tempEnemies[enemyID].y,
                currentSprite : tempEnemies[enemyID].currentSprite
              }
            }else{
              enemiesData[enemyID] = {
                id : enemyID,
                x : tempEnemies[enemyID].x,
                y : tempEnemies[enemyID].y,
                currentSprite : tempEnemies[enemyID].currentSprite,
                fighting : tempEnemies[enemyID].fighting,
                width : tempEnemies[enemyID].width,
                height : tempEnemies[enemyID].height,
                collisionWidth : tempEnemies[enemyID].collisionWidth,
                collisionHeight : tempEnemies[enemyID].collisionHeight,
                health : tempEnemies[enemyID].health,
                maxHealth : tempEnemies[enemyID].maxHealth
              }
              this.tableOfSendedEnemies[enemyID] = true;
            }
        }
        this.setEnemies = true;


        this.dataToSend.enemiesData = enemiesData;

  }

  setPlayersDataToSend(){
    var playersData = {};
    var tempPlayers = this.players;

    for (var playerID in tempPlayers) {

        if (!tempPlayers.hasOwnProperty(playerID)) continue;

        playersData[playerID] = {
          id : playerID,
          x : tempPlayers[playerID].x,
          y : tempPlayers[playerID].y,
          currentSprite : tempPlayers[playerID].currentSprite
        }

        if(!tempPlayers[playerID].setStatics){
          playersData[playerID].statics = this.statics
          tempPlayers[playerID].setStatics = true;
        }

    }

    for (var playerID in this.tableOfRemovedPlayers) {

      if (!this.tableOfRemovedPlayers.hasOwnProperty(playerID)) continue;

      playersData[playerID] = {
        remove : true
      }

    }

    this.dataToSend.playersData = playersData;
  }



    getNextMapData(playerID){

      //MUSIMY ZMIENIC setStatics = false dla playera, ktory zmeinai mape !: o
      var teleportsTable = this.tilesAndTeleportCoords.teleportsTable;
      if(!this.players[playerID]) return {
        error : "player not found"
      }
      var player = this.players[playerID].gameData;
      for(var i =0;i<teleportsTable.length;i++){
        if(player.x + player.speed >= teleportsTable[i].xl && player.x <= teleportsTable[i].xr + player.speed){
          if(player.y + player.speed >= teleportsTable[i].yu && player.y <= teleportsTable[i].yd + player.speed)
            return {
              nextMapName : teleportsTable[i].nextMap,
              playerNewX : teleportsTable[i].playerNewX,
              playerNewY : teleportsTable[i].playerNewY
            }
        }


      }
      return {
        error : "bad coords of player"
      }
    }

    addPlayer(playerData){
      this.players[playerData.id] = playerData;
      this.setEnemies = false;
    }

    removePlayer(playerID){
      delete this.players[playerID];
      this.tableOfRemovedPlayers[playerID] = {playerID:playerID};
    }

    checkForEnemies(){
      //we call this function from tick, and any subclass of Map can fill body of this function for its own purpose
    }

    handleFight(playerID,enemyID,typeOfFight){

      if(this.enemies[enemyID].fighting || this.enemies[enemyID].dead || this.fight[playerID]){
        return;
      }


      var playerCenter = Helper.getCenterOfEntity({
        x : this.players[playerID].x,
        y : this.players[playerID].y,
        width : 32,
        height : 32
      });
      var enemyCenter = Helper.getCenterOfEntity(this.enemies[enemyID]);
      var distance = Helper.getDistanceBetweenTwo2DPoints(playerCenter,enemyCenter);

      if(distance < this.players[playerID].width + this.enemies[enemyID].width/2){

        this.enemies[enemyID].currentFightTick = this.enemies[enemyID].maxFightTick;
        this.enemies[enemyID].currentSprite = this.enemies[enemyID].fightSprite;
        this.players[playerID].currentSprite = CharacterSprites.mainCharacter.idle;
        var enemy = this.enemies[enemyID];

        if(typeOfFight == "fast"){
          this.fight[playerID] = {};
          this.fight[playerID].turn = "player";
          this.fight[playerID].opponentID = enemyID
          this.fight[playerID].currentFightTick = 0;
          this.fight[playerID].maxFightTick = 0;

          this.fight[playerID].dataToSend = {};
          this.fight[playerID].dataToSend.fightInitialization = {};
          this.fight[playerID].dataToSend.fightInitialization.enemyID = enemyID;
          this.fight[playerID].dataToSend.fightInitialization.currentFightTick = this.fight[playerID].currentFightTick;
          this.fight[playerID].dataToSend.fightInitialization.maxFightTick = this.fight[playerID].maxFightTick;
          this.fight[playerID].dataToSend.fightInitialization.idle = enemy.idle;
          this.fight[playerID].dataToSend.fightInitialization.moveLeft = enemy.moveLeft;
          this.fight[playerID].dataToSend.fightInitialization.fightSprite = enemy.fightSprite;
          this.fight[playerID].dataToSend.fightInitialization.moveRight = enemy.moveRight;
          this.fight[playerID].dataToSend.fightInitialization.turn = "player";
        }else{
          this.fight[playerID] = {};
          this.fight[playerID].turn = "player";
          this.fight[playerID].opponentID = enemyID
          this.fight[playerID].currentFightTick = enemy.currentFightTick;
          this.fight[playerID].maxFightTick = enemy.maxFightTick;

          this.fight[playerID].dataToSend = {};
          this.fight[playerID].dataToSend.fightInitialization = {};
          this.fight[playerID].dataToSend.fightInitialization.enemyID = enemyID;
          this.fight[playerID].dataToSend.fightInitialization.currentFightTick = enemy.currentFightTick;
          this.fight[playerID].dataToSend.fightInitialization.maxFightTick = enemy.maxFightTick;
          this.fight[playerID].dataToSend.fightInitialization.idle = enemy.idle;
          this.fight[playerID].dataToSend.fightInitialization.moveLeft = enemy.moveLeft;
          this.fight[playerID].dataToSend.fightInitialization.fightSprite = enemy.fightSprite;
          this.fight[playerID].dataToSend.fightInitialization.moveRight = enemy.moveRight;
          this.fight[playerID].dataToSend.fightInitialization.turn = "player";
        }




        this.enemies[enemyID].fighting = true;
        this.enemies[enemyID].opponentID = playerID;
      }

    }


    fightTick(){

      for (var playerID in this.fight) {

        if (!this.fight.hasOwnProperty(playerID) || this.fight[playerID].endOfFight) continue;

        if(this.fight[playerID].turn == "opponent"){

          this.prepareFightMoveDataToSend(playerID);
          var enemy = this.enemies[this.fight[playerID].opponentID];

          if(this.fight[playerID].currentFightTick<=this.fight[playerID].maxFightTick/2 && !this.fight[playerID].damaged){
            this.players[playerID].health -= enemy.damage;
            this.fight[playerID].damaged = true;
            this.fight[playerID].dataToSend.fightMove.player = this.fight[playerID].dataToSend.fightMove.player || {};
            this.fight[playerID].dataToSend.fightMove.player.health = this.players[playerID].health;
            console.log("player got damage");
          }


          if(this.fight[playerID].currentFightTick <= 0){
            console.log("player turn!");
            this.changeMove(playerID);
          }

        }else if(this.fight[playerID].turn == "none"){


          this.prepareFightMoveDataToSend(playerID);

          if(this.fight[playerID].currentFightTick<=this.fight[playerID].maxFightTick/2 && !this.fight[playerID].damaged){
            var opponent = this.enemies[this.fight[playerID].opponentID];
            opponent.health -= this.fight[playerID].damageFromPlayer;
            console.log("opponent got damage:: " + this.fight[playerID].damageFromPlayer);
            this.fight[playerID].damaged = true;
            this.fight[playerID].damageFromPlayer = 0;
            opponent.tick();
            this.fight[playerID].dataToSend.fightMove.opponent = {};
            this.fight[playerID].dataToSend.fightMove.opponent.health = opponent.health;
          }else if(this.fight[playerID].currentFightTick<=0){
            this.fight[playerID].skill = false;
            var opponent = this.enemies[this.fight[playerID].opponentID];
            if(opponent.dying){
              opponent.dead = true;
              opponent.onDie();
              console.log("opponent is dying");
              this.fight[playerID].dataToSend.win = true;
              this.fight[playerID].endOfFight = true;
            }else{
              this.changeMove(playerID);
            }
          }
        }
      }
    }

    prepareFightMoveDataToSend(playerID){
      this.fight[playerID].currentFightTick -= 1;
      this.fight[playerID].dataToSend = this.fight[playerID].dataToSend || {};
      this.fight[playerID].dataToSend.fightMove = this.fight[playerID].dataToSend.fightMove || {};
      this.fight[playerID].dataToSend.fightMove.currentFightTick = this.fight[playerID].currentFightTick;
    }
    changeMove(playerID){

      this.fight[playerID].dataToSend = this.fight[playerID].dataToSend || {};
      this.fight[playerID].dataToSend.fightMove = this.fight[playerID].dataToSend.fightMove || {};

      if(this.fight[playerID].turn == "none"){
        this.fight[playerID].turn = "opponent";
        this.fight[playerID].dataToSend.fightMove.turn = this.fight[playerID].turn;
      }else if(this.fight[playerID].turn == "player"){
        this.fight[playerID].turn = "none";
        this.fight[playerID].dataToSend.fightMove.turn = "player";
      }else{
        this.fight[playerID].turn = "player";
        this.fight[playerID].dataToSend.fightMove.turn = this.fight[playerID].turn;
      }

      this.fight[playerID].damaged = false;
      this.fight[playerID].currentFightTick = this.fight[playerID].maxFightTick;
      this.fight[playerID].dataToSend.fightMove.currentFightTick = this.fight[playerID].maxFightTick;

    }

    handleFightMove(fightData,playerID){

      if(this.fight[playerID].turn != "player"){
        return;
      }


      var opponent = this.enemies[this.fight[playerID].opponentID];

      console.log(fightData.move);
      if(fightData.move == "normal"){
        this.fight[playerID].damageFromPlayer = this.players[playerID].attack;
        this.fight[playerID].skill = false;
      }else if(fightData.move == "kamehame"){
        this.fight[playerID].damageFromPlayer = Skills.KamehamehaWave.baseDamage * this.players[playerID].level;
        console.log("setting damage from player: " + this.fight[playerID].damageFromPlayer);
        this.fight[playerID].skill = Skills.KamehamehaWave;
      }else{
        return;
      }


      this.changeMove(playerID);
      this.fight[playerID].dataToSend.fightMove.player = this.fight[playerID].dataToSend.player || {};
      this.fight[playerID].dataToSend.fightMove.player.playerSkillData = this.fight[playerID].skill;

    }

    handleFightEnd(playerID,enemyID){
      this.fight[playerID].dataToSend.fightResult = true;
    }

}

class FirstMap extends Map{
  constructor(socketTable){
    var statics = [
                  //  Static.getHouse1Data(500,400),
                  //  Static.getHouse1Data(650,400),
                  //  Static.getHouse1Data(800,400),
                  //  Static.getHouse1Data(950,400),
                  //  Static.getHouse2Data(300,330)
      ];

      for(var i=0;i<250;i++){
        if(Math.random() > 0.5){
          statics.push(Static.getTreeData(Math.floor(Math.random() * 1150 + 50),Math.floor(Math.random() * 1300)));
        }else{
          statics.push(Static.getTree2Data(Math.floor(Math.random() * 1150 + 50),Math.floor(Math.random() * 1300)));
        }
      }
    super("firstMap", MapTiles["firstMap"],{},{},statics,socketTable);
    this.numberOfHulks = 0;
  }

  checkForEnemies(){
    this.respawnFrame += 1;
    if(this.numberOfHulks < 2 && this.respawnFrame > 1){
      this.respawnFrame = 0;
      var x = Math.floor(Math.random() * 150 + 20);
      var y = Math.floor(Math.random() * 100 + 400);
      var tempID = "hu" + Math.floor(Math.random() * 1000000) + "fm";
      var here = this;
      this.enemies[tempID] = new Hit(tempID,x,y,function(){
        here.numberOfHulks -= 1;
      });
      this.numberOfHulks += 1;
      console.log("new enemy was born !: o");

    }
  }
}

module.exports = {
  FirstMap
};
