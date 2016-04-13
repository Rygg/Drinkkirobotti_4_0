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
var ID = 0;
// var orderQueue = backend.orderQueue;
// Testipullot:
// backend.database.currentShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
// backend.database.currentShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)
// backend.database.reservedShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
// backend.database.reservedShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)

var orderQueue = [];
/*orderQueue.push( { id: 1, drinkName: "ScrewDriver", orderer: "Matti" } );
orderQueue.push( { id: 2, drinkName: "ScrewDriver", orderer: "Teppo" } );
orderQueue.push( { id: 3, drinkName: "ScrewDriver", orderer: "Seppo" } );
orderQueue.push( { id: 5, drinkName: "ScrewDriver", orderer: "Ville" } );
orderQueue.push( { id: 4, drinkName: "Apple Juice", orderer: "Jori" } );
orderQueue.push( { id: 6, drinkName: "Apple Juice", orderer: "Jakke" } );
orderQueue.push( { id: 7, drinkName: "Apple Juice", orderer: "Sepi" } );
orderQueue.push( { id: 8, drinkName: "Green Widow", orderer: "Juha88" } );
*/
// autentikointi

// UI:n aukaisu automaattisesti
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ui_customer.html');
});
app.get('/operator', function (req, res) {
  res.sendFile(__dirname + '/ui_operator.html');
});
var exec = require('child_process').exec;
exec('explorer "http://localhost:3000/"', function(error, stdout, stderr) {
});
//

io.on('connection', function(socket){
	socket.emit('initializeList', orderQueue);
	console.log('a user connected');

	socket.on('giveorder', function(drinkName, ordererName) {
		console.log('new order!');
		ID = ID+1;
                console.log("Tilattiin "+drinkName+", tarjoillaan GT.");
                order = { "ID": ID, "drinkName": "GT", "orderer":ordererName };
                console.log(order);
                JSONI = JSON.stringify(order);
								orderQueue.push(JSONI); //testi
		//backend.processOrder(JSONI);
	});

});