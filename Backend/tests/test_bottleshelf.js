// Testing of the BottleShelf-class.
"use strict";
let BottleShelf = require('../bottleshelf.js');

let success = 0;
let failure = 0;
let total = 0;


let BS = new BottleShelf();

// Test name, availability, recipe:
console.log("----------------------------------------------------");
console.log('Test 1: Testing of the constructor:');
console.log("----------------------------------------------------");
console.log("");
let testif = true;
if(BS.length = 12 && typeof(BS.bottles) == 'object' && testif) {
	for(let i = 0; i < 12; i++) {
		if(BS.bottles[i] != 'empty') {
			testif = false;
		}
	}
	success++;
	console.log('Test success!');
} else {
	testif = false;
}
if(!testif) {
	failure++;
	console.log('Test failure!');
}
total++;
console.log("");

// Testing the getBottles() -subroutine.
console.log("----------------------------------------------------");
console.log('Test 2: Testing the getBottles() -subroutine with an empty shelf:');
console.log("----------------------------------------------------");
console.log("");

BS.getBottles();
if(BS.getBottles() != ['empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty','empty']) {
	failure++;
	console.log('Test failure!');
} else {
	success++;
	console.log('Test success!');
}
total++;
console.log("");

// Testing the getBottles() - subroutine.
console.log("----------------------------------------------------");
console.log('Test 3: Testing the addBottle() and getBottles() -subroutines with a new bottle:');
console.log("----------------------------------------------------");
console.log("");

let bottleString= '{ "name":"Janoviina", "type":"Lasijallupullo", "volume":10,"pourSpeed":2, "isAlcoholic":true}';
BS.addBottle(bottleString, 5);

if(BS.getBottles() != ['empty','empty','empty','empty','Janoviina','empty','empty','empty','empty','empty','empty','empty']) {
	failure++;
	console.log('Test failure!');
} else {
	if(typeof(BS.bottles[5]) != 'object' && BS.bottles[5].name != 'Janoviina' && BS.bottles[5].type != 'Lasijallupullo' 
		&& BS.bottles[5].volume != 10 && BS.bottles[5].pourSpeed != 2 && BS.bottles[5].isAlcoholic != true) {
			failure++;
			console.log('Test failure!');
		} else {
			success++;
			console.log('Test success!');
		}
}
total++;
console.log("");

// Testing the exportShelf -function.
// Hyllytesti1.txt should contain:
// {['empty','empty','empty','empty',{"name":"Janoviina", "type":"Lasijallupullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},'empty','empty','empty','empty','empty','empty','empty'] } 	
BS.exportShelf('hyllytesti1.txt');

// Testing the adding of more bottles:
console.log("----------------------------------------------------");
console.log('Test 4: Testing the addBottle() and getBottles() -subroutines with two new objects:');
console.log("----------------------------------------------------");
console.log("");

BS.addBottle(bottleString,1);
bottleString= '{"name":"Gin", "type":"Bombaypullo", "volume":10,"pourSpeed":2, "isAlcoholic":true}';
BS.addBottle(bottleString, 6);

if(BS.getBottles() != ['Janoviina','empty','empty','empty','Janoviina','Gin','empty','empty','empty','empty','empty','empty']) {
	failure++;
	console.log('Test failure!');
} else {
	if(typeof(BS.bottles[1]) != 'object' && BS.bottles[1].name != 'Janoviina' && BS.bottles[1].type != 'Lasijallupullo' 
		&& BS.bottles[1].volume != 10 && BS.bottles[1].pourSpeed != 2 && BS.bottles[1].isAlcoholic != true && 
		typeof(BS.bottles[5]) != 'object' && BS.bottles[5].name != 'Janoviina' && BS.bottles[5].type != 'Lasijallupullo' 
		&& BS.bottles[5].volume != 10 && BS.bottles[5].pourSpeed != 2 && BS.bottles[5].isAlcoholic != true &&
		typeof(BS.bottles[6]) != 'object' && BS.bottles[6].name != 'Gin' && BS.bottles[5].type != 'Bombaypullo' 
		&& BS.bottles[6].volume != 10 && BS.bottles[6].pourSpeed != 2 && BS.bottles[6].isAlcoholic != true) {
			failure++;
			console.log('Test failure!');
		} else {
			success++;
			console.log('Test success!');
		}
}
total++;
console.log("");

// Testing the replacing of and old bottle:
console.log("----------------------------------------------------");
console.log('Test 5: Testing the addBottle() and getBottles() -subroutines with a replacing bottle:');
console.log("----------------------------------------------------");
console.log("");

BS.addBottle(bottleString, 5);

if(BS.getBottles() != ['Janoviina','empty','empty','empty','Gin','Gin','empty','empty','empty','empty','empty','empty']) {
	failure++;
	console.log('Test failure!');
} else {
	if(typeof(BS.bottles[1]) != 'object' && BS.bottles[1].name != 'Janoviina' && BS.bottles[1].type != 'Lasijallupullo' 
		&& BS.bottles[1].volume != 10 && BS.bottles[1].pourSpeed != 2 && BS.bottles[1].isAlcoholic != true && 
		typeof(BS.bottles[5]) != 'object' && BS.bottles[5].name != 'Gin' && BS.bottles[5].type != 'Bombaypullo' 
		&& BS.bottles[5].volume != 10 && BS.bottles[5].pourSpeed != 2 && BS.bottles[5].isAlcoholic != true &&
		typeof(BS.bottles[6]) != 'object' && BS.bottles[6].name != 'Gin' && BS.bottles[5].type != 'Bombaypullo' 
		&& BS.bottles[6].volume != 10 && BS.bottles[6].pourSpeed != 2 && BS.bottles[6].isAlcoholic != true) {
			failure++;
			console.log('Test failure!');
		} else {
			success++;
			console.log('Test success!');
		}
}
total++;
console.log("");

// The second export test: Hyllytesti2.txt should contain: 
// {[{"name":"Janoviina", "type":"Lasijallupullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},'empty','empty','empty',{"name":"Gin", "type":"Bombaypullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},{"name":"Gin", "type":"Bombaypullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},'empty','empty','empty','empty','empty','empty'] } 	
BS.exportShelf('hyllytesti2.txt');

// Testing the findBottleLocations() subroutine:
console.log("----------------------------------------------------");
console.log('Test 6: Testing the findBottleLocations() with a single object:');
console.log("----------------------------------------------------");
console.log("");

if(BS.findBottleLocations('Janoviina') != [1]) {
	failure++;
	console.log('Test failure!');
} else {
	success++;
	console.log('Test success!');
}
total++;
console.log("");

// Testing the findBottleLocations() subroutine with two returns:
console.log("----------------------------------------------------");
console.log('Test 6: Testing the findBottleLocations() with two objects:');
console.log("----------------------------------------------------");
console.log("");

if(BS.findBottleLocations('Gin') != [5,6]) {
	failure++;
	console.log('Test failure!');
} else {
	success++;
	console.log('Test success!');
}
total++;
console.log("");

//TODO
console.log('TEST: Removing bottle based on location:');
BS.removeBottle(5);
console.log('')
console.log('TEST: Trying to remove bottle based on name:');
BS.removeBottle('Janoviina');
console.log(BS.getBottles);
BS.loadShelf('hyllytesti1.txt'); // Reads or doesn't, depending of the writing speed of the computer, otherwise throws an error.
console.log(BS.getBottles());
BS.loadShelf('hyllytesti2.txt'); // Reads or doesn't, depending of the writing speed of the computer, otherwise throws an error.


console.log("");
console.log("");
console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');
console.log("");
