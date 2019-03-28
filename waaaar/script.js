const RED = "RED";
const GREEN = "GREEN";
const BLUE = "BLUE";
const EDGE_FOR_MULTIPLYING = 30;
const LIFE_TRANSMITION = 15;

var colorOption = document.getElementById("color");
var tempratureOption = document.getElementById("temprature");

var grid;
var cols;
var rows;
var resolution = 10;
var cells;

var gameStarted = false;
var gameFinished = false;

var health = {
  green:100,
  red:100,
  blue:100
}

function startGame(){
  gameStarted = true;
}
function save(){
  var colorOption = document.getElementById("color");
  var tempratureOption = document.getElementById("temprature");
}

var counter = new Array();

function drawCell(x, y, color) {
  push();
  fill(color == "RED" ? 255 : 0, color == "GREEN" ? 255 : 0, color == "BLUE" ? 255 : 0);
  rect(x, y, resolution, resolution);
  pop();
}

class Cell {
  health = 100;
  age = 0;
  maxAge = 1000;
  color = "NONE"
  isAlive = false;
  healthLosing = 1;
  initDmgMultiplier = 1;
  dmgMultiplier = 1;

  getDamage() {
    if (this.color == "RED" && tempratureOption[tempratureOption.selectedIndex].value == "HOT") { this.dmgMultiplier = 3; }
    if (this.color == "RED" && tempratureOption[tempratureOption.selectedIndex].value == "WARM") { this.dmgMultiplier = 2; }
    if (this.color == "RED" && tempratureOption[tempratureOption.selectedIndex].value == "COLD") { this.dmgMultiplier = 1; }

    if (this.color == "BLUE" && tempratureOption[tempratureOption.selectedIndex].value == "HOT") { this.dmgMultiplier = 1; }
    if (this.color == "BLUE" && tempratureOption[tempratureOption.selectedIndex].value == "WARM") { this.dmgMultiplier = 2; }
    if (this.color == "BLUE" && tempratureOption[tempratureOption.selectedIndex].value == "COLD") { this.dmgMultiplier = 3; }

    if (this.color == "GREEN" && tempratureOption[tempratureOption.selectedIndex].value == "HOT") { this.dmgMultiplier = 1; }
    if (this.color == "GREEN" && tempratureOption[tempratureOption.selectedIndex].value == "WARM") { this.dmgMultiplier = 2; }
    if (this.color == "GREEN" && tempratureOption[tempratureOption.selectedIndex].value == "COLD") { this.dmgMultiplier = 1; }

    this.health -= this.healthLosing;
    
  }

  createNew(health, color) {
    this.age = 0;
    this.color = color;
    this.health = health;
    this.isAlive = true;
  }

  update() {
    
    if (this.health <= 0 || ++this.age >= this.maxAge) {
      this.isAlive = false;
      return false;
    }

    if (this.isAlive) {
      this.getDamage();
      if (this.health % EDGE_FOR_MULTIPLYING == 0) {
        return true
      }

    }
    return false;
  }

  absorbCell(cell) {
    let amountOfCells;
    switch (cell.color) {
      case "GREEN":
        amountOfCells = counter[0];
        break;
      case "BLUE":
        amountOfCells = counter[1];
        break;
      case "RED":
        amountOfCells = counter[2];
        break;
    }

    this.health += this.color == cell.color ? cell.health : -cell.health * cell.dmgMultiplier * (cells.length * cells[0].length / amountOfCells) * this.initDmgMultiplier;

  }

  draw(i, j) {
    if (this.isAlive) { drawCell(i * resolution, j * resolution, this.color); }
  }
}



function setup() {
  createCanvas(600, 400);
  cols = width / resolution;
  rows = height / resolution;
  initCells();
}

function draw() {
  background(155);
  if(!gameFinished){
    drawGrid();
    drawAndUpdateCells();
  } else {
    textSize(width / 9.2)
    text("GAME IS FINISHED",0,height / 2);
  }
}

function drawGrid() {
  for (let i = 0; i < rows; i++) {
    line(0, i * resolution, width, i * resolution);
  }

  for (let i = 0; i < cols; i++) {
    line(i * resolution, 0, i * resolution, height);
  }
}
function getSelctedColor() {
  return colorOption[colorOption.selectedIndex].value;
}
function mouseClicked() {
  let i = Math.floor(mouseX / resolution);
  let j = Math.floor(mouseY / resolution);
  if (mouseX < width && mouseY < height && mouseX >= 0 && mouseY >= 0) {
    cells[i][j].color = getSelctedColor();
    cells[i][j].isAlive = true;
  }
}

function initCells() {
  cells = new Array(cols);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = new Array(rows);
  }

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j] = new Cell();
    }
  }
}

function drawAndUpdateCells() {
  counter[0] = counter[1] = counter[2] = 0;
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      if(gameStarted){
        switch (cells[i][j].color) {
          case "GREEN":
            counter[0]++;
            break;
          case "BLUE":
            counter[1]++;
            break;
          case "RED":
            counter[2]++;
            break;
        }
  
        if (cells[i][j].update()) {
          createInAround(i, j);
        }
      }
      
      cells[i][j].draw(i, j);
    }
  }
  if(gameStarted){
    let skipInd = -1;
    for(let i = 0 ; i < counter.length ; i++){
      if(counter[i] == 0){
        skipInd = i;
      }  
    }

    for(let i = 0 ; i < counter.length ; i++){
      if(i == skipInd){
        continue;
      }
      if(counter[i] == 0){
        gameFinished = true;
      }  
    }
  }
}

function createInAround(i, j) {
  let indexI = i + Math.floor(Math.random() * 3) - 1;
  let indexJ = j + Math.floor(Math.random() * 3) - 1;

  if (indexI == -1) { indexI = Math.floor(Math.random() * 2); }
  if (indexI == cells.length - 1) { indexI = i + Math.floor(Math.random() * 2); }
  if (indexJ == -1) { indexI = Math.floor(Math.random() * 2); }
  if (indexJ == cells[0].length - 1) { indexJ = j + Math.floor(Math.random() * 2); }

  if (i > 0 && j > 0 && i < cells.length - 1 && j < cells[0].length - 1) {
    if (cells[indexI][indexJ].isAlive) {
      cells[indexI][indexJ].absorbCell(cells[i][j]);
    } else {
      cells[indexI][indexJ].createNew(100, cells[i][j].color);
    }
  }

}