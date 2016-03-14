"use strict"

let SerialPort = require("serialport").SerialPort;
let serialPort = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600
}); 

serialPort.open(function(err) {
    if(err) {
        console.log('Failed to open: ' +err);
    } else {
        console.log('Port open');
        serialPort.on('data', function(data) {
            console.log('Data received: '+data);
        });
        serialPort.write('Tytto tule laineille kellumaan kullimaan odottaa (a-a-a) (kulli!) Tyttö vetää spiidot päähän tai paljaltaan kuinka vaan Kulli-Man odottaa (a-a-a) jätä Jukka-poika nukkumaan et haluu Jukkaa ollenkaan vaan Kulli-Man! (kulli!) Tytto tule laineille kellumaan kullimaan odottaa (a-a-a), KULLII! Kulli kikä kulli!', function(err, results) {
            console.log('err', + err);
            console.log('results', results);
        });     
    }    
});

// Listening:
/* 
serialPort.on("open", function() {
    console.log('open');
    serialPort.on('data', function(data) {
        console.log(data);
    });
});
*/
