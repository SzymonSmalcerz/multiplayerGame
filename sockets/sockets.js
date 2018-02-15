
var User = require("../database/models/userModel");
var Maps = require("./serverSideLevel");

var socketsOfPlayers = {};


//MAPS
var maps = {};
var firstMap = new Maps.FirstMap(socketsOfPlayers);

maps[firstMap.name] = firstMap;

//PLAYERS
var players = {};





var socketHandler = (socket,io) => {
  socket.on("getGameData", async (object) => {

    console.log("got request to get game data from player with id: " + object.id);

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
}


module.exports = {
  socketHandler
};
