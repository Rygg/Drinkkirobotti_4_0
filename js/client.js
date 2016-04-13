var socket = io();

socket.on('drinkOrdered', addDrink);
socket.on('initializeList', refreshQueue);

function refreshQueue(orderQueue){
  if(orderQueue.length == 0) {
      return;
  }

  // Tuhoa vanha ja tee uusi samanlainen elementti
  removeElement("contentleft", "orderlist");
  appendElement("contentleft", "ol", "orderlist");

  // Lisää listan eka drinkki
  let drinkName = orderQueue[0].drinkName;
  let orderID = drinkName + orderQueue[0].ID;
  addDrink(drinkName, orderID);

  // käy läpi tilaajat
  for (i=0; i < orderQueue.length; i++){
  // jos tilaajalla sama drinkki, lisää nimi samaan erään
    if (orderQueue[i].drinkName==drinkName){
        addOrderer(orderQueue[i].orderer, orderQueue[i].ID, orderID)
  // muuten lisää uusi drinkki
    }else{
      drinkName = orderQueue[i].drinkName;
      orderID = drinkName + orderQueue[i].ID;
      addDrink(drinkName, orderID);
      addOrderer(orderQueue[i].orderer,orderQueue[i].ID, orderID)
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

// Hyödyllinen funktio elementin poistoon
function removeElement(parentID, childID){
  let parent = document.getElementById(parentID);
  let child = document.getElementById(childID);
  parent.removeChild(child);
}

// Hyödyllinen funktio uuden elementin lisäämiseen
function appendElement(parentID, childElement, childIDName, childClassName){
  let parent = document.getElementById(parentID);
  let child = document.createElement(childElement);
  if (childIDName !== undefined) {child.setAttribute("id", childIDName)};
  if (childClassName !== undefined) {child.setAttribute("class", childClassName)};
  parent.appendChild(child);
}

function writeToElement(elementID, text){
  let el = document.getElementById(elementID);
  el.innerHTML = text;
}

function orderselected() {
  // Hae tilatun juoman nimi
  let drinkName = document.getElementById('orderName').innerHTML;
  // Hae tilaajan nimi
  let input = document.getElementById('chat-input');
  let orderer = input.value;
  socket.emit('giveorder', drinkName, orderer);

  // tyhjennä kentät ja sulje ruutu
  input.value = '';
  document.getElementById('abc').style.display = "none";
};





// var form = document.getElementById('chat-form');
// form.addEventListener('submit', function(e) {
//   var input = document.getElementById('chat-input');
//   var value = input.value;
//   input.value = '';
//   onNameMessage(value);
//   e.preventDefault();
//   document.getElementById('abc').style.display = "none";
// });

function show_info(drinkName) {
document.getElementById('abc').style.display = "block";
document.getElementById('orderName').innerHTML = drinkName;
};
//Function to Hide Popup
function hide_info(){
document.getElementById('abc').style.display = "none";
};
