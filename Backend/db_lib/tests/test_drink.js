// Testing of the Drink-class:
"use strict";
let Drink = require('../drink.js');

let success = 0;
let failure = 0;
let total = 0;

console.log('Running the tests for the class "Drink":');

// Create the test drink.
let GT = new Drink('GT');

// Test name, availability, recipe:
console.log("----------------------------------------------------");
console.log('Test 1: Testing of the constructor:');
console.log("----------------------------------------------------");
console.log("");
if(GT.name == 'GT' && GT.available == false && GT.recipe && GT.recipe.length ==0) {
    console.log('Test success!');
    success++;
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// Test adding portions:
console.log("----------------------------------------------------");
console.log('Test 2: Testing the proper use of "addPortion()".');
console.log("----------------------------------------------------");
console.log("");
GT.addPortion('Gin', 4);
GT.addPortion('Tonic', 6);
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 4 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Test success!');
    success++;
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// Test adding a portion without amount:
console.log("----------------------------------------------------");
console.log('Test 3: Testing "addPortion()" - adding a portion without the amount.');
console.log("----------------------------------------------------");
console.log("");
GT.addPortion('Kalja');
// Nothing happens:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 4 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Test success!');
    success++;
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// Test adding a portion with NaN amount:
console.log("----------------------------------------------------");
console.log('Test 4: Testing "addPortion()" - adding a portion with an invalid amount.');
console.log("----------------------------------------------------");
console.log("");

GT.addPortion('Kalja', 'einain');
// Nothing happens:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 4 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Test success!');
    success++;
// Something happened:
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// Test changing the value of existing portion while adding a portion to the drink.
console.log("----------------------------------------------------");
console.log('Test 5: Testing "addPortion()" - adding an already increasing portion and therefore changing the amount.')
console.log("----------------------------------------------------");
console.log("");
GT.addPortion('Gin', 6);
// Only the amount should change:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 6 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Test success!');
    success++;
// Something else happened:
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// Test trying to remove a portion that doesn't exist:
console.log("----------------------------------------------------");
console.log('Test 6: Testing "removePortion()" - Trying to remove a portion that doesn\'t exist:');
console.log("----------------------------------------------------");
console.log("");
GT.removePortion('Kaljala');
// Nothing should happen:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 6 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Test success!');
    success++;
// Something happened:
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// Test trying to remove a portion that exists:
console.log("----------------------------------------------------");
console.log('Test 7: Testing "removePortion()" - Trying to remove a portion that exists:');
console.log("----------------------------------------------------");
console.log("");
GT.removePortion('Tonic');
// The recipe should change to pure Gin:
if(GT.recipe.length == 1 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 6) {
    console.log('Test success!');
    success++;
// Something else happened:
} else {
    console.log('Test failure!');
    failure++;
}
total++;
console.log("");

// TODO:
// Test checkAvailability() - function () (if it even is here and not in the app itself.).
console.log("");
console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');


