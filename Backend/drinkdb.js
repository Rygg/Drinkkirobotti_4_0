// Source code for drinkdatabase functions

// Import Drink-class
var Drink = require("./drink.js");

// The definition for the class
var DrinkDB = function () {
    this.drinks = [];
};


// Function which adds a drink to the drinks array. Assumes a string and an array of portions as parameters
DrinkDB.prototype.addDrink = function (name, recipe) {
    console.log('Adding drink ' + name + ' to the database.');
    beverage = new Drink(name);
    for (i = 0; i < recipe.length; i++) {
        beverage.addPortion(recipe[i].bottleName, recipe[i].amount);
    }
    console.log('Succesfully added drink ' + name + 'to the database.');
}

// The function which reads an existing drinkdatabase from a file.
DrinkDB.prototype.initialize = function () {
    // Todo
}



// The function which writes the drink database into a separate file.
DrinkDB.prototype.export = function () {
    var drinklist = JSON.stringify(this.drinks);
    console.log(drinklist);
}



console.log('Testing intensifies:')
var GT = new Drink('GT');
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
var Portion = function (bottlename, amount) {
    this.bottleName = bottlename;
    this.amount = amount;
};

var DB = new DrinkDB();
var resepti = [];
resepti.push(new Portion("Jallu", 4));
resepti.push(new Portion("Kahvi", 4));

DrinkDB.addDrink('Jallukahvi', resepti);
DrinkDB.export;
