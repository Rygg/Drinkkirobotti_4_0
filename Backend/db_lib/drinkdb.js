// Source code for drinkdatabase functions
"use strict";

// Import Drink-class
let Drink = require("./drink.js");
// Import FileSystem for reading and writing.
let fs = require('fs');


// The definition for the class
class DrinkDB {
    constructor(){
        this.drinks = [];
    }
    
    // Function which adds a drink to the drinks array. Assumes a string and a JSON-string of an array of portions as parameters. 
    // TODO?: Also appends the drink to the drinklist.txt.
    // Difficulty: Changing recipe values of the already existing drinks, currently done by exporting the whole drinklist.
    addDrink(name, recipeJSON, initialized) {
        if(typeof(initialized) == 'undefined') {
            initialized = false;
        }
        //console.log('Adding drink ' + name + ' to the database.');
        // Create an object of the recipe-parameter
        let recipe;
        try {
            recipe = JSON.parse(recipeJSON);
        } catch(err) {
            console.log("Error when adding drink: " + err.message);
            return false;
        }
        // Create the object for the drink.
        let beverage = new Drink(name);
        // Copy the recipe from the parameter
        for (let i = 0; i < recipe.length; i++) {
            beverage.addPortion(recipe[i].bottleName, recipe[i].amount);
        }        
        // Check the database if the drink already exists and if so, remove it.
        if(!initialized) {
            this.removeDrink(name);
        } else {
            this.removeDrink(name, true);
        }
        // Add the new drink to the container.
        this.drinks.push(beverage);
        // If the DB is not being imported, export the new drinklist to the default file.
        if(!initialized) {
            changeExport(this.drinks);
        }
        console.log('Succesfully added drink ' + name + ' to the database.');
        return true;
    }
    
    // The function that searches for a drink by name and removes it if found.
    removeDrink(name, initialized) {
        if(typeof(initialized) == 'undefined') {
            initialized == false;
        }
        // Search for the drink
        for(let i = 0; i < this.drinks.length; i++) {
            if(this.drinks[i].name == name) {
                // Remove it
                this.drinks.splice(i, 1);
                // Export the new database list.
                if(!initialized) {
                    changeExport(this.drinks);    
                }
                console.log('Succesfully removed the drink ' + name + ' from the drink database.')
                return;
            }
        }
        // Drink was not in the database.
        if (!initialized) {
            console.log('Drink ' + name + ' not present in the database.');    
        }  
        return;
    }
    
    // The function that reads the drink database from a separate file.
    initialize(filename) {
        // Check for default filename:
        if(typeof(filename) == 'undefined') {
            filename = 'drinkdb.json';
        }
        console.log('Initializing database from the file ' + filename + '.');
        // Empty the current database:
        this.drinks = [];

        // Read the file using utf-8 encoding, save the data to the DBstring.
        let DBstring;
        try {
            DBstring = fs.readFileSync(filename, 'utf-8');
        } catch(err) {
            console.log("Error: Could not read file: " + err.message + ".");
            return false;
        } 
        // Parse to DB and // Check if the type is correct:
        let DB;
        try {
            DB = JSON.parse(DBstring);    
        } catch(err) {
            console.log("Error: The drink database file could not be read: " + err.message + ".");
            return false;
        }
        // If the read file indeed was in JSON format, replace the current database with the one read by adding objects.
        for(let i = 0; i < DB.length; i++) {
            // Get the name and the recipe, if they exist. Utilizes checkFormat()-function to check whether the current element is a correct element for the database.
            if (checkFormat(DB[i])) {
                let name = DB[i].name;
                let recipe = JSON.stringify(DB[i].recipe);
                // Add the drink in the initialization mode.
                this.addDrink(name,recipe,true);
            } 
            // If the object was in the wrong format, return false: 
            else {
                console.log('Error: The drink database could not be read: Not a proper DrinkDB-object.');
                console.log('Reseting drink database.');
                this.drinks = [];
                return false;
            }
            
        }
        console.log("Database initialized succesfully!");
        return true;
    }
    
    // The function which writes the current drink database into a separate 'drinklist.txt' file.
    // NOTE: Currently asynchronous behaviour, might be a problem? Probably not on this one though.
    export(filename) {
        // Check for default filename:
        if(typeof(filename) == 'undefined') {
            filename = 'drinkdb.json';
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

// Convert the Database to JSON String and save to default file:
function changeExport(object) {
    let drinksJSON = JSON.stringify(object);
    fs.writeFileSync("drinkdb.json", drinksJSON)
    console.log("Changes were made into drinkdb.json");
    return;
}

// Check if the current element in object is a proper DrinkDB object. Returns true/false.
function checkFormat(object) {
    // Check if the drink object inside the container is in the right 'shape'. 
    if ( typeof(object.name) != 'string' || typeof(object.available) != 'boolean' || typeof(object.recipe) != 'object') {
        // Is not.
        return false;
    } 
    // Is, Check if the recipe is an array of portions:
    else {
        for (let i = 0; i < object.recipe.length; i++) {
            if( typeof(object.recipe[i].bottleName) != 'string' || typeof(object.recipe[i].amount) != 'number' ) {
                return false;
            }
        }
    }
    // No errors found.    
    return true;
}

module.exports = DrinkDB;