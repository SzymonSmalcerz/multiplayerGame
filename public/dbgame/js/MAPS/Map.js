class Map{
  //constructor(tilesTable,teleportsCoords,maxNumOfEnemies){
  constructor(handler,dataFromServer){
    this.handler = handler;


    this.specialTiles = [];
  	this.allEntities = [];


    this.leftBorderOfDisplayWindow = 0;
    this.rightBorderOfDisplayWindow = handler.gameCanvasesWidth;
    this.topBorderOfDisplayWindow = 0;
    this.bottomBorderOfDisplayWindow = handler.gameCanvasesHeight;


    Object.defineProperty(this, "tiles", {
      value : dataFromServer.table,
      writable : false,
      enumerable : true,
      configurable : false
    })
    Object.freeze(this.tiles);

    Object.defineProperty(this, "maxNumOfEnemies", {
      value : dataFromServer.maxNumOfEnemies || 50,
      writable : false,
      enumerable : true,
      configurable : false
    })
    Object.freeze(this.maxNumOfEnemies);

    Object.defineProperty(this, "teleportsTable", {
      value : dataFromServer.teleportsTable,
      writable : false,
      enumerable : true,
      configurable : false
    })
    Object.freeze(this.teleportsTable);

  	this.moveX = 0; // this two variables used onlyt to "move" tiles while moving player
  	this.moveY = 0; //

    //just how many tiles in verticly and horozontally
  	this.widthOfMap = this.tiles[0].length;	//not scaled !!!!
  	this.heightOfMap = this.tiles.length;

    console.log("map has been created")
  }



  tick(){
    this.draw(); //first draw then tick !!! otherwise not working
    // for(var i =0;i<this.teleportsTable.length;i++){
    //
    //   if(this.handler.character.x >= this.teleportsTable[i].xl && this.handler.character.x <= this.teleportsTable[i].xr){
    //     if(this.handler.character.y >= this.teleportsTable[i].yu && this.handler.character.y <= this.teleportsTable[i].yd){}
    //     //TODO CHANGE MAP TODO
    //       // socket.emit("changeMap", { idOfPlayer : this.handler.character.id});
    //     //TODO CHANGE MAP TODO
    //
    //   }
    // }
  };



  //draw ^^
  draw(){



    //32 is the width and height of tile rectangle, we can assume that it wont change, so we will not
    //stretch for this value to Tile.js file but we will statically type in 32 (faster loading)
    var specialTilesTemp = [];
    var tempTileContainer;
  	for(var i = 0;i < this.tiles.length; i++){
  		for(var j = 0;j < this.tiles[i].length; j++){
  			if(  (j*32 + this.moveX) >= this.leftBorderOfDisplayWindow - 32
          && (j*32 + this.moveX) <= this.rightBorderOfDisplayWindow + 32
  			  && (i*32 + this.moveY) >= this.topBorderOfDisplayWindow - 32
          && (i*32 + this.moveY) <= this.bottomBorderOfDisplayWindow + 32){
                tempTileContainer = this.handler.tiles[this.tiles[i][j]];
  				      tempTileContainer.draw(j*32 + this.moveX, i*32 + this.moveY);
                if(tempTileContainer.special){
                  specialTilesTemp.push({
                    width : tempTileContainer.width,
                    height : tempTileContainer.height,
                    collisionWidth : tempTileContainer.collisionWidth,
                    collisionHeight : tempTileContainer.collisionHeight,
                    renderX : j*32 + this.moveX,
                    renderY :  i*32 + this.moveY
                  });
                }
  			}

  		}
  	}
    this.specialTiles = specialTilesTemp;


    this.handleEntities();//description of handleEntities above function declaration

  	for(var i=0;i<this.allEntities.length;i++){
      var entityTemp = this.allEntities[i];
  		if(entityTemp){
          entityTemp.draw();
  		}

  	};

    //drawing wall around our display screen
    var tempYPosOfWall = this.topBorderOfDisplayWindow - 32;
    while(tempYPosOfWall - 1 < this.bottomBorderOfDisplayWindow + 32){
      Game.handler.tiles.WALL.draw(this.rightBorderOfDisplayWindow + 30, tempYPosOfWall);
      Game.handler.tiles.WALL.draw(this.leftBorderOfDisplayWindow - 30, tempYPosOfWall);
      tempYPosOfWall += 30;
    }

    var tempXPosOfWall = this.leftBorderOfDisplayWindow - 32;
    while(tempXPosOfWall - 1 < this.rightBorderOfDisplayWindow + 32){
      Game.handler.tiles.WALL.draw(tempXPosOfWall, this.topBorderOfDisplayWindow - 30);
      Game.handler.tiles.WALL.draw(tempXPosOfWall, this.bottomBorderOfDisplayWindow + 30);

      tempXPosOfWall += 30;
    }


  }


  //this function just adds all of entities into one table and then sorts this table
  //this one SORTED table of entities is usefull when drawing map
  handleEntities(){

    var tempArrayOfEntities = [];
    var tempArrayOfEnemies = [];
    var tempArrayOfPlayers = [];
    var tempArrayOfStatics = [];
    var entityTemp;

    for(var playerID in this.handler.players){
      if (!this.handler.players.hasOwnProperty(playerID)) continue;
      var player = this.handler.players[playerID];
      tempArrayOfPlayers.push(player);
    }

    for(var i=0;i< tempArrayOfPlayers.length; i++){
      entityTemp = tempArrayOfPlayers[i];
      entityTemp.renderX = entityTemp.x + this.moveX;
      entityTemp.renderY = entityTemp.y + this.moveY;
      if(entityTemp.renderX >= this.leftBorderOfDisplayWindow - entityTemp.width
      && entityTemp.renderX <= this.rightBorderOfDisplayWindow + entityTemp.width
      && entityTemp.renderY >= this.topBorderOfDisplayWindow - entityTemp.height
      && entityTemp.renderY <= this.bottomBorderOfDisplayWindow + entityTemp.height){

        tempArrayOfEntities.push(entityTemp);
      }
  	}

    for(var staticID in this.handler.statics){
      if (!this.handler.statics.hasOwnProperty(staticID)) continue;
      var staticTemp = this.handler.statics[staticID];
      tempArrayOfStatics.push(staticTemp);
    }

  	for(var i=0;i< tempArrayOfStatics.length; i++){
      entityTemp = tempArrayOfStatics[i];
      entityTemp.renderX = entityTemp.x + this.moveX;
      entityTemp.renderY = entityTemp.y + this.moveY;
      if(entityTemp.renderX >= this.leftBorderOfDisplayWindow - entityTemp.width
      && entityTemp.renderX <= this.rightBorderOfDisplayWindow + entityTemp.width
      && entityTemp.renderY >= this.topBorderOfDisplayWindow - entityTemp.height
      && entityTemp.renderY <= this.bottomBorderOfDisplayWindow + entityTemp.height){
        tempArrayOfEntities.push(entityTemp);
      }
  	}


    for(var enemyID in this.handler.enemies){

      if (!this.handler.enemies.hasOwnProperty(enemyID)) continue;
      var enemy = this.handler.enemies[enemyID];

      tempArrayOfEnemies.push(enemy);

    }

    for(var i=0;i< tempArrayOfEnemies.length; i++){
      entityTemp = tempArrayOfEnemies[i];

      entityTemp.renderX = entityTemp.x + this.moveX;
      entityTemp.renderY = entityTemp.y + this.moveY;
      if(entityTemp.renderX >= this.leftBorderOfDisplayWindow - entityTemp.width
      && entityTemp.renderX <= this.rightBorderOfDisplayWindow + entityTemp.width
      && entityTemp.renderY >= this.topBorderOfDisplayWindow - entityTemp.height
      && entityTemp.renderY <= this.bottomBorderOfDisplayWindow + entityTemp.height){
        tempArrayOfEntities.push(entityTemp);
      }
    }


    tempArrayOfEntities.push(this.handler.character);
    this.allEntities = tempArrayOfEntities;
  	this.sortEntityTable();
  }

  sortEntityTable(){ //sorting for drawing purposes
  	var temp;
  	for(var i =0;i<this.allEntities.length;i++){
  		for(var j=0;j<this.allEntities.length;j++){
        //flat rendering => tile on tile we do not want it to be sorted
  			if((this.allEntities[i].flatRendering  || (this.allEntities[i] && this.allEntities[j] && this.allEntities[i].y + this.allEntities[i].height < this.allEntities[j].y + this.allEntities[j].height)) && !this.allEntities[j].flatRendering){
  				temp = this.allEntities[i];
  				this.allEntities[i] = this.allEntities[j];
  				this.allEntities[j] = temp;
  			}
  		}
  	}
  }


  onResize(){

        //we dont want to draw unneeded tiles and entities so we must declare leftBorderOfDisplayWindow etc
        //we want to draw tiles and entities inside rectangle with width:(leftBorderOfDisplayWindow to right..)
        //and height : (top.. to bottom..)
        //of cource this rectangle must be at the center of the screen

          //creating 4 border points and putting them relatively from the center of the screen
          this.leftBorderOfDisplayWindow = 0;
          this.rightBorderOfDisplayWindow = this.handler.gameCanvasesWidth;
          this.topBorderOfDisplayWindow = 0;
          this.bottomBorderOfDisplayWindow = this.handler.gameCanvasesHeight;
  }

}
