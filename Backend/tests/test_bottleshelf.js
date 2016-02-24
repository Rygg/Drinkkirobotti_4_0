// Testing of the BottleShelf-class.
"use strict";
let BottleShelf = require('../bottleshelf.js');

let success = 0;
let failure = 0;
let total = 0;

// Todotesting:
let BS = new BottleShelf();
console.log(BS);
console.log(BS.getBottles());
let bottleString= '{ "name":"Janoviina", "type":"whatisthis?", "volume":10,"pourSpeed":2, "isAlcoholic":true}';
BS.addBottle(bottleString, 5);
console.log(BS.getBottles());
BS.exportShelf('hyllytesti1.txt');
BS.addBottle(bottleString,1);
bottleString= '{ "name":"Gin", "type":"whatisthis?", "volume":10,"pourSpeed":2, "isAlcoholic":true}';
BS.addBottle(bottleString, 6);
BS.addBottle(bottleString, 5);
console.log(BS.getBottles());
BS.exportShelf('hyllytesti2.txt');
console.log('TEST: Find bottle locations for Janoviina');
console.log(BS.findBottleLocations('Janoviina'));
console.log('TEST: Find bottle location for Gin');
console.log(BS.findBottleLocations('Gin'));
console.log('TEST: Removing bottle based on location:');
BS.removeBottle(5);
console.log('')
console.log('TEST: Trying to remove bottle based on name:');
BS.removeBottle('Janoviina');
console.log(BS.getBottles);
BS.loadShelf('hyllytesti1.txt'); // Reads or doesn't, depending of the writing speed of the computer, otherwise throws an error.
console.log(BS.getBottles());
BS.loadShelf('hyllytesti2.txt'); // Reads or doesn't, depending of the writing speed of the computer, otherwise throws an error.

