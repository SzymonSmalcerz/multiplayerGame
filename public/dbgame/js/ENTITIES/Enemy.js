class Enemy extends Mob{
  constructor(handler,id,sprite,x,y){
    super(handler,id,sprite,x,y);
  }
}


const hitSprite = new Image();
class Hit extends Enemy{
	constructor(handler,id,x,y){
    if(!hitSprite.src)
      hitSprite.src = "dbgame/js/SPRITES/hitSprite.png";
    super(handler,id,hitSprite,x,y);
  }
}

const darkKnightSprite = new Image();
class DarkKnight extends Enemy{
	constructor(handler,id,x,y){
    if(!darkKnightSprite.src)
      darkKnightSprite.src = "dbgame/js/SPRITES/darkKnightSprite.png";
    super(handler,id,darkKnightSprite,x,y);
  }
}


const hulkSprite = new Image();
class Hulk extends Enemy{
  constructor(handler,id,x,y){
    if(!hulkSprite.src)
      hulkSprite.src = "dbgame/js/SPRITES/hulkSprite.png";
    super(handler,id,hulkSprite,x,y);
  }
}


const dragonSprite = new Image();
class Dragon extends Enemy{
  constructor(handler,id,x,y){
    if(!dragonSprite.src)
      dragonSprite.src = "dbgame/js/SPRITES/dragonSprite.png";
    super(handler,id,dragonSprite,x,y);
  }
}

const minionSkeletonSprite = new Image();
class MinionSkeleton extends Enemy{
  constructor(handler,id,x,y){
    if(!minionSkeletonSprite.src)
      minionSkeletonSprite.src = "dbgame/js/SPRITES/minionSkeletonSprite.png";
    super(handler,id,minionSkeletonSprite,x,y);
  }
}


const yetiSprite = new Image();
class Yeti extends Enemy{
  constructor(handler,id,x,y){
    if(!yetiSprite.src)
      yetiSprite.src = "dbgame/js/SPRITES/yetiSprite.png";
    super(handler,id,yetiSprite,x,y);
  }
}
