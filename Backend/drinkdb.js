// Source code for drinkdatabase functions
"use strict";

// Import Drink-class
const Drink = require("./drink.js");
// Import FileSystem for reading and writing.
const fs = require('fs');


// The definition for the class
class DrinkDB {
    constructor(){
        this.drinks = [];
    }
    
    // Function which adds a drink to the drinks array. Assumes a string and a JSON-string of an array of portions as parameters. 
    // TODO?: Also appends the drink to the drinklist.txt.
    // Difficulty: Changing recipe values of the already existing drinks, currently done by exporting the whole drinklist.
    addDrink(name, recipeJSON) {
        console.log('Adding drink ' + name + ' to the database.');
        // Create an object of the recipe-parameter
        let recipe = JSON.parse(recipeJSON);
        // Create the object for the drink.
        let beverage = new Drink(name);
        // Copy the recipe from the parameter
        for (let i = 0; i < recipe.length; i++) {
            beverage.addPortion(recipe[i].bottleName, recipe[i].amount);
        }
        // Check for current availablity
        beverage.checkAvailability()
        
        // Check the database if the drink already exists and if so, remove it.
        this.removeDrink(name);
        
        // Add the new drink to the container.
        this.drinks.push(beverage);
        // Export the new drinklist to the default file.
        changeExport(this);
        console.log('Succesfully added drink ' + name + ' to the database.');
        return;
    }
    
    // The function that searches for a drink by name and removes it if found.
    removeDrink(name) {
        // Search for the drink
        for(let i = 0; i < this.drinks.length; i++) {
            if(this.drinks[i].name == name) {
                // Remove it
                this.drinks.splice(i, 1);
                // Export the new database list.
                changeExport(this);
                console.log('Succesfully removed the drink ' + name + ' from the drink database.')
                return;
            }
        }
        // Drink was not in the database.  
        console.log('Drink ' + name + ' not present in the database.');
        return;
    }
    
    // The function that reads the drink database from a separate file.
    // NOTE: Currently asynchronous behaviour, might be a problem?
    // to be checked later on on the actual app development.
    initialize(filename) {
        // Check for default filename:
        if(typeof(filename) == 'undefined') {
            filename = 'drinklist.txt'
        }
        console.log('Initializing database from the file ' + filename + '.');
        
        let DB;
        // Read the file using utf-8 encoding.
        fs.readFile(filename, "utf-8", (err, data) => {
            if (err) {
                throw err;
            }            
            // Save the data to the DBString.
            DB = JSON.parse(data);
            // Check if the type is correct:
            if(typeof(DB) != 'object') {
            console.log("Error: The database file could not be read.")
            return;
            }
            // If the read file indeed was in the right format, replace the current database with the one read.
            this.drinks = DB;
            console.log("Database initialized succesfully!");
            return;
        })
        return;
    }
    
    // The function which writes the current drink database into a separate 'drinklist.txt' file.
    // NOTE: Currently asynchronous behaviour, might be a problem? Probably not on this one though.
    export(filename) {
        // Check for default filename:
        if(typeof(filename) == 'undefined') {
            filename = 'drinklist.txt'
        }
        console.log('Exporting the database to ' + filename + '.');
        // Convert the Database to a JSON String.
        let drinksJSON = JSON.stringify(this.drinks);
        // Write it into a file.
        fs.writeFile(filename, drinksJSON, (err) => {
            if (err) {
                throw err;
            }
            console.log('Drink database exported to '+ filename +'.');
            return;
        })
        return;
    }
};

function changeExport(object) {
    // Convert the Database to JSON String:
    let drinksJSON = JSON.stringify(object);
    fs.writeFileSync("drinklist.txt", drinksJSON)
    console.log("Changes were made into drinklist.txt");
    return;
}


module.exports = DrinkDB;

// For testing purposes.
// Drink
console.log('Testing intensifies:')
let GT = new Drink('GT');
GT.addPortion('Gin', 4);
GT.addPortion('Tonic', 6);
GT.addPortion('Kalja');
GT.addPortion('Kalja', "lol");
console.log(GT.recipe);
GT.addPortion('Gin', 6);
console.log(GT.recipe);
GT.removePortion('Kaljala');
console.log(GT.recipe);
GT.removePortion('Tonic');
console.log(GT.recipe);

// Database
let DB = new DrinkDB();
let resepti = '[{"bottleName": "Jallu", "amount":4},{"bottleName":"Kahvi","amount":4}]';
let resp = JSON.parse(resepti); 
DB.addDrink('Jallukahvi', resepti);
DB.export('testi.txt');
resepti = '[{"bottleName": "Jallu", "amount":6},{"bottleName":"Kahvi","amount":4}]';
DB.addDrink('Jallukahvi', resepti);
resepti = '[{"bottleName": "Jack Daniels", "amount":6},{"bottleName":"Coca-Cola","amount":8}]';
DB.addDrink('Lemmy', resepti);
DB.removeDrink('Lemmy');
DB.initialize('testi.txt');
DB.export('testi2.txt');

