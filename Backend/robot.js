// Implementation of the class that connects with the robot controller
"use strict";

// Require SerialPort-library (npm install serialport)
// if problems -> sudo npm install --unsafe-perm serialport
const SerialPort = require("serialport");

let timeout_occurred = false;
// Serial Port configuration:
const port = '/dev/ttyUSB0';

class Robot { 
    // Construct the robot class:
    constructor() {
        // Link the serialport to the robot-class as a member variable to export it outside:
        this.serialPort = new SerialPort.SerialPort(port, {
        baudrate: 9600
        });
        // Set the flags for monitoring the robot process.
        this.communicating = false;
        this.working = false;
        this.lastCommand = 'none';

        // Open the Serial Port connection
        this.serialPort.open(function(err) {
            if(err) {
                throw err; // Port failed to open:
            }
            // Open a test listening and writing to the port (TESTING PURPOSES) 
            else {
                console.log("SerialPort connection to controller opened.");
                this.serialPort.write("Ma ajan koko yon", function(err,res) {
                    if(err) {
                        throw err;
                    } else {
                        console.log("Wrote to serial, response: " + res);
                    }

                });
                this.serialPort.on('data', function(data) {    
                    console.log("Tuli dataa: ");
                    console.log(data);
                    i++;
                    this.serialPort.close();
                });
            }
        })
    }    
    
    // Other functions for writing to the serial port for robot control - False is unable to comply.
    
    // Grabbing a bottle from the shelf:
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
        
        // Write the command to the serialport.
        this.lastCommand = 'grabBottle';
        writeSerial(command);
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

// Function to write to write a command to the serial port.
function writeSerial(command) {
    // Set timeout calculator for the write operation (5 seconds for testing purposes):
    let timeout = setTimeout(function() {
        timeout_occurred = true;
        console.log("Program timed out.");
    }, 5000);
    // Write the command to the serial connection. 
    this.serialPort.write(command, function(err,result) {
        if(timeout_occurred) {
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

// Function to be called if writing to port succeeds.
function responseHandler(err, result, success) {
    if(err) {
        throw err;
    }
    console.log("Wrote to serial, waiting for response:");
    this.serialPort.on('data', function(err, data){
        if(err) {
            throw err;
        }
        if(data == 'working') {
            this.working = true;
            this.communicating = false;
            console.log("Robot is working");
        } else {
            this.working = false;
            this.communicating = false;
            console.log("Error: Robot couldn't execute the command.");
        }
    })
      
}


let i = 0;


let Rob = new Robot();
Rob.grabBottle(5,'Bombay');


//serialPort.close();


// Export serialport connection and robot module
module.exports = Robot;