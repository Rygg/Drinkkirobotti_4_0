# Drinkkirobotti_4_0

The source code for the web server and control logic for the new drink serving robot cell from TUT's student club Pullonkaula.
http://www.pullonkaula.net/ 

----


The web-server functions on a Raspberry Pi which is connected to a robot controller with an USB to RS-232 serial cable.
The source code uses the publicly available Node.js package serialport for implementing the serial communication, which is available at: https://www.npmjs.com/package/serialport


The server is run with node.js from the main server file server.js.

The main control logic for the robot is used by importing the class exported by Backend/logic.js. This class uses the classes modeling the robot and other physical elements of the robot cell to communicate with the robot controller and maintain the pouring cycle based on the ordered drinks.

The main program cycle is best described in a flow chart diagram located here:
http://s33.postimg.org/4czodx56n/process_eng.png

---- 

The communication with the robot is handled with 5 main functions:
  - grabBottle(location,type);
  
  Grabs a bottle from the bottleshelf location specified in the parameters. Type indicates the shape of the bottle.

  - pourDrinks(pourTime,howMany,type);
  
  Pour drinks from the already grabbed bottle. The parameter pourTime indicates the pouring time in milliseconds and howMany indicates in how many of the four available glasses to pour.

  - returnBottle(location,type);
  
  Returns the already grabbed bottle to the bottleshelf into the specified location.

  - removeBottle(type);
  
  Removes the already grabbed bottle to the bottle changing station.

  - getNewBottle(location,type);

  Grabs a new bottle from the bottle changing station and places it in the specified location in the bottleshelf.
  
The robot answers with the given command with affixes depending on whether it has started the action or completed it.



