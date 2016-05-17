// The definition of the Database class:
"use strict";

// Imported the already defined classes placed in the db_lib folder:
let DrinkDB = require('./db_lib/drinkdb.js');
let BottleShelf = require ('./db_lib/bottleshelf.js');
let Drink = require('./db_lib/drink.js');

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
        let usedDrink = new Drink();
        for (let i = 0; i < this.drinkDB.drinks.length; i++) {
            if (this.drinkDB.drinks[i].name == drinkName) {
                // Drink found, find the bottles used:
                if (this.drinkDB.drinks[i].available) {
                    usedDrink.name = this.drinkDB.drinks[i].name;
                    usedDrink.available = this.drinkDB.drinks[i].available;
                    usedDrink.recipe = this.drinkDB.drinks[i].recipe.slice(0);
                } else {
                    // Drink not found in the database
                    console.log("Drink not available in the database.");
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
            // Bottle not present.
            if(loc.length == 0 && typeof(loc) == 'undefined') {
                return false;
            }
            // Bottle only in one location:
            else if(loc.length == 1) {
                this.reservedShelf.bottles[loc[0]].volume -= am;
                usedLocations.push(loc[0]);    
            } 
            // Bottle in more than 1 place. Check from the number 0 onwards if it has enough.
            else {
                for(let j = 0; j < loc.length; j++) {
                    if(this.reservedShelf.bottles[loc[j]].volume >= am) {
                        // Found an okay bottle:
                        this.reservedShelf.bottles[loc[j]].volume -= am;
                        usedLocations.push(loc[j]);
                        break;
                    } // Not this round, repeat:       
                }    
            }
        }
        
        // Check availability and return the QueueObject
        this.checkDrinkAvailability(drinkName);
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
                this.reservedShelf.bottles[currentLoc].volume += returnAmount;
            }
            return true;
        } catch(err) {
            console.log("Canceling drink failed: "+err.message);
            return false;
        }
    }
    
    // Function for removing the poured amount from the bottle in the correct location after the pour action
    // has been completed.
    // rather simple but keeps the implementation more module.
    pourCompleted(location, amount, howMany) {
        amount = howMany*amount;
        this.currentShelf.bottles[location].volume -= amount;
        console.log("New volume is: " + this.currentShelf.bottles[location].volume);
        return;
    }
    
    // A function for simply importing both bottleshelf and drinkDB at once.
    importDB(drinkDB_file, bottleShelf_file) {
        // Check if only the drinkDB is imported (the usual case);
        if(typeof(bottleShelf_file) == 'undefined') {
            this.drinkDB.initialize(drinkDB_file);
        }
        // A bottleShelf file also needs to be imported.
        else {
            this.drinkDB.initialize(drinkDB_file);
            this.currentShelf.loadShelf(bottleShelf_file);
            this.reservedShelf.loadShelf(bottleShelf_file);
        }
        // Exit
        // Check drink availability for all the drinks imported.
        for(let i = 0; i < this.drinkDB.drinks.length; i++) {
            this.checkDrinkAvailability(this.drinkDB.drinks[i].name);
        }
        return;
    }
    
    // A function for simply exporting both bottleshelf and drinkDB at once. 
    exportDB(drinkDB_file, bottleShelf_file) {
        // Check if only the drinkDB is to be exported (the usual case);
        if(typeof(bottleShelf_file) == 'undefined') {
            this.drinkDB.export(drinkDB_file);
        }
        // A bottleShelf file also needs to be imported.
        else {
            this.drinkDB.export(drinkDB_file);
            this.currentShelf.exportShelf(bottleShelf_file);
            this.reservedShelf.exportShelf(bottleShelf_file);
        }
        // Exit
        return;
    }
    
    // A function that checks availability of the drinks. 
    // Has to be used by main program when adding a drink or adding/removing bottles in the database. 
    // Changes the value for the drink in the database and returns the result.
    checkDrinkAvailability(drinkName) {
        // Create a variable for the drinks availability:
        let isAvailable = true;
        // Get the drinks recipe and location in the drinkdb:
        let drinkLocation = 0;
        let recipe;
        // Search
        for(drinkLocation; drinkLocation < this.drinkDB.drinks.length; drinkLocation++) {
            if(this.drinkDB.drinks[drinkLocation].name == drinkName) {
                recipe = this.drinkDB.drinks[drinkLocation].recipe;
                break;
            }
        }
        if(typeof(recipe) == 'undefined') {
            console.log("Drink not available as it is not in the database.");
            return false;    
        }
        // Check if the bottleshelf has the proper bottles in it:
        for (let i = 0; i < recipe.length; i++) {
            let loc = this.reservedShelf.findBottleLocations(recipe[i].bottleName);
            if(loc.length == 0 || typeof(loc) == 'undefined') {
                // Bottle not present in the shelf configuration
                isAvailable = false;
                break;
            }
            // Check in how many bottles the liquid is available in:
            else if(loc.length == 1) {
                // Operate normally:
                if(this.reservedShelf.bottles[loc[0]].volume < recipe[i].amount) {
                    // The bottle does not have enough liquid in it.
                    isAvailable = false;
                    break;
                }
            } else {
                // More than one bottle present.
                for(let j = 0; j < loc.length; j++) {
                    if(this.reservedShelf.bottles[loc[j]].volume >= recipe[i].amount) {
                        // Found an okay bottle:
                        isAvailable = true;
                        break;
                    } // Not this round:
                    isAvailable = false;
                }
            } 
        }
        // Set the availability value for the drink:
        this.drinkDB.drinks[drinkLocation].available = isAvailable;
        
        return isAvailable; // Exit and return the result.
    }
    
    addBottle(bottle, location) {
        this.reservedShelf.addBottle(bottle,location);
        this.currentShelf.addBottle(bottle,location);

        // Looping through the whole drinkDB to check availability.
	console.log("Checking availability for every drink in the DB.");
        for(let i = 0; i < this.drinkDB.drinks.length; i++) {
            if(this.checkDrinkAvailability(this.drinkDB.drinks[i].name)) {
                console.log("Drink: " + this.drinkDB.drinks[i].name + " is now available.");
            } else {
                console.log(this.drinkDB.drinks[i].name + "Not yet available.");
            }
        };
    }
};

module.exports = Database;
