// Require modules
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var url = require("url");
//var Logic = require('./Backend/logic.js');

// create and initialize the server
var app = express();
var server = http.createServer(app);
var io = socketio(server);
//var backend = new Logic();

server.listen(8080, function(){
	console.log("Started");
});

// Käytettävät kansiot
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/Drinkit'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/Backend/logic.js'));
//

// var orderQueue = backend.orderQueue;
// Testipullot:
// backend.database.currentShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
// backend.database.currentShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)
// backend.database.reservedShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
// backend.database.reservedShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)

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
//////////////////////////TESTAUS TYNGÄT ////////////////////////////////
/////////////////////////////////////////////////////////////////////////
var orderQueue = [];
var beingPrepared = [];
var drinkList = [];
// backend.database.BottleShelf.getBottles();
var backend_getbottles = ["Vodka","Water","OrangeJuice","Water"];
// backend.database.BottleShelf.findBottleLocations(bottles[i])
function backend_findBottleLocations(bottle){
	if (bottle == "Vodka"){
		return [0];
	} else if (bottle == "Water") {
		return [1,4];
	} else if (bottle == "OrangeJuice") {
		return [2,3,5,6,7,8,9,11];
	} else {
		return [];
	}
}

drinkList.push({"name":"GT","available":false,"recipe":[{"bottleName":"Gin","amount":6},{"bottleName":"Tonic","amount":10}]});
drinkList.push({"name":"Screwdriver","available":true,"recipe":[{"bottleName":"Finlandia","amount":4},{"bottleName":"Orange Juice","amount":10}]});
drinkList.push({"name":"Cat","available":false,"recipe":[{"bottleName":"Furball","amount":2},{"bottleName":"Mice","amount":1}]});

orderQueue.push( { ID: 2, drinkName: "ScrewDriver", orderer: "Teppo" } );
orderQueue.push( { ID: 3, drinkName: "ScrewDriver", orderer: "Seppo" } );
orderQueue.push( { ID: 5, drinkName: "ScrewDriver", orderer: "Ville" } );
orderQueue.push( { ID: 4, drinkName: "Apple Juice", orderer: "Jori" } );
orderQueue.push( { ID: 6, drinkName: "Apple Juice", orderer: "Jakke" } );
orderQueue.push( { ID: 7, drinkName: "Apple Juice", orderer: "Sepi" } );
orderQueue.push( { ID: 8, drinkName: "Green Widow", orderer: "Juha88" } );

beingPrepared.push( { ID: 9, drinkName: "ScrewDriver", orderer: "Matti" } );
beingPrepared.push( { ID: 10, drinkName: "ScrewDriver", orderer: "Seppo" } );
beingPrepared.push( { ID: 11, drinkName: "ScrewDriver", orderer: "Teppo" } );


/////////////////////////////////////////////////////////////////////////
////////////////////////// Servun muuttujat /////////////////////////////
/////////////////////////////////////////////////////////////////////////

var ID = 20;
var addedBottle = {"name":undefined,"type": undefined,"volume":undefined,"pourSpeed":undefined,"isAlcoholic":undefined};
var nextBottlePlace = -1;

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Socket IO /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket){
	socket.emit('initializeDrinkList',drinkList);
	socket.emit('initializePreparedDrinks', beingPrepared);
	socket.emit('initializeList', orderQueue);
	console.log('a user connected');

	socket.on('giveorder', function(drinkName, ordererName) {
		console.log('new order!');
		ID = ID+1;
                //console.log("Tilattiin "+drinkName+", tarjoillaan GT.");
                order = { "ID": ID, "drinkName": drinkName, "orderer":ordererName };
                console.log(order);
                //JSONI = JSON.stringify(order); // ota pois testeis
								//orderQueue.push(JSONI);
								orderQueue.push(order); //includaa testeis
								//socket.emit('initializeList', orderQueue);
		//backend.processOrder(JSONI);
	});
	socket.on('bottleadded', function(content,shape,volume) {
		nextBottlePlace = getFreeShelfPlace();
		if (nextBottlePlace != -1){
			addedBottle = { "name": content, "type": shape, "volume":volume,"pourSpeed":1,"isAlcoholic":true};
			JSONI = JSON.stringify(addedBottle);
			//backend.addBottle(JSONI,place);
			bottlestatus = JSONI + " is reserved for place: " + nextBottlePlace;
			socket.emit('addedBottleStatus', bottlestatus)
		} else {
			bottlestatus = "Shelf is full! Cannot add a new bottle!"
			socket.emit('addedBottleStatus', bottlestatus);
		};
	});

	socket.on('removeOrder', function(IDlist){
		for(i=0; i < IDlist.length; i++)
			console.log(Number(IDlist[i]));
	});

	socket.on('addNewDrink', function(drinkObject){
		//{"name":"GT","available":false,"recipe":[{"bottleName":"Gin","amount":6},{"bottleName":"Tonic","amount":10}]}
		var newDrink = {"name":drinkObject.name,"available":true,"recipe":drinkObject.recipe};
		drinkList.push(newDrink)
		socket.emit('initializeDrinkList',drinkList);
	});

	// pysäyttää robotin seuraavan toiminnon jälkeen
	socket.on('pauserobot', function(){
		console.log("Robot paused");
		//backend.pause();
	});

	// antaa robotin jatkaa
	socket.on('resumerobot', function(){
		console.log("resumed");
		//backend.unpause();
	});

	socket.on('pausegrab', function(location, type){
		console.log("location: " + location + " type: " + type);
		//backend.pauseGrab(location,type);
	});

	socket.on('pausepour', function(pourTime, howMany,type,location,amount){
		console.log("pourTime: " + pourTime + " howMany: " + howMany + " type: " + type + " location: " + location + " amount: " + amount);
		//backend.pausePour(pourTime,howMany,3,2);
	});

	socket.on('pausereturn', function(location, type){
		console.log("location: " + location + " type: " + type);
		//backend.pauseReturn(location,type);
	});

	socket.on('pauseremove', function(location,type){
		console.log("location: " + location + " type: " + type);
		//backend.pauseRemove(location,type);
	});

	socket.on('pausespin', function() {
		console.log("TODO: Juomakarusellin pyöräytys, TODO");
	});

	socket.on('pausegetnew', function(location, type){
		if (addedBottle.type !=undefined){
			var JSONI = JSON.stringify(addedBottle);
			console.log(location,type,JSONI);
		} else {
			console.log("No in bottlechangestation! Add a bottle first!");
		}
	});

	socket.on('loadBottle', function() {
		if (addedBottle.type != undefined){
			JSONI = JSON.stringify(addedBottle);
			console.log("newBottleReady: " + nextBottlePlace + ", " + addedBottle.type + ", " + JSONI);
			//backend.newBottleReady(nextBottlePlace,addedBottle.type,JSONI);
			socket.emit('addedBottleStatus', "");
			addedBottle = {"name":undefined,"type": undefined,"volume":undefined,"pourSpeed":undefined,"isAlcoholic":undefined};
			nextBottlePlace = -1;
		} else {
			socket.emit('addedBottleStatus', "Please add bottleinfo!");
			// Joku
		}
	});
});

setInterval(function () {
	io.emit('initializeList', orderQueue);
	//console.log('update');
	//console.log(socket.listeners('initializeList').lenght);
}, 3000);

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Apufunktiot ///////////////////////////////
/////////////////////////////////////////////////////////////////////////

// Funktio hakee vapaan paikan hyllystä. Jos vapaata paikkaa ei löydä palauttaa -1
function getFreeShelfPlace() {

	bottles = backend_getbottles;
	reserved_places = [];
	// Hae varatut paikat ja lisää ne reserved_places listaan.
	for (i = 0; i < bottles.length; i++){
		bottle_locations = backend_findBottleLocations(bottles[i]);
		for (j = 0; j < bottle_locations.length; j++){
			reserved_places.push(bottle_locations[j]);
		}
	};
	//käy läpi paikat 0-12 ja palauta heti, jos paikka vapaana
	for (i = 0; i < 12; i++){
		if (reserved_places.indexOf(i) == -1){
			return i;
		}
	}
	return -1;
};
