// Source code for the drink class.

"use strict"; // Force to strict mode for Class and Let usage.

// Data structure for portion
class Portion {
    constructor(bottlename, amount) {
        this.bottleName = bottlename;
        this.amount = amount;
    }
};

// Datastructure for the drink class:
class Drink {
    constructor(name) {
        this.name = name;
        this.available = false;
        this.recipe = [];
    }

    // Function for adding a portion into the recipe-array. Incase of duplicates, changes the amount of the drink.
    addPortion(pname, pamount) {
        // Check for invalid amount:
        if (typeof(pamount) != "number") {
            console.log('Invalid amount when adding ' + pname + ' to recipe.')
            return;
        }
        // Check for duplicates:
        for (let i = 0; i < this.recipe.length; i++) {
            if (this.recipe[i].bottleName == pname) {
                this.recipe[i].amount = pamount;
                console.log(pname + ' already found in the recipe. Changed the amount to ' + pamount + 'cl.');
                return;
            }
        }
        // Add a new portion:
        let newportion = new Portion(pname, pamount)
        this.recipe.push(newportion);
        console.log('Added ' + pamount + 'cl of ' + pname + ' to the recipe.')
    }

    // Function for removing the portion of the wanted name from the recipe-array.
    removePortion(pname) {
        // Search and remove:
        for(let i = 0; i < this.recipe.length; i++) {
            if (this.recipe[i].bottleName == pname) {
                this.recipe.splice(i, 1);
                console.log('Removed ' + pname + ' from the recipe.')
                return;
            }
        }
        // Not found:
        console.log(pname + ' not found in the recipe.')
    }

    // Function which checks if the drink can be mixed with current bottles:
    checkAvailability() {
        //Todo:
        if(this.available = false) {
            this.available = true;
        }
        return;
    }

};

module.exports = Drink;
