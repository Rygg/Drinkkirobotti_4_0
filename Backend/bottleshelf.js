// Source code for the bottleshelf module.
"use strict";

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
        this.volume = 10; // Fill to 10cl.
    }
};

// Class Shelf:
class BottleShelf {
    constructor() {
        this.bottles = new Array(12);
    }
    // Adds a bottle to the specific location in the shelf. Assumes a JSON-String of Bottle-object.
    // Returns true if the bottle was placed in the place, false if place was occupied or not specified.
    // If location isn't between 0 and 11, it will be rounded to 0 or 11.
    addBottle(bottle, location) {
        //todo
    }
    // Removes a bottle from the shelf based on its name.
    // Returns true if succesfull, false if bottle not found.
    removeBottle(name) {
        //todo
    }
    // Returns an array of the bottle names present in the shelf
    listBottles() {
        //todo
    }
    // Finds the location of the bottle by the searched name.
    // Returns 0-11 for success, 0 for not found and -1 for configuration error.
    findBottleLocation(name) {
        //todo
    } 
    // Loads the shelf from a separate file.
    loadShelf(filename) {
        //todo
    }
    // Exports the shelf configuration to a separate file.
    exportShelf(filename) {
        //todo
    }
    
};


module.exports = BottleShelf;


// Testing:
let BS = new BottleShelf();
console.log(BS);
