// Implementation of the class controlling the robot based on the web pages requests.
// For more information check the documentations in the /doc folder. (TODO)
// Use strict mode.
"use strict"

// Import the constructed database.
const Database = require('db.js');
// The actual robot class with its functionality.
const Robot = require('robot.js').Robot;
// The used serial port.
const serialPort = require('robot.js').serialPort;
// The emitter used to handle the events by the robot.
const RobotEmitter = require('robot.js').RobotEmitter;

// The class for the robots control logic.
class ControlLogic {
    // Constructor, construct the designed API
    constructor() {
        // Construct the variables for the logic.
        this.queue = []; // The queue of QueueObjects for the logics own use.
        this.orderQueue = []; // The queue from the website.
        this.running = false; // The variable for monitoring if the robot pour cycle is running.
           
        // Initialize the database.
        Database.importDB();
        
            
    }
    
    
    // The API functions to be used.
    
    //processOrder() - the function which adds a new object to the queue if possible. Should be called when user orders a drink.
    processOrder(newOrder) {
        // Doublecheck the orders format.
        if(!checkOrderFormat(newOrder)) {
            return false; // Mitä tässä halutaan tapahtuvan?
        }
        // The order is in correct format, check if the drink is available (Should be or the order should not have been able to be placed).
        if(!Database.checkDrinkAvailability(newOrder.drinkName)) {
            // If not, the Order is not processed.
            return false;
        }
        // Reserve the drink. Should change availability if need be.
        let QueueObject = Database.reserveDrink(newOrder.drinkName, newOrder.ID);
        if(!QueueObject) {
            return false; // QueueObject was not reserved.
        }
        // Add the drink to the queues.
        if(!addtoQueues(this.queue, this.orderQueue, newOrder.drinkName, newOrder, QueueObject)) {
            return false; // The queues do not match.
            // << INSERT MASSIVE ERROR EMIT HERE >>
        }
        
        // Afterwards, Start the pouring routine if not running already.
        if (!this.running) {
            this.run();
        }
        return true;
    }
        
    //removeOrder() - The function which removes a certain object based on it's the ID  from both queues, should be used when a drink is cancelled from the UI.
    removeOrder(ID) {
        // Firsts see if the queues match.
        if(this.queue.length != this.orderQueue.length) {
            return false; // Queues didn't match.
        }
        // Find the index for the ID.
        let index = -1;
        for(let i = 0; i < queue.length; i++) {
            if(this.queue == ID) {
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
                // Remove the objects from the queues:
                queue.splice(index,0);
                orderQueue.splice(index,0);
                return true;
            }
        }
    }
      
    
    // The other functions for the functionality of the logic. 
   
    // Run() - The function which starts the drink pouring process. Should be called from processOrder if the system isn't running already (running == true).
    run() {
        console.log("Starting the pouring cycle:");   
    }
    
    
    
    
    // The event handler functions:
    
    // grabHandler() - This is what is executed after the bottle is called to be grabbed from the bottleshelf.
    grabHandler() {
        
    }
    
    // pourHandler() - Executed after pouring action is called upon.
    pourHandler() {
        
    }
    
    // returnHandler() - Executed after a bottle is called to be returned to the station.
    returnHandler() {
        
    }
    
    // removeHandler() - Executed after a bottle is called to be removed to the bottle-changing station.
    removeHandler() {
        
    }
    
    // getNewHandler() - Executed after the bottle  is called to be fetched from the bottle-changing station.
    getNewHandler() {
        
    }
};

// Helpful functions to be used in the main program cycle.
function checkOrderFormat(order) {
    // Check if the types of the order are correct.
    if(typeof(order.ID) == 'number' && typeof(order.drinkName) == 'string' && typeof(order.orderer) == 'string') {
        // The format is correct.
        return true; 
    }
    // If in the wrong format or the drink is not found in the database, return false.
    return false;
}

function addToQueues(queue, orderQueue, drinkName, newOrder, QueueObject) {
    if(queue.length != orderQueue.length) {
        return false; // Queues do not match.
    }
    let found = [];
    // Search the queue for the current drinkName.
    for(let i = 0; i < queue.length; i++) {
        if(queue[i].drinkName == drinkName) {
            // The drink was already in the queue, add the positions to the array.
            found.push(i);
        }
    } // Gone trough all the queue.
    // Check if the number of the drinks ordered in the queue is divisible by four.
    if(found.length % 4 == 0) {
        // Because the number of the drinks is divisible by 4, all the packs of four are full. Add the drink to the end of the queues.
        queue.push(QueueObject);
        orderQueue.push(newOrder);
        return true;
    } else {
        // Insert the item into the index behind the last item in the find array, as there is room behind it in the queue (for the batches of 4).
        let index = found.length - 1;
        queue.splice(index,0,QueueObject);
        orderQueue.splice(index,0,newOrder);
        return true;
    }
}