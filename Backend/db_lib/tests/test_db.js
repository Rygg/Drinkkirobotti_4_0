// The tests for the db.js functions
"use strict";

let Database = require('../../db.js');

let DB = new Database();

let total = 0;
let failure = 0;
let success = 0;

// Import drinkDB
console.log("----------------------------------------------------");
console.log("Test 1: Importing the drinkDB-object.");
console.log("----------------------------------------------------");
console.log("");

DB.importDB('db_drinkDB_test.json');

if(DB.drinkDB.drinks.size == 0 || typeof(DB.drinkDB) == 'undefined' || DB.currentShelf.bottles[0] != 'empty' || DB.reservedShelf.bottles[0] != 'empty') {
    failure++;
    console.log("Test failed!");
} else {
    success++;
    console.log("Test success!");   
}

total++;
console.log("");

// Import the bottleshelf and drinkDB
console.log("----------------------------------------------------");
console.log("Test 2: Importing both database objects.");
console.log("----------------------------------------------------");
console.log("");

DB.importDB('db_drinkDB_test.json', 'db_bottleShelf_test.json');

if(DB.drinkDB.drinks.size == 0 || typeof(DB.drinkDB) == 'undefined' || DB.currentShelf.bottles[0] == 'empty' || DB.reservedShelf.bottles[0] == 'empty') {
    failure++;
    console.log("Test failed!");
} else {
    success++;
    console.log("Test success!");   
}

total++;
console.log("");

// Testing the checkDrinkAvailability
console.log("----------------------------------------------------");
console.log("Test 3: Testing the checkDrinkAvailability() function");
console.log("----------------------------------------------------");
console.log("");

if(DB.drinkDB.drinks[0].available) {
    failure++;
    console.log("Test failure!");
} else {
    DB.checkDrinkAvailability(DB.drinkDB.drinks[0].name);
    if(!DB.drinkDB.drinks[0].available) {
        console.log(DB.drinkDB.drinks);
        failure++;
    } else {
        success++;
    } 
}
total++;
console.log("");
    
console.log("----------------------------------------------------");
console.log("Test 4: Testing the checkDrinkAvailability() after reserving too much of the same drink");
console.log("----------------------------------------------------");
console.log("");

// Reserve 10 drinks, CranberryJuice should be over and availability instantly false.
let test = DB.reserveDrink('VodkaCranberry', 456);
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');
DB.reserveDrink('VodkaCranberry');

if(DB.drinkDB.drinks[0].available) {
    failure++;
    console.log('Test failure!');
} else {
    if(test.drink.name != 'VodkaCranberry' && test.id != 456) {
        failure++;
        console.log('Test failure!');
    } else {
        success++;
        console.log('Test success!');
    }
}
total++;
console.log("");

// Testing the reserving of a drink that is unable to be prepared:
console.log("----------------------------------------------------");
console.log("Test 5: Testing the reserveDrink() with an unavailable drink:");
console.log("----------------------------------------------------");
console.log("");
let ans = DB.reserveDrink('Sidecar');
if(ans == true || typeof(ans) == 'object') {
    failure++;
    console.log('Test failure!');
} else {
    success++;
    console.log('Test success!');
}
total++;
console.log("");

// Testing the canceling of an order:
console.log("----------------------------------------------------");
console.log("Test 6: Testing the cancelDrink() with an unavailable drink:");
console.log("----------------------------------------------------");
console.log("");

let loc1 = DB.reservedShelf.findBottleLocations('Gin');
let loc2 = DB.reservedShelf.findBottleLocations('Tonic');

let vol1 = DB.reservedShelf.bottles[loc1].volume;
let vol2 = DB.reservedShelf.bottles[loc2].volume;
DB.checkDrinkAvailability('GinTonic');
let reserve = DB.reserveDrink('GinTonic');
// Check if the locations match in the reserved drink and the volumes do not:
if(reserve.locations[0] != loc1 && reserve.location[1] != loc2 && vol1 == DB.reservedShelf.bottles[loc1].volume && vol2 == DB.reservedShelf.bottles[loc2].volume) {
    failure++;
    console.log("Test failure!");
} else {
    // Cancel the order:
    DB.cancelDrink(reserve);
    // The volumes should now match again, since no orders have been made in between
    if(vol1 != DB.reservedShelf.bottles[loc1].volume && vol2 != DB.reservedShelf.bottles[loc2].volume) {
        failure++;
        console.log("Test failure!");
    } else {
        success++;
        console.log("Test success!");
    }
}
total++;
console.log("");


console.log("");
console.log("");
console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');
console.log("");