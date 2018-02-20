class Map{
  //constructor(tilesTable,teleportsCoords,maxNumOfEnemies){
  constructor(handler,dataFromServer){
    this.handler = handler;

    this.fightTile = dataFromServer.fightTile;


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

    if(this.handler.character.isFighting){

      for(var i = 0;i <= this.rightBorderOfDisplayWindow/32 + 1; i++){
    		for(var j = 0;j <= this.bottomBorderOfDisplayWindow/32 + 1; j++){
          tempTileContainer = this.handler.tiles[this.fightTile];
    		  tempTileContainer.draw(i*32, j*32);
    		}
    	}
      var player = this.handler.character;
      var enemy  = this.handler.character.opponent;
      var fightData = this.handler.fightData;




      enemy.renderY = this.bottomBorderOfDisplayWindow * 0.5 - enemy.height*0.8;
      player.renderY = this.bottomBorderOfDisplayWindow * 0.5 - player.height*0.8;

      if(this.rightBorderOfDisplayWindow>450){
        var defaultOpponentPosition = this.rightBorderOfDisplayWindow * 0.60;
        var defaultCharacterPosition = this.rightBorderOfDisplayWindow * 0.40;
      }else if(this.rightBorderOfDisplayWindow > 300){
        var defaultOpponentPosition = this.rightBorderOfDisplayWindow * 0.70;
        var defaultCharacterPosition = this.rightBorderOfDisplayWindow * 0.30;
      }else{
        var defaultOpponentPosition = this.rightBorderOfDisplayWindow * 0.80;
        var defaultCharacterPosition = this.rightBorderOfDisplayWindow * 0.20;
      }
      if(this.handler.fightData.turn == "opponent" && fightData.maxFightTick > 0){
        player.hasJustMadeMoveInFight = false;
        if(fightData.currentFightTick > 2 * fightData.maxFightTick/3){
          var ratio = 3*(fightData.maxFightTick-fightData.currentFightTick)/(fightData.maxFightTick);

          enemy.renderX = defaultOpponentPosition - enemy.width/2 + (player.width * (ratio))/2  - ((defaultOpponentPosition - defaultCharacterPosition) *(ratio));
          enemy.currentSprite = fightData.moveLeft;
        }else if(fightData.currentFightTick > fightData.maxFightTick/3){
          enemy.renderX = defaultCharacterPosition - enemy.width/2 + (player.width)/2;
          enemy.currentSprite = fightData.fightSprite;
        }else{
          var ratio = ((fightData.maxFightTick-fightData.currentFightTick) - 2/3 * (fightData.maxFightTick))/(fightData.maxFightTick/3);
          enemy.renderX = defaultCharacterPosition - enemy.width/2 + (player.width * (1-ratio))/2 + ((defaultOpponentPosition - defaultCharacterPosition)  * (ratio));
          enemy.currentSprite = fightData.moveRight;
        }
      }else{
        enemy.renderX = defaultOpponentPosition - enemy.width/2;
        if(fightData.idle){
          enemy.currentSprite = fightData.idle;
        }
      }

      if(player.hasJustMadeMoveInFight && fightData.maxFightTick > 0){

        if(!player.isUsingSkill){
          if(fightData.currentFightTick > 2 * fightData.maxFightTick/3){
            var ratio = 3*(fightData.maxFightTick-fightData.currentFightTick)/(fightData.maxFightTick);
            player.renderX = defaultCharacterPosition - player.width/2 + (enemy.width * (ratio))/2 + ((defaultOpponentPosition - defaultCharacterPosition) *(ratio));
            player.currentSprite = player.right;
          }else if(fightData.currentFightTick > fightData.maxFightTick/3){
            player.renderX = defaultOpponentPosition - player.width/2 - enemy.width/2;
            player.currentSprite = player.right_fight;
          }else{
            var ratio = ((fightData.maxFightTick-fightData.currentFightTick) - 2/3 * (fightData.maxFightTick))/(fightData.maxFightTick/3);
            player.renderX = defaultOpponentPosition - player.width/2 - (enemy.width * (1 - ratio))/2 - ((defaultOpponentPosition - defaultCharacterPosition)  * (ratio));
            player.currentSprite = player.left;
          }
        }else{

          player.currentSprite = player.KamehamehaWaveSprite;
          player.renderX = defaultCharacterPosition - player.width/2;

          if(fightData.currentFightTick > 2*fightData.maxFightTick/3){
            var ratio = 3*(fightData.maxFightTick-fightData.currentFightTick)/(fightData.maxFightTick);
            var x = defaultCharacterPosition - player.width/2  + ((defaultOpponentPosition - defaultCharacterPosition) *(ratio));

            for(var i=player.renderX + player.width;i<=x;i+=5){
              fightData.skill.draw(i,player.renderY);
            }
          }else if(fightData.currentFightTick > fightData.maxFightTick/3){
            var x = defaultOpponentPosition - enemy.width/2;
            for(var i=player.renderX + player.width;i<=x;i+=5){
              fightData.skill.draw(i,player.renderY);
            }

            this.drawExplosion = true;
          }else{
            var ratio = ((fightData.maxFightTick-fightData.currentFightTick) - 2/3 * (fightData.maxFightTick))/(fightData.maxFightTick/3);
            var xR = defaultOpponentPosition - enemy.width/2;
            var xL = defaultCharacterPosition + player.width  + ((defaultOpponentPosition - defaultCharacterPosition) *(ratio));
            for(var i=xL;i<=xR;i+=5){
              fightData.skill.draw(i,player.renderY);
            }
            this.drawExplosion = true;
            player.currentSprite = player.idle;
          }
        }

      }else{
        player.isUsingSkill = false;
        player.renderX = defaultCharacterPosition - player.width/2;
        player.currentSprite = player.idle;
      }



      if(fightData.turn != "opponent"){
        this.handler.ctx.fillStyle = "rgba(255,255,0,0.5)";
        this.handler.ctx.fillRect(0,0,this.rightBorderOfDisplayWindow/2,11 * this.bottomBorderOfDisplayWindow/50);
      }else {
        this.handler.ctx.fillStyle = "rgba(255,255,0,0.5)";
        this.handler.ctx.fillRect(this.rightBorderOfDisplayWindow/2,0,this.rightBorderOfDisplayWindow/2,11 * this.bottomBorderOfDisplayWindow/50);
      }


      player.draw();
      enemy.draw();
      player.drawHp(this.rightBorderOfDisplayWindow/10,this.bottomBorderOfDisplayWindow/10,3*this.rightBorderOfDisplayWindow/10,this.bottomBorderOfDisplayWindow/50);
      enemy.drawHp(6 * this.rightBorderOfDisplayWindow/10,this.bottomBorderOfDisplayWindow/10,3*this.rightBorderOfDisplayWindow/10,this.bottomBorderOfDisplayWindow/50);

      if(this.drawExplosion){
        delete this.drawExplosion;

        fightData.explosion.draw(defaultOpponentPosition - enemy.width/2,player.renderY);
      }
      return;
    }



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
