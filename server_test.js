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
var drinkList = ["Screwdriver","Apple Juice","Green Widow"];
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

/////////////////////////////////////////////////////////////////////////
////////////////////////// Servun muuttujat /////////////////////////////
/////////////////////////////////////////////////////////////////////////

var ID = 0;
var addedBottle = {"name":undefined,"type": undefined,"volume":undefined,"pourSpeed":undefined,"isAlcoholic":undefined};
var nextBottlePlace = -1;

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Socket IO /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket){
	socket.emit('initializeDrinkList',drinkList);
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
