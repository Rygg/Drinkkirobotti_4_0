// Require express, http, socketio
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
/*var Logic = require('./Backend/logic.js');*/

// create and initialize the server
var app = express();
var server = http.createServer(app);
var io = socketio(server);
/*
try {
	var backend = new Logic();
} catch(err) {
	console.log("hups" + err);
}
*/
server.listen(3000, function(){
	console.log("Started");
});

// Käytettävät kansiot
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/Drinkit'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/Backend/logic.js'));
//

// servun muuttujat
var ID = 9;
var orderQueue = [];
orderQueue.push( { id: 1, drinkName: "ScrewDriver", orderer: "Matti" } );
orderQueue.push( { id: 2, drinkName: "ScrewDriver", orderer: "Teppo" } );
orderQueue.push( { id: 3, drinkName: "ScrewDriver", orderer: "Seppo" } );
orderQueue.push( { id: 4, drinkName: "Apple Juice", orderer: "Jori" } );
orderQueue.push( { id: 5, drinkName: "ScrewDriver", orderer: "Ville" } );
orderQueue.push( { id: 6, drinkName: "Apple Juice", orderer: "Seppo" } );
orderQueue.push( { id: 7, drinkName: "Apple Juice", orderer: "Jori" } );
orderQueue.push( { id: 8, drinkName: "Green Widow", orderer: "Ville" } );

// UI:n aukaisu automaattisesti
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ui_customer.html');
});
var exec = require('child_process').exec;
exec('explorer "http://localhost:3000/"', function(error, stdout, stderr) {
});
//

io.on('connection', function(socket){
	socket.emit('initializeList', orderQueue);
	console.log('a user connected');

	socket.on('orderDrink', function(drinkName) {
		io.emit('drinkOrdered', drinkName);
	});

	socket.on('giveorder', function(drinkName, ordererName) {
		console.log('new order!');
		ID = ID + 1;
		console.log(drinkName);
		console.log(ordererName);
		console.log(ID);
		var JSONI = { "id": ID, "drinkName": drinkName, "orderer": ordererName };
		console.log(JSON.stringify(JSONI));
		orderQueue.push(JSONI);
	});

});
