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
const baudrate = 9600;

// Create the serialport:
let serialPort = new SerialPort.SerialPort(port, {
    baudrate: baudrate
});


class Robot { 
    // Construct the robot class:
    constructor() {
        // Set the flags for monitoring the robot process.
        this.communicating = false;
        this.working = false;
        this.lastCommand = 'none';
        this.failure = false;

        // Open the Serial Port connection
        serialPort.open(function(err) {
            if(err) {
                throw err; // Port failed to open:
            }
            // Port opened 
            else {
                console.log("SerialPort connection to controller opened.");
                /*// Test write:
                serialPort.write('Moikka!', (err, res) => {
                    console.log("kirjoitettiin " + res + " merkkiä");
                });
                serialPort.on('data', (data) => {
                    console.log('Tuli dataa ' + data); 
                }); */
            }    
        })
    }
    
       /*---------------------------------------------------------------------------------------------------
                        Callable functions for writing to the serial port for robot control  
       ---------------------------------------------------------------------------------------------------*/     
       
    // grabBottle() - Grabbing the bottle from the bottleshelf. returns an instant false if unable to comply, true if reaches the end.
    // Emits a RobotEmitter 'grabBottle_done' once fully done with callbacks. the result of the process is stored in the failure-variable.
    // failure == false if succesful, true if not.
    grabBottle(location, type) {
        // Check if the robot is busy:
        if(this.isBusy()) {
            console.log("Command not registered: Robot is busy.");
            return false;
        }
        // Check if the parameters are correct:
        if(typeof(location) != 'number' || location < 0 || location > 11  || typeof(type) != 'string') {
            console.log("Error with grabBottle()-parameters. Instruction not registered.");
            return false;
        }

        // Set the action and command for the commHandler-function.
        let action = 'grabBottle';
        let command = action+'('+location+','+type+');';

        command = editCommandLength(command); // Edit the length to 30.
        if(!command) {
            return false;
        }
        // Call the communications handler
        if(!this.commHandler(action,command)) {
            console.log("The robot is not able to execute the command: " + command);
            return false;
        }
        return true; // All callbacks started.
    }
    
    // pourDrinks() - Pouring a drink from the grabbed bottle: returns an instant false if unable to comply, true if the function reaches its end and starts all callbacks.
    // Emits a RobotEmitter 'pourDrinks_done' once fully done with callbacks. the result of the process is stored in the failure-variable.
    // failure == false if succesful, true if not.
    pourDrinks(pourTime, howMany) {
        // Check if the robot is busy:
        if(this.isBusy()) {
            console.log("Command not registered: Robot is busy.");
            return false;
        }
        // Check if the parameters are correct:
        if(typeof(pourTime) != 'number' || pourTime <= 0 || pourTime > 8000 || typeof(howMany) != 'number' || howMany <= 0 || howMany > 4) {
            console.log("Error with pourDrinks()-parameters, Instruction not registered.");
            return false;
        }
        // Set the action and command for the commHandler-function.
        let action = 'pourDrinks';
        let command = action+'('+pourTime+','+howMany+');';
        
        command = editCommandLength(command); // Edit the length to 30.
        if(!command) {
            return false;
        }
        // Call the communications handler
        if(!this.commHandler(action,command)) {
            console.log("The robot is not able to execute the command: " + command);
            return false;
        }
        return true; // All callbacks started
    }
    
    // returnBottle() - Returning the grabbed bottle to the bottleshelf after (or before) pouring the drinks:
    // Returns an instant false if the robot is unable to comply with the request. True if all the requests are called, timeout is still possible though.
    // Emits a RobotEmitter 'returnBottle_done' once fully done with callbacks. The result of the process can be accessed from the failure-variable.
    // Success: failure == false, Failure: failure == true
    returnBottle(location, type) {
        // Check if the robot is busy:
        if(this.isBusy()) {
            console.log("Command not registered: Robot is busy.");
            return false;
        }
        // Check if the parameters are correct:
        if(typeof(location) != 'number' || location < 0 || location > 11  || typeof(type) != 'string') {
            console.log("Error with returnBottle()-parameters. Instruction not registered.");
            return false;
        }

        // Set the action and command for the commHandler-function.
        let action = 'returnBottle';
        let command = action+'('+location+','+type+');';

        command = editCommandLength(command); // Edit the length to 30.
        if(!command) {
            return false;
        }
        // Call the communications handler
        if(!this.commHandler(action,command)) {
            console.log("The robot is not able to execute the command: " + command);
            return false;
        }
        return true; // All callbacks started.
    }
    
    // removeBottle() - Placing the grabbed bottle to the bottlechange-station.
    // Returns an instant false if the robot is unable to comply with the request. True if all the requests are called, timeout is still possible though.
    // Emits a RobotEmitter 'removeBottle_done' once fully done with callbacks. The result of the process can be accessed from the failure-variable.
    // Success: failure == false, Failure: failure == true
    removeBottle(type) {
        // Check if the robot is busy:
        if(this.isBusy()) {
            console.log("Command not registered: Robot is busy.");
            return false;
        }
        // Check if the parameters are correct:
        if(typeof(type) != 'string') {
            console.log("Error with getNewBottle()-parameters. instruction not registered.");
            return false;
        }
        
        // Set the action and command for the commHandler-function.
        let action = 'removeBottle';
        let command = action+'('+type+');';

        command = editCommandLength(command); // Edit the length to 30.
        if(!command) {
	    console.log("Here?");
            return false;
        }
        // Call the communications handler
        if(!this.commHandler(action,command)) {
            console.log("The robot is not able to execute the command: " + command);
            return false;
        }
        return true; // All callbacks started.   
    }
    
    // getNewBottle() - Grab a new bottle from the bottlechange-station:
    // Returns an instant false if the robot is unable to comply with the request. True if all the requests are called, timeout is still possible though.
    // Emits a RobotEmitter 'getNewBottle_done' once fully done with callbacks. The result of the process can be accessed from the lastCommand-variable.
    // Success: failure == false, Failure: failure == true
    getNewBottle(location, type) {
        // Check if the robot is busy:
        if(this.isBusy()) {
            console.log("Command not registered: Robot is busy.");
            return false;
        }
        // Check if the parameters are correct:
        if(typeof(location) != 'number' || location < 0 || location > 11  || typeof(type) != 'string') {
            console.log("Error with getNewBottle()-parameters. instruction not registered.");
            return false;
        }

        // Set the action and command for the commHandler-function.
        let action = 'getNewBottle';
        let command = action+'('+location+','+type+');';
        command = editCommandLength(command); // Edit the length to 30.
        if(!command) {
            return false;
        }
        // Call the communications handler
        if(!this.commHandler(action,command)) {
            console.log("The robot is not able to execute the command: " + command);
            return false;
        }
        return true; // All callbacks started.
    }


    /*-------------------------------------------------------------------------------------
     *            Member functions for event and serial communication handling
    -------------------------------------------------------------------------------------*/

    // isBusy() -  Checks if the robot is already doing something: True if true (very surprisingly).
    isBusy() {
        console.log("") // Print an empty row in the beginning to clear out the output.
        if(this.communicating || this.working) {
            return true;
        }
        else {
            return false;
        }
    }

    // commHandler() - The main communications logic function.
    // Checks the robots current status, changes the robot to be busy, starts a timeout counter,
    // calls for writing to serial port and handles to possible timeout.
    // returns false unable to execute, true if all the callbacks are initiated.
    commHandler(action,command) {
        // Check if the robot is able to perform the current action.
        if(!checkStatus(action, this.lastCommand, this.failure)) {
            return false; // Not.
        }
        
        // Should be able to perform, start communicating:
        this.communicating = true;
        this.lastCommand = action;
        this.failure = false;

        let timeoutString = 'timeout_' + action;
        // Set the timeout calculator:
        let timeout = setTimeout(function() {
            console.log("Timeout occurred in: "+ command);
            RobotEmitter.emit(timeoutString);
        }, 1000);// One second timeout.

        // Write the command to the serial port:
        let that = this;
        writeSerial(action,command,timeout, that);

        // Check for the timeout:
        RobotEmitter.once(timeoutString, function() {
            that.failure = true;
            that.communicating = false;
            console.log(action+'()-function failed.');
            RobotEmitter.emit(action+'_done');
        });

        return true;
    }
    
    // listenSerial() - Exportable listening function, perharps used in the main logic module.
    listenSerial(callback) {
        serialPort.once('data', callback);
    }

};

    /*-------------------------------------------------------------------------------------
                 Functions for handling the serial communication:
    -------------------------------------------------------------------------------------*/


// Function to pack up the commonly used writing to serial.
function writeSerial(action,command,timeout,that) {
    console.log("Writing to serial: " + command);
    // Write the command to the serial connection.
    serialPort.write(Buffer(command, "utf8"), function(err,result) {
        if(timeout._called || result != command.length) {
            // Do not emit anything and exit. Results in a timeout 'done'.
            return;
        }
        try {
            responseHandler(err, result, command, action, timeout, that);
        } catch(error) {
            // Error occurred, set failure to true and emit '<action>_done'.
            that.failure = true;
            console.log("Error occurred while writing to serial: " + error);
            RobotEmitter.emit(action+'_done');
        }
    });
}

// Function to pack up the commonly used response handling.
function responseHandler(err,result,command,action,timeout,that) {
    if(err) {
        throw error;
    }
    console.log("Wrote "+result+" symbols to serial, waiting for response:");
    try {
        serialPort.once('data', function(data){
            if(timeout._called) {
                // Do not emit anything and exit. Results in a timeout 'done'-emit.
                console.log("Timeout when reading robots response.");
                return;
            }
            // Response read before timeout, clearing the timeout counter.
            clearTimeout(timeout);
            let expected = command+";s";
            if(data == expected) { // To be changed to the actual command declared later on.
                that.working = true;
                that.communicating = false;
                console.log("Robot started working");
                let eventstring = 'timeout_' + action;
                RobotEmitter.removeListener(eventstring, function(){}); // No callback.
                RobotEmitter.emit(action+'_done');
                
            } else {
                // The robot returned a wrong command, reset writing and set failure.
                that.working = false;
                that.communicating = false;
                that.failure = true;
                console.log("Error: Robot couldn't execute the command.");
                console.log("Got response: "+data);
                console.log("Expected:     "+expected);
                RobotEmitter.emit(action+'_done');
            }   
        });
    } catch(err) {
        // Error occurred, set failure to true and emit 'done'
        that.failure = true;
        console.log("Error occurred while writing to serial: " + err);
        RobotEmitter.emit(action+'_done');
    }
}

/* -------------------------------------------------------------------------------
 *                  Functions to clean and simplify the code
 * -----------------------------------------------------------------------------*/

// checkStatus- a function which checks if the robot is able to perform the required operation.
function checkStatus(action,lastCommand,failure) { 
    // Check if the robot is trying to perform the same task again.
    if(failure && lastCommand == action) {
        // Return true: otherwise with failure, always false.
        return true;
    }
    if(failure) {
        return false;
    }

    if(lastCommand == 'none' && (action == 'pourDrinks' || action == 'returnBottle' || action == 'removeBottle') ) {
        console.log("Error: Robot has to grab a bottle for the first command.");
        return false;
    }

   // Check if the robot is able to grab a new bottle.
    if(action == 'getNewBottle' || action == 'grabBottle') {
        if(lastCommand == 'pourDrinks' || lastCommand == 'grabBottle' || failure) {
            console.log("Unable to execute "+ action +": The robot is already holding a bottle");
            return false;
        }
        return true;
    }
    // Check if the robot is holding a bottle
    else if(action == 'returnBottle' || action == 'removeBottle' || action == 'pourDrinks' || failure) {
        if(lastCommand == 'returnBottle' || lastCommand == 'removeBottle' || lastCommand == 'getNewBottle') {
            console.log("Unable to execute "+ action +": The robot does not have a bottle.");
            return false;
        } 
        return true;
    }
    
    // Undefined behavior, invalid action.
    else {
        console.log("Error: Invalid action: " + action);
        return false;
    }
}

// Edits the command length to 30.
function editCommandLength(command) {
    if(command.length < 30) {
        let times = 30 - command.length;
        for(let i = 0; i < times; i++) {
            command = command + "-"; // Append the command to 30 symbols.
        }
    }
    else if (command.length > 30) {
        console.log("Command was too long for the robot.");
        return false;
    }
     
    return command;
}
/*
// Create Rob the Bot
let Rob = new Robot();

// After 2,5seconds tell the poor sob to grab a bottle:
setTimeout(function(err) {
    Rob.grabBottle(5,'Bombay');
}, 2500);

// After 5 seconds, tell the weasel to pour a drink from it.
setTimeout(function(err) {
    Rob.pourDrinks(4000,2);
}, 5000);

// After 7,5 seconds, tell the good lad put the bottle back to the shelf.
setTimeout(function(err) {
    Rob.returnBottle(5,'Bombay');
}, 7500);

// After 10 seconds, tell the good lad remove a bottle he doesn't have.
setTimeout(function(err) {
    Rob.removeBottle('Bombay');
}, 10000);

// After 12 seconds, tell the good lad to do it properly and grab a bottle to remove it.
setTimeout(function(err) {
    Rob.grabBottle(5,'Bombay');
    setTimeout(function(err) {
        Rob.removeBottle('Bombay');     
    },2000);
}, 12000);

// After 17 seconds, the bottle is switched and RobTheBot enthusiastically grabs the new one to a new location.
setTimeout(function(err) {
    Rob.getNewBottle(5,'Muovijallu');
},17000);
*/

// Export serialport connection and robot module
module.exports.Robot = Robot;
module.exports.serialPort = serialPort;
module.exports.RobotEmitter = RobotEmitter;
