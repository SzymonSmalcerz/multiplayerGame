const spriteOtherPlayer = new Image();
class OtherPlayer extends Mob{
  constructor(id,handler){
    if(!spriteOtherPlayer.src)
      spriteOtherPlayer.src = "dbgame/js/dragonBallGame/sprites/spriteGokuSupix.png";
    super(handler,id,spriteOtherPlayer);
  }
}
