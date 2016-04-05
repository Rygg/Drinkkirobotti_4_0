// Implementation of the class that connects with the robot controller
"use strict";

// Require SerialPort-library (npm install serialport)
// if problems -> sudo npm install --unsafe-perm serialport
const SerialPort = require("serialport");

// Create the eventEmitter for timeouts.
const EventEmitter = require('events');
class RobotEmitterC extends EventEmitter {}
const RobotEmitter = new RobotEmitterC;


let timeout_occurred = false;
// Serial Port configuration:
const port = '/dev/ttyUSB0';

// Create the serialport:
let serialPort = new SerialPort.SerialPort(port, {
    baudrate: 9600
});

class Robot { 
    // Construct the robot class:
    constructor() {
        // Set the flags for monitoring the robot process.
        this.communicating = false;
        this.working = false;
        this.lastCommand = 'none';

        // Open the Serial Port connection
        serialPort.open(function(err) {
            if(err) {
                throw err; // Port failed to open:
            }
            // Port opened 
            else {
                console.log("SerialPort connection to controller opened.");
            }    
        })
    }

    // Other functions for writing to the serial port for robot control - False is unable to comply.
    grabBottle(location, type) {
        if(!ableToMove) {
            return false;
        }
        // Check possible last commands:
        if(this.lastCommand == 'pourDrinks' || this.lastCommand == 'grabBottle') {
            console.log("Unable to execute command: The robot is already holding a bottle");
            return false;
        }
        // Robot should be able to perform the task:
        this.communicating = true;
        let command = 'grabBottle(' + location + ',' + type + ')';
        this.lastCommand = 'grabBottle';

        // Set the timeout calculator:
        let timeout = setTimeout(function() {
            RobotEmitter.emit('timeout_grabBottle');
            }, 1000); // One second timeout.

        // Write the command to the serialport.
        writeSerial(command,timeout);
        
        let func = grabBottle;
        // Check if timeout happened.
        RobotEmitter.once('timeout_grabBottle', function(func) {
            // Argument to return false.
            func.return = false;
            console.log("grabBottle()-function timed out.");
        });
    }
    
    // Pouring a drink from the grabbed bottle - (Boolean):
    pourDrinks(pourTime, howMany) {
        
    }
    
    // Returning the grabbed bottle to the bottleshelf after pouring the drinks - (Boolean):
    returnBottle(location, type) {
        
    }
    
    // Placing the grabbed bottle to the bottlechange-station - (Boolean):
    removeBottle(type) {
        
    }
    
    // Grab a new bottle from the bottlechange-station - (Boolean):
    getNewBottle(location, type) {
        
    }


    // Function to pack up the commonly used response handling.
    
};

// Function to check if the robot is busy.
function ableToMove() {
    // Check if the robot is busy.
    if(this.communicating || this.working) {
        console.log("Unable to execute command: Robot is busy.");
        return false;
    }
    // Doublecheck if the parameters are defined and proper. 
    if(typeof(location) != 'number' || location < 0 || location > 11  || typeof(type) != 'string') {
        console.log("Error with parameters. grabBottle-command not registered.");
        return false;
    }
    return true;
}

// Function to pack up the commonly used writing to serial.
function writeSerial(command,timeout) {
    // Write the command to the serial connection. 
    serialPort.write(command, function(err,result) {
        if(timeout || result != command.length) {
            return;
        }
        clearTimeout(timeout);
        try {
            responseHandler(err, result);
        } catch(error) {
            console.log("Error occurred while writing to serial: " + error);
        }
    });
}

// Function to pack up the commonly used response handling.
function responseHandler(err,result) {
    if(err) {
        throw err;
    }
    console.log("Wrote to serial, waiting for response:");
    serialPort.on('data', function(err, data){
        if(err) {
            throw err;
        }
        if(data == 'working') { // To be changed to the actual command declared later on.
            this.working = true;
            this.communicating = false;
            console.log("Robot is working");
            RobotEmitter.emit('working_grabBottle');
        } else {
            this.working = false;
            this.communicating = false;
            console.log("Error: Robot couldn't execute the command.");
            RobotEmitter.emit('failed_grabBottle');
        }   
    })
}


let  i = 0;


let Rob = new Robot();


setTimeout(function(err) {
    Rob.grabBottle(5,'Bombay');
}, 2500);


//serialPort.close();


// Export serialport connection and robot module
module.exports.Robot = Robot;
module.exports.serialPort = serialPort;
module.exports.RobotEmitter = RobotEmitter;
