class SocketHandler{

  constructor(handler){
    this.handler = handler;
  }

  setSockets(){

    var handler = this.handler;
    var tableOfPlayersIDToRemove = [];
    var tableOfEnemiesIDToRemove = [];

    socket.on("mapData",function(data){



      for (var playerID in data.playersData) {

        if (!data.playersData.hasOwnProperty(playerID)) continue;



        if(data.playersData[playerID].remove){
          tableOfPlayersIDToRemove.push(playerID);
          continue;
        }

        if(handler.character.id == playerID){

          if(data.fight && data.fight[playerID]){
            handler.character.isFighting = true;
            handler.character.opponent = handler.enemies[data.fight[playerID].enemyID];
          }

          if(data.fightResult){
            handler.character.isFighting = false;
            handler.character.opponent = {};
            Game.onResize();
          }

          if(data.playersData[playerID].statics){
            handler.statics = [];
            console.log("GOT STATICS DATA");
            //handler.statics = data.playersData[playerID].statics;
            var staticData = data.playersData[playerID].statics;
            for(var i=0;i<staticData.length;i++){
              var staticEntity;

                if(staticData[i].typeOfSprite == "32"){
                  staticEntity = new StaticEntity32(handler,staticData[i]);
                }else{
                  staticEntity = new StaticEntity(handler,staticData[i]);
                }


              // staticEntity.renderX += handler.currentMap.moveX;
              // staticEntity.renderY += handler.currentMap.moveY;
              handler.statics.push(staticEntity);
            }
          }
          continue;
        }

        if(!handler.players[playerID]){
          handler.players[playerID] = new OtherPlayer(playerID,handler,data.playersData[playerID].x,data.playersData[playerID].y)
        }

        handler.players[playerID].x = data.playersData[playerID].x;
        handler.players[playerID].y = data.playersData[playerID].y;
        handler.players[playerID].currentSprite = data.playersData[playerID].currentSprite;

      }

      for(var i=0;i<tableOfPlayersIDToRemove.length;i++){
        delete handler.players[tableOfPlayersIDToRemove[i]];
      }

      tableOfPlayersIDToRemove = [];


      for (var enemyID in data.enemiesData) {

        if (!data.enemiesData.hasOwnProperty(enemyID)) continue;



        if(data.enemiesData[enemyID].remove){
          tableOfEnemiesIDToRemove.push(enemyID);
          continue;
        }

        if(!handler.enemies[enemyID]){
          handler.enemies[enemyID] = new Hulk(handler,enemyID,data.enemiesData[enemyID].x,data.enemiesData[enemyID].y)
        }

        handler.enemies[enemyID].x = data.enemiesData[enemyID].x;
        handler.enemies[enemyID].y = data.enemiesData[enemyID].y;
        handler.enemies[enemyID].currentSprite = data.enemiesData[enemyID].currentSprite;

        if(data.enemiesData[enemyID].width){
          handler.enemies[enemyID].width = data.enemiesData[enemyID].width;
          handler.enemies[enemyID].height = data.enemiesData[enemyID].height;
          handler.enemies[enemyID].collisionWidth = data.enemiesData[enemyID].collisionWidth;
          handler.enemies[enemyID].collisionHeight = data.enemiesData[enemyID].collisionHeight;
          handler.enemies[enemyID].health = data.enemiesData[enemyID].health;
        }


      }

      for(var i=0;i<tableOfEnemiesIDToRemove.length;i++){
        delete handler.enemies[tableOfEnemiesIDToRemove[i]];
      }

      tableOfEnemiesIDToRemove = [];
    })



    socket.on("checkForConnection", function() {
      socket.emit("checkedConnection", {
        id : handler.character.id
      } );
    })

  }

  emitData(){
    var handler = this.handler;
    socket.emit("data",handler.dataToSend);
    handler.dataToSend = {};
  }

}
