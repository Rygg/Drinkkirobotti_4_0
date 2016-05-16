// Source code for the bottleshelf module.
"use strict";
// Load the filestream -module.
let fs = require('fs');
// Constant value for the bottleshelf size.
const MAX_BOTTLES = 9;

// Class Bottle
class Bottle {
    constructor(name, type, volume, pourSpeed, isAlcoholic) {
        this.name = name; // Assumes string
        this.type = type; // Assumes string
        this.volume = volume; // Assumes int
        this.pourSpeed = pourSpeed; // Assumes int
        this.isAlcoholic = isAlcoholic; // Assumes boolean
    }
    fill() {
        this.volume = 100; // Fill to 100cl.
    }
};

// Class Shelf:
class BottleShelf {
    
    // Creates a new array with the size 12 that's filled with the strings 'empty'.
    constructor() {
        this.bottles = new Array(9);
        this.bottles.fill('empty');
    }
    
    // Adds a bottle to the specific location in the shelf. Assumes a JSON-String of Bottle-object.
    // Returns 1 if the bottle was placed in the place, 0 if place was occupied.
    // If location isn't between 0 and 11 or is not specified or JSON cannot be parsed, returns -1.
    addBottle(bottle, location) {
        // Check for the value of location parameter. If incorrect, return false.
        if(location < 0 || location > (MAX_BOTTLES -1) || typeof(location) != 'number') {
            console.log('Error occurred while adding bottle: Invalid location for bottle.');
            return -1;
        }
        // Check if the current bottleslot is occupied.
        if(this.bottles[location] != 'empty') {
            console.log('Error occurred while adding bottle: The location is occupied by another bottle.');
            return 0;
        }
        // Parse an object from the JSON string.
        let temp;
        try {
            temp = JSON.parse(bottle); 
        } catch(err) {
            console.log("Error while adding bottle to the shelf: " + err.message);
            return -1;
        }
        
        // Create a new bottle object based on the objects fields, add it to the intended location in the container.
        let newBottle = new Bottle(temp.name, temp.type, temp.volume, temp.pourSpeed, temp.isAlcoholic);
        this.bottles[location] = newBottle;
        console.log('Bottle ' + newBottle.name + ' added succesfully to location '+ location +'.');
        return 1;
    }
    
    // Removes a bottle from the shelf based on its location.
    // Returns true if succesfull, false if no bottle is present in the location or the location is faulted.
    removeBottle(location) {
        // Check for the parameter restrictions.
        if(location < 0 || location > (MAX_BOTTLES -1) || typeof(location) != 'number') {
            console.log('Unknown bottle location while removing bottle.');
            return false;
        }
        // Check if the slot is empty.
        if(this.bottles[location] == 'empty') {
            console.log('No bottle present in location ' + location + '.');
            return false;
        }
        // Remove the bottle.
        this.bottles[location] = 'empty';
        console.log('Bottle from location ' + location + ' was removed succesfully.');
        return true;
    }
    
    // Returns an array of the bottle names present in the shelf
    getBottles() {
        // Create the return array:
        let array = [];
        // Push all the non-empty elements in it.
        for(let i = 0; i < this.bottles.length; i++) {
            if(this.bottles[i] != 'empty') {
                array.push(this.bottles[i].name);
            }
        }
        // Return the array.
        return array;
    }
    
    // Finds the location of the bottles by the searched name.
    // Returns an array of positions 0-11 (can be empty) for success and nothing for configuration error.
    findBottleLocations(name) {
        // Simple for-loop:
        let array = [];
        for(let i = 0; i < this.bottles.length; i++) {
            // If the index exceeds 11, there is too many bottles in the bottleshelf and an error must occur.
            if(i > MAX_BOTTLES -1) {
                console.log('Error: There\'s too many bottles in the bottleshelf');
                return;
            }
            // Push all the found results in to the array.
            if(this.bottles[i].name == name) {
                array.push(i);
            }
        }
        return array;
    } 
    
    // Loads the shelf configuration from a separate file. Clears the current structure when called.
    // Returns true if succesfull, false if the file is in the wrong format.
    loadShelf(filename) {
        console.log('Loading bottleshelf from file ' + filename +'.');
        // Empty the current bottleshelf:
        this.bottles = [];
        
        // Create an object from the read data.
        // Check if the file is indeed a string.
        let objString;
        try {
            objString = fs.readFileSync(filename, 'utf-8'); 
        } catch(err) {
            console.log('Error while reading shelf configuration from file: ' + err.message + '.');
            return false;
        }
        let object;
        try {
            object = JSON.parse(objString);
	    console.log(object.length);
        } catch (err) {
            console.log('Error while reading shelf configuration from file: ' + err.message + '.');
            return false;
        }
        // Check if the length of the object is 12.
        if(object.length != MAX_BOTTLES) {
            console.log('Error while reading shelf configuration from file ' + filename +': Not a proper BottleShelf-object.');
            return false;
        }
       
        for(let i = 0; i < object.length; i++) {
            // Check if the current object in the list is the correct form:
            if( (typeof(object[i].name) == 'string' && typeof(object[i].type) == 'string' && typeof(object[i].volume) == 'number' 
                && typeof(object[i].pourSpeed) == 'number' && typeof(object[i].isAlcoholic) == 'boolean') ) {
                    // If so, create object and add to container at the location i:
                    let temp = new Bottle(object[i].name, object[i].type, object[i].volume, object[i].pourSpeed, object[i].isAlcoholic);
                    this.bottles[i] = temp;
                    
            }
            // If it wasn't, check if the current slot was empty.
            else if(object[i] == 'empty') {
                this.bottles[i] = 'empty';
            } 
            // If it wasn't, the file is in an incorrect format:
            else {
                console.log('Error while reading shelf configuration from file ' + filename +': Not a proper BottleShelf-object.');
                this.bottles.fill('empty');
                return false;
            }
                 
        }
        // Success!
        console.log('Bottleshelf configuration imported succesfully!');
        return true;
    }
    
    // Exports the shelf configuration to a separate file.
    // Asynchronous functionality.
    exportShelf(filename) {
        // Create the JSON-string of the bottleshelf.
        console.log('Exporting the configuration of the bottle shelf to ' + filename + '.')
        let exportString = JSON.stringify(this.bottles);
        fs.writeFile(filename, exportString, (err) => {
            if (err) {
                throw err;
            }
            console.log('Bottleshelf configuration saved to the file ' + filename + '.');
            return;
        })
        return;
    }
    
};


module.exports = BottleShelf;
