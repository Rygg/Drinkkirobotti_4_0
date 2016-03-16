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
    // returns false if the drink is not available in the database, though assumes it is in there.
    // Implementation for ID parameter is missing, assuming parameter.
    reserveDrink(drinkName, id) {        
        // Search the drink from the database.
        let usedDrink;
        for (let i = 0; i < this.drinkDB.drinks.length; i++) {
            if (this.drinkDB.drinks[i].name == drinkName) {
                // Drink found, find the bottles used:
                if (this.drinkDB.drinks[i].available) {
                    usedDrink = this.drinkDB.drinks[i];
                } else {
                    return false;
                }
            }
        }
        let usedLocations = [];
        // Find bottles and their locations.
        // Remove the amounts from the reserved shelf.
        for (let i = 0; i < usedDrink.recipe.length; i++) {
            let am  = usedDrink.recipe[i].amount;
            let loc = this.reservedShelf.findBottleLocations(usedDrink.recipe[i].bottleName);
            
            this.reservedShelf.bottles[loc].volume =- am;
            usedLocations.push(loc);
        }
        
        return {
            drink: usedDrink,
            locations: usedLocations,
            ID: id
        };
    }
        
    // Function for canceling a drink from the queue. Returns the reservedShelf back to the original value before the order.
    // Returns true for a succesful operation and false for failure.
    cancelDrink(qObject) {
        // Go through the recipe of the drink and add the correct amounts back to the bottles:
        // try-catch incase something weird has happened with the indeces.
        try {
            for(let i = 0; i < qObject.drink.recipe.length; i++) {
                let returnAmount = qObject.drink.recipe[i].amount;
                let currentLoc = qObject.locations[i];
                this.reservedShelf.bottles[currentLoc].amount += returnAmount;
            }
            return true;
        } catch() {
            return false;
        }
    }
    
    // Function for removing the poured amount from the bottle in the correct location after the pour action
    // has been completed.
    // rather simple but keeps the implementation more module.
    pourCompleted(location, amount) {
        this.currentShelf[location].amount =- amount;
        return;
    }
    
    // A function for simply importing both bottleshelf and drinkDB at once. On a second thought completely useless? 
    // Maybe for a "read/write default structure"
    importDB(drinkDB_file, bottleShelf_file) {
        return;
    }
    
    // A function for simply exporting both bottleshelf and drinkDB at once. On a second thought completely useless?  
    // Maybe for a "read/write default structure."
    exportDB(drinkDB_file, bottleShelf_file) {
        return;
    }
    
    // A function that checks availability of the drinks. To be used by main program when adding a drink to the database. 
    checkDrinkAvailability(drinkName) {
        // Create a variable for the drinks availability:
        let isAvailable = true;
        // Get the drinks recipe:
        let recipe;
        for(let i = 0; i < this.drinkDB.drinks.length; i++) {
            if(this.drinkDB.drinks[i].name == drinkName) {

            }
        }

        return;
    }
    
};

module.exports = Database;
