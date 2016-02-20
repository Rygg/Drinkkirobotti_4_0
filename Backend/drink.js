// Source code for the drink class.


// Data structure for portion
var Portion = function(bottlename, amount) {
    this.bottleName = bottlename;
    this.amount = amount;
};

// Datastructure for a drink.
var Drink = function(name) {
    this.name = name;
    this.available = false;
    this.recipe = [];
};

// Function for adding a portion into the recipe-array. Incase of duplicates, changes the amount.
Drink.prototype.addPortion = function (pname, pamount) {
    if (arguments.length < 1 || typeof(pamount) != "number") {
        console.log('Invalid amount when adding ' + pname + ' to recipe.')
        return;
    }
    for (i = 0; i < this.recipe.length; i++) {
        if (this.recipe[i].bottleName == pname) {
            this.recipe[i].amount = pamount;
            console.log(pname + ' already found in the recipe. Changed the amount to ' + pamount + 'cl.');
            return;
        }
    }
    newportion = new Portion(pname, pamount)
    this.recipe.push(newportion);
    console.log('Added ' + pamount + 'cl of ' + pname + ' to the recipe.')
}

// Function for removing the portion of the wanted name from the recipe-array.
Drink.prototype.removePortion = function (pname) {
    // Search and remove:
    for(i = 0; i < this.recipe.length; i++) {
        if (this.recipe[i].bottleName == pname) {
            this.recipe.splice(i, 1);
            console.log('Removed ' + pname + ' from the recipe.')
            return;
        }
    }
    // Not found:
    console.log(pname + ' not found in the recipe.')
}

// Function which checks if there are ingredients for preparing the drink.
Drink.prototype.checkAvailability = function () {
    //Todo:
    this.available = true;
}

// Function, which turns the portions in the recipe into JSON-strings and returns it in an array.
Drink.prototype.recipetoJSON = function () {
    if (this.recipe.length < 1) {
        console.log('No recipe.')
        return;
    }
    var portions = [];
    var string;
    for (i = 0; i < this.recipe.length; i++) {
        string = JSON.stringify(this.recipe[i]);
        portions.push(string);
    }
    return portions;
}
module.exports = Drink
