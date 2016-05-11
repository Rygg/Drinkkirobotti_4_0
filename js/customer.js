//
//                        Customer.js
// sisältää customerin omat funktiot.
//
//

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

function refreshQueue(orderQueue){
  if(orderQueue.length == 0) {
      return;
  }
  // Tuhoa vanha ja tee uusi lista
  removeElement("contentleft", "orderlist");
  appendElement("contentleft", "ol", "orderlist");
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

function addDrink(drinkName, batchID) {
  li_ID = "li_" + batchID;
  appendElement('orderlist',"li",li_ID, "batch");
  writeToElement(li_ID,drinkName);
  appendElement(li_ID,"ol",batchID);
};

function addOrderer(ordererName,uniqueID, batchID) {
  appendElement(batchID,"li",uniqueID)
  writeToElement(uniqueID,ordererName)
};
