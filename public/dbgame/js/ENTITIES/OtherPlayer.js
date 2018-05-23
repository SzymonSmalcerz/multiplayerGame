const spriteOtherPlayer = new Image();
class OtherPlayer extends Mob{
  constructor(id,handler,x,y){
    if(!spriteOtherPlayer.src)
    spriteOtherPlayer.src = "dbgame/js/SPRITES/spriteGokuSupix.png";
    super(handler,id,spriteOtherPlayer,x,y);
    this.width = 32;
    this.height = 32;
  }
}
