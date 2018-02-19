const {EnemySprites} = require("./Sprites");
const Static = require("./serverSideStatic");

const playerStatics = {
  width : 32,
  height : 32,
  collisionWidth : 32/3,
  collisionHeight : 32/3
}

class Enemy{

  constructor(id,x,y,moveSprite,callbackOnDeath,width,height,collisionHeight,collisionWidth,health,damage,mana){

    this.id = id || Math.floor((Math.random() * 100000) + 1);
    this.width = width || 32;
    this.height = height || 32;
    this.collisionHeight = collisionHeight || this.height/3;
  	this.collisionWidth = collisionWidth || this.width/3 ;
    this.tickCounter = 0;
    this.callbackOnDeath = callbackOnDeath;
    this.opponentID = 0;

    //SPRITES
  	this.idle = moveSprite.idle;
  	this.dying_SpriteTable = moveSprite.dying_SpriteTable || moveSprite.idle;
  	this.dead_SpriteTable = moveSprite.dead_SpriteTable || moveSprite.idle;
    this.currentSprite = this.idle;
    this.fightSprite = moveSprite.left_fight;
    this.moveLeft = moveSprite.left;
    this.moveRight = moveSprite.right;

    this.currentFightTick = 36;
    this.maxFightTick = 36;


    //PHYSICS AND LOGIC THINGS BELOW
    this.fighting = false;
    this.x = x;
    this.y = y;
    this.mana = mana || 100;
  	this.maxMana = mana || 100;
    this.health = health || 1000;
    this.maxHealth = health || 1000;
    this.damage = damage || 5;
    this.manaRegeneration = mana/400 || 2.5;
    this.healthRegeneration = health/400 || 10;
    this.experience = 10;

    this.dead = false;
    this.dying = false;

    this.set = false;


  }

  onDie(){
    if(this.callbackOnDeath){
      this.callbackOnDeath();
    }
  }


  tick(){

    this.handleManaAndHp();

  };


  handleManaAndHp(){

    if(this.dead){
      return;
    }

    if(this.health <= 0){
      this.health = -1;
      this.dying = true;
      return;
    }

  };

}




class Hit extends Enemy{

	constructor(id,x,y,callbackOnDeath){
    super(id,x,y,EnemySprites.hit,callbackOnDeath);
    this.type = "hit";
    this.experience = 2000;
    this.health = 130;
    this.maxHealth = 130;
    this.damage = 5;
  }

}

class Hulk extends Enemy{
  constructor(id,x,y,callbackOnDeath){
    super(id,x,y,EnemySprites.hulk,callbackOnDeath,100,100,25);
    this.type = "hulk";
    this.experience = 300000000;
    this.health = 100;
    this.maxHealth = 100;
    this.damage = 15;
  }
}

class Dragon extends Enemy{
  constructor(id,x,y,callbackOnDeath){
    super(id,x,y,EnemySprites.dragon,callbackOnDeath,50,50);
    this.type = "dragon";
    this.experience = 2000;
    this.health = 700;
    this.maxHealth = 700;
    this.damage = 5;
  }
}


class Yeti extends Enemy{
  constructor(id,x,y,callbackOnDeath){
    super(id,x,y,EnemySprites.yeti,callbackOnDeath,80,80);
    this.type = "yeti";
    this.experience = 1500;
    this.health = 500;
    this.maxHealth = 500;
    this.damage = 3;
  }
}

class DarkKnight extends Enemy{
  constructor(id,x,y,callbackOnDeath){
    super(id,x,y,EnemySprites.darkKnight,callbackOnDeath,50,50);
    this.type = "darkKnight";
    this.experience = 15000;
    this.health = 5000;
    this.maxHealth = 5000;
    this.damage = 30;
  }
}
class MinionSkeleton extends Enemy{
  constructor(id,x,y,callbackOnDeath){
    super(id,x,y,EnemySprites.minionSkeleton,callbackOnDeath,20,20);
    this.type = "minionSkeleton";
    this.experience = 1000;
    this.health = 50;
    this.maxHealth = 50;
    this.damage = 2;
  }
}



module.exports = {
  Enemy,
  Hit,
  Hulk,
  Dragon,
  Yeti,
  DarkKnight,
  MinionSkeleton,
  Static
}
