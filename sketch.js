var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed,lastFed;
var time;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed= createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog)

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  time=database.ref("feedTime")
  time.on("value",function(data){
    lastFed=data.val()
  })
  
 
  //write code to display text lastFed time here
  fill("red")
  textSize(20);
  
  if(lastFed>=12){
    text("last feed"+lastFed%12+"pm",350,30)
  }
  else if(lastFed==0){
    text("last feed  12am",350,30)
  }
  else{
    text("last feed"+lastFed+"am",350,30)
  }

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var foodStockVal=foodObj.getFoodStock();
  if(foodStockVal<=0){
    foodObj.updateFoodStock(foodStockVal * 0)
    
  }
  else{
    foodObj.updateFoodStock(foodStockVal-1)
  }
  //write code here to update food stock and last fed time
  database.ref("/").update({
    food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS= foodS+1;
  database.ref('/').update({
    food:foodS
  })
}
