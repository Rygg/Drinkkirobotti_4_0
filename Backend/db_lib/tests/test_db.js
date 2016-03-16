// The tests for the db.js functions
"use strict";

let Database = require('../../db.js');

let DB = new Database();

let total = 0;
let failure = 0;
let success = 0;

// Import the bottleshelf and drinkDB
console.log("----------------------------------------------------");
console.log("Test 1: Importing both database objects.");
console.log("----------------------------------------------------");
console.log("");

DB.importDB('db_drinkDB_test.txt', 'db_bottleShelf_test.txt');



