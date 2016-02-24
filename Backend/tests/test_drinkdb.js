// Testing of the DrinkDB-class.
"use strict";
let DrinkDB = require('../drinkdb.js');

// Testing of the Database
let DB = new DrinkDB();
let resepti = '[{"bottleName": "Jallu", "amount":4},{"bottleName":"Kahvi","amount":4}]';
let resp = JSON.parse(resepti); 
DB.addDrink('Jallukahvi', resepti);
DB.export('testi.txt');
resepti = '[{"bottleName": "Jallu", "amount":6},{"bottleName":"Kahvi","amount":4}]';
DB.addDrink('Jallukahvi', resepti);
resepti = '[{"bottleName": "Jack Daniels", "amount":6},{"bottleName":"Coca-Cola","amount":8}]';
DB.addDrink('Lemmy', resepti);
DB.export('testi3.txt');
DB.removeDrink('Lemmy');
DB.export('testi4.txt');
DB.initialize('testi5.txt');
DB.drinks[2].addPortion('Ice',1);
DB.export('testi2.txt');