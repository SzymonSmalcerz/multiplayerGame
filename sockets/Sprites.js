const EnemySprites = {
  hit : {
    up : [{x:4,y:9},{x:8,y:9}],
    left : [{x:6,y:9},{x:10,y:9}],
    right : [{x:5,y:9},{x:9,y:9}],
    down : [{x:3,y:9},{x:7,y:9}],
    up_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}],
    down_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}],
    left_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}],
    right_fight : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}],
    idle : [{x:13,y:8},{x:14,y:8},{x:0,y:9},{x:1,y:9}]
  }, darkKnight : {
    up : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}
    ,{x:5,y:4},{x:6,y:4},{x:7,y:4}],
    left : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}
    ,{x:5,y:4},{x:6,y:4},{x:7,y:4}],
    right : [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3}
    ,{x:5,y:3},{x:6,y:3},{x:7,y:3}],
    down : [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3}
    ,{x:5,y:3},{x:6,y:3},{x:7,y:3}],
    up_fight : [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}],
    down_fight : [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0}],
    left_fight : [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}],
    right_fight : [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0} ],
    idle : [{x:8,y:1}],
    dying_SpriteTable : [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:4,y:2}],
    dead_SpriteTable : [{x:5,y:2}],
  }, minionSkeleton : {
    up : [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
    left : [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}],
    right : [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
    down : [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}],
    up_fight : [{x:0,y:2},{x:1,y:2},{x:2,y:2}],
    down_fight : [{x:0,y:3},{x:1,y:3},{x:2,y:3}],
    left_fight : [{x:0,y:3},{x:1,y:3},{x:2,y:3}],
    right_fight : [{x:0,y:2},{x:1,y:2},{x:2,y:2}],
    idle : [{x:5,y:1}],
    dying_SpriteTable : [{x:0,y:4},{x:0,y:4},{x:1,y:4},{x:1,y:4},{x:0,y:4},{x:0,y:4},{x:1,y:4},{x:1,y:4}],
    dead_SpriteTable : [{x:2,y:4}],
  }, hulk : {
    up : [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}],
    left : [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:5,y:3}],
    right : [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}],
    down : [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2}],
    up_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}],
    down_fight : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}],
    left_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5}],
    right_fight : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}],
    idle : [{x:3,y:0},{x:3,y:0},{x:3,y:0},{x:3,y:0},{x:4,y:0},{x:4,y:0}]
  }, dragon : {
    up : [{x:0,y:3},{x:1,y:3},{x:2,y:3}],
  	left : [{x:0,y:1},{x:1,y:1},{x:2,y:1}],
  	right : [{x:0,y:2},{x:1,y:2},{x:2,y:2}],
  	down : [{x:0,y:0},{x:1,y:0},{x:2,y:0}],
  	up_fight : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:5,y:4}],
  	down_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},{x:5,y:5}],
  	left_fight : [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:5,y:7}],
  	right_fight : [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:5,y:6}],
  	idle : [{x:1,y:0}]
  },yeti : {
    up : [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6}],
  	left : [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2}],
  	right : [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4}],
  	down : [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0}],
  	up_fight : [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7}],
  	down_fight : [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}],
  	left_fight : [{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3}],
  	right_fight : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5}],
  	idle : [{x:3,y:0},{x:4,y:0}]
  }
}

const CharacterSprites = {
  mainCharacter : {
    up : [{x:11,y:11},{x:12,y:7},{x:4,y:2},{x:11,y:1}],
    left : [{x:1,y:11},{x:13,y:11},{x:9,y:11},{x:5,y:11}],
    right : [{x:0,y:11},{x:12,y:11},{x:8,y:11},{x:4,y:11}],
    down : [{x:10,y:1},{x:3,y:2}],
    up_fight : [{x:9,y:3},{x:11,y:9},{x:2,y:4},{x:6,y:4},{x:10,y:8},{x:0,y:6},{x:4,y:6}],
    down_fight : [{x:14,y:5},{x:3,y:6},{x:13,y:8},{x:14,y:5},{x:12,y:3},{x:1,y:4},{x:5,y:4}],
    left_fight : [{x:13,y:9},{x:5,y:5},{x:2,y:6},{x:1,y:5}],
    right_fight : [{x:12,y:9},{x:4,y:5},{x:1,y:6},{x:0,y:5}],
    idleDown : [{x:1,y:0}],
    idleRight : [{x:1,y:2}],
    idleLeft : [{x:2,y:2}],
    idleUp : [{x:0,y:2}],
    idle : [{x:1,y:0}],
    KamehamehaWaveSprite : [{x:3,y:8}]
  }
}


module.exports = {
  EnemySprites,
  CharacterSprites
}
