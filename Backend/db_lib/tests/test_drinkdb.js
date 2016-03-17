// Testing of the DrinkDB-class.
"use strict";
let DrinkDB = require('../drinkdb.js');

let success = 0;
let failure = 0;
let total = 0;

// Testing the constructor
let DB = new DrinkDB();
console.log("----------------------------------------------------");
console.log("Test 1: Testing the constructor");
console.log("----------------------------------------------------");
console.log("");
// Should have an empty array.
if (DB.drinks.length == 0 && DB.drinks) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;


// Test 2: Test adding a drink:
console.log("----------------------------------------------------");
console.log("Test 2: Testing 'addDrink()'.");
console.log("----------------------------------------------------");
console.log("");
let resepti = '[{"bottleName": "Jallu", "amount":4},{"bottleName":"Kahvi","amount":4}]'; 
DB.addDrink('Jallukahvi', resepti);
// Should have an array with 1 element with a Drink-object. The addPortion()-function adding the recipe has been tested in the test_drink.js.
if (DB.drinks.length == 1 && DB.drinks[0].name == "Jallukahvi" && typeof(DB.drinks[0].available) == 'boolean' && DB.drinks[0].recipe) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;

console.log("");
// FIRST EXPORT:
// testi.json should contain:
// [{"name":"Jallukahvi","available":false,"recipe":[{"bottleName":"Jallu","amount":4},{"bottleName":"Kahvi","amount":4}]}]
DB.export('testi.json');
console.log("");

// Test 3: Adding another drink
console.log("----------------------------------------------------");
console.log("Test 3: Testing 'addDrink()' - adding another drink.");
console.log("----------------------------------------------------");
console.log("");

resepti = '[{"bottleName": "Jack Daniels", "amount":6},{"bottleName":"Coca-Cola","amount":8}]';
DB.addDrink('Lemmy', resepti);
// Should have an array with 2 drinks. 
if (DB.drinks.length == 2 && DB.drinks[0].name == "Jallukahvi" && typeof(DB.drinks[0].available) == 'boolean' && DB.drinks[0].recipe &&
    DB.drinks[1].name == "Lemmy" && typeof(DB.drinks[1].available) == 'boolean' && DB.drinks[1].recipe) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

// Test 4: Adding another drink with an invalid bottle parameter
console.log("----------------------------------------------------");
console.log("Test 4: Testing 'addDrink()' - adding a drink with an invalid bottle.");
console.log("----------------------------------------------------");
console.log("");

resepti = '[{"bottleName": "Jack Daniels", "amount":6,{"bottleName":"Coca-Cola","amount":8}]';
if(DB.addDrink('Ei toimi', resepti) != false) {
    console.log("Test failure!");
    failure++;
} else {
    // Should still have an array with 2 drinks. 
    if (DB.drinks.length == 2 && DB.drinks[0].name == "Jallukahvi" && typeof(DB.drinks[0].available) == 'boolean' && DB.drinks[0].recipe &&
        DB.drinks[1].name == "Lemmy" && typeof(DB.drinks[1].available) == 'boolean' && DB.drinks[1].recipe) {
        console.log("Test success!");
        success++;
    } else {
        console.log("Test failure!");
        failure++;
    }    
}

total++;
console.log("");

 
 // Test #4: Adding a drink with the same name.
console.log("----------------------------------------------------");
console.log("Test 5: Testing 'addDrink()' - adding a drink with the same name.");
console.log("----------------------------------------------------");
console.log("");

resepti = '[{"bottleName": "Jallu", "amount":6},{"bottleName":"Kahvi","amount":4}]'; 
DB.addDrink('Jallukahvi', resepti);
// Should have an array with 2 drinks, with the "new" drink pushed to the back of the container. 
if (DB.drinks.length == 2 && DB.drinks[1].name == "Jallukahvi" && typeof(DB.drinks[1].available) == 'boolean' && DB.drinks[1].recipe &&
    DB.drinks[0].name == "Lemmy" && typeof(DB.drinks[0].available) == 'boolean' && DB.drinks[0].recipe) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

// SECOND EXPORT:
/* testi3.json should contain:
[{"name":"Jallukahvi","available":false,"recipe":[{"bottleName":"Jallu","amount":6},{"bottleName":"Kahvi","amount":4}]},
{"name":"Lemmy","available":false,"recipe":[{"bottleName":"Jack Daniels","amount":6},{"bottleName":"Coca-Cola","amount":8}]}]
*/
DB.export('testi3.json');
console.log("");


console.log("----------------------------------------------------");
console.log("Test 6: Testing 'removeDrink()'.");
console.log("----------------------------------------------------");
console.log("");

DB.removeDrink('Lemmy');
// Should contain just one object in the database.
if (DB.drinks.length == 1 && DB.drinks[0].name == "Jallukahvi" && typeof(DB.drinks[0].available) == 'boolean' && DB.drinks[0].recipe) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

// THIRD EXPORT:
/* testi4.json should contain:
[{"name":"Jallukahvi","available":false,"recipe":[{"bottleName":"Jallu","amount":6},{"bottleName":"Kahvi","amount":4}]}]
*/

DB.export('testi4.json');
console.log("");

// Test 6: Testing the initializing (read from file).
console.log("----------------------------------------------------");
console.log("Test 7: Testing 'intialize()'. Also tests if objects keep their methods when read from file.");
console.log("----------------------------------------------------");
console.log("");

DB.initialize('testi5.json');
DB.drinks[2].addPortion('Ice',1); // If no error/crash, methods retained.

// Should contain:
if (DB.drinks.length == 4 && DB.drinks[0].name == "Jallukahvi" && typeof(DB.drinks[0].available) == 'boolean' && DB.drinks[0].recipe &&
    DB.drinks[1].name == "Jallukola" && DB.drinks[2].name == "Lemmy" && DB.drinks[3].name == "GT") {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

// THIRD EXPORT:
/* testi2.json should contain:
[{"name":"Jallukahvi","available":false,"recipe":[{"bottleName":"Jallu","amount":6},{"bottleName":"Kahvi","amount":4}]},
{"name":"Jallukola","available":false,"recipe":[{"bottleName":"Jallu","amount":6},{"bottleName":"Kola","amount":8}]},
{"name":"Lemmy","available":false,"recipe":[{"bottleName":"Jack","amount":6},{"bottleName":"Kola","amount":8},{"bottleName":"Ice","amount":1}]},
{"name":"GT","available":false,"recipe":[{"bottleName":"Gin","amount":6},{"bottleName":"Tonic","amount":10}]}]
*/

DB.export('testi2.json');


// Test 7: Testing the initializing (read from file).
console.log("----------------------------------------------------");
console.log("Test 8: Testing 'intialize()' with an invalid filename.");
console.log("----------------------------------------------------");
console.log("");

let ans = DB.initialize('eiole.txt');
// Should be false:
if (!ans) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

// Test 8: Testing the initializing (read from file).
console.log("----------------------------------------------------");
console.log("Test 9: Testing 'intialize()' with file that doesn't include JSON.");
console.log("----------------------------------------------------");
console.log("");

ans = DB.initialize('notJSON.json');
// Should be false:
if (!ans) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

// Test 9: Testing the initializing (read from file).
console.log("----------------------------------------------------");
console.log("Test 10: Testing 'intialize()' with file that includes JSON in a wrong structure.");
console.log("----------------------------------------------------");
console.log("");

ans = DB.initialize('invalid_drinkDB.json');
// Should be false:
if (!ans) {
    console.log("Test success!");
    success++;
} else {
    console.log("Test failure!");
    failure++;
}
total++;
console.log("");

console.log("");
console.log("");
console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');
console.log("");