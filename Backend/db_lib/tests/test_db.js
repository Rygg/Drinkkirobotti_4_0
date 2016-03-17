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
console.log("Test 6: Testing the cancelDrink() with an available drink:");
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

// Testing the pour completed.
console.log("----------------------------------------------------");
console.log("Test 7: Testing the pourCompleted()-function:");
console.log("----------------------------------------------------");
console.log("");

// Reserve drinks.
reserve = DB.reserveDrink('GinTonic');
vol1 = DB.reservedShelf.bottles[loc1].volume;
vol2 = DB.reservedShelf.bottles[loc2].volume;
// Complete both pours.
DB.pourCompleted(reserve.locations[0], reserve.drink.recipe[0].amount);
DB.pourCompleted(reserve.locations[1], reserve.drink.recipe[1].amount);

if(DB.currentShelf.bottles[reserve.locations[0]].volume != vol1 && DB.currentShelf.bottles[reserve.locations[1]].volume != vol2) {
    console.log("Test failure!");
    failure++;
} else {
    console.log("Test success!:");
    success++;
}
total++;
console.log("");

// Testing the export-function.
console.log("----------------------------------------------------");
console.log("Test 8: Exporting the current database to db_expdrinks.json and db_expshelf.json:");
console.log("----------------------------------------------------");
console.log("");

// db_expdrinks.json should be identical to the one loaded earlier (db_drinkDB_test.json);
// db_expshelf.json should be almost identical to the one loaded earlier (db_bottleShelf.json);
// the differences:
// CranberryJuices volume should be 0, The first vodka should be at 60. Gin should be at 92 and Tonic at 86.

try { 
    DB.exportDB('db_expdrinks.json', 'db_expshelf.json');
    success++;    
} catch(err) {
    failure++;
}
total++;
// 

// Testing the changing of vodkabottle to another.
console.log("----------------------------------------------------");
console.log("Test 9: Testing of switching to the next bottle of same kind.");
console.log("----------------------------------------------------");
console.log("");

// As the cranberry juice is over. let's fill it:
loc1 = DB.currentShelf.findBottleLocations('CranberryJuice');
DB.reservedShelf.bottles[loc1[0]].fill();

// Order another 10 vodka cranberries.
DB.checkDrinkAvailability('VodkaCranberry');
for(let i = 0; i < 10; i++) {
    DB.reserveDrink('VodkaCranberry');
}
// Try to order another one (Vodka should be at 20, cranberry juice at 0.:
if(DB.reserveDrink('VodkaCranberry') != false) {
    failure++;
    console.log("Test failure!");
} else {
    DB.checkDrinkAvailability('Screwdriver');
    // Order 5 screwdrivers, vodka should go to 0. Save the location of the vodka bottle.
    // Order 1.
    reserve = DB.reserveDrink('Screwdriver');
    loc1 = reserve.locations[0];
    // Order 4 more.
    for(let i = 0; i < 4; i++) {
        reserve = DB.reserveDrink('Screwdriver');
        loc2 = reserve.locations[0];
    }
    // Loc1 and Loc2 should still equal, as the bottle hasn't changed.
    if(loc1 != loc2) {
        failure++;
        console.log("Test failure!")
    } else {
        // Let's order the next Screwdriver.
        reserve = DB.reserveDrink('Screwdriver');
        // Check if the location is different.
        if(loc1 == reserve.locations[0]) {
            failure++;
            console.log("Test failure!");
        } else {
            // Find the index of the second vodka bottle and compare that to see if the drink was really made of vodka.
            let locs = DB.reservedShelf.findBottleLocations('Vodka');
            if(locs[1] != reserve.locations[0]) {
                failure++;
                console.log("Test failure!")
            } else {
                success++;
                console.log("Test success!");
            }
        }
    }
}
total++;

console.log("");
console.log("");
console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');
console.log("");