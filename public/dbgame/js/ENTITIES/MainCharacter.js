
class MainCharacter extends Mob{

  constructor(handler, playerData){
    const spritePlayer = new Image();
    spritePlayer.src = "dbgame/js/SPRITES/spriteGokuSupix.png";
    super(handler,playerData.id,spritePlayer,playerData.x,playerData.y);

    this.level = playerData.level;
    this.experience = playerData.experience;

    this.renderX = this.x;//must be that way !!
    this.renderY = this.y;//must be that way !!



    this.setSprites();

    this.isFighting = false;

    this.requiredExperience = playerData.requiredExperience;
    this.speed = playerData.speed;
    this.mana = playerData.mana;
    this.maxMana = playerData.maxMana;
    this.health = playerData.health;
    this.maxHealth = playerData.maxHealth;
    this.width = 32;
    this.height = 32;
    this.collisionHeight = 11;
    this.collisionWidth = 11;


    this.movesStack = [];

    console.log("player has been created!");
  }

  tick(){



    this.currentSprite = this.idle;

    if(keyHandler["37"] || keyHandler["38"] || keyHandler["39"] || keyHandler["40"] ){
  		this.manageKeyPressing();
      this.movesStack = [];
  	}

    if(this.isRegeneratingMana ){
  		this.manageRegenerationMana();
      this.movesStack = [];
  	}else if(this.usingSkill && this.mana >= 3){
      this.movesStack = [];
  	}else if(this.isFighting){
      this.manageFighting();
      this.movesStack = [];
    }


    if(this.movesStack.length>0){
      var move = this.movesStack.pop();
      if(move == "right"){
        this.move(this.speed,0);
      }else if(move == "left"){
        this.move(-(this.speed),0);
      }else if(move == "down"){
        this.move(0,this.speed);
      }else{
        this.move(0,-(this.speed));
      }
    }

    this.fillDataToSend();
  }

  manageFighting(){

  }
  move(x,y){
  	this.currentSprite = this.idle;
    var canMove = true;
    var allEntities = this.handler.currentMap.allEntities;
    var mainCharacter = this;
  	if(x > 0){

      allEntities.forEach(function(entity){
        if(entity === mainCharacter){
          return;
        }
        if(Helper.areTwoEntitiesInRange(mainCharacter,entity,{x:mainCharacter.speed, y:0})){
          canMove = false;
        }
      });

      if(canMove){
        this.x += this.speed;
        this.renderX += this.speed;
        this.currentSprite = this.right;
      }

  	}else if(x < 0){

      allEntities.forEach(function(entity){
        if(entity === mainCharacter){
          return;
        }
        if(Helper.areTwoEntitiesInRange(mainCharacter,entity,{x: (-mainCharacter.speed), y:0})){
          canMove = false;
        }
      });

      if(canMove){
          this.x -= this.speed;
          this.renderX -= this.speed;
  				this.currentSprite = this.left;
  			}
  	}else if(y > 0){

      allEntities.forEach(function(entity){
        if(entity === mainCharacter){
          return;
        }
        if(Helper.areTwoEntitiesInRange(mainCharacter,entity,{x:0, y:mainCharacter.speed})){
          canMove = false;
        }
      });

        if(canMove){
          this.y += this.speed;
          this.renderY += this.speed;
  				this.currentSprite = this.down;
  			}
  	}else if(y < 0){

      allEntities.forEach(function(entity){
        if(entity === mainCharacter){
          return;
        }
        if(Helper.areTwoEntitiesInRange(mainCharacter,entity,{x:0, y:(-mainCharacter.speed)})){
          canMove = false;
        }
      });

  		if(canMove){
  				this.y -= this.speed;
          this.renderY -= this.speed;
  				this.currentSprite = this.up;
  			}
  	}
  }

  fillDataToSend(){
    this.handler.dataToSend.character = {
      id : this.id,
      x : this.x,
      y : this.y,
      currentSprite : this.currentSprite
    }
  }

  setSprites(){
    this.up = [{x:11,y:11},{x:12,y:7},{x:4,y:2},{x:11,y:1}];
    this.left = [{x:1,y:11},{x:13,y:11},{x:9,y:11},{x:5,y:11}];
    this.right = [{x:0,y:11},{x:12,y:11},{x:8,y:11},{x:4,y:11}];
    this.down = [{x:10,y:1},{x:3,y:2}];
    this.up_fight = [{x:9,y:3},{x:11,y:9},{x:2,y:4},{x:6,y:4},{x:10,y:8},{x:0,y:6},{x:4,y:6}];
    this.down_fight = [{x:14,y:5},{x:3,y:6},{x:13,y:8},{x:14,y:5},{x:12,y:3},{x:1,y:4},{x:5,y:4}];
    this.left_fight = [{x:13,y:9},{x:5,y:5},{x:2,y:6},{x:1,y:5}];
    this.right_fight = [{x:12,y:9},{x:4,y:5},{x:1,y:6},{x:0,y:5}];
    this.idleDown = [{x:1,y:0}];
    this.idleRight = [{x:1,y:2}];
    this.idleLeft = [{x:2,y:2}];
    this.idleUp = [{x:0,y:2}];
    this.idle = this.idleDown;
  }

  manageKeyPressing(){
    if(keyHandler["37"]	){
      this.idle = this.idleLeft;
      if(!this.isFighting && !this.isRegeneratingMana){
        this.move(-1,0);
      }
    }else if(keyHandler["38"]	){
      this.idle = this.idleUp;
      if(!this.isFighting && !this.isRegeneratingMana)
        this.move(0,-1);
    }else if(keyHandler["39"]	){
      this.idle = this.idleRight;
      if(!this.isFighting && !this.isRegeneratingMana)
        this.move(1,0);
    }else if(keyHandler["40"]	){
      this.idle = this.idleDown;
      if(!this.isFighting && !this.isRegeneratingMana)
        this.move(0,1);
    }
  }
  manageRegenerationMana(){
    this.currentSprite =	[{x:3,y:10},{x:4,y:10},{x:5,y:10},{x:6,y:10},{x:7,y:10},{x:8,y:10}];
  }


}





var keyHandler = {};

window.addEventListener("keydown",function(event){


	if(event.keyCode === 82){

		Game.handler.character.isRegeneratingMana = true;
		Game.handler.character.isFighting = false;
		Game.handler.character.usingSkill = false;
		keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;
		return;
		//keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

	};

	if(event.keyCode === 32){

		Game.handler.character.isFighting = true;
		//keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

	};

	if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40){

		keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

			keyHandler[event.keyCode] = true;


	};

	if(event.keyCode >=  49 && event.keyCode <= 57){

		for(var i = 49;i<58;i++){
			keyHandler[i.toString()] = false;
		};

		Game.handler.character.isFighting = false;
		Game.handler.character.usingSkill = true;

		keyHandler[event.keyCode] = true;
	}




});


window.addEventListener("keyup",function(event){


	if(event.keyCode === 82){

		Game.handler.character.isRegeneratingMana = false;
		//keyHandler["37"] = keyHandler["38"] = keyHandler["39"] = keyHandler["40"] = false;

	};

	if(event.keyCode === 32){

		Game.handler.character.isFighting = false;

	};

	if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40){

		keyHandler["37"] = keyHandler["38"]= keyHandler["39"] = keyHandler["40"] = false;

	};


	if(event.keyCode >=  49 && event.keyCode <= 57){

		for(var i = 49;i<58;i++){
			keyHandler[i.toString()] = false;
		};

		Game.handler.character.usingSkill = false;

	}


});
