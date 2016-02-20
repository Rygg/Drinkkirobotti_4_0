// Source code for drinkdatabase functions
"use strict";

// Import Drink-class
let Drink = require("./drink.js");

// The definition for the class
class DrinkDB {
    constructor(){
        this.drinks = [];
    }
    
    // Function which adds a drink to the drinks array. Assumes a string and an array of portions as parameters
    addDrink(name, recipe) {
        console.log('Adding drink ' + name + ' to the database.');

        // Create the drink
        let beverage = new Drink(name);
        // Copy the recipe from the parameter
        for (let i = 0; i < recipe.length; i++) {
            beverage.addPortion(recipe[i].bottleName, recipe[i].amount);
        }
        // Add to the container
        this.drinks.push(beverage);
    
        console.log('Succesfully added drink ' + name + ' to the database.');
    }
    
    // The function that reads the drink database from a separate file.
    initialize() {
        return;
        //Todo
    }
    
    // The function which writes the drink database into a separate file.
    export() {
        //todo
        let drinklist = JSON.stringify(this.drinks[0]);
        console.log(drinklist);
    }
};




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

// For testing, cp:d from the file
let Portion = function (bottlename, amount) {
    this.bottleName = bottlename;
    this.amount = amount;
};

let DB = new DrinkDB();
let resepti = [];
resepti.push(new Portion("Jallu", 4));
resepti.push(new Portion("Kahvi", 4));
console.log(resepti);

DB.addDrink('Jallukahvi', resepti);
DB.export;
