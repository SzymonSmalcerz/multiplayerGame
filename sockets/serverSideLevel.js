const {Hit,Hulk,Dragon,Yeti,DarkKnight,MinionSkeleton} = require("./serverSideEnemy");
const MapTiles = require("./serverSideLevelTiles");



class Map{
  constructor(name,tilesAndTeleportCoords,players,enemies,statics,socketTable){
    this.name = name;

    this.players = players;
    this.enemies = enemies;
    this.statics = statics;
    this.tableOfRemovedPlayers = {};
    this.tableOfRemovedEnemies = [];

    this.socketTable = socketTable;
    this.tilesAndTeleportCoords = tilesAndTeleportCoords;
    this.respawnFrame = 0;
    this.dataToSend = {};
  }

  tick(){

    this.checkForEnemies();

    var enemiesData = {};
    var tempEnemies = this.enemies;
    for (var enemyID in tempEnemies) {

        if (!tempEnemies.hasOwnProperty(enemyID)) continue;

        tempEnemies[enemyID].tick();

        if(tempEnemies[enemyID].dead){
          this.tableOfRemovedEnemies.push(enemyID);
          enemiesData[enemyID].remove = true;
          continue;
        }

        if(tempEnemies[enemyID].set){
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
            health : tempEnemies[enemyID].health
          }
          tempEnemies[enemyID].set = true;
        }


    }

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

    }

    for (var playerID in this.tableOfRemovedPlayers) {

      if (!this.tableOfRemovedPlayers.hasOwnProperty(playerID)) continue;

      playersData[playerID] = {
        remove : true
      }

    }


    for (var playerID in tempPlayers) {

        if (!tempPlayers.hasOwnProperty(playerID)) continue;

        this.socketTable[playerID].emit("mapData",{
          playersData,
          enemiesData
        })

    }

    for(var i=0;i<this.tableOfRemovedEnemies.length;i++){
      delete this.enemies[tableOfRemovedEnemies[i]];
    }

    this.tableOfRemovedPlayers = {};
    this.tableOfRemovedEnemies = [];


  }



    getNextMapData(playerID){
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
    }

    removePlayer(playerID){
      delete this.players[playerID];
      this.tableOfRemovedPlayers[playerID] = {playerID:playerID};
    }

    checkForEnemies(){
      //we call this function from tick, and any subclass of Map can fill body of this function for its own purpose
    }

}

class FirstMap extends Map{
  constructor(socketTable){
    super("firstMap", MapTiles["firstMap"],{},{},{},socketTable);
    this.numberOfHulks = 0;
  }

  checkForEnemies(){
    this.respawnFrame += 1;
    if(this.numberOfHulks < 5 && this.respawnFrame > 10){
      this.respawnFrame = 0;
      var x = Math.floor(Math.random() * 200 + 200);
      var y = Math.floor(Math.random() * 200 + 200);
      var tempID = "hu" + Math.floor(Math.random() * 1000000) + "fm";
      var here = this;
      this.enemies[tempID] = new Hulk(tempID,x,y,function(){
        here.numberOfHulks -= 1;
      });
      this.numberOfHulks += 1;

    }
  }
}

module.exports = {
  FirstMap
};
