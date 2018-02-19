var socket = socket || io();
window.onload = function(){

  socket.on('connect', function () {
    console.log('Connected to server');
    socket.emit("getGameData",{
      id : playerID
    });
  });

  socket.on('initialData',function(data){
    Game.createMainCharacter(data.characterData);
    Game.setCurrentMap(data.mapData);
  });
};





const Game = {
  handler : {
    parentDiv : undefined,
		canvas : undefined,
		ctx : undefined,
		currentMap : undefined,
		camera : undefined,
    players: {},
    enemies : {},
    statics : [],
    tiles : {},
    character : undefined,
    gameCanvasesWidth : undefined,
    gameCanvasesHeight : undefined,
    drawer : undefined,
    shortestPath : undefined,
    socketHandler : undefined,
    canvasesHandler : undefined,
    dataToSend : {},
    fightData : {},


		//technicals
    scale : 1,
		fps : 12,
		lastTime : 0,
		globalTickCounter : 0, //used only for animations for tiles (nor for mobs)
		menu : {}
	},


  init : function(){


    this.handler.socketHandler = new SocketHandler(this.handler);
    this.handler.socketHandler.setSockets();
    this.handler.camera = new Camera(this.handler);

    this.handler.camera.handleMoveXandMoveY();
    this.handleTilesLevelsAndOther();


    this.handler.drawer = new Drawer(this.handler);

    socket.emit("initialized", {id : Game.handler.character.id});
    setTimeout(Game.mainLoop,1000);

  },
  mainLoop : function(time){

		requestAnimationFrame(Game.mainLoop);


		if(time - Game.handler.lastTime > 1000/Game.handler.fps){

      Game.handler.lastTime = time;
      Game.handler.camera.tick();
      Game.handler.currentMap.tick();
      Game.handler.character.tick();
      Game.handler.globalTickCounter += 1;
      Game.handler.socketHandler.emitData();
      Game.handler.dataToSend = {};

		}
	},
  handleTilesLevelsAndOther : function(){
    this.handler.tiles.G = new Tile(this.handler,0,0);
    this.handler.tiles.D = new Tile(this.handler,1,0);
    this.handler.tiles.S = new Tile(this.handler,5,0);
    this.handler.tiles.L = new Tile(this.handler,6,0);
    this.handler.tiles.P = new Tile(this.handler,7,0);
    this.handler.tiles.WALL = new Tile(this.handler,0,1);
    this.handler.tiles.W = new AnimatedTile(this.handler,[{x:2,y:0},{x:3,y:0},{x:4,y:0}]);

  },
  createMainCharacter : function(playerData) {
    this.handler.character = new MainCharacter(this.handler, playerData);
  },
  setCurrentMap : function(mapData){
    //creating cavas is needed for map to exist so we must create canvasses before creating map
    this.handler.canvasesHandler = new CanvasesHandler(this.handler);
    this.handler.canvasesHandler.setCanvases();
    this.handler.currentMap = new Map(this.handler, mapData);
    Game.init();
  },
  onResize(){

    if(Game.handler.canvasesHandler){
      Game.handler.canvasesHandler.setWidthAndHeightOfCanvases();
      Game.handler.camera.handleMoveXandMoveY();
      Game.handler.currentMap.onResize();
    }

  }

}


window.addEventListener("resize", Game.onResize);
