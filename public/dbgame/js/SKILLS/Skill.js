const SkillStatic = {
  width : 32,
  height : 32,
  sprite : new Image()
};


class Skill{
  constructor(frameTable,handler){

    if(!SkillStatic.sprite.src)
      SkillStatic.sprite.src = "dbgame/js/SPRITES/shootSprite.png";

  	this.height = SkillStatic.height;
  	this.width = SkillStatic.width;
    this.collisionWidth = SkillStatic.width;
    this.collisionHeight = SkillStatic.height;
    this.tickCounter = 0;

    this.handler = handler;
    this.frameTable = frameTable;

  }

  draw(x,y){
    this.tickCounter+=1;
  	this.handler.ctx.drawImage(SkillStatic.sprite,
  		this.frameTable[Math.floor(this.tickCounter)%this.frameTable.length].x*SkillStatic.width,this.frameTable[Math.floor(this.tickCounter)%this.frameTable.length].y*SkillStatic.height,
  		SkillStatic.width, SkillStatic.height,
  		x, y,
  		SkillStatic.width, SkillStatic.height);
  }

}
