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
if(BS.getBottles().length != 0) {
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

if(BS.getBottles().length != 1 && BS.getBottles()[0] != 'Janoviina') {
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

if(BS.getBottles().length != 3 && BS.getBottles()[0] != 'Janoviina' && BS.getBottles()[1] != 'Janoviina' && BS.getBottles()[2] != 'Gin') {
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

// Testing the replacing of an old bottle:
console.log("----------------------------------------------------");
console.log('Test 5: Testing the addBottle() and getBottles() -subroutines with a replacing bottle:');
console.log("----------------------------------------------------");
console.log("");

if(BS.addBottle(bottleString, 5) != 0) {
    failure++;
    console.log('Test failure!');
} else {
    if(BS.getBottles().length != 3 && BS.getBottles()[0] != 'Janoviina' && BS.getBottles()[1] != 'Janoviina' && BS.getBottles()[2] != 'Gin') {
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
}

total++;
console.log("");

// Testing the adding of a new bottle with invalid parameter of the shelf location.
console.log("----------------------------------------------------");
console.log('Test 6: Testing the addBottle() and getBottles() -subroutines with invalid location:');
console.log("----------------------------------------------------");
console.log("");

if(BS.addBottle(bottleString, 45) != -1) {
    failure++;
    console.log('Test failure!');
} else {
    if(BS.getBottles().length != 3 && BS.getBottles()[0] != 'Janoviina' && BS.getBottles()[1] != 'Janoviina' && BS.getBottles()[2] != 'Gin') {
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
}

total++;
console.log("");

// Testing the adding of a new bottle with invalid parameter for the bottle.
console.log("----------------------------------------------------");
console.log('Test 7: Testing the addBottle() and getBottles() -subroutines with invalid bottle:');
console.log("----------------------------------------------------");
console.log("");

let errorString = 'Error';
if(BS.addBottle(errorString, 7) != -1) {
    failure++;
    console.log('Test failure!');
} else {
    if(BS.getBottles().length != 3 && BS.getBottles()[0] != 'Janoviina' && BS.getBottles()[1] != 'Janoviina' && BS.getBottles()[2] != 'Gin') {
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
}

total++;
console.log("");


// The second export test: Hyllytesti2.txt should contain: 
// {[{"name":"Janoviina", "type":"Lasijallupullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},'empty','empty','empty',{"name":"Janoviina", "type":"Lasijallupullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},{"name":"Gin", "type":"Bombaypullo", "volume":10,"pourSpeed":2, "isAlcoholic":true},'empty','empty','empty','empty','empty','empty'] } 	
BS.exportShelf('hyllytesti2.txt');

// Testing the findBottleLocations() subroutine:
console.log("----------------------------------------------------");
console.log('Test 8: Testing the findBottleLocations() with a single object:');
console.log("----------------------------------------------------");
console.log("");

if(BS.findBottleLocations('Gin').length != 1 && BS.findBottleLocations('Janoviina')[0] != 6) {
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
console.log('Test 9: Testing the findBottleLocations() with two objects:');
console.log("----------------------------------------------------");
console.log("");

if(BS.findBottleLocations('Janoviina').length != 2 && BS.findBottleLocations('Janoviina')[0] != 1 && BS.findBottleLocations('Janoviina')[0] != 5) {
	failure++;
	console.log('Test failure!');
} else {
	success++;
	console.log('Test success!');
}
total++;
console.log("");

// Testing the removeBottle() subroutine:
console.log("----------------------------------------------------");
console.log('Test 10: Testing the removeBottle() with no parameters:');
console.log("----------------------------------------------------");
console.log("");

if(BS.removeBottle() != false) {
    failure++;
	console.log('Test failure!');
} else {
	success++;
	console.log('Test success!');
}
total++;
console.log("");


// Testing the removeBottle() subroutine:
console.log("----------------------------------------------------");
console.log('Test 11: Testing the removeBottle() with invalid parameter:');
console.log("----------------------------------------------------");
console.log("");

if(BS.removeBottle(48) != false) {
    failure++;
	console.log('Test failure!');
} else {
	success++;
	console.log('Test success!');
}
total++;
console.log("");

// Testing the removeBottle() subroutine:
console.log("----------------------------------------------------");
console.log('Test 12: Testing the removeBottle() with a proper parameter:');
console.log("----------------------------------------------------");
console.log("");

if(BS.removeBottle(5) != true) {
    failure++;
	console.log('Test failure!');
} else {
	if(BS.getBottles().length != 2 && BS.getBottles()[0] != 'Janoviina' && BS.getBottles()[1] != 'Gin') {
	failure++;
	console.log('Test failure!');
    } else {
        if(typeof(BS.bottles[1]) != 'object' && BS.bottles[1].name != 'Janoviina' && BS.bottles[1].type != 'Lasijallupullo' 
		&& BS.bottles[1].volume != 10 && BS.bottles[1].pourSpeed != 2 && BS.bottles[1].isAlcoholic != true && 
		typeof(BS.bottles[5]) != 'string' && BS.bottles[5] != 'empty' &&
		typeof(BS.bottles[6]) != 'object' && BS.bottles[6].name != 'Gin' && BS.bottles[5].type != 'Bombaypullo' 
		&& BS.bottles[6].volume != 10 && BS.bottles[6].pourSpeed != 2 && BS.bottles[6].isAlcoholic != true) {
		    failure++;
			console.log('Test failure!');
		} else {
		    success++;
		    console.log('Test success!');
        }
    }
}

total++;
console.log("");

// Testing the removeBottle() subroutine:
console.log("----------------------------------------------------");
console.log('Test 13: Testing the removeBottle() with an empty location:');
console.log("----------------------------------------------------");
console.log("");

if(BS.removeBottle(9) != false) {
    failure++;
	console.log('Test failure!');
} else {
	if(BS.getBottles().length != 2 && BS.getBottles()[0] != 'Janoviina' && BS.getBottles()[1] != 'Gin') {
	failure++;
	console.log('Test failure!');
    } else {
        if(typeof(BS.bottles[1]) != 'object' && BS.bottles[1].name != 'Janoviina' && BS.bottles[1].type != 'Lasijallupullo' 
		&& BS.bottles[1].volume != 10 && BS.bottles[1].pourSpeed != 2 && BS.bottles[1].isAlcoholic != true && 
		typeof(BS.bottles[5]) != 'string' && BS.bottles[5] != 'empty' &&
		typeof(BS.bottles[6]) != 'object' && BS.bottles[6].name != 'Gin' && BS.bottles[5].type != 'Bombaypullo' 
		&& BS.bottles[6].volume != 10 && BS.bottles[6].pourSpeed != 2 && BS.bottles[6].isAlcoholic != true) {
		    failure++;
			console.log('Test failure!');
		} else {
		    success++;
		    console.log('Test success!');
        }
    }
}

total++;
console.log("");

// Testing the loadShelf()-function:
console.log("----------------------------------------------------");
console.log('Test 14: Testing the loadShelf() with an invalid filename:');
console.log("----------------------------------------------------");
console.log("");

if(BS.loadShelf('eiole.txt') != false && this.bottles.length != 0) {
    failure++;
    console.log('Test failure!');
} else {
    success++;
	console.log('Test success!');
}
total++;
console.log("");

// Testing the loadShelf()-function:
console.log("----------------------------------------------------");
console.log('Test 15: Testing the loadShelf() with a file that is not in JSON format:');
console.log("----------------------------------------------------");
console.log("");

if(BS.loadShelf('notJSON.txt') != false && this.bottles.length != 0) {
    failure++;
    console.log('Test failure!');
} else {
    success++;
	console.log('Test success!');
}
total++;
console.log("");


// Testing the loadShelf()-function:
console.log("----------------------------------------------------");
console.log('Test 16: Testing the loadShelf() with a file that is not a correct bottleShelf object:');
console.log("----------------------------------------------------");
console.log("");

if(BS.loadShelf('invalid_bottleShelf.txt') != false && this.bottles.length != 0) {
    failure++;
    console.log('Test failure!');
} else {
    success++;
	console.log('Test success!');
}
total++;
console.log("");

// Testing the loadShelf()-function:
console.log("----------------------------------------------------");
console.log('Test 17: Testing the loadShelf() with a file with a correct bottleShelf object:');
console.log("----------------------------------------------------");
console.log("");

if(BS.loadShelf('test_bottleShelf.txt') != true && BS.bottles.length != 12) {
    failure++;
    console.log('Test failure!');
} else {
    if(typeof(BS.bottles[1]) != 'object' && BS.bottles[1].name != 'Finlandia' && BS.bottles[1].type != 'Finlandia' 
	&& BS.bottles[1].volume != 10 && BS.bottles[1].pourSpeed != 2 && BS.bottles[1].isAlcoholic != true && BS.bottles[2] != 'empty' &&
    BS.bottles[3] != 'empty' && BS.bottles[4] != 'empty' && 
	typeof(BS.bottles[5]) != 'object' && BS.bottles[5].name != 'Janoviina' && BS.bottles[5].type != 'Lasijallupullo' 
	&& BS.bottles[5].volume != 10 && BS.bottles[5].pourSpeed != 2 && BS.bottles[5].isAlcoholic != true &&
	typeof(BS.bottles[6]) != 'object' && BS.bottles[6].name != 'Gin' && BS.bottles[5].type != 'Bombaypullo' 
	&& BS.bottles[6].volume != 10 && BS.bottles[6].pourSpeed != 2 && BS.bottles[6].isAlcoholic != true &&
    BS.bottles[7] != 'empty' && BS.bottles[8] != 'empty' && BS.bottles[9] != 'empty' && BS.bottles[10] != 'empty' &&
    BS.bottles[11] != 'empty') {
	    failure++;
		console.log('Test failure!');
	} else {
	    success++;
	    console.log('Test success!');
    }
}
total++;
console.log("");

console.log("");
console.log("");
console.log('Testing completed: ' + total + ' tests were run with ' + success + ' successes and ' +failure + ' failures.');
console.log("");
