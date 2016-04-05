// Implementation of the class that connects with the robot controller
"use strict";

// Require SerialPort-library (npm install serialport)
// if problems -> sudo npm install --unsafe-perm serialport
const SerialPort = require("serialport");

// Create the eventEmitter for timeouts.
const EventEmitter = require('events');
class RobotEmitterC extends EventEmitter {}
const RobotEmitter = new RobotEmitterC;

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
    
       /*---------------------------------------------------------------------------------------------------
                        Callable functions for writing to the serial port for robot control  
       ---------------------------------------------------------------------------------------------------*/
       
       
    // Grabbing the bottle from the bottleshelf. returns an instant false if unable to comply.
    // Emits a RobotEmitter 'done' once fully done with callbacks. the result of the process is stored in the lastCommand-variable.
    // lastCommand == 'grabBottle' if succesful, 'failed' if not.
    grabBottle(location, type) {
        // Name the action.
        let action = 'grabBottle';
        
        // Check if the robot is able to perform the action.
        if(!ableToMove || !checkStatus(action)) {
            return false; // Not.
        }
        
        // Robot should be able to perform the task, prepare the action and format the command:
        let timeout = prepareAction(action);
        let command = action+'('+location+','+type+')';
        // Write the command to the serialport.
        writeSerial(command,timeout);
        
        // Check if the timeout happened.
        let timeoutString = 'timeout_' + action;
        RobotEmitter.once(timeoutString, timeoutHandler(action));
    }
    
    // Pouring a drink from the grabbed bottle: returns an instant false if unable to comply.
    // Emits a RobotEmitter 'done' once fully done with callbacks. the result of the process is stored in the lastCommand-variable.
    // lastCommand == 'grabBottle' if succesful, 'failed' if not.
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



    /*-------------------------------------------------------------------------------------
                  Member functions for event and serial communication handling
    -------------------------------------------------------------------------------------*/
    
    timeoutHandler(action) {
        // Set the lastCommand to 'failed' and emit a 'done'.
        console.log(action+'()-function timed out.');
        this.lastCommand = 'failed';
        RobotEmitter.emit('done');
    }

    
};


    /*-------------------------------------------------------------------------------------
                 Functions for handling the serial communication:
    -------------------------------------------------------------------------------------*/


// Function to pack up the commonly used writing to serial.
function writeSerial(command,timeout) {
    // Write the command to the serial connection. 
    serialPort.write(command, function(err,result) {
        if(timeout || result != command.length) {
            // Do not emit anything and exit. Results in a timeout 'done'.
            return;
        }
        try {
            responseHandler(err, result, timeout);
        } catch(error) {
            // Error occurred, set lastCommand to 'failed' and emit 'done'.
            this.lastCommand = 'failed';
            RobotEmitter.emit('done');
            console.log("Error occurred while writing to serial: " + error);
        }
    });
}

// Function to pack up the commonly used response handling.
function responseHandler(err,result,timeout) {
    if(err) {
        throw err;
    }
    console.log("Wrote to serial, waiting for response:");
    serialPort.on('data', function(err, data){
        if(timeout) {
            // Do not emit anything and exit. Results in a timeout 'done'-emit.
            return;
        }
        // Response read before timeout, clearing the timeout counter.
        clearTimeout(timeout);
        if(err) {
            throw err;
        }
        if(data == 'working') { // To be changed to the actual command declared later on.
            this.working = true;
            this.communicating = false;
            console.log("Robot is working");
            RobotEmitter.emit('done');
        } else {
            this.working = false;
            this.communicating = false;
            this.lastCommand = 'failed';
            console.log("Error: Robot couldn't execute the command.");
            RobotEmitter.emit('done');
        }   
    })
}

// Helper functions:

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

// Function which checks if the robot is able to perform the required operation.
function checkStatus(action) {
    switch(action) {
        // Check if the robot is able to grab a new bottle.
        case grabBottle:
            if(this.lastCommand == 'pourDrinks' || this.lastCommand == 'grabBottle') {
                console.log("Unable to execute command: The robot is already holding a bottle");
                return false;
            }
            return true;
        // Check if the robot is able to pour a drink from the bottle.
        case pourDrinks:
            if(this.lastCommand != 'grabBottle') {
                console.log("Unable to execute command: The robot has not grabbed a bottle.");
                return false;
            } 
            return true;
        // Check if the robot is holding a bottle.
        case returnBottle:
            if(this.lastCommand != 'grabBottle' || this.lastCommand != 'pourDrinks') {
                console.log("Unable to execute command: The robot does not have a bottle.");
                return false;
            } 
            return true;
        // Check if the robot is holding a bottle.
        case removeBottle:
            if(this.lastCommand != 'grabBottle' || this.lastCommand != 'pourDrinks') {
                console.log("Unable to execute command: The robot does not have a bottle.");
                return false;
            } 
            return true;
        // Check if the robot is NOT holding a bottle.
        case getNewBottle:
            if(this.lastCommand == 'pourDrinks' || this.lastCommand == 'grabBottle') {
                console.log("Unable to execute command: The robot is already holding a bottle");
                return false;
            }
            return true;
        // Default behavior, invalid action.
        default:
            console.log("Error: Invalid action: " + action);
            return false;    
    }
}

// Function which prepares the actions for writing the command to the serial port. Returns a timeout-object.
function prepareAction(action) {
    // Set the flag for communicating and the last action.
    this.communicating = true;
    this.lastCommand = action;

    // Set the timeout calculator:
    let timeout = setTimeout(function() {
        let timeoutString = 'timeout_' + action;
        RobotEmitter.emit(timeoutString);
    }, 1000); // One second timeout.
    
    // Return a timeout-object to pass as a parameter.
    return timeout;
}




let Rob = new Robot();

setTimeout(function(err) {
    Rob.grabBottle(5,'Bombay');
}, 2500);


//serialPort.close();


// Export serialport connection and robot module
module.exports.Robot = Robot;
module.exports.serialPort = serialPort;
module.exports.RobotEmitter = RobotEmitter;
