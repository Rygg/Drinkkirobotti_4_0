// The definition of the Database class:
"use strict";

// Imported the already defined classes placed in the db_lib folder:
let DrinkDB = require('./db_lib/drinkdb.js');
let BottleShelf = require ('./db_lib/bottleshelf.js');

// Define the class for the database and it's operations:
class Database {
    // Constructor for the class:
    constructor() {
        this.drinkDB = new DrinkDB();
        this.currentShelf = new BottleShelf();
        this.reservedShelf = new BottleShelf(); 
    }
    
    // Function for reserving a drink from the reservedShelf. Returns the reserved drink(s) in the
    // QueueObject-JSON for the main program to use.  
    reserveDrink(drinkName) {
        return;
    }
    
    // Function for canceling a drink from the queue. Returns the reservedShelf back to the original value before the order.
    // Returns true for a succesful operation and false for failure.
    cancelDrink(qObject) {
        return;
    }
    
    // Function for removing the poured amount from the bottle in the correct location after the pour action
    // has been completed.
    pourCompleted(location, amount) {
        return;
    }
    
    // A function for simply importing both bottleshelf and drinkDB at once. On a second thought completely useless? 
    importDB(drinkDB_file, bottleShelf_file) {
        return;
    }
    
    // A function for simply exporting both bottleshelf and drinkDB at once. On a second thought completely useless?  
    exportDB(drinkDB_file, bottleShelf_file) {
        return;
    }
    
    // A function that checks availability of the drinks. To be used by main program when adding a drink to the database. 
    checkDrinkAvailability(drinkName) {
        return;
    }
    
};

module.exports = Database;
