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
//      DEBUG: No idea why this fails?
console.log('Test 1: Testing of the constructor:');
console.log(GT);
if(GT.name == 'GT' && GT.available == false && GT.recipe == []) {
    console.log('Success!');
    success++;
} else {
    console.log('Failure!');
    failure++;
}
total++;

// Test adding portions:
console.log('Test 2: Testing the proper use of "addPortion()".');
GT.addPortion('Gin', 4);
GT.addPortion('Tonic', 6);
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 4 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Success!');
    success++;
} else {
    console.log('Failure!');
    failure++;
}
total++;

// Test adding a portion without amount:
console.log('Test 3: Testing "addPortion()" - adding a portion without the amount.');
GT.addPortion('Kalja');
// Nothing happens:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 4 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Success!');
    success++;
// Something happened:
} else {
    console.log('Failure!');
    failure++;
}
total++;

// Test adding a portion with NaN amount:
console.log('Test 3: Testing "addPortion()" - adding a portion with an invalid amount.');
GT.addPortion('Kalja', 'einain');
// Nothing happens:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 4 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Success!');
    success++;
// Something happened:
} else {
    console.log('Failure!');
    failure++;
}
total++;

// Test changing the value of existing portion while adding a portion to the drink.
console.log('Test 4: Testing "addPortion()" - adding an already increasing portion and therefore changing the amount.')
GT.addPortion('Gin', 6);
// Only the amount should change:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 6 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Success!');
    success++;
// Something else happened:
} else {
    console.log('Failure!');
    failure++;
}
total++;

// Test trying to remove a portion that doesn't exist:
console.log('Test 5: Testing "removePortion()" - Trying to remove a portion that doesn\'t exist:');
GT.removePortion('Kaljala');
// Nothing should happen:
if(GT.recipe.length == 2 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 6 && 
    GT.recipe[1].bottleName == 'Tonic' && GT.recipe[1].amount == 6) {
    console.log('Success!');
    success++;
// Something happened:
} else {
    console.log('Failure!');
    failure++;
}
total++;

// Test trying to remove a portion that exists:
console.log('Test 5: Testing "removePortion()" - Trying to remove a portion that exists:');
GT.removePortion('Tonic');
// The recipe should change to pure Gin:
if(GT.recipe.length == 1 && GT.recipe[0].bottleName == 'Gin' && GT.recipe[0].amount == 6) {
    console.log('Success!');
    success++;
// Something else happened:
} else {
    console.log('Failure!');
    failure++;
}
total++;

// TODO:
// Test checkAvailability() - function () (if it even is here and not in the app itself.).

console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');


