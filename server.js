var express = require('express'),
	app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/js', express.static(__dirname + '/client/js'));

http.listen(3000, function(){
	console.log("Started");
});

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/Drinkit'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ui_customer.html');
});

var exec = require('child_process').exec;
exec('explorer "http://localhost:3000/"', function(error, stdout, stderr) {

});
