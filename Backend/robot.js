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
    // Other functions for writing to the serial port for robot control.
    
    // Grabbing a bottle from the shelf - (Boolean):
    //
    grabBottle(location, type) {
        // Check if the robot is busy.
        if(this.busy) {
            console.log("Robot is busy, grabBottle-command not registered.");
            return false;
        }
        // Doublecheck if the parameters are defined and proper. 
        if(typeof(location) != 'number' || location < 0 || location > 11  || typeof(type) != 'string') {
            console.log("Error with parameters. grabBottle-command not registered.");
            return false;
        }
        // Robot should be able to perform the task:
        this.busy = 1;
        let command = 'grabBottle(' + location + ',' + type + ')';
        // Set timeout calculator for the write operation (5 seconds for testing purposes):
        let timeout = setTimeout(function() {
            console.log("Program timed out.");
        }, 5000);
        
        serialPort.write(command, function(err,result) {
            clearTimeout(timeout);
            try {
                responseHandler(err, result);
            } catch(error) {
                console.log("Error occurred while writing to serial: " + error);
            }
        });
        // 
        
        
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

function responseHandler(err, result) {
    
    if(err) {
        throw err;
    }
    console.log("Wrote to serial, waiting for response:");
    serialPort.on('data', function(){
    
    })
      
}

let i = 0;


let Rob = new Robot();
Rob.grabBottle(5,'Bombay');


//serialPort.close();
