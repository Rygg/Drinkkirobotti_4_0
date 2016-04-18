// Implementation of the class controlling the robot based on the web pages requests.
// For more information check the documentations in the /doc folder. (TODO)
// Use strict mode.
"use strict"

// Import the constructed database.
const DB = require('./db.js');
//let Database = new DB();

// The actual robot class with its functionality.
const Robot = require('./robot.js').Robot;
//let Robot = new Rob();

// The used serial port.
let serialPort = require('./robot.js').serialPort;
// The emitter used to handle the events by the robot.
let RobotEmitter = require('./robot.js').RobotEmitter;

// Some constants for the logic:
const MAX_ERRORS = 10; // The maximum amount that the message sending can fail.
const MIN_VOLUME = 6; // The minimum volume to be remaining in the bottle before it's removed.

// The class for the robots control logic.
class ControlLogic {
    // Constructor, construct the designed API
    constructor(drinkDB,bottleShelf) {
        // Construct the variables for the logic.
        this.queue = []; // The queue of QueueObjects for the logics own use.
        this.orderQueue = []; // The queue from the website.
        this.running = false; // The variable for monitoring if the robot pour cycle is running.
        this.errorCount = 0; // The variable for monitoring how many times the message has failed to execute.
        this.newBottle = [false,'unknown','unknown']; // The flag which is checked in beginning of every cycle if there's a new bottle to be grabbed.
        this.beingPoured = []; // The variable which keeps track of the drink currently being poured.
        this.paused = false;
        this.startable = true;

        // Add member variables for the Database and the Robot.
        this.database = new DB();
        this.robot = new Robot();     
            
        // Initialize the database.
        this.database.importDB(drinkDB,bottleShelf);
        
            
    }
    
    
    // The API functions to be used.
    
    //processOrder() - the function which adds a new object to the queue if possible. Should be called when user orders a drink.
    processOrder(newOrder) {
        // Parse the order to an object format.
        let new_Order;
        console.log("Processing Order:");
        try {
            new_Order = JSON.parse(newOrder);
        } catch (err) {
            console.log("Error parsing the newOrder parameter." + err);
            return false; // Mitä tässä halutaan tapahtuvan?
        }
        // Doublecheck the orders format.
        if(!checkOrderFormat(new_Order)) {
            return false; // Mitä tässä halutaan tapahtuvan?
        }
        // The order is in correct format, check if the drink is available (Should be or the order should not have been able to be placed).
        if(!this.database.checkDrinkAvailability(new_Order.drinkName)) {
            // If not, the Order is not processed.
            console.log("Drink not available.");
            return false;
        }
        // Reserve the drink. Should change availability if need be.
        let QueueObject = this.database.reserveDrink(new_Order.drinkName, new_Order.ID);
        if(!QueueObject) {
            console.log("QueueObject not reserved.");
            return false; // QueueObject was not reserved.
        }
        // Add the drink to the queues.
        if(!addToQueues(this.queue, this.orderQueue, new_Order.drinkName, new_Order, QueueObject)) {
            // The queues do not match.
            console.log("Queues did not match.");
            return false;
            // << INSERT MASSIVE ERROR EMIT HERE >>
        }
        
        // Afterwards, Start the pouring routine if not running already.
        if (!this.running) {
            this.run();
        }
        return true; // not started.
    }
        
    //removeOrder() - The function which removes a certain object based on it's the ID  from both queues, should be used when a drink is cancelled from the UI.
    removeOrder(ID) {
        // Firsts see if the queues match.
        if(this.queue.length != this.orderQueue.length) {
            return false; // Queues didn't match.
        }
        // Find the index for the ID.
        let index = -1;
        for(let i = 0; i < this.queue.length; i++) {
            if(this.queue.ID == ID) {
                index = i;
            }
        }
        if(index < 0) {
            return false; // the robot didn't found the ID in the queue.
        } else {
            // Check if the IDs match in both queues.
            if(this.queue[index].ID != this.orderQueue[index].ID) {
                return false; // The IDs of the objects in the same places in queues didn't match.
                // << INSERT MASSIVE ERROR EMIT HERE >>
            } else {
                // Add the qObject back to the reserved shelf:
                this.database.cancelDrink(queue[index]);
                // Remove the objects from the queues:
                this.queue.splice(index,0);
                this.orderQueue.splice(index,0);
                return true;
            }
        }
    }
      
    
    // The other functions for the functionality of the logic. 
   
    // Run() - The function which starts the drink pouring process. Should be called from processOrder if the system isn't running already (running == true).
    run() {
        // Check if already running:
        if(this.running) {
            return false;
        }
        // Check if the system is paused.
        if(this.paused) {
            return false;
        }
        // Check if the robot is not startable.
        if(!this.startable) {
            return false;
        }
        // Check if the robot is in the correct 
        // Check if there is a newBottle to be grabbed:
        if(this.newBottle[0]) {
            this.running = true;
            console.log("Starting to grab a new Bottle.");
            if(this.robot.getNewBottle(this.newBottle[1],this.newBottle[2])) {
                this.getNewHandler(this.newBottle[1],this.newBottle[2],this.newBottle[3]);
                return true;
            }
        }
        // Otherwise start the drink pouring cycle.

        // Double check if there is stuff in the queue.
        if(this.queue.length < 1) {
            console.log("Queue is empty, waiting..");
            this.running = false;
                return false;
            }
        
        console.log("Starting the pouring cycle:");
        // Count the number of orders for the same drink (max 4).
        let howMany = 1;
        let condition = 4;
        if(this.queue.length < 4) {
            condition = this.queue.length;
        }
        for(let i = 1; i < condition; i++) {
            if(this.queue[0].drink.name == this.queue[i].drink.name) {
            howMany++;
            }
        }   
        // Create a temporary queue so we do not touch to objects. Also pass this as the parameter.
        let pourQueue = this.queue.slice(0);
        // Pop the location of the first bottle.
        let location = pourQueue[0].locations.shift();
        // Pop the first portion of the recipe.
        let portion = pourQueue[0].drink.recipe.shift();
        let amount = portion.amount;
        // Find the pourSpeed of the bottle.
        let pourSpeed = this.database.reservedShelf.bottles[location].pourSpeed;
        // Calculate the pourTime:
        let pourTime = countPourTime(pourSpeed,portion);
        // Remove the to-be-poured items from the queue.
        for(let i = 0; i < howMany; i++) {
            this.beingPoured.push(this.orderQueue[i]); // To be tested.
            this.queue.shift();
            this.orderQueue.shift();
        }
        // Grab the first bottle.
        if(this.robot.grabBottle(location,this.database.reservedShelf.bottles[location].type)) {
            // Call the grabHandler if executed.
            try {
                this.grabHandler(location,howMany,pourTime,amount,pourQueue);
            } catch(err) {
                console.log("Error occurred in the grabHandler()." +err);
                return false;
            }
            this.running = true;
            return true; // The cycle is started.     
        }
        // grabBottle command didn't execute.
        this.running = false;
        return false;
    }
    
    
    
    // newBottleReady() - Function which sets the flag for grabbing a new bottle next.
    newBottleReady(location,type,bottleString) {
        // Check if the location is empty:
        if(this.database.currentShelf.bottles[location] == 'empty') {
            this.newBottle[0] = true;
            this.newBottle[1] = location;
            this.newBottle[2] = type;
            this.newBottle[3] = bottleString;
            if(!this.running) {
                this.run();
                console.log("Run() started from newBottleReady();");
            }
            return true;    
        }
        console.log("Error: The bottleshelf location was occupied.");
        return false; // The location was not empty.
    }
    
    
    
    // The event handler functions:
    
    // grabHandler() - This is what is executed after the bottle is called to be grabbed from the bottleshelf.
    grabHandler(location, howMany, pourTime, amount, pourQueue) {
        console.log('grabHandler() started.');
        this.startable = false; // The cycle is not able to start from this position.
        let that = this;
        // Wait for the emit happening.
        RobotEmitter.once('grabBottle_done', function() {
            // Check if the event was succesfull.
            if(that.robot.failure) {
                // The message wasn't delivered. Try again.
                that.errorCount++;
                if(that.errorCount > MAX_ERRORS -1) { // Max amount of errors = 10.
                    console.log("The grabBottle-message failed to deliver too many times.")
                    // <<INSERT MASSIVE ERROR EMIT HERE>>
                    return false;
                }
                if(that.robot.grabBottle(location,that.database.reservedShelf.bottles[location].type)) {
                    that.grabHandler(location,howMany,pourTime,amount,pourQueue); // Call the current function recursively.
                    return true;
                }
                // There was no error, continue with the routine.
            } else {
                that.errorCount = 0;
                let expected = "grabBottle("+location+","+that.database.reservedShelf.bottles[location].type+");";
                expected = editCommandLength(expected); // Reached this far, error impossible.
                expected = expected +";c"; // TODO
                
                // Wait for the move completed message from the robot.
                serialPort.once('data', function(data) {
                    if(data == expected) { // Whatever the message will be.
                        // The action was completed. If the robot is not paused, Call for the pourDrink action and the handler.
                        console.log("Action: "+data+" completed!"); 
                        that.robot.working = false;
                        if(that.paused) {
                            return true; // Completed in case the robot is paused.
                        }
                        if(that.robot.pourDrinks(pourTime,howMany)) {
                            try {
                                that.pourHandler(pourTime,howMany,location,amount,pourQueue);
                            } catch(err) {
                                console.log("Error occurred: " + err);       
                            }
                            return true; // Return true as all the necessary functions have been called.
                        }
                    }
                    else {
                        console.log("Error happened with the grab-cycle.");
                        console.log("Got:      "+data);
                        console.log("Expected: "+expected);
                        // <<INSERT MASSIVE ERROR EMIT HERE>>
                        return false;
                    }
                });   
            }
            // What happens if grabBottle fails in retry.? Is it even possible? insert here.
        });
    }
    
    
    // pourHandler() - Executed after pouring action is called upon.
    pourHandler(pourTime,howMany,location,amount,pourQueue) {
        console.log("pourHandler()-started.");
        this.startable = false; // The robot is not able to start from this position;
        let that = this;
        // Wait for the emit to happen.
        RobotEmitter.once('pourDrinks_done', function() {
            if(that.robot.failure) {
                // The message wasn't delivered, Try again:
                that.errorCount++;
                 if(that.errorCount > MAX_ERRORS -1) { // Max amount of errors = 10.
                    console.log("The grabBottle-message failed to deliver too many times.")
                    // <<INSERT MASSIVE ERROR EMIT HERE>>
                    return false;
                }
                if(that.robot.pourDrinks(pourTime,howMany)) {
                    // Try again and call the current function recursively.
                    that.pourHandler(pourTime,howMany,location,amount,pourQueue);
                    return true;
                }
            } else {
                // No failure occurred.
                that.errorCount = 0;
                let expected = "pourDrinks("+pourTime+","+howMany+");";
                expected = editCommandLength(expected); // Reached this far, error impossible.
                expected = expected +";c"; // TODO
                serialPort.once('data', function(data) {
                    if(data == expected) {
                        console.log("Action: "+data+" completed!"); 
                 
                        that.robot.working = false;
                        // Call the pourCompleted()-function,
                        that.database.pourCompleted(location,amount);
                        // See if the bottle got empty, depending on that call the next command.
                        // Also check if the robot is paused, and if so, don't call anything.
                        if(that.paused) {
                            return true;
                        }
                        if(that.database.currentShelf.bottles[location].volume < MIN_VOLUME) { // Minimum value for the bottle before changing it.
                            console.log('Current bottle got empty. Removing it.'); 
                            if(that.robot.removeBottle(that.database.currentShelf.bottles[location].type)) {
                                that.removeHandler(location,that.database.currentShelf.bottles[location].type, howMany, pourQueue);
                                return true;
                            }
                        } else {
                            // The bottle has still enough liquid left, return it to the bottleshelf.
                            if(that.robot.returnBottle(location,that.database.currentShelf.bottles[location].type)) {
                                that.returnHandler(location,that.database.currentShelf.bottles[location].type, howMany, pourQueue);
                                return true;
                            }
                        }
                    } else {
                        console.log("Error happened with the pour-cycle.")
                        console.log("Got:      "+data);
                        console.log("Expected: "+expected);
                        // <<INSERT MASSIVE ERROR EMIT HERE>>
                        return false;
                    }
                });
            }
            // ?????????????
        });
        
    }
    
    // returnHandler() - Executed after a bottle is called to be returned to the station.
    returnHandler(location, type, howMany, pourQueue) {
        console.log('returnHandler() started.');
        this.startable = false; // The robot is not yet able to start a new cycle from this position.
        let that = this;
        // Wait for the emit to happen:
        RobotEmitter.once('returnBottle_done', function() {
            // Check for failure:
            if(that.robot.failure) {
                // The message wasn't delivered, Try again:
                that.errorCount++;
                 if(that.errorCount > MAX_ERRORS -1) { // Max amount of errors = 10.
                    console.log("The returnBottle-message failed to deliver too many times.")
                    // <<INSERT MASSIVE ERROR EMIT HERE>>
                    return false;
                }
                if(that.robot.returnBottle(location,type)) {
                    // Try again and call the current function recursively.
                    that.returnHandler(location, type, howMany, pourQueue);
                    return true;
                }
            } else {
                that.errorCount = 0;
                let expected = "returnBottle("+location+","+type+");";
                expected = editCommandLength(expected); // Reached this far, error impossible.
                expected = expected +";c"; // TODO
                // No errors occurred, wait for the completion message.
                serialPort.once('data', function(data) {
                    // No error occurred, the bottle has been returned to the bottleshelf.
                    if(data == expected) {
                        console.log("Action: "+data+" completed!");
                        that.robot.working = false;
                        that.startable = true; // The robot can start a new cycle from this position.
                        // See if the robot is paused. return true if yes.
                        if(that.paused) {
                            return true;
                        }
                        // See if there are still ingredients left for the drink.
                        if(pourQueue[0].locations.length > 0 && pourQueue[0].drink.recipe.length > 0) {
                            // There were.
                            let location2 = pourQueue[0].locations.shift(); // Pop the location of the new bottle.
                            let portion = pourQueue[0].drink.recipe.shift(); // Pop the next portion of the recipe.
                            let amount = portion.amount; // Save the amount and find the amount needed.
                            let pourSpeed = that.database.reservedShelf.bottles[location2].pourSpeed; // Find the pourSpeed of the bottle.
                            let pourTime = countPourTime(pourSpeed,portion); // Calculate the pourTime:       
                            // Call the robot to grab the new bottle.
                            if(that.robot.grabBottle(location2,that.database.reservedShelf.bottles[location2].type)) {
                                // Call the grabHandler.
                                try {
                                    that.grabHandler(location2,howMany,pourTime,amount,pourQueue);
                                    return true; // A new bottle is to be grabbed.
                                } catch(err) {
                                    console.log("Error occurred in the grabHandler()." +err);
                                    console.log("Got:      "+data);
                                    console.log("Expected: "+expected);
                                    return false;
                                }
                            }
                            
                        } else {
                            // The drink has been completely poured.
                            // Restart the cycle:
                            that.beingPoured = []; // Clear the info of what is being poured.
                            that.running = false; // The system is no longer running.
                            that.run();
                            return true;
                        }
                        
                    } else {
                        console.log("Error happened with the return-cycle.")
                        // <<INSERT MASSIVE ERROR EMIT HERE>>
                        return false;
                    }
                })
            }  
        });
    }
    
    // removeHandler() - Executed after a bottle is called to be removed to the bottle-changing station.
    removeHandler(location, type, howMany, pourQueue) {
        console.log('removeHandler() started.');
        let that = this;
        // Wait for the emit to happen:
        RobotEmitter.once('removeBottle_done', function() {
            // Check for failure:
            if(that.robot.failure) {
                // The message wasn't delivered, Try again:
                that.errorCount++;
                 if(that.errorCount > MAX_ERRORS -1) { // Max amount of errors = 10.
                    console.log("The removeBottle-message failed to deliver too many times.")
                    // <<INSERT MASSIVE ERROR EMIT HERE>>
                    return false;
                }
                if(that.robot.removeBottle(type)) {
                    // Try again and call the current function recursively.
                    that.removeHandler(location, type, pourQueue);
                    return true;
                }
            } else {
                that.errorCount = 0;
                let expected = "removeBottle("+type+");";
                expected = editCommandLength(expected); // Reached this far, error impossible.
                expected = expected +";c"; // TODO
                // No errors occurred, wait for the completion message.
                serialPort.once('data', function(data) {
                    // No error occurred, the bottle has been returned to the bottleshelf.
                    if(data == expected) {
                        console.log("Action: "+data+" completed!");
                        that.robot.working = false;
                        // Remove bottle from the database:
                        that.database.currentShelf.removeBottle(location);
                        that.database.reservedShelf.removeBottle(location);
                        that.startable = true; // The robot can start a new cycle from this position.
                        // See if the program is paused.
                        if(that.paused) {
                            return true;
                        }
                        // See if there are still ingredients left for the drink.
                        if(pourQueue[0].locations.length > 0 && pourQueue[0].drink.recipe.length > 0) {
                            // There were.
                            let location2 = pourQueue[0].locations.shift(); // Pop the location of the new bottle.
                            let portion = pourQueue[0].drink.recipe.shift(); // Pop the next portion of the recipe.
                            let amount = portion.amount; // Save the amount and find the amount needed.
                            let pourSpeed = that.database.reservedShelf.bottles[location2].pourSpeed; // Find the pourSpeed of the bottle.
                            let pourTime = countPourTime(pourSpeed,portion); // Calculate the pourTime:       
                            // Call the robot to grab the new bottle.
                            if(that.robot.grabBottle(location2,that.database.reservedShelf.bottles[location2].type)) {
                                // Call the grabHandler.
                                try {
                                    that.grabHandler(location2,howMany,pourTime,amount,pourQueue);
                                    return true;
                                } catch(err) {
                                    console.log("Error occurred in the grabHandler()." +err);
                                    return false;
                                }
                            }
                        } else {
                            // The drink has been completely poured.
                            // Restart the cycle:
                            that.beingPoured = []; // Clear what is being poured.
                            that.running = false; // The system is no longer running.
                            that.run();
                            return true;
                        }
                    } else {
                        console.log("Error happened with the remove-cycle.")
                        console.log("Got:      "+data);
                        console.log("Expected: "+expected);
                        // <<INSERT MASSIVE ERROR EMIT HERE>>
                        return false;
                    }
                })
            }  
        });
    }

    
    // getNewHandler() - Executed after the bottle  is called to be fetched from the bottle-changing station.
    getNewHandler(location,type,bottleString) {
        console.log("getNewHandler() started.");
        let that = this;
        // Listen for the emit:
        RobotEmitter.once('getNewBottle_done', function() {
            if(that.robot.failure) {
                // The message wasn't delivered, Try again:
                that.errorCount++;
                 if(that.errorCount > MAX_ERRORS -1) { // Max amount of errors = 10.
                    console.log("The getNewHandler-message failed to deliver too many times.")
                    // <<INSERT MASSIVE ERROR EMIT HERE>>
                    return false;
                }
                if(that.robot.getNewBottle(location,type)) {
                    // Try again and call the current function recursively.
                    that.getNewHandler(location, type, bottleString);
                    return true;
                }
            } else {
                // No failure occurred:
                // Listen for the completion message.
                let expected = "getNewBottle("+location+","+type+");";
                expected = editCommandLength(expected); // Reached this far, error impossible.
                expected = expected +";c"; // TODO
                serialPort.once('data', function(data) {
                    if(data == expected) {
                        console.log("Action: "+data+" completed!");
                        that.robot.working = false;
                        // The action was carried out completely.
                        // Add the bottle to the bottleshelfs:
                        that.database.currentShelf.addBottle(bottleString,location);
                        that.database.reservedShelf.addBottle(bottleString,location);
                        that.newBottle[0] = false; // Set the flags accordingly.
                        that.newBottle[1] = 'unknown';
                        that.newBottle[2] = 'unknown';
                        that.newBottle[3] = 'unknown';
                        
                        that.running = false;
                        that.startable = true; // The robot can start a new cycle from this position.
                        // Restart the cycle if the program is not paused:
                        if(that.paused) {
                            return true;
                        }
                        // If not, restart the cycle.
                         // All actions completed.
                        that.run();
                        return true;
                    } else {
                        console.log("Error happened with the getNew-cycle.")
                        // <<INSERT MASSIVE ERROR EMIT HERE>>
                        console.log("Got:      "+data);
                        console.log("Expected: "+expected);
                        return false;
                    }
                });
            }  
        });
    }

    // Functions for manual control of the robot from the operator UI.
    pause() {
        this.paused = true;
        console.log("Program cycle paused. Finishing current action.");
        // Örr?
    };
    
    unpause() {
        // Unpause and restart the cycle.
        // Check if the robot is able to continue the cycle
        // (is in the middle position with no bottle.)
        if(!this.startable) {
            console.log("The robot is not in the proper position to unpause.");
            return false;
        }
        this.paused = false;
        console.log("Restarting pouring cycle.")
        this.run();   
        return true;
    }
    
    pauseGrab(location, type) {
        // Safety checkit tähän.
        if(!this.paused) {
            console.log("Cycle not paused.");
            return false;
        }
        this.robot.grabBottle(location,type);
        this.grabHandler();
        return true;
    }
    
    pausePour(pourTime, howMany) {
        // Safety checkit asennosta.
        if(!this.paused) {
            console.log("Cycle not paused.");
            return false;
        }
        this.robot.pourDrinks(pourTime,howMany);
        this.pourHandler();
        return true;
    }
    
    pauseReturn(location, type) {
        // Safety checkit tähän.
        if(!this.paused) {
            console.log("Cycle not paused.");
            return false;
        }
        this.robot.returnBottle(location,type);
        this.returnHandler();
        return true;
    }
    
    pauseRemove(location, type) {
        // Safety checkit tähän.
        if(!this.paused) {
            console.log("Cycle not paused.");
            return false;
        }
        this.robot.removeBottle(type);
        this.removeHandler(location);
        return true;
    }
    
    pauseGetNew(location, type) {
         // Safety checkit tähän.
        if(!this.paused) {
            console.log("Cycle not paused.");
            return false;
        }
        this.robot.getNewBottle(location,type);
        this.getNewHandler();
        return true;
    }
    
}; // End of the class and logic definition.


// Helpful functions to be used in the main program cycle.

// checkOrderFormat() - Checks the format of the order. Used to double check if the order is actually useable.
function checkOrderFormat(order) {
    // Check if the types of the order are correct.
    if(typeof(order.ID) == 'number' && typeof(order.drinkName) == 'string' && typeof(order.orderer) == 'string') {
        // The format is correct.
        return true; 
    }
    // If in the wrong format or the drink is not found in the database, return false.
    console.log("The format of the order proved wrong.");
    return false;
}

// addToQueues() - Used to check the place of the queue the order is to be placed at.
function addToQueues(queue, orderQueue, drinkName, newOrder, queueObject) {
    if(queue.length != orderQueue.length) {
        return false; // Queues do not match.
    }
    let found = [];
    // Search the queue for the current drinkName.
    for(let i = 0; i < queue.length; i++) {
        if(queue[i].drinkName == drinkName) {
            // The drink was already in the queue, add the positions to the array.
            console.log("Drink already in queue while adding.");
            found.push(i);
        }
    } // Gone trough all the queue.
    // Check if the number of the drinks ordered in the queue is divisible by four.
    if(found.length % 4 == 0) {
        // Because the number of the drinks is divisible by 4, all the packs of four are full. Add the drink to the end of the queues.
        queue.push(queueObject);
        orderQueue.push(newOrder);
        return true;
    } else {
        // Insert the item into the index behind the last item in the find array, as there is room behind it in the queue (for the batches of 4).
        let index = found.length - 1;
        queue.splice(index,0,queueObject);
        orderQueue.splice(index,0,newOrder);
        return true;
    }
}


// countPourTime() - The function calculating the pouring time based on the pouring speed and recipe.
function countPourTime(pourSpeed,portion) {
    // Get the pourspeed of the bottle and the needed amount:
    let amount = portion.amount;
    // The calculation for the pouring time: Assumes pourSpeed in cl/s and amount in cl.
    // Formula of amount / pourSpeed -> seconds needed.
    let seconds = amount/pourSpeed;
    let ms = 1000*seconds;
    // Return the value in milliseconds.
    return ms;
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
// Create the test-object.
let ProgramLogic = new ControlLogic();
ProgramLogic.database.drinkDB.addDrink("GT",'[{"bottleName":"Gin","amount":6},{"bottleName":"Tonic","amount":10}]');
ProgramLogic.database.currentShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
ProgramLogic.database.currentShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)
ProgramLogic.database.reservedShelf.addBottle('{"name":"Gin","type":"Gin","volume":100,"pourSpeed":1,"isAlcoholic":true}',5)
ProgramLogic.database.reservedShelf.addBottle('{"name":"Tonic","type":"Tonic","volume":100,"pourSpeed":2,"isAlcoholic":false}',6)
// Wait for a second and process a new order.
setTimeout(function(err) {
    console.log("Trying to process order.");
    ProgramLogic.processOrder('{"drinkName":"GT","orderer":"Matti","ID":43}');
},1000);

setTimeout(function(err) {
    console.log("Adding two more gin tonics to the queue.");
    if(ProgramLogic.processOrder('{"drinkName":"GT","orderer":"Matti","ID":44}')) {
        console.log("Added one.");
    }
    if(ProgramLogic.processOrder('{"drinkName":"GT","orderer":"Matti","ID":45}')) {
        console.log("Added the second.");
    }
},5000);

setTimeout(function() {
    console.log("Putting a new Bottle to the bottlestation.");
    let bottleString = '{"name":"Jallu","type":"Muovijallu","volume":50,"pourSpeed":2,"isAlcoholic":true}'; 
    ProgramLogic.newBottleReady(4,'Muovijallu',bottleString);
    console.log("Bottle placed in the changing station.");
},15000);

setTimeout(function() {
    console.log("Putting a new Bottle to a reserved space in the bottleshelf.");
    let bottleString = '{"name":"Jallu","type":"Muovijallu","volume":50,"pourSpeed":2,"isAlcoholic":true}'; 
    ProgramLogic.newBottleReady(6,'Muovijallu',bottleString);
},20000);

setTimeout(function() {
    console.log("Adding a new GT to the queue after one minute.");
    ProgramLogic.processOrder('{"drinkName":"GT","orderer":"Matti","ID":45}');
},60000);

*/

module.exports = ControlLogic;

