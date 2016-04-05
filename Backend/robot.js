// Implementation of the class that connects with the robot controller
"use strict";

// Require SerialPort-library (npm install serialport)
// if problems -> sudo npm install --unsafe-perm serialport
const SerialPort = require("serialport");

// Serial Port configuration:
const port = '/dev/ttyUSB0';
// Create the serialPort variable:
let serialPort = new SerialPort.SerialPort(port, {
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
                serialPort.write("Ma ajan koko yon", function(err,res) {
                    if(err) {
                        throw err;
                    } else {
                        console.log("Wrote to serial, response: " + res);
                    }

                });
                serialPort.on('data', function(data) {    
                    console.log("Tuli dataa: ");
                    console.log(data);
                    i++;
                    serialPort.close();
                });
            }
        })
    }
    listen() {
        serialPort.on('data', function(data) {
            console.log("Tuli data: ");
            console.log(data);
        });
    }
    
    // Other functions for writing to the serial port for robot control.
    
};

let i = 0;


let Rob = new Robot();
Rob.listen();

//serialPort.close();
