var sadDog, happyDog, database;
var foodS, foodStock;
var dog;
var addFoodButton, feedPetButton;
var fedTime, lastFed;
var foodObj;
var gameState, readState;
var bedroomImg,gardenImg,washroomImg;
var currentTime;
var input, greeting, name, button;
function preload()
{

	sadDog=loadImage("images/Dog.png");
 happyDog=loadImage("images/happydog.png");
 bedroomImg = loadImage("images/Bed Room.png");
gardenImg = loadImage("images/Garden.png")
washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
	createCanvas(1200, 800);
  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(1000,300,100,100)
  dog.addImage(sadDog);
  dog.scale=0.25;

readState=database.ref('gameState');
readState.on("value",function(data){
gameState=data.val();
})

foodObj = new Food();
feedPetButton=createButton("Feed the Dog");
feedPetButton.position(700,95);
feedPetButton.mousePressed(feedDog);

addFoodButton=createButton("Add Food");
addFoodButton.position(800,95);
addFoodButton.mousePressed(addFood);

input=createInput("Change the Pet's Name");
input.position(900,95);

button=createButton("ENTER")
button.position(1300,90);
button.mousePressed(dogRename);
}


function draw() {  
background(46,139,87);


foodObj.display();
  drawSprites();

  //add styles here

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });
  currentTime = hour();

  console.log(currentTime);

  if(gameState!= "Hungry"){
    feedPetButton.hide();
    addFoodButton.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }

  if(currentTime === (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }
  


  textSize(20);
  fill("aqua");
  stroke("black");
  text("Remaining Food:" + foodS, 200,100);

  fill(255);
  textSize(20);
  if(lastFed>=12){
    text("Last fed: "+lastFed%12+"PM", 400, 100);
  }else if(lastFed===0){
    text("Last fed: "+lastfed+"AM", 400, 100)
  }

}




function writeStock(x){

  if(x<=0){
    x=0;
  }
  else{
  x=x-1;
  }
  
  database.ref('/').update({
    'Food':x


})
}

function readStock(data) {
  foodS = data.val()
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()  
  });
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });   
}


function dogRename(name){

  name=input.value();
button.hide();
input.hide();
database.ref('/').update
name:name

}

