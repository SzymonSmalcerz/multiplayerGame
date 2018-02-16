
var User = require("../database/models/userModel");
var Maps = require("./serverSideLevel");
var serverStarted = false;
var socketsOfPlayers = {};


var fps = 10;
var lastTime = 0;
var lastTimeForCheckingIfPlayersAreActive = 0;
//MAPS
var maps = {};
var findMapNameByPlayerId = {};
var firstMap = new Maps.FirstMap(socketsOfPlayers);

maps[firstMap.name] = firstMap;

//PLAYERS
var players = {};





var socketHandler = (socket,io) => {

//BEGINNING OF INITIALIZATION PHASE

  socket.on("getGameData", async (object) => {

    console.log("got request to get game data from player with id: " + object.id);
    if(players[object.id]){
      return;
    }
    try {
      if (object.id.match(/^[0-9a-fA-F]{24}$/)) {
  // Yes, it's a valid ObjectId, proceed with `findById` call.
      }else{
        console.log("doesnt match :C");
        throw "id is not valid, doesn't mach ObjectID from monbodb";
      }
      var user = await User.findById(object.id);
      if(!user){
        console.log("shouldn't happen but user not found in socket.on(getGameData) sockets.js");
      }else{
        var characterData = {};
        //  = levels[user.currentMapName].getcharacterData();
        characterData.x = user.x;
        characterData.y = user.y;
        characterData.experience = user.experience;
        characterData.requiredExperience = 1000;
        characterData.speed = 10;
        characterData.level = user.level;
        characterData.maxHealth = 10000;
        characterData.health = 5000;
        characterData.maxMana = 1000;
        characterData.mana = 500;
        characterData.attack = 50;
        characterData.id = object.id;
        characterData.active = true;
        characterData.width = 32;
        characterData.height = 32;

        findMapNameByPlayerId[object.id] = user.currentMapName;
        socketsOfPlayers[object.id] = socket;
        players[object.id] = characterData;

        socket.emit("initialData",{
          characterData : characterData,
          mapData : maps[user.currentMapName].tilesAndTeleportCoords
        });
      }

    }catch(error){
      console.log("SHIIIIT HAPPEND ! : " + error);
      socket.emit("error", {error});
    }
  })

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  socket.on("initialized",(data) => {
    maps[findMapNameByPlayerId[data.id]].addPlayer(players[data.id]);
  })

//END OF INITIALIZATION PHASE

//BEGINNING OF DATA EXCHANGE SERVER -> CLIENT
var sendToUserData = (time) => {
  requestAnimationFrame(sendToUserData);
  if(time - lastTime > 1000/fps){
    lastTime = time;
    for(var mapID in maps){
      if(!maps.hasOwnProperty(mapID)) continue;
      maps[mapID].tick();
    }

  }
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

socket.on("data",(data) => {
  if(!players[data.character.id]){
    return;
  }
  players[data.character.id].x = data.character.x;
  players[data.character.id].y = data.character.y;
  players[data.character.id].currentSprite = data.character.currentSprite;

  if(data.fight){
    maps[findMapNameByPlayerId[data.character.id]].handleFight(data.character.id,data.fight.enemyID);
  }

  if(data.fightMove){
    maps[findMapNameByPlayerId[data.character.id]].handleFightMove(data.fightMove,data.character.id);
  }
});

//END OF DATA EXCHANGE SERVER -> CLIENT

var checkForConnection = (time) => {
  requestAnimationFrame(checkForConnection);




  if(time - lastTimeForCheckingIfPlayersAreActive > 10000){//every 10 sec we check for connection
    lastTimeForCheckingIfPlayersAreActive = time;
    for (var playerID in players) {
        // skip loop if the property is from prototype
        if (!players.hasOwnProperty(playerID)) continue;
        if(!players[playerID]) continue;
        players[playerID].active = false;
    }
    io.emit("checkForConnection");
    setTimeout(async function(){
      for (var playerID in players) {
          // skip loop if the property is from prototype
          if (!players.hasOwnProperty(playerID)) continue;



          if(!players[playerID]) continue;
          var player = players[playerID];
          if(!players[playerID].active){


            try {
              var player = players[playerID];
              var user = await User.findById(playerID);
              user.x = player.x;
              user.y = player.y;
              console.log(player.x + " X");
              console.log(player.y + " Y");
              user.level = player.level;
              user.experience = player.experience;
              user.currentMapName = findMapNameByPlayerId[player.id];
              await user.save();

              console.log("saved statis of :", user._id);
            }catch(e){
              console.log(e);
            }

            delete socketsOfPlayers[playerID];
            delete players[playerID];
            delete maps[findMapNameByPlayerId[playerID]].removePlayer(playerID);
            delete findMapNameByPlayerId[playerID];

          }
      }
    }, 5000);


  }
};

socket.on("checkedConnection", (playerData) => {
  if(players[playerData.id])
    players[playerData.id].active = true;
})








  if(!serverStarted){
    sendToUserData();
    checkForConnection();
    serverStarted = true;
  }
}



//polyfill to requestAnimationFrame
(function() {
    var lastTime = 0;

    if (!global.requestAnimationFrame)
        global.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!global.cancelAnimationFrame)
        global.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



module.exports = {
  socketHandler
};
