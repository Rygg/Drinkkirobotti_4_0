// Require express, http, socketio
"use strict";

var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var Logic = require('./Backend/logic.js');

// create and initialize the server
var app = express();
var server = http.createServer(app);
var io = socketio(server);
var backend = new Logic('test_database.json');
var locations = [""]

server.listen(3000, function(){
	console.log("Started");
});

// Käytettävät kansiot
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/Drinkit'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/Backend/logic.js'));
//

/////////////////////////////////////////////////////////////////////////
///////////////////////////// SIVUT /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ui_customer.html');
});
app.get('/operator', function (req, res) {
  res.sendFile(__dirname + '/ui_operator.html');
});

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Testaus ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// Testipullot:
/*backend.database.currentShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
backend.database.currentShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)
backend.database.reservedShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
backend.database.reservedShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)
*/
/*orderQueue.push( { ID: 1, drinkName: "ScrewDriver", orderer: "Matti" } );
orderQueue.push( { ID: 2, drinkName: "ScrewDriver", orderer: "Teppo" } );
orderQueue.push( { ID: 3, drinkName: "ScrewDriver", orderer: "Seppo" } );
orderQueue.push( { ID: 5, drinkName: "ScrewDriver", orderer: "Ville" } );
orderQueue.push( { ID: 4, drinkName: "Apple Juice", orderer: "Jori" } );
orderQueue.push( { ID: 6, drinkName: "Apple Juice", orderer: "Jakke" } );
orderQueue.push( { ID: 7, drinkName: "Apple Juice", orderer: "Sepi" } );
orderQueue.push( { ID: 8, drinkName: "Green Widow", orderer: "Juha88" } );
*/

/////////////////////////////////////////////////////////////////////////
////////////////////////// Servun muuttujat /////////////////////////////
/////////////////////////////////////////////////////////////////////////
setTimeout(function(){
	var ID = 0;
	var addedBottle = {"name":undefined,"type": undefined,"volume":undefined,"pourSpeed":undefined,"isAlcoholic":undefined};
	var nextBottlePlace = -1;
	var beingPrepared = backend.beingPoured;
	var orderQueue = backend.orderQueue;
	var drinkList = backend.database.drinkDB.drinks; // onko database pienellä vai isolla?

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Socket IO /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket){
	socket.emit('initializeList', orderQueue);
	socket.emit('initializePreparedDrinks', beingPrepared);
	socket.emit('initializeDrinkList',drinkList);
	console.log('a user connected');

	// Tilauksen käsittely
	socket.on('giveorder', function(drinkName, ordererName) {
		ID = ID+1;
    let order = { "ID": ID, "drinkName": drinkName, "orderer":ordererName }
    let JSONI = JSON.stringify(order);
		backend.processOrder(JSONI);
	});

	// Uuden pullon tiedot
	socket.on('bottleadded', function(content,shape,volume) {
		nextBottlePlace = getFreeShelfPlace();
		if (nextBottlePlace != -1){
			addedBottle = { "name": content, "type": shape, "volume":volume,"pourSpeed":1,"isAlcoholic":true};
			let msg = content + "-" + shape + "-" + volume + " is reserved for place: " + nextBottlePlace;
			socket.emit('addedBottleStatus', msg)
		} else {
			let msg = "Shelf is full! Cannot add a new bottle!"
			socket.emit('addedBottleStatus', msg);
		};
	});

	socket.on('removeOrder', function(IDlist){
		for(i=0; i < IDlist.length; i++)
			backend.removeOrder(Number(IDlist[i]));
	});

	socket.on('addNewDrink', function(drinkObject){
		//{"name":"GT","available":false,"recipe":[{"bottleName":"Gin","amount":6},{"bottleName":"Tonic","amount":10}]}
		let JSONI = JSON.stringify(drinkObject);
		backend.database.drinkDB.addDrink(JSONI);
	});

	// pysäyttää robotin seuraavan toiminnon jälkeen
	socket.on('pauserobot', function(){
		backend.pause();
	});

	// antaa robotin jatkaa
	socket.on('resumerobot', function(){
		backend.unpause();
	});

	socket.on('pausegrab', function(location, type){
		backend.pauseGrab(Number(location),type);
	});

	socket.on('pausepour', function(pourTime, howMany,type,location,amount){
		backend.pausePour(Number(pourTime),Number(howMany),type,Number(location),Number(amount));
	});

	socket.on('pausereturn', function(location, type){
		backend.pauseReturn(Number(location),type);
	});

	socket.on('pauseremove', function(location,type){
		backend.pauseRemove(Number(location),type);
	});

	socket.on('pausespin', function() {
		console.log("TODO: Juomakarusellin pyöräytys, TODO");
	});

	socket.on('pausegetnew', function(location, type, Bottle){
		if (addedBottle.type !=undefined){
			let JSONI = JSON.stringify(addedBottle);
			backend.pauseGetNew(Number(location),type,JSONI);
		} else {
			console.log("No in bottlechangestation! Add a bottle first!");
		}
	});
	// Uuden syötettävän pullon tiedot
	socket.on('loadBottle', function() {
		if (addedBottle.type != undefined){
			let JSONI = JSON.stringify(addedBottle);
			backend.newBottleReady(nextBottlePlace,addedBottle.type,JSONI);

			// nollaa pullotiedot
			socket.emit('addedBottleStatus', "");
			addedBottle = {"name":undefined,"type": undefined,"volume":undefined,"pourSpeed":undefined,"isAlcoholic":undefined};
			nextBottlePlace = -1;
		} else {
			socket.emit('addedBottleStatus', "Please add bottleinfo!");
		}
	});

});

setInterval(function () {
	io.emit('initializeList', orderQueue);
	io.emit('initializePreparedDrinks', beingPrepared);
	//console.log('UI updated..');
	//console.log(socket.listeners('initializeList').lenght);
}, 3000);

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Apufunktiot ///////////////////////////////
/////////////////////////////////////////////////////////////////////////

// Funktio hakee vapaan paikan hyllystä. Jos vapaata paikkaa ei löydä palauttaa -1
function getFreeShelfPlace() {
	let bottles = backend.database.currentShelf.getBottles();
	let reserved_places = [];
	// Hae varatut paikat ja lisää ne reserved_places listaan.
	for (let i = 0; i < bottles.length; i++){
		let bottle_locations = backend.database.currentShelf.findBottleLocations(bottles[i]);
		for (let j = 0; j < bottle_locations.length; j++){
			reserved_places.push(bottle_locations[j]);
		}
	};
	//käy läpi paikat 0-12 ja palauta heti, jos paikka vapaana
	for (let i = 0; i < 12; i++){
		if (reserved_places.indexOf(i) == -1){
			return i;
		}
	}
	return -1;
};

},1500);
