//
//                        Operator.js
// sisältää operaattorin omat funktiot.
//
//

socket.on('addedBottleStatus', changeBottleStatus);
socket.on('initializeList', refreshQueue);
socket.on('initializePreparedDrinks', refreshCurrentOrderers);

function refreshCurrentOrderers(currentOrderers){
  if(currentOrderers.length == 0) {
      writeToElement("prepared", "");
      return;
  }
  //writeToElement("prepared", "IT WORKS");
  // Tuhoa vanha ja tee uusi lista
  removeElement("prepared", "preparedlist");
  appendElement("prepared", "ol", "preparedlist");
  //lisää drinkki
  let drinkName = currentOrderers[0].drinkName;
  writeToElement("prepareddrink", drinkName);
  for (i=0; i < currentOrderers.length; i++){
    addOrderer(currentOrderers[i].orderer,currentOrderers[i].ID,"preparedlist")
  }
}

function updateTextInput(textInput,val) {
  writeToElement(textInput,val);
}

function refreshQueue(orderQueue){
  if(orderQueue.length == 0) {
      return;
  }
  // Tuhoa vanha ja tee uusi lista
  removeElement("listmargin", "orderlist");
  appendElement("listmargin", "ol", "orderlist");
  // Lisää listan eka drinkki.
  let drinkName = orderQueue[0].drinkName;
  let batchID = drinkName + orderQueue[0].ID;
  addDrink(drinkName, batchID);
  // käy läpi tilaajat
  for (i=0; i < orderQueue.length; i++){
  // jos tilaajalla sama drinkki kuin edellisellä, lisää nimi samaan erään
    if (orderQueue[i].drinkName==drinkName){
        addOrderer(orderQueue[i].orderer, orderQueue[i].ID, batchID)
  // muuten lisää uusi drinkki
    }else{
      drinkName = orderQueue[i].drinkName;
      batchID = drinkName + orderQueue[i].ID;
      addDrink(drinkName, batchID);
      addOrderer(orderQueue[i].orderer,orderQueue[i].ID, batchID)
    }
  }
}

function addOrderer(ordererName,uniqueID, batchID) {
  appendElement(batchID,"li",uniqueID)
  writeToElement(uniqueID,ordererName + " ID:" + uniqueID)
};

function changeBottleStatus(msg) {
  writeToElement('addedBottle',msg);
}

function loadBottle(){
  socket.emit('loadBottle');
}

function removeDrink(){

}

function removeOrder(){
let input = document.getElementById('removeorder-input');
let value = input.value;
  socket.emit('removeOrder',value);
}

function pause(){
  writeToElement("lastCommand","Pause");
  socket.emit('pauserobot');
}

function resume(){
  writeToElement("lastCommand","Resume");
  socket.emit('resumerobot');
}

function pauseGrab(){
  writeToElement("lastCommand","pauseGrab");
  socket.emit('pausegrab',3,'Finlandia');
}

function pausePour(){
  writeToElement("lastCommand","pausePour");
  socket.emit('pausepour',5000,3);
}

function pauseReturn(){
  writeToElement("lastCommand","pauseReturn");
  socket.emit('pausereturn',3,'Finlandia');
}

function pauseRemove(){
  writeToElement("lastCommand","pauseRemove");
  socket.emit('pauseremove',3,'Finlandia');
}

function pauseGetNew(){
  writeToElement("lastCommand","pauseGetNew");
  socket.emit('pausegetnew',3,'Finlandia');
}

// Funktio juomakarusellin pyöräyttämiselle.
function pauseSpin() {
  writeToElement("lastCommand","pauseSpin");
  socket.emit('pausespin');
}

function addBottle(){
  let bottleinfo = document.getElementById('bottleinfo_form');
  let content = bottleinfo.content.value;
  let shape = bottleinfo.shape.value;
  let volume = bottleinfo.volume.value;
  // console.log(content)
  if (volume != "" & shape != "" & content != "" ){
  socket.emit('bottleadded', content,shape,volume);
  hide_element("bottleinfo");
  };
  //
}

function pause(){
  $("#pausepanel").slideDown("slow");

  socket.emit('pauserobot');
}

function resume(){
  $("#pausepanel").slideUp("slow");
  socket.emit('resumerobot');
}
