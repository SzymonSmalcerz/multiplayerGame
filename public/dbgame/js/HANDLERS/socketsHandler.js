class SocketHandler{

  constructor(handler){
    this.handler = handler;
  }

  setSockets(){

    var handler = this.handler;
    var tableOfPlayersIDToRemove = [];

    socket.on("mapData",function(data){

      for (var playerID in data.playersData) {

        if (!data.playersData.hasOwnProperty(playerID)) continue;



        if(data.playersData[playerID].remove){
          tableOfPlayersIDToRemove.push(playerID);
          continue;
        }

        if(handler.character.id == playerID){
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
  }

}
