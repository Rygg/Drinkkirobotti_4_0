// Implementation of the class that connects with the robot controller
"use strict";

// Require SerialPort-library (npm install serialport)
// if problems -> sudo npm install --unsafe-perm serialport
let SerialPort = require("serialport").SerialPort;

// Serial Port configuration:
let port = "/dev/ttyUSB0";
// Create the serialPort variable:
let serialPort = new SerialPort(port, {
    baudrate: 9600
});

class Robot {
    // Construct the robot class:
    constructor() {
        // Set the flags for monitoring process from outside the class.
        this.busy = false;
        
        // Open the Serial Port connection
        serialPort.open(function(err) {
            if(err) {
                throw err; // Port failed to open:
            }
            // Open a constant listening to the port: 
            else {
                console.log("SerialPort connection to controller opened.");
                console.log("Listening:");
                serialPort.on('data', handler(data)); 
            }
        })
    }
    
    // Other functions for writing to the serial port for robot control.
    
};


// Function to handle the listened communication:
function handler(data) {
    console.log(data);
    return;
}
 

