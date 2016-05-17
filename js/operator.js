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
  for (let i=0; i < currentOrderers.length; i++){
    addOrderer(currentOrderers[i].orderer,currentOrderers[i].ID,"preparedlist")
  }
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
  let batchorderers = 0;
  addDrink(drinkName, batchID);
  // käy läpi tilaajat
  for (let i=0; i < orderQueue.length; i++){
  // jos tilaajalla sama drinkki kuin edellisellä, lisää nimi samaan erään
    if (orderQueue[i].drinkName==drinkName && batchorderers < 3){
        batchorderers = batchorderers + 1;
        addOrderer(orderQueue[i].orderer, orderQueue[i].ID, batchID)
  // muuten lisää uusi drinkki
    }else{
      batchorderers = 0;
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

function addNewDrink() {
  let nameform = document.getElementById('newdrink_form');
  let drinkName = nameform.drinkname.value;
  if(drinkName != ""){
    let portionlist = [];
    for (let i=0; i < 4; i++){
      let portionformID = "portionform" + i;
      let portionform = document.getElementById(portionformID);
      let bottleName = portionform.bottlename.value;
      if (bottleName == "None"){ continue; };
      let portionAmount = portionform.amount.value;
      let portionObject = {"bottleName":bottleName,"amount":portionAmount};
      portionlist.push(portionObject);
    }
    if (portionlist.length > 0){
      let drinkObject = {"name":drinkName,"recipe":portionlist};
      socket.emit('addNewDrink',drinkObject);
      hide_element("newdrinkinfo");
    }
  }else {
    let input = document.getElementById('drinkname_input');
    input.focus();
  }
}
  //{"name":"GT","available":false,"recipe":[{"bottleName":"Gin","amount":6},{"bottleName":"Tonic","amount":10}]}



function loadBottle(){
  socket.emit('loadBottle');
}

// säädetään pausefunktioiden valintaikkuna vastaamaan oikeaa funktiota
function show_pausefunction(function_nick,function_name){
  writeToElement("pausefunction_name",function_nick);
  // function_name = pauseGrab
  //onclick(pauseGrab(location,type))
  let el = document.getElementById('pausefunction_button');
  el.setAttribute("onclick", function_name);
  //el.setAttribute("onmouseenter", "functionality");
  show_element("pausescreen");
}

function removeDrink(){

}

function removeOrder(){
let input = document.getElementById('removeorder-input');
let ID_list = input.value.split(" ");
socket.emit('removeOrder',ID_list);
input.value = "";
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
  let form = document.getElementById('pausefunction_form');
  let location = form.location.value;
  let shape = form.shape.value;
  hide_element("pausescreen");
  socket.emit("pausegrab",location,shape);
}

function pausePour(){
  let form = document.getElementById('pour_form');
  let pourtime = form.time.value;
  let cups = form.cups.value;
  let shape = form.shape.value
  let location = form.location.value;
  let volume = form.volume.value;
  // lisää parametreja tänne
  socket.emit('pausepour',pourtime,cups,shape,location,volume);
  hide_element("pourscreen");
}

function pauseReturn(){
  let form = document.getElementById('pausefunction_form');
  let location = form.location.value;
  let shape = form.shape.value;
  hide_element("pausescreen");
  socket.emit('pausereturn',location,shape);
}

function pauseRemove(){
  let form = document.getElementById('pausefunction_form');
  let location = form.location.value;
  let shape = form.shape.value;
  hide_element("pausescreen");
  socket.emit('pauseremove',location,shape);
}

function pauseGetNew(){
  let form = document.getElementById('pausefunction_form');
  let location = form.location.value;
  let shape = form.shape.value;
  hide_element("pausescreen");
  socket.emit('pausegetnew',location,shape);
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
  //$("#pausepanel").slideDown("slow");
  show_element("pausepanel");
  socket.emit('pauserobot');
}

function resume(){
  hide_element("pausepanel");
  socket.emit('resumerobot');
}
