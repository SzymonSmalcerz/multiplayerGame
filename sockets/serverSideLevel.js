
var MapTiles = require("./serverSideLevelTiles");



class Map{
  constructor(name,tilesAndTeleportCoords,players,enemies,statics,socketTable){
    this.name = name;

    this.players = players;
    this.enemies = enemies;
    this.statics = statics;
    this.tableOfRemovedPlayers = {};

    this.socketTable = socketTable;
    this.enemyData = []; //we send this to players !
    this.tilesAndTeleportCoords = tilesAndTeleportCoords;
    this.respawnFrame = 0;
    this.dataToSend = {};
  }

  tick(){

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

    this.tableOfRemovedPlayers = {};

    for (var playerID in tempPlayers) {

        if (!tempPlayers.hasOwnProperty(playerID)) continue;

        this.socketTable[playerID].emit("mapData",{
          playersData
        })

    }

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

}

class FirstMap extends Map{
  constructor(socketTable){
    super("firstMap", MapTiles["firstMap"],{},{},{},socketTable);
  }
}

module.exports = {
  FirstMap
};
