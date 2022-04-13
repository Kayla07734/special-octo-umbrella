var ground, invisibleGround, groundImage;
var trex, trex_running, trex_collided;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var PLAY = 0;
var END = 1;
var gameState = PLAY;
var cloudsGroup;
var cactusGroup;
var score;
var gameOver, gameOverImage;
var restart, restartImage;
var die, jump, checkpoint;
var trex_collided;
//var crows, crowsGroup;
localStorage["HighestScore"]=0

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkpoint.mp3");
  //crow = loadImage("crow.png");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 5, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  // console.log("Hello" + 5);

  score = 0;

  cloudsGroup = new Group();
  cactusGroup = new Group();
  //crowsGroup = new Group();

  trex.debug = true;
  // trex.setCollider("rectangle",0,0,100,100);
  trex.setCollider("circle", 0, 0, 50);

  gameOver = createSprite(250, 100);
  gameOver.addImage("over", gameOverImage);
  gameOver.scale = 1.5;

  restart = createSprite(250, 120);
  restart.addImage("restart", restartImage);
  restart.scale = 0.3;

}

function draw() {
  background(180);
  text("Score: " + score, 500, 50);
  text("HighestScore: "+localStorage["HighestScore"],300,50)

  //crow.velocityX = -4;
  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -(4+score/100);

    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -10;
      jump.play();
    }

    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }

    score = score + Math.round(getFrameRate()/60);

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    gameOver.visible = false;
    restart.visible = false;
    //spawnCrows();
    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();
    if (cactusGroup.isTouching(trex)) {
      gameState = END;
      die.play();
      trex.changeAnimation("collided", trex_collided);
    }
  } else if (gameState === END) {
    //move the ground
    ground.velocityX = 0;

    trex.velocityX = 0;
    trex.velocityY = 0;
    cloudsGroup.setVelocityXEach(0);
    cactusGroup.setVelocityXEach(0);

    cactusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      restartGame();
    }
  }

  trex.collide(invisibleGround);

  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(4+score/500);

    // //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    cactusGroup.add(obstacle)
    
  }
}

/*function spawnCrows() {
  if (frameCount % 1000 === 0) {
    crow = createSprite(600,100);
    crow.scale = 0.1;
    crow.addImage("crow", crow);
    crow.y = Math.round(random(10, 60));
    
    crow.velocityX = -4;
    crow.lifetime = 1;
    crow.depth = trex.depth;
    trex.depth = trex.depth + 1;
    crowsGroup.add(crow);
  }

}*/

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 400;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function restartGame() {
  gameState = PLAY;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);

  if (localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score
  }
  score = 0;
}


