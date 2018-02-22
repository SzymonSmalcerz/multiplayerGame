
class ShortestPath{

  constructor(handler,drawer,widthOfDisplayWindow,heightOfDisplayWindow){
    this.handler = handler;
    this.drawer = drawer;
    this.widthOfDisplayWindow = widthOfDisplayWindow;
    this.heightOfDisplayWindow = heightOfDisplayWindow;
    handler.parentDiv.addEventListener("click", function(event){
      if(handler.character.isFighting){
        return;
      }
      var x = event.offsetX;
      var y = event.offsetY;

      Game.handler.shortestPath.calculateShortestPath(Game.handler.character, x, y, Game.handler.currentMap.allEntities);

    });
  }


  calculateShortestPath(mainEntity, destinationX, destinationY, entitesToAvoid){



    var sourceX = Math.round(mainEntity.renderX + mainEntity.width/2);
    var sourceY = Math.round(mainEntity.renderY + mainEntity.height*0.9 - mainEntity.collisionHeight/2);

    var allEntities = entitesToAvoid;
    var mockEntity = new Entity(this.handler,mainEntity.x, mainEntity.y);


    mockEntity.renderX = sourceX;
    mockEntity.renderY = sourceY;
    mockEntity.width = mainEntity.width;
    mockEntity.height = mainEntity.height;
    mockEntity.collisionWidth = Math.abs(mainEntity.collisionWidth);
    mockEntity.collisionHeight = Math.abs(mainEntity.collisionHeight);

    var change = mainEntity.speed;
    var source ; //sourceNode
    var destinationNode;





    var width = this.widthOfDisplayWindow;
    var height = this.heightOfDisplayWindow;
    var leftBorderOfDisplayWindow = 0;
    var rightBorderOfDisplayWindow = this.widthOfDisplayWindow;

    var topBorderOfDisplayWindow = 0;
    var bottomBorderOfDisplayWindow = this.heightOfDisplayWindow;

    var openList = [];
    var closedList = [];

    var nodes = {};

    var leftBorder = sourceX;
    var rightBorder = sourceX;
    var topBorder = sourceY;
    var bottomBorder = sourceY;
    while(leftBorder > leftBorderOfDisplayWindow){
      leftBorder -= mainEntity.speed;
    }
    while(rightBorder < rightBorderOfDisplayWindow){
      rightBorder += mainEntity.speed;
    }
    while(topBorder > topBorderOfDisplayWindow){
      topBorder -= mainEntity.speed;
    }
    while(bottomBorder < bottomBorderOfDisplayWindow){
      bottomBorder += mainEntity.speed;
    }


    for(var w=leftBorder; w<= rightBorder ; w+=change){
      for(var h=topBorder; h<=bottomBorder; h+=change){
        nodes[w + " " + h] = {};
        nodes[w + " " + h].x = w;
        nodes[w + " " + h].y = h;
        nodes[w + " " + h].f = -1;
        nodes[w + " " + h].parent = null;
        nodes[w + " " + h].h = Math.abs(w-destinationX) + Math.abs(h-destinationY);
        if(w == sourceX && h == sourceY){
          source = nodes[w + " " + h];
          source.g = 0;
          source.f = source.h;
        }

        if(Math.abs(w - destinationX) <= mainEntity.speed/2 && Math.abs(h - destinationY) <= mainEntity.speed/2){
          destinationNode = nodes[w + " " + h];
        }
      }
    }

    var canMove = true;
    var enemyFight = false;

    mockEntity.renderX = destinationNode.x - mainEntity.width/2;
    mockEntity.renderY = destinationNode.y - mainEntity.height*0.9 + mainEntity.collisionHeight/2;



    allEntities.forEach(function(entity){
      if(entity === mainEntity){
        return;
      }
      if(Helper.areTwoEntitiesInRange(mockEntity,entity)){
        if(entity instanceof Enemy ){
          enemyFight = true;
        }else{
          canMove = false;
        }
      }
    });

    // dbgame/js/dragonBallGame/sprites/crossMove.png"

    if(!canMove){
      this.drawer.addItemToDraw("dbgame/js/SPRITES/crossMove.png",mockEntity.renderX, mockEntity.renderY, 500, 32, 32, 1, 0);
      return;
    }else if(enemyFight){
      this.drawer.addItemToDraw("dbgame/js/SPRITES/crossMove.png",mockEntity.renderX, mockEntity.renderY, 500, 32, 32, 2, 0);
    }else{
      this.drawer.addItemToDraw("dbgame/js/SPRITES/crossMove.png",mockEntity.renderX, mockEntity.renderY, 500, 32, 32, 0, 0);
    }




    openList.push(source);


    while(openList.length > 0){

      var q = this.findNodeWithLowestF(openList);

      openList = openList.filter(function(listItem){
        if(listItem !== q){
          return true;
        }

        return false;
      });





      for(var w=q.x-change;w<=q.x+change;w+=change) {
  				for(var h=q.y-change;h<=q.y+change;h+=change) {





            if(w==(q.x+change) && (h==(q.y+change) || h==(q.y-change))) {
  						continue;
  					}
  					if(w==(q.x-change) && (h==(q.y+change) || h==(q.y-change))) {
  						continue;
  					}

            if(w>=leftBorder && w<rightBorder && h>=topBorder && h<bottomBorder && !(h==q.y && w==q.x)) {


              canMove = true;
              mockEntity.renderX = w - mainEntity.width/2;
              mockEntity.renderY = h - mainEntity.height*0.9 + mainEntity.collisionHeight/2;
              var handler = this.handler;
              allEntities.forEach(function(entity){
                if(entity === mainEntity){
                  return;
                }
                if(Helper.areTwoEntitiesInRange(mockEntity,entity)){

                  if(enemyFight){
                    console.log(handler.fightHandler);
                    if(handler.fightHandler.potentialOpponentOfPlayer){
                      console.log("ISTENIJE");
                      if(entity === handler.fightHandler.potentialOpponentOfPlayer){
                        console.log("TRUEEE");
                      }else{
                        canMove = false;
                      }
                    }else{
                      canMove = false;
                    }
                  }else{
                    canMove = false;
                  }
                }
              });

              if(!canMove){
  						 continue;
  						}

              var calculatedG = change + q.g;

              if(openList.includes(nodes[w + " " + h]) || closedList.includes(nodes[w + " " + h])) {
                if(!(nodes[w + " " + h].f >0 && nodes[w + " " + h].f < calculatedG + nodes[w + " " + h].h)) {

  								nodes[w + " " + h].f = calculatedG + nodes[w + " " + h].h;
  								nodes[w + " " + h].g = calculatedG;
  								nodes[w + " " + h].parent = q;

  							}

  							continue;
              }
              nodes[w + " " + h].f = calculatedG + nodes[w + " " + h].h;
              nodes[w + " " + h].g = calculatedG;
              nodes[w + " " + h].parent = q;
  							if(destinationNode === nodes[w + " " + h]) {

                  var temp = destinationNode;
                  this.drawWay(temp,mainEntity);
                  //temp = destinationNode;
                  this.createWay(temp,mainEntity)

  								return;
  							}


  							openList.push(nodes[w + " " + h]);
            }

            closedList.push(q);
          }
      }



    }

  }

  findNodeWithLowestF(openList){

    var wantedNode = openList[0];
    var lowestF = openList[0].f;

    openList.forEach(function(listItem){
      if(listItem.f < lowestF){
        wantedNode = listItem;
        lowestF = listItem.f;
      }
    });

    return wantedNode;

  }

  calculateBorder(displayBorder,change, position){
    return  Math.abs(displayBorder) - (Math.abs(displayBorder)%change) + (position%change);
  }

  drawWay(destinationNode,mainEntity){

    // var colorRandRed = Math.round(Math.random() * 150) + 100;
    // var colorGreenRed = Math.round(Math.random() * 150) + 100;
    // var colorBlueRed = Math.round(Math.random() * 150) + 100;
    // Game.handler.collisionCtx.fillStyle = "rgba("+colorRandRed+","+colorGreenRed+","+colorBlueRed+",0.5)";
    // while(destinationNode != null){
    //
    //   Game.handler.collisionCtx.fillRect(destinationNode.x-mainEntity.collisionWidth/2,destinationNode.y-mainEntity.collisionHeight/2,mainEntity.collisionWidth,mainEntity.collisionHeight);
    //   destinationNode = destinationNode.parent;
    //
    // }
  }

  createWay(destinationNode,mainEntity){


    mainEntity.movesStack = [];
    while(true){

      if(!destinationNode.parent){
        break;
      }

      if(destinationNode.parent.x > destinationNode.x){
        mainEntity.movesStack.push("left");
      }else if(destinationNode.parent.x < destinationNode.x){
        mainEntity.movesStack.push("right");
      }else if(destinationNode.parent.y > destinationNode.y){
        mainEntity.movesStack.push("up");
      }else{
        mainEntity.movesStack.push("down");
      }

      destinationNode = destinationNode.parent;

    }
  }

  onResize(widthOfDisplayWindow,heightOfDisplayWindow){
    this.widthOfDisplayWindow = widthOfDisplayWindow;
    this.heightOfDisplayWindow = heightOfDisplayWindow;
  }
}
